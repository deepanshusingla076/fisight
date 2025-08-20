# 💸 FiSight AI – Financial Behavior Prediction Engine

FiSight is a smart AI-driven assistant that analyzes synthetic financial user data and recommends personalized financial actions such as:
- 💰 `invest_more`
- 💳 `pay_debt`
- 🏦 `save_money`
- 🚫 `stop_spending`

It uses advanced machine learning (XGBoost with GPU) trained on enhanced synthetic data to predict intelligent financial actions based on user attributes like income, credit score, spending behavior, and risk profile.

---

## 🧠 How the Model is Trained

### 1. **Synthetic Dataset Generation**
The dataset is generated using `Faker`, `random`, and `NumPy`, simulating 5000 realistic financial user profiles with:
- Age, income, account balance, credit score
- Spending behavior (number, type, amount of transactions)
- Risk profile & spending category

Each user is labeled with a **target financial action** using intelligent, rule-based logic via the function `determine_target_action()`.

> ✅ The generated dataset is saved as:  
> `synthetic_financial_data.csv`

---

### 2. **Feature Engineering**
Additional derived features are added to improve prediction power:
- `income_to_balance_ratio`
- `spending_efficiency`
- `financial_health_score`
- `age_income_interaction`
- Binary indicators for `high_risk_spending`, `conservative_profile`, etc.

---

### 3. **Preprocessing**
- Encodes categorical columns using `LabelEncoder`
- Drops irrelevant fields (e.g., `user_id`)
- Scales numerical features with `StandardScaler`
- Selects top 12 important features using `SelectKBest`

---

### 4. **Class Imbalance Handling**
- Applies **SMOTE (Synthetic Minority Over-sampling Technique)** to balance the dataset classes (especially for underrepresented labels like `pay_debt`).

---

### 5. **Model Training (XGBoost with GPU)**
- Uses **XGBoostClassifier** with `device='cuda'` for GPU acceleration
- Applies **GridSearchCV** with 3-fold cross-validation to find best hyperparameters
- Includes **early stopping** to prevent overfitting

Training is done with:
```python
XGBClassifier(
    tree_method='hist', device='cuda',
    n_estimators=200,
    learning_rate=0.1,
    max_depth=4,
    subsample=0.8,
    eval_metric='mlogloss'
)
```

---

### 6. **Model Saving**
Trained model and components are saved as `.pkl` files for later inference or deployment:

- `financial_model.pkl`
- `financial_model_pipeline.pkl`
- `scaler.pkl`
- `feature_selector.pkl`
- `*_encoder.pkl` for label encoders

---

## 🚀 How to Run Locally

### Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Generate Dataset
```bash
python generate_dataset.py
```

### Step 3: Train Model (GPU Optimized)
```bash
python train_model.py
```

---

## 📊 Current Performance

- ✅ Accuracy: **79.80%**
- 🏆 Best model: **XGBoost (GPU-accelerated)**
- 📋 Classification report includes macro and weighted precision/recall

---

## 📁 Project Structure

```
.
├── generate_dataset.py         # Generates enhanced synthetic financial dataset
├── train_model.py              # Trains the ML model using XGBoost + SMOTE
├── synthetic_financial_data.csv
├── financial_model.pkl
├── financial_model_pipeline.pkl
├── scaler.pkl, feature_selector.pkl
├── *_encoder.pkl               # Encoders for categorical labels
└── README.md                   # Project documentation
```

---

## 🧠 Future Enhancements (Optional)

- Expand dataset to 10,000 users
- Tune hyperparameters with Optuna
- Deploy model as a REST API (Flask/FastAPI)
- Integrate into the FiSight dashboard UI

---

## 👨‍💻 Built With

- Python 3.10+
- pandas, numpy, faker
- scikit-learn
- imbalanced-learn (SMOTE)
- XGBoost (GPU)

---

## 💡 Use Case

FiSight AI can be embedded into any financial assistant, robo-advisor, or personal finance dashboard to deliver smart, data-driven recommendations to users based on their unique profile.

---

## 🙌 Authors

- **Deepanshu Singla**
- HackRx 2025 Submission – LLM Document Processing Challenge (Team: FiSight)