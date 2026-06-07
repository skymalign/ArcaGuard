# ==================================================
# CHURN HUNTER - export_charts.py
# Exporta TODOS los datos de graficas a un JSON listo para consumir en React.
# Salida: reports/charts.json  (arrays de objetos -> Recharts / Chart.js / nivo)
# Correr (despues de features.py y model.py):  python src/export_charts.py
# ==================================================

import json
from pathlib import Path

import numpy as np
import pandas as pd

PROC = Path("data/processed")
REP = Path("reports"); REP.mkdir(exist_ok=True)
MXN_PERDIDOS_MES = 12_000_000   # dato del reto: MXN perdidos/mes por churn


def records(df, **rename):
    """DataFrame -> lista de dicts (formato comodo para React, decimales limpios)."""
    if rename:
        df = df.rename(columns=rename)
    return json.loads(df.to_json(orient="records", double_precision=4))


def categoria_de(v):
    """Agrupa cada variable para colorear la grafica de importancia."""
    if v.startswith(("tx_", "bx_")):
        return "Ventas"
    if v in {"recency", "tenure", "meses_activos_3", "meses_activos_6",
             "pct_ceros_3", "pct_ceros_6"}:
        return "Actividad"
    if "cooler" in v or "door" in v:
        return "Coolers"
    return "Cliente"


def main():
    charts = {}
    df = pd.read_parquet(PROC / "features_train.parquet")
    pred = pd.read_parquet(PROC / "features_predict.parquet")

    # ---------- KPIs ----------
    metrics = {}
    mpath = PROC / "metrics.json"
    if mpath.exists():
        metrics = json.loads(mpath.read_text(encoding="utf-8"))
    hgb = next((m for m in metrics.get("modelos", []) if "Hist" in m["modelo"]), {})
    recall10 = metrics.get("recall_top10pct")
    try:
        sco = pd.read_csv(PROC / "scoring_clientes.csv")
        alto = int((sco["nivel_riesgo"] == "alto").sum())
    except FileNotFoundError:
        sco, alto = None, None

    charts["kpis"] = {
        "clientes_evaluados": int(len(pred)),
        "churn_rate_pct": round(float(df["target"].mean() * 100), 2),
        "clientes_riesgo_alto": alto,
        "pr_auc": hgb.get("pr_auc"),
        "roc_auc": hgb.get("roc_auc"),
        "recall_top10pct": recall10,
        "mxn_perdidos_mes": MXN_PERDIDOS_MES,
        "mxn_direccionable_top10": int(MXN_PERDIDOS_MES * recall10) if recall10 else None,
    }

    # ---------- Comparacion de modelos ----------
    if metrics.get("modelos"):
        charts["modelos"] = metrics["modelos"] + [
            {"modelo": "Azar (churn rate)", "pr_auc": metrics.get("azar_pr_auc"), "roc_auc": 0.5}
        ]

    # ---------- P1: importancia de variables (con categoria para colorear) ----------
    imp = pd.read_csv(PROC / "feature_importance.csv").head(15)
    imp["categoria"] = imp["feature"].map(categoria_de)
    charts["importancia_variables"] = records(imp, feature="variable")

    # ---------- Impacto comercial: recall@top-K ----------
    charts["recall_topk"] = records(pd.read_csv(PROC / "recall_topk.csv"))

    # ---------- Curva de umbral (precision/recall trade-off) ----------
    charts["umbral"] = records(pd.read_csv(PROC / "threshold_table.csv"))

    # ---------- P2: churn por territorio ----------
    terr = (df.groupby("territory_d")["target"]
            .agg(churn_pct=lambda s: round(s.mean() * 100, 2), registros="count")
            .reset_index().rename(columns={"territory_d": "territorio"})
            .sort_values("churn_pct", ascending=False))
    charts["churn_por_territorio"] = records(terr)

    # ---------- P3: churn por # de coolers ----------
    df["_bucket"] = pd.cut(df["num_coolers_last"], [-1, 0, 1, 3, 1e9],
                           labels=["0", "1", "2-3", "4+"])
    cool = (df.groupby("_bucket", observed=True)["target"]
            .agg(churn_pct=lambda s: round(s.mean() * 100, 3), registros="count")
            .reset_index().rename(columns={"_bucket": "coolers"}))
    charts["churn_por_coolers"] = records(cool)

    # ---------- Extra: churn por tamaño de cliente ----------
    orden = ["Mini", "Pequeño", "Mediano", "Grande", "Gigante"]
    size = (df.groupby("rtm_customer_size_d")["target"]
            .agg(churn_pct=lambda s: round(s.mean() * 100, 3), registros="count")
            .reset_index().rename(columns={"rtm_customer_size_d": "tamano"}))
    size["_o"] = size["tamano"].map({k: i for i, k in enumerate(orden)})
    charts["churn_por_tamano"] = records(size.sort_values("_o").drop(columns="_o"))

    # ---------- Extra: churn por subcanal comercial ----------
    sub = (df.groupby("comercial_subchannel_d")["target"]
           .agg(churn_pct=lambda s: round(s.mean() * 100, 3), registros="count")
           .reset_index().rename(columns={"comercial_subchannel_d": "subcanal"})
           .sort_values("churn_pct", ascending=False))
    charts["churn_por_subcanal"] = records(sub)

    # ---------- Tendencia: churn por mes ----------
    mes = (df.assign(mes=df["calmonth"].astype(str))
           .groupby("mes")["target"]
           .agg(churn_pct=lambda s: round(s.mean() * 100, 3), registros="count")
           .reset_index().sort_values("mes"))
    charts["churn_por_mes"] = records(mes)

    # ---------- Curva Precision-Recall (pilar de modelado) ----------
    prc = PROC / "pr_curve.csv"
    if prc.exists():
        charts["pr_curve"] = records(pd.read_csv(prc))

    # ---------- Niveles de riesgo (mes objetivo) ----------
    if sco is not None:
        niv = (sco["nivel_riesgo"].value_counts()
               .rename_axis("nivel").reset_index(name="clientes"))
        charts["niveles_riesgo"] = records(niv)

    # ---------- Preguntas de negocio (texto + dato, para mostrar en la app) ----------
    top_t, bot_t = terr.iloc[0], terr.iloc[-1]
    t_hi, t_lo = round(float(top_t.churn_pct), 2), round(float(bot_t.churn_pct), 2)
    c0 = round(float(cool.loc[cool["coolers"] == "0", "churn_pct"].iloc[0]), 2)
    c4 = round(float(cool.loc[cool["coolers"] == "4+", "churn_pct"].iloc[0]), 2)
    smap = {k: round(float(v), 2) for k, v in zip(size["tamano"], size["churn_pct"])}
    top3 = ", ".join(imp["feature"].head(3))
    charts["preguntas"] = [
        {"id": "P1", "pregunta": "¿Qué variables influyen más en que un cliente deje de comprar?",
         "respuesta": "El nivel y la tendencia de compra reciente, no los datos demográficos.",
         "dato_clave": f"Top variables: {top3}",
         "recomendacion": "Alerta temprana cuando un cliente cae por debajo de su propia media histórica.",
         "grafica": "importancia_variables"},
        {"id": "P2", "pregunta": "¿El territorio influye en la pérdida de clientes?",
         "respuesta": f"Sí: el churn varía ~{round(t_hi / t_lo, 1)}× entre territorios.",
         "dato_clave": f"{top_t.territorio} {t_hi}% (mayor) vs {bot_t.territorio} {t_lo}% (menor)",
         "recomendacion": "Reforzar retención en los territorios de mayor churn; replicar buenas prácticas de los de menor.",
         "grafica": "churn_por_territorio"},
        {"id": "P3", "pregunta": "¿La cantidad de coolers afecta el riesgo de churn?",
         "respuesta": f"Sí, relación monótona de ~{int(round(c0 / c4))}×.",
         "dato_clave": f"0 coolers {c0}% vs 4+ coolers {c4}% de churn",
         "recomendacion": "Instalar coolers a clientes de alto riesgo que aún no tienen → palanca directa de retención.",
         "grafica": "churn_por_coolers"},
        {"id": "extra", "pregunta": "¿El tamaño del cliente importa?",
         "respuesta": "Sí: los clientes pequeños ('Mini') son los más volátiles.",
         "dato_clave": f"Mini {smap.get('Mini')}% vs Gigante {smap.get('Gigante')}% de churn",
         "recomendacion": "Enfocar campañas de retención en clientes Mini/Pequeño.",
         "grafica": "churn_por_tamano"},
    ]
    if recall10:
        charts["mensaje_principal"] = (
            f"Contactando solo al 10% de clientes más riesgosos, el equipo comercial "
            f"alcanza al {round(recall10 * 100)}% de quienes van a abandonar.")

    out = REP / "charts.json"
    out.write_text(json.dumps(charts, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[ok] {out}")
    print("secciones:", ", ".join(charts.keys()))


if __name__ == "__main__":
    main()
