import pandas as pd
import random
import numpy as np
from faker import Faker

fake = Faker()
random.seed(42)
np.random.seed(42)

def generate_user_id(index):
    return f"U{str(index).zfill(4)}"

def determine_target_action(user):
    if user['account_balance'] < 1000 and user['credit_score'] < 550:
        return 'pay_debt'
    elif user['income'] > 150000 and user['risk_profile'] == 'low':
        return 'save_money'
    elif user['income'] > 100000 and user['account_balance'] > 50000:
        return 'invest_more'
    elif user['avg_transaction_value'] > 20000 and user['num_transactions'] > 60:
        return 'stop_spending'
    else:
        return random.choice(['save_money', 'pay_debt', 'invest_more'])

def generate_dataset(num_rows=5000):
    data = []
    spending_categories = ['groceries', 'travel', 'entertainment', 'utilities', 'education', 'health']
    risk_profiles = ['low', 'medium', 'high']

    for i in range(num_rows):
        income = round(random.uniform(10000, 200000), 2)
        account_balance = round(random.uniform(0, 1000000), 2)
        credit_score = random.randint(300, 850)
        num_transactions = random.randint(5, 150)
        avg_transaction_value = round(random.uniform(100, 50000), 2)

        user = {
            "user_id": generate_user_id(i + 1),
            "age": random.randint(18, 70),
            "income": income,
            "account_balance": account_balance,
            "credit_score": credit_score,
            "num_transactions": num_transactions,
            "avg_transaction_value": avg_transaction_value,
            "spending_category": random.choice(spending_categories),
            "risk_profile": random.choice(risk_profiles)
        }

        # Derived features
        user["income_to_balance_ratio"] = round(income / (account_balance + 1), 4)
        user["transaction_frequency"] = round(num_transactions / 30, 2)
        user["spending_efficiency"] = round(avg_transaction_value / (income / 12), 4)
        user["financial_health_score"] = round((credit_score / 850) * 0.4 + (account_balance / income) * 0.6, 4)
        user["age_income_interaction"] = round((user["age"] * income) / 100000, 4)
        user["high_risk_spending"] = 1 if user['spending_category'] in ['entertainment', 'travel'] else 0
        user["conservative_profile"] = 1 if user['risk_profile'] == 'low' else 0

        # Target
        user["target_action"] = determine_target_action(user)

        data.append(user)

    df = pd.DataFrame(data)
    return df

# Generate and save the dataset
df = generate_dataset(5000)
df.to_csv("synthetic_financial_data.csv", index=False)
print("\n✅ Enhanced dataset saved as 'synthetic_financial_data.csv'")
