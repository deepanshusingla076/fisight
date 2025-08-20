import pandas as pd
import numpy as np
import joblib
import warnings
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.metrics import classification_report, accuracy_score
from imblearn.over_sampling import SMOTE
from xgboost import XGBClassifier

# Suppress all warnings
warnings.filterwarnings("ignore")

# === CONFIG ===
DATA_FILE = "synthetic_financial_data.csv"
TARGET_COL = "target_action"
DROP_COLS = ["user_id"]
CATEGORICAL_COLS = ["spending_category", "risk_profile", "target_action"]
TOP_FEATURES = 12
TEST_SIZE = 0.2
RANDOM_STATE = 42

print("\n🚀 FiSight AI Model Training (GPU Optimized) Started")
print("====================================================")

# Load dataset
df = pd.read_csv(DATA_FILE)
print(f"📊 Loaded dataset: {df.shape[0]} rows, {df.shape[1]} columns")

# Feature engineering
print("\n🔧 Engineering features...")
df['income_to_balance_ratio'] = df['income'] / (df['account_balance'] + 1)
df['transaction_frequency'] = df['num_transactions'] / 30
df['spending_efficiency'] = df['avg_transaction_value'] / (df['income'] / 12)
df['financial_health_score'] = (df['credit_score'] / 850) * 0.4 + (df['account_balance'] / df['income']) * 0.6
df['age_income_interaction'] = df['age'] * df['income'] / 100000
df['high_risk_spending'] = df['spending_category'].isin(['entertainment', 'travel']).astype(int)
df['conservative_profile'] = (df['risk_profile'] == 'low').astype(int)

# Drop irrelevant columns
df.drop(columns=DROP_COLS, inplace=True)

# Encode categorical features
print("🏷️ Encoding categorical columns...")
label_encoders = {}
for col in CATEGORICAL_COLS:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le
    joblib.dump(le, f"{col}_encoder.pkl")
    print(f"   ✅ Encoded: {col}")

# Split data
X = df.drop(columns=[TARGET_COL])
y = df[TARGET_COL]

# Feature selection
selector = SelectKBest(score_func=f_classif, k=min(TOP_FEATURES, X.shape[1]))
X_selected = selector.fit_transform(X, y)
selected_features = X.columns[selector.get_support()]
joblib.dump(selector, "feature_selector.pkl")
print(f"\n🔍 Selected Features: {selected_features.tolist()}")

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X_selected, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y)

# Apply SMOTE
print("\n📈 Applying SMOTE to handle imbalance...")
smote = SMOTE(random_state=RANDOM_STATE)
X_train, y_train = smote.fit_resample(X_train, y_train)

# Scaling
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
joblib.dump(scaler, "scaler.pkl")

# === Train XGBoost with GPU ===
print("\n⚡ Training XGBoost (GPU Enabled)...")

xgb = XGBClassifier(
    device='cuda',  # Correct GPU usage (XGBoost 2.0+)
    objective='multi:softprob',
    eval_metric='mlogloss',
    random_state=RANDOM_STATE,
    verbosity=0,
    use_label_encoder=False
)

params = {
    'n_estimators': [100, 200],
    'learning_rate': [0.05, 0.1],
    'max_depth': [4, 6],
    'subsample': [0.8, 1.0],
}

grid = GridSearchCV(
    estimator=xgb,
    param_grid=params,
    scoring='accuracy',
    cv=3,
    verbose=1,
    n_jobs=-1
)

grid.fit(X_train_scaled, y_train)


best_model = grid.best_estimator_
y_pred = best_model.predict(X_test_scaled)

accuracy = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred, target_names=label_encoders[TARGET_COL].classes_)

# Print evaluation
print("\n🏁 Training Complete")
print("✅ Accuracy:", f"{accuracy:.2%}")
print("\n📋 Classification Report:\n", report)

# Save model pipeline
model_pipeline = {
    "model": best_model,
    "scaler": scaler,
    "feature_selector": selector,
    "label_encoders": label_encoders,
    "selected_features": selected_features.tolist(),
    "model_type": "XGBoost (GPU)",
    "accuracy": accuracy
}
joblib.dump(model_pipeline, "financial_model_pipeline.pkl")
joblib.dump(best_model, "financial_model.pkl")

print("\n💾 Saved:")
print("   • financial_model_pipeline.pkl")
print("   • financial_model.pkl")
print("   • scaler.pkl")
print("   • feature_selector.pkl")
print("   • *_encoder.pkl (label encoders)")
print("\n🎯 Model ready for deployment!")
