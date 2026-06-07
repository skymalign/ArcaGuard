# ==================================================
# CHURN HUNTER - features.py
# Feature engineering temporal (enfoque PREDICTIVO, sin leakage)
# --------------------------------------------------
# Para cada (cliente, mes M) se construyen variables usando UNICAMENTE
# el historial hasta el mes M-1. Las ventas del propio mes M nunca se usan
# como feature (eso seria leakage: target=1 <=> tx~0 en el mismo mes).
#
# Genera:
#   data/processed/features_train.parquet   -> filas etiquetadas (target 0/1)
#   data/processed/features_train_bal.parquet-> negativos submuestreados (modelado rapido)
#   data/processed/features_predict.parquet  -> filas del mes 202602 (para el submission)
# ==================================================

import time
from pathlib import Path

import numpy as np
import pandas as pd

RAW = Path("data/raw")
OUT = Path("data/processed")
OUT.mkdir(parents=True, exist_ok=True)

PREDICT_MONTH = 202602          # mes a predecir (test)
NEG_RATIO = 15                  # negativos por positivo en el archivo balanceado
SEED = 42


def to_mi(calmonth: pd.Series) -> pd.Series:
    """YYYYMM -> indice entero de mes (year*12 + mes-1) para hacer aritmetica."""
    return (calmonth // 100) * 12 + (calmonth % 100 - 1)


def gcol(df, col):
    """Atajo: groupby por cliente preservando el orden (panel ya ordenado)."""
    return df.groupby("cust", sort=False)[col]


def roll(df, col, w, fn):
    """Rolling dentro de cada cliente sobre una columna YA desfasada (shift).
    Devuelve una serie alineada al indice de df. min_periods=1 + NaN-aware:
    si no hay historial, queda NaN."""
    out = df.groupby("cust", sort=False)[col].rolling(w, min_periods=1).agg(fn)
    return out.reset_index(level=0, drop=True)


def main():
    t0 = time.time()

    # ---------- 1. CARGA Y UNION DEL PANEL ----------
    dt_sales = {
        "customer_id": "string",
        "calmonth": "int32",
        "num_transacciones": "int32",
        "uni_boxes_sold_m": "float32",
    }
    train = pd.read_csv(RAW / "sales_churn_train.csv", dtype={**dt_sales, "target": "float32"})
    test = pd.read_csv(RAW / "sales_churn_test.csv", dtype=dt_sales)
    test["target"] = np.float32(np.nan)   # sin etiqueta

    # Concatenamos para que los clientes de test extiendan su linea de tiempo a 202602.
    panel = pd.concat(
        [train.assign(split="train"), test.assign(split="predict")],
        ignore_index=True,
    )
    print(f"[carga] panel: {panel.shape}  (train {len(train):,} + test {len(test):,})")

    panel["mi"] = to_mi(panel["calmonth"]).astype("int32")
    panel["tx"] = panel["num_transacciones"].astype("float32")
    panel["bx"] = panel["uni_boxes_sold_m"].clip(lower=0).astype("float32")  # 79 negativos -> 0

    # ---------- 2. JOINS (coolers mensual + clientes estatico) ----------
    co = pd.read_csv(
        RAW / "Coolers.csv",
        dtype={"customer_id": "string", "calmonth": "int32",
               "num_coolers": "float32", "num_doors": "float32"},
    )
    co = co.groupby(["customer_id", "calmonth"], as_index=False).agg(   # dedup 1,573 filas
        num_coolers=("num_coolers", "max"),
        num_doors=("num_doors", "max"),
    )
    panel = panel.merge(co, on=["customer_id", "calmonth"], how="left")

    cl = pd.read_csv(RAW / "Clientes.csv", dtype="string", encoding="latin-1")
    panel = panel.merge(cl, on="customer_id", how="left")

    # Orden canonico del panel y codigo entero de cliente (groupby mas rapido).
    panel = panel.sort_values(["customer_id", "mi"]).reset_index(drop=True)
    panel["cust"] = pd.factorize(panel["customer_id"])[0]
    print(f"[joins] listo en {time.time()-t0:.1f}s")

    # ---------- 3. FEATURES TEMPORALES (todo desde el historial <= M-1) ----------
    # Columnas base desfasadas un mes: excluyen el mes actual -> sin leakage.
    panel["tx_s1"] = gcol(panel, "tx").shift(1)
    panel["bx_s1"] = gcol(panel, "bx").shift(1)
    panel["act"] = (panel["tx"] > 0).astype("float32")          # mes con compra real
    panel["act_s1"] = gcol(panel, "act").shift(1)

    # --- Nivel: lags ---
    panel["tx_lag1"] = panel["tx_s1"]
    panel["tx_lag2"] = gcol(panel, "tx").shift(2)
    panel["tx_lag3"] = gcol(panel, "tx").shift(3)
    panel["bx_lag1"] = panel["bx_s1"]
    panel["bx_lag2"] = gcol(panel, "bx").shift(2)

    # --- Nivel: promedios / dispersion / volumen ---
    panel["tx_mean_3"] = roll(panel, "tx_s1", 3, "mean")
    panel["tx_mean_6"] = roll(panel, "tx_s1", 6, "mean")
    panel["tx_mean_12"] = roll(panel, "tx_s1", 12, "mean")
    panel["bx_mean_3"] = roll(panel, "bx_s1", 3, "mean")
    panel["bx_mean_6"] = roll(panel, "bx_s1", 6, "mean")
    panel["tx_std_3"] = roll(panel, "tx_s1", 3, "std")
    panel["tx_std_6"] = roll(panel, "tx_s1", 6, "std")
    panel["bx_std_3"] = roll(panel, "bx_s1", 3, "std")
    panel["tx_max_6"] = roll(panel, "tx_s1", 6, "max")
    panel["tx_sum_6"] = roll(panel, "tx_s1", 6, "sum")

    # --- Recencia / actividad / antiguedad ---
    panel["mi_active"] = panel["mi"].where(panel["tx"] > 0)
    laff = gcol(panel, "mi_active").ffill()                      # ultimo mes activo <= actual
    panel["last_active_prev"] = laff.groupby(panel["cust"], sort=False).shift(1)  # <= M-1
    panel["tenure"] = (panel["mi"] - gcol(panel, "mi").transform("min")).astype("float32")
    panel["recency"] = (panel["mi"] - panel["last_active_prev"]).astype("float32")
    panel["recency"] = panel["recency"].fillna(panel["tenure"] + 1)   # nunca compro antes
    panel["meses_activos_3"] = roll(panel, "act_s1", 3, "sum")
    panel["meses_activos_6"] = roll(panel, "act_s1", 6, "sum")
    panel["pct_ceros_3"] = 1 - roll(panel, "act_s1", 3, "mean")
    panel["pct_ceros_6"] = 1 - roll(panel, "act_s1", 6, "mean")

    # --- Tendencia / declive (la señal de oro del churn) ---
    panel["tx_ratio_1_3"] = panel["tx_lag1"] / (panel["tx_mean_3"] + 1.0)
    panel["bx_ratio_1_3"] = panel["bx_lag1"] / (panel["bx_mean_3"] + 1.0)
    panel["tx_drop_3"] = panel["tx_mean_3"] - panel["tx_lag1"]    # >0 = cayendo
    panel["tx_slope_3"] = panel["tx_lag1"] - panel["tx_lag3"]     # <0 = cayendo

    # --- Coolers: estado conocido hasta M-1 (variable de negocio clave) ---
    panel["coolers_state"] = gcol(panel, "num_coolers").ffill()
    panel["doors_state"] = gcol(panel, "num_doors").ffill()
    panel["num_coolers_last"] = gcol(panel, "coolers_state").shift(1).fillna(0).astype("float32")
    panel["num_doors_last"] = gcol(panel, "doors_state").shift(1).fillna(0).astype("float32")
    coolers_lag3 = gcol(panel, "coolers_state").shift(3)
    # >0 = perdio coolers; sin historial de coolers (16% sin nevera) => 0 cambio
    panel["coolers_drop_3"] = (coolers_lag3 - panel["num_coolers_last"]).fillna(0).astype("float32")
    panel["tiene_cooler"] = (panel["num_coolers_last"] > 0).astype("int8")
    print(f"[features] listo en {time.time()-t0:.1f}s")

    # ---------- 4. SELECCION DE COLUMNAS ----------
    cat_cols = ["territory_d", "comercial_subchannel_d", "rtm_customer_size_d"]
    num_cols = [
        "recency", "tenure", "meses_activos_3", "meses_activos_6", "pct_ceros_3", "pct_ceros_6",
        "tx_lag1", "tx_lag2", "tx_lag3", "bx_lag1", "bx_lag2",
        "tx_mean_3", "tx_mean_6", "tx_mean_12", "bx_mean_3", "bx_mean_6",
        "tx_std_3", "tx_std_6", "bx_std_3", "tx_max_6", "tx_sum_6",
        "tx_ratio_1_3", "bx_ratio_1_3", "tx_drop_3", "tx_slope_3",
        "num_coolers_last", "num_doors_last", "coolers_drop_3", "tiene_cooler",
    ]
    feat_cols = num_cols + cat_cols
    meta_cols = ["customer_id", "calmonth", "target"]

    for c in num_cols:
        panel[c] = panel[c].astype("float32")

    # ---------- 5. SPLITS Y GUARDADO ----------
    # Prediccion: todas las filas del mes objetivo (sin filtro de antiguedad).
    predict_df = panel.loc[panel["calmonth"] == PREDICT_MONTH, ["customer_id"] + feat_cols].copy()

    # Entrenamiento: filas etiquetadas con al menos 2 meses de historial.
    mask_tr = (panel["split"] == "train") & (panel["tenure"] >= 2)
    train_df = panel.loc[mask_tr, meta_cols + feat_cols].copy()

    # Archivo balanceado (todos los positivos + negativos submuestreados).
    pos = train_df[train_df["target"] == 1]
    neg = train_df[train_df["target"] == 0].sample(
        n=min(len(pos) * NEG_RATIO, (train_df["target"] == 0).sum()), random_state=SEED
    )
    train_bal = pd.concat([pos, neg]).sample(frac=1, random_state=SEED).reset_index(drop=True)

    predict_df.to_parquet(OUT / "features_predict.parquet", index=False)
    train_df.to_parquet(OUT / "features_train.parquet", index=False)
    train_bal.to_parquet(OUT / "features_train_bal.parquet", index=False)

    # ---------- 6. VALIDACION ----------
    print("\n" + "=" * 55)
    print("RESUMEN FEATURE ENGINEERING")
    print("=" * 55)
    print(f"train (etiquetado): {train_df.shape}  churn={train_df['target'].mean()*100:.2f}%")
    print(f"train balanceado : {train_bal.shape}  churn={train_bal['target'].mean()*100:.2f}%")
    print(f"predict (202602) : {predict_df.shape}")
    print(f"# features        : {len(feat_cols)} ({len(num_cols)} num + {len(cat_cols)} cat)")

    print("\n--- nulos por feature (train, %) ---")
    nul = (train_df[feat_cols].isna().mean() * 100).round(2)
    print(nul[nul > 0].sort_values(ascending=False).to_string() or "sin nulos")

    print("\n--- SANITY CHECK: media por clase (churn=1 debe separarse) ---")
    chk = ["recency", "tx_mean_3", "tx_lag1", "pct_ceros_3", "tx_drop_3",
           "meses_activos_6", "num_coolers_last"]
    comp = train_df.groupby("target")[chk].mean().T
    comp.columns = ["no_churn(0)", "churn(1)"]
    print(comp.round(3).to_string())

    print(f"\nlisto en {time.time()-t0:.1f}s  ->  {OUT}/")


if __name__ == "__main__":
    main()
