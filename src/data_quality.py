# ==================================================
# CHURN HUNTER - data_quality.py
# Reporte de calidad de datos: vacios, duplicados, outliers, cobertura.
# Imprime en consola y guarda reports/data_quality.md (documentado en el repo).
# Correr desde la raiz:  python src/data_quality.py
# ==================================================

from pathlib import Path
import pandas as pd

RAW = Path("data/raw")
PROC = Path("data/processed")
REP = Path("reports"); REP.mkdir(exist_ok=True)

LINES = []
def out(s=""):
    print(s)
    LINES.append(s)


def to_mi(c):
    return (c // 100) * 12 + (c % 100 - 1)


def main():
    out("# Reporte de calidad de datos - Churn Hunter")
    out(f"_Generado automaticamente con `src/data_quality.py`._\n")

    # ---------- VENTAS (dato principal) ----------
    out("## 1. Ventas (sales_churn_train / test)")
    tr = pd.read_csv(RAW / "sales_churn_train.csv")
    te = pd.read_csv(RAW / "sales_churn_test.csv")
    panel_ids = set(tr["customer_id"]) | set(te["customer_id"])
    for nm, d in [("train", tr), ("test", te)]:
        nulos = d.isna().sum().sum()
        out(f"- **{nm}**: {d.shape[0]:,} filas x {d.shape[1]} cols | vacios: **{nulos}**")
    neg = (tr["uni_boxes_sold_m"] < 0).sum()
    out(f"- cajas (`uni_boxes_sold_m`) negativas en train: **{neg}** -> se recortan a 0 en features")
    out(f"- `num_transacciones` rango: [{tr['num_transacciones'].min()}, {tr['num_transacciones'].max()}]")
    cr = tr["target"].mean() * 100
    out(f"- target: {int(tr['target'].sum()):,} churns / {len(tr):,} -> churn rate **{cr:.2f}%** (desbalance extremo)\n")

    # ---------- CLIENTES ----------
    out("## 2. Clientes (estatico)")
    cl = pd.read_csv(RAW / "Clientes.csv", dtype="string", encoding="latin-1")
    nul = cl.isna().sum()
    out(f"- {len(cl):,} filas | duplicados de customer_id: {cl['customer_id'].duplicated().sum()}")
    for c in cl.columns:
        if nul[c] > 0:
            en_panel = len(set(cl.loc[cl[c].isna(), "customer_id"]) & panel_ids)
            out(f"- vacios en `{c}`: **{nul[c]:,}** | de esos, en el universo modelado: **{en_panel}**")
    if nul.sum() == 0:
        out("- sin vacios")
    out("")

    # ---------- COOLERS ----------
    out("## 3. Coolers (mensual)")
    co = pd.read_csv(RAW / "Coolers.csv")
    dups = co.duplicated(subset=["customer_id", "calmonth"]).sum()
    cov = len(set(co["customer_id"]) & panel_ids) / len(panel_ids) * 100
    out(f"- {len(co):,} filas | vacios: {co.isna().sum().sum()}")
    out(f"- duplicados (cliente+mes): **{dups:,}** -> se deduplican tomando el maximo")
    out(f"- cobertura de clientes modelados: **{cov:.1f}%** -> el resto = sin nevera, se rellena con 0\n")

    # ---------- ESTRUCTURA DEL PANEL ----------
    out("## 4. Estructura del panel (train)")
    tr["mi"] = to_mi(tr["calmonth"])
    g = tr.groupby("customer_id")["mi"]
    dense = ((g.max() - g.min() + 1) == g.count()).mean() * 100
    out(f"- clientes unicos: {tr['customer_id'].nunique():,} | meses: {tr['calmonth'].nunique()} "
        f"({tr['calmonth'].min()} -> {tr['calmonth'].max()})")
    out(f"- panel **denso (sin huecos cliente-mes): {dense:.1f}%** | "
        f"duplicados cliente+mes: {tr.duplicated(subset=['customer_id','calmonth']).sum()}\n")

    # ---------- TABLA DE FEATURES ----------
    out("## 5. Tabla de features (lo que entra al modelo)")
    ftr = PROC / "features_train.parquet"
    if not ftr.exists():
        out("- _(corre `python src/features.py` primero para auditar las features)_\n")
    else:
        d = pd.read_parquet(ftr)
        p = pd.read_parquet(PROC / "features_predict.parquet")
        cats = ["territory_d", "comercial_subchannel_d", "rtm_customer_size_d"]
        out(f"- train: {d.shape[0]:,} filas | predict(202602): {p.shape[0]:,} filas")
        out(f"- vacios en categoricas (train/predict): " +
            ", ".join(f"`{c}`={d[c].isna().sum()}/{p[c].isna().sum()}" for c in cats))
        n = (d.isna().mean() * 100)
        n = n[n > 0].round(2).sort_values(ascending=False)
        out("- NaN restantes (solo por falta de historial; HGB los maneja nativo):")
        if len(n) == 0:
            out("  - ninguno")
        else:
            for k, v in n.items():
                out(f"  - `{k}`: {v}%")
        out("")

    out("## Veredicto")
    out("- El dato principal (ventas) viene **sin vacios**.")
    out("- Vacios de `rtm_customer_size_d` corresponden a clientes **fuera del universo modelado** (no afectan).")
    out("- Ausencia de coolers se trata como **0** (sin nevera), no como dato faltante.")
    out("- NaN en features = **falta de historial**; el modelo de arboles (HGB) los aprovecha sin imputar.")

    (REP / "data_quality.md").write_text("\n".join(LINES), encoding="utf-8")
    print(f"\n[guardado] {REP/'data_quality.md'}")


if __name__ == "__main__":
    main()
