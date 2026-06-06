# ==================================================
# CHURN HUNTER - 01_EDA.py
# Carga y exploración inicial de datos
# ==================================================

import pandas as pd
import numpy as np

# ==================================================
# CONFIGURACIÓN
# ==================================================

pd.set_option("display.max_columns", None)
pd.set_option("display.width", 200)

# ==================================================
# CARGA DE DATOS
# ==================================================

clientes = pd.read_csv("../data/raw/clientes.csv")
coolers = pd.read_csv("../data/raw/coolers.csv")
train = pd.read_csv("../data/raw/sales_churn_train.csv")
test = pd.read_csv("../data/raw/sales_churn_test.csv")
submission = pd.read_csv("../data/raw/preds_submission.csv")

print("Archivos cargados correctamente")

# ==================================================
# DIMENSIONES
# ==================================================

print("\n===== DIMENSIONES =====")
print(f"Clientes: {clientes.shape}")
print(f"Coolers: {coolers.shape}")
print(f"Train: {train.shape}")
print(f"Test: {test.shape}")
print(f"Submission: {submission.shape}")

# ==================================================
# PRIMERAS FILAS
# ==================================================

print("\n===== CLIENTES =====")
print(clientes.head())

print("\n===== COOLERS =====")
print(coolers.head())

print("\n===== TRAIN =====")
print(train.head())

print("\n===== TEST =====")
print(test.head())

print("\n===== SUBMISSION =====")
print(submission.head())

# ==================================================
# TIPOS DE DATOS
# ==================================================

print("\n===== INFO CLIENTES =====")
clientes.info()

print("\n===== INFO COOLERS =====")
coolers.info()

print("\n===== INFO TRAIN =====")
train.info()

print("\n===== INFO TEST =====")
test.info()

# ==================================================
# VALORES NULOS
# ==================================================

print("\n===== NULOS CLIENTES =====")
print(clientes.isnull().sum())

print("\n===== NULOS COOLERS =====")
print(coolers.isnull().sum())

print("\n===== NULOS TRAIN =====")
print(train.isnull().sum())

print("\n===== NULOS TEST =====")
print(test.isnull().sum())

# ==================================================
# CLIENTES ÚNICOS
# ==================================================

print("\n===== CLIENTES ÚNICOS =====")

print(
    "Clientes en tabla clientes:",
    clientes["customer_id"].nunique()
)

print(
    "Clientes en train:",
    train["customer_id"].nunique()
)

print(
    "Clientes en test:",
    test["customer_id"].nunique()
)

# ==================================================
# TARGET
# ==================================================

print("\n===== DISTRIBUCIÓN TARGET =====")

print(train["target"].value_counts())

print("\n===== PORCENTAJES TARGET =====")

print(
    train["target"]
    .value_counts(normalize=True)
    .mul(100)
    .round(2)
)

# ==================================================
# FECHAS
# ==================================================

train["calmonth"] = pd.to_datetime(
    train["calmonth"].astype(str),
    format="%Y%m"
)

test["calmonth"] = pd.to_datetime(
    test["calmonth"].astype(str),
    format="%Y%m"
)

coolers["calmonth"] = pd.to_datetime(
    coolers["calmonth"].astype(str),
    format="%Y%m"
)

print("\n===== RANGO DE FECHAS =====")

print(
    "Train:",
    train["calmonth"].min(),
    "->",
    train["calmonth"].max()
)

print(
    "Test:",
    test["calmonth"].min(),
    "->",
    test["calmonth"].max()
)

print(
    "Coolers:",
    coolers["calmonth"].min(),
    "->",
    coolers["calmonth"].max()
)

# ==================================================
# ESTADÍSTICAS DESCRIPTIVAS
# ==================================================

print("\n===== DESCRIBE TRAIN =====")

print(
    train[
        [
            "num_transacciones",
            "uni_boxes_sold_m"
        ]
    ].describe()
)

# ==================================================
# DUPLICADOS
# ==================================================

print("\n===== DUPLICADOS =====")

print(
    "Train:",
    train.duplicated().sum()
)

print(
    "Test:",
    test.duplicated().sum()
)

print(
    "Clientes:",
    clientes.duplicated().sum()
)

print(
    "Coolers:",
    coolers.duplicated().sum()
)

# ==================================================
# DUPLICADOS POR CUSTOMER + MES
# ==================================================

print("\n===== CUSTOMER_ID + CALMONTH =====")

print(
    "Duplicados Train:",
    train.duplicated(
        subset=["customer_id", "calmonth"]
    ).sum()
)

print(
    "Duplicados Test:",
    test.duplicated(
        subset=["customer_id", "calmonth"]
    ).sum()
)

print(
    "Duplicados Coolers:",
    coolers.duplicated(
        subset=["customer_id", "calmonth"]
    ).sum()
)

# ==================================================
# VALIDACIÓN DE LLAVES
# ==================================================

print("\n===== CUSTOMER_ID NULOS =====")

print(
    "Train:",
    train["customer_id"].isnull().sum()
)

print(
    "Clientes:",
    clientes["customer_id"].isnull().sum()
)

print(
    "Coolers:",
    coolers["customer_id"].isnull().sum()
)

# ==================================================
# MESES DISPONIBLES
# ==================================================

print("\n===== MESES DISPONIBLES TRAIN =====")

print(
    train["calmonth"]
    .sort_values()
    .unique()
)

print("\nCantidad de meses:")

print(
    train["calmonth"]
    .nunique()
)

# ==================================================
# RESUMEN EJECUTIVO
# ==================================================

print("\n==============================")
print("RESUMEN")
print("==============================")

print(
    f"Clientes únicos train: {train['customer_id'].nunique():,}"
)

print(
    f"Clientes únicos test: {test['customer_id'].nunique():,}"
)

print(
    f"Meses train: {train['calmonth'].nunique()}"
)

print(
    f"Churn rate: {train['target'].mean()*100:.2f}%"
)

print("\nEDA inicial completado")