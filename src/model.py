# ==================================================
# CHURN HUNTER - model.py
# Modelado con scikit-learn (validacion TEMPORAL, desbalance, scoring de riesgo)
# --------------------------------------------------
# 1. Carga features (src/features.py).
# 2. Split temporal: entrena <=202512, valida 202601 (imita predecir 202602).
# 3. Compara baseline (LogisticRegression) vs HistGradientBoosting.
# 4. Metricas para desbalance: PR-AUC, ROC-AUC, recall, recall@top-K (lift).
# 5. Ajuste de umbral + niveles de riesgo alto/medio/bajo.
# 6. Permutation importance -> que variables influyen mas (P1).
# 7. Reentrena con todo y predice 202602 -> submission + scoring de clientes.
# ==================================================

import json
import time
import warnings
from pathlib import Path

import numpy as np
import pandas as pd
import joblib

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.utils.class_weight import compute_sample_weight
from sklearn.inspection import permutation_importance
from sklearn.metrics import (
    average_precision_score, roc_auc_score, precision_score,
    recall_score, f1_score, confusion_matrix, precision_recall_curve,
)

warnings.filterwarnings("ignore")

PROC = Path("data/processed")
MODELS = Path("models"); MODELS.mkdir(exist_ok=True)

VALID_MONTH = 202601          # mes de validacion (ultimo etiquetado)
SEED = 42

CAT_COLS = ["territory_d", "comercial_subchannel_d", "rtm_customer_size_d"]


def recall_at_topk(y_true, scores, ks=(0.01, 0.02, 0.05, 0.10, 0.20)):
    """% de churners capturados si el equipo comercial contacta al top-K% mas riesgoso."""
    order = np.argsort(scores)[::-1]
    y = np.asarray(y_true)[order]
    total_pos = y.sum()
    n = len(y)
    rows = []
    for k in ks:
        m = max(1, int(n * k))
        captured = y[:m].sum()
        rows.append({
            "top_%": f"{k*100:.0f}%",
            "clientes_contactados": m,
            "churners_capturados": int(captured),
            "recall": round(captured / total_pos, 3),
            "lift": round((captured / m) / (total_pos / n), 2),
        })
    return pd.DataFrame(rows)


def main():
    t0 = time.time()

    # ---------- 1. CARGA ----------
    df = pd.read_parquet(PROC / "features_train.parquet")
    pred = pd.read_parquet(PROC / "features_predict.parquet")
    feat_cols = [c for c in df.columns if c not in ("customer_id", "calmonth", "target")]
    num_cols = [c for c in feat_cols if c not in CAT_COLS]

    # categoricas como dtype 'category' (HGB las maneja nativo)
    for c in CAT_COLS:
        df[c] = df[c].astype("category")
        pred[c] = pred[c].astype("category")

    # ---------- 2. SPLIT TEMPORAL ----------
    tr = df[df["calmonth"] < VALID_MONTH]
    va = df[df["calmonth"] == VALID_MONTH]
    Xtr, ytr = tr[feat_cols], tr["target"].astype(int)
    Xva, yva = va[feat_cols], va["target"].astype(int)
    print(f"[split] train {Xtr.shape} churn={ytr.mean()*100:.2f}%  |  "
          f"valid(202601) {Xva.shape} churn={yva.mean()*100:.2f}%")

    w_tr = compute_sample_weight("balanced", ytr)   # corrige desbalance sin tirar datos

    # ---------- 3. MODELOS ----------
    # Baseline: regresion logistica (imputa + escala num, one-hot cat)
    pre = ColumnTransformer([
        ("num", Pipeline([("imp", SimpleImputer(strategy="median")),
                          ("sc", StandardScaler())]), num_cols),
        ("cat", OneHotEncoder(handle_unknown="ignore", min_frequency=20), CAT_COLS),
    ])
    baseline = Pipeline([("pre", pre),
                         ("clf", LogisticRegression(max_iter=1000, class_weight="balanced"))])

    # Modelo principal: HistGradientBoosting (gradient boosting de arboles)
    hgb = HistGradientBoostingClassifier(
        learning_rate=0.08, max_iter=400, max_leaf_nodes=63,
        min_samples_leaf=200, l2_regularization=1.0,
        categorical_features="from_dtype", early_stopping=True,
        validation_fraction=0.1, random_state=SEED,
    )

    print("\n[fit] entrenando baseline (LogReg)...")
    t = time.time(); baseline.fit(Xtr, ytr); print(f"   ok {time.time()-t:.1f}s")
    print("[fit] entrenando HistGradientBoosting...")
    t = time.time(); hgb.fit(Xtr, ytr, sample_weight=w_tr); print(f"   ok {time.time()-t:.1f}s")

    # ---------- 4. EVALUACION (validacion temporal) ----------
    print("\n" + "=" * 55)
    print("COMPARACION DE MODELOS (validacion 202601)")
    print("=" * 55)
    results = {}
    metrics = {"validacion_mes": VALID_MONTH,
               "churn_rate_valid": round(float(yva.mean()), 4), "modelos": []}
    for name, model in [("LogReg (baseline)", baseline), ("HistGradientBoosting", hgb)]:
        p = model.predict_proba(Xva)[:, 1]
        results[name] = p
        pr, roc = average_precision_score(yva, p), roc_auc_score(yva, p)
        metrics["modelos"].append({"modelo": name, "pr_auc": round(float(pr), 4),
                                   "roc_auc": round(float(roc), 4)})
        print(f"{name:>22}  PR-AUC={pr:.4f}  ROC-AUC={roc:.4f}")
    base_rate = yva.mean()
    print(f"{'(azar / churn rate)':>22}  PR-AUC={base_rate:.4f}")

    proba = results["HistGradientBoosting"]   # modelo elegido

    # ---------- 5. UMBRAL + NIVELES DE RIESGO ----------
    print("\n--- Ajuste de umbral (modelo elegido, valid 202601) ---")
    rows = []
    for thr in [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]:
        yp = (proba >= thr).astype(int)
        rows.append({
            "umbral": thr,
            "precision": round(precision_score(yva, yp, zero_division=0), 3),
            "recall": round(recall_score(yva, yp), 3),
            "f1": round(f1_score(yva, yp, zero_division=0), 3),
            "marcados": int(yp.sum()),
        })
    thr_tbl = pd.DataFrame(rows)
    print(thr_tbl.to_string(index=False))
    best_thr = float(thr_tbl.loc[thr_tbl["f1"].idxmax(), "umbral"])
    print(f"\nUmbral con mejor F1: {best_thr}")
    yp = (proba >= best_thr).astype(int)
    tn, fp, fn, tp = confusion_matrix(yva, yp).ravel()
    print(f"Matriz @ {best_thr}: TP={tp} FP={fp} FN={fn} TN={tn}")

    print("\n--- recall@top-K (impacto comercial: a quien contactar) ---")
    topk = recall_at_topk(yva, proba)
    print(topk.to_string(index=False))

    # ---------- 6. IMPORTANCIA DE VARIABLES (P1) ----------
    print("\n[importance] permutation importance (PR-AUC, muestra valid)...")
    samp = va.sample(min(40000, len(va)), random_state=SEED)
    pi = permutation_importance(
        hgb, samp[feat_cols], samp["target"].astype(int),
        scoring="average_precision", n_repeats=5, random_state=SEED, n_jobs=-1,
    )
    imp = (pd.DataFrame({"feature": feat_cols, "importance": pi.importances_mean})
           .sort_values("importance", ascending=False).reset_index(drop=True))
    print(imp.head(15).to_string(index=False))

    # ---------- 7. REENTRENO CON TODO + PREDICCION 202602 ----------
    print("\n[final] reentrenando con TODOS los meses etiquetados...")
    Xall, yall = df[feat_cols], df["target"].astype(int)
    w_all = compute_sample_weight("balanced", yall)
    final = HistGradientBoostingClassifier(
        learning_rate=0.08, max_iter=400, max_leaf_nodes=63,
        min_samples_leaf=200, l2_regularization=1.0,
        categorical_features="from_dtype", random_state=SEED,
    )
    final.fit(Xall, yall, sample_weight=w_all)

    pred_proba = final.predict_proba(pred[feat_cols])[:, 1]
    pred_out = pred[["customer_id"]].copy()
    pred_out["churn_proba"] = pred_proba.round(5)
    pred_out["target"] = (pred_proba >= best_thr).astype(int)
    # niveles de riesgo: alto = sobre umbral; medio = mitad del umbral; bajo = resto
    pred_out["nivel_riesgo"] = np.select(
        [pred_proba >= best_thr, pred_proba >= best_thr / 2],
        ["alto", "medio"], default="bajo",
    )
    print("\nDistribucion niveles de riesgo (202602):")
    print(pred_out["nivel_riesgo"].value_counts().to_string())
    print(f"Clientes marcados churn (target=1): {pred_out['target'].sum():,}")

    # ---------- 8. GUARDADO ----------
    # submission con el formato exacto de preds_submission.csv (target, customer_id).
    # IMPORTANTE: la columna target debe ser la PROBABILIDAD de churn (se califica con AUC),
    # NO la etiqueta 0/1. El AUC necesita el score continuo para ordenar a los clientes.
    sub_tmpl = pd.read_csv("data/raw/preds_submission.csv", dtype={"customer_id": "string"})
    sub = sub_tmpl[["customer_id"]].merge(
        pred_out[["customer_id", "churn_proba"]], on="customer_id", how="left")
    sub["target"] = sub["churn_proba"].fillna(0.0)
    sub[["target", "customer_id"]].to_csv(PROC / "preds_submission.csv", index=False)

    pred_out.sort_values("churn_proba", ascending=False).to_csv(
        PROC / "scoring_clientes.csv", index=False)
    imp.to_csv(PROC / "feature_importance.csv", index=False)
    thr_tbl.to_csv(PROC / "threshold_table.csv", index=False)
    topk.to_csv(PROC / "recall_topk.csv", index=False)
    joblib.dump(final, MODELS / "churn_hgb.joblib")

    # curva Precision-Recall (validacion temporal), submuestreada para el dashboard
    prec, rec, _ = precision_recall_curve(yva, proba)
    idx = np.linspace(0, len(prec) - 1, min(200, len(prec))).astype(int)
    pd.DataFrame({"recall": rec[idx].round(4), "precision": prec[idx].round(4)}).to_csv(
        PROC / "pr_curve.csv", index=False)

    # metricas para el dashboard / reproducibilidad
    metrics.update({
        "umbral_elegido": best_thr,
        "matriz_confusion": {"tp": int(tp), "fp": int(fp), "fn": int(fn), "tn": int(tn)},
        "recall_top10pct": float(topk.loc[topk["top_%"] == "10%", "recall"].iloc[0]),
        "azar_pr_auc": round(float(base_rate), 4),
    })
    (PROC / "metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")

    print(f"\nlisto en {time.time()-t0:.1f}s")
    print(f"submission -> {PROC}/preds_submission.csv")
    print(f"scoring    -> {PROC}/scoring_clientes.csv (prob + nivel de riesgo)")
    print(f"modelo     -> {MODELS}/churn_hgb.joblib")


if __name__ == "__main__":
    main()
