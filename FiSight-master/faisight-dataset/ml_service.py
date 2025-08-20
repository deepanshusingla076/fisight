import os
import sys
import joblib
import pandas as pd
import numpy as np
from pathlib import Path

class FiSightMLService:
    """
    FiSight Machine Learning Service for Financial Predictions
    Integrates trained models with the web application
    """
    
    def __init__(self, model_path=None):
        self.model_path = model_path or Path(__file__).parent / "financial_model_pipeline.pkl"
        self.pipeline = None
        self.is_loaded = False
        self.load_model()
    
    def load_model(self):
        """Load the trained model pipeline"""
        try:
            if os.path.exists(self.model_path):
                self.pipeline = joblib.load(self.model_path)
                self.is_loaded = True
                print(f"Model loaded successfully from {self.model_path}")
                print(f"   Model type: {self.pipeline.get('model_type', 'Unknown')}")
                print(f"   Accuracy: {self.pipeline.get('accuracy', 0):.1%}")
            else:
                print(f"Model file not found: {self.model_path}")
                self.is_loaded = False
        except Exception as e:
            print(f"Error loading model: {e}")
            self.is_loaded = False
    
    def predict_financial_action(self, user_data):
        """
        Predict the best financial action for a user
        
        Args:
            user_data (dict): User financial data with keys:
                - age: int
                - income: float
                - account_balance: float
                - credit_score: int
                - num_transactions: int
                - avg_transaction_value: float
                - spending_category: str
                - risk_profile: str
        
        Returns:
            dict: Prediction results with action, confidence, and probabilities
        """
        if not self.is_loaded:
            return {
                'error': 'Model not loaded',
                'predicted_action': 'save_money',  # Default fallback
                'confidence': 0.25,
                'all_probabilities': {
                    'save_money': 0.25,
                    'invest_more': 0.25,
                    'pay_debt': 0.25,
                    'stop_spending': 0.25
                }
            }
        
        try:
            # Create input dataframe
            input_data = pd.DataFrame([user_data])
            
            # Engineer features (same as training)
            input_data['income_to_balance_ratio'] = input_data['income'] / (input_data['account_balance'] + 1)
            input_data['transaction_frequency'] = input_data['num_transactions'] / 30
            input_data['spending_efficiency'] = input_data['avg_transaction_value'] / (input_data['income'] / 12)
            input_data['financial_health_score'] = (input_data['credit_score'] / 850) * 0.4 + (input_data['account_balance'] / input_data['income']) * 0.6
            input_data['age_income_interaction'] = input_data['age'] * input_data['income'] / 100000
            input_data['high_risk_spending'] = (input_data['spending_category'].isin(['entertainment', 'travel'])).astype(int)
            input_data['conservative_profile'] = (input_data['risk_profile'] == 'low').astype(int)
            
            # Encode categorical variables
            for col in ['spending_category', 'risk_profile']:
                if col in self.pipeline['label_encoders']:
                    try:
                        input_data[col] = self.pipeline['label_encoders'][col].transform(input_data[col])
                    except ValueError:
                        # Handle unknown categories
                        input_data[col] = 0  # Default to first category
            
            # Select features and scale
            input_selected = self.pipeline['feature_selector'].transform(input_data)
            input_scaled = self.pipeline['scaler'].transform(input_selected)
            
            # Predict
            prediction = self.pipeline['model'].predict(input_scaled)[0]
            probabilities = self.pipeline['model'].predict_proba(input_scaled)[0]
            
            # Decode prediction
            predicted_action = self.pipeline['label_encoders']['target_action'].inverse_transform([prediction])[0]
            
            # Create probability dictionary
            prob_dict = {}
            for i, class_name in enumerate(self.pipeline['label_encoders']['target_action'].classes_):
                prob_dict[class_name] = float(probabilities[i])
            
            return {
                'predicted_action': predicted_action,
                'confidence': float(max(probabilities)),
                'all_probabilities': prob_dict,
                'feature_importance': self._get_feature_importance(input_data.columns.tolist())
            }
            
        except Exception as e:
            print(f"Prediction error: {e}")
            return {
                'error': str(e),
                'predicted_action': 'save_money',  # Default fallback
                'confidence': 0.25,
                'all_probabilities': {
                    'save_money': 0.25,
                    'invest_more': 0.25,
                    'pay_debt': 0.25,
                    'stop_spending': 0.25
                }
            }
    
    def get_financial_insights(self, user_data):
        """
        Get comprehensive financial insights based on ML predictions and rules
        """
        prediction_result = self.predict_financial_action(user_data)
        insights = []
        
        # ML-based primary recommendation
        primary_action = prediction_result['predicted_action']
        confidence = prediction_result['confidence']
        
        insights.append({
            'type': 'ml_prediction',
            'title': f'AI Recommendation: {primary_action.replace("_", " ").title()}',
            'description': f'Based on your financial profile, our AI suggests to {primary_action.replace("_", " ")}.',
            'confidence': confidence,
            'priority': 'high' if confidence > 0.4 else 'medium',
            'actionable': True
        })
        
        # Rule-based insights
        age = user_data.get('age', 30)
        income = user_data.get('income', 50000)
        balance = user_data.get('account_balance', 10000)
        credit_score = user_data.get('credit_score', 700)
        risk_profile = user_data.get('risk_profile', 'medium')
        
        # Emergency fund check
        emergency_months = (balance / (income / 12)) if income > 0 else 0
        if emergency_months < 3:
            insights.append({
                'type': 'emergency_fund',
                'title': 'Build Emergency Fund',
                'description': f'You have {emergency_months:.1f} months of expenses saved. Aim for 3-6 months.',
                'priority': 'high',
                'actionable': True
            })
        
        # Credit score insights
        if credit_score < 650:
            insights.append({
                'type': 'credit_score',
                'title': 'Improve Credit Score',
                'description': f'Your credit score of {credit_score} could be improved. Focus on paying bills on time.',
                'priority': 'medium',
                'actionable': True
            })
        
        # Investment insights based on age and risk
        if age < 35 and risk_profile in ['medium', 'high'] and balance > income * 0.1:
            insights.append({
                'type': 'investment',
                'title': 'Consider Long-term Investing',
                'description': 'Your age and risk profile suggest you could benefit from growth investments.',
                'priority': 'medium',
                'actionable': True
            })
        
        # High income, low balance warning
        if income > 75000 and balance < income * 0.05:
            insights.append({
                'type': 'savings_rate',
                'title': 'Increase Savings Rate',
                'description': 'Consider increasing your savings rate to build wealth faster.',
                'priority': 'medium',
                'actionable': True
            })
        
        return {
            'insights': insights,
            'ml_prediction': prediction_result,
            'risk_assessment': self._assess_financial_risk(user_data),
            'savings_recommendations': self._get_savings_recommendations(user_data)
        }
    
    def _assess_financial_risk(self, user_data):
        """Assess financial risk level"""
        income = user_data.get('income', 50000)
        balance = user_data.get('account_balance', 10000)
        credit_score = user_data.get('credit_score', 700)
        
        risk_score = 0
        
        # Emergency fund risk
        emergency_months = (balance / (income / 12)) if income > 0 else 0
        if emergency_months < 1:
            risk_score += 3
        elif emergency_months < 3:
            risk_score += 2
        elif emergency_months < 6:
            risk_score += 1
        
        # Credit score risk
        if credit_score < 600:
            risk_score += 3
        elif credit_score < 700:
            risk_score += 2
        elif credit_score < 750:
            risk_score += 1
        
        # Income to balance ratio risk
        balance_ratio = balance / income if income > 0 else 0
        if balance_ratio < 0.05:
            risk_score += 2
        elif balance_ratio < 0.1:
            risk_score += 1
        
        if risk_score >= 6:
            return {'level': 'high', 'score': risk_score, 'description': 'High financial risk - immediate attention needed'}
        elif risk_score >= 3:
            return {'level': 'medium', 'score': risk_score, 'description': 'Moderate financial risk - improvements recommended'}
        else:
            return {'level': 'low', 'score': risk_score, 'description': 'Low financial risk - good financial health'}
    
    def _get_savings_recommendations(self, user_data):
        """Get personalized savings recommendations"""
        income = user_data.get('income', 50000)
        age = user_data.get('age', 30)
        risk_profile = user_data.get('risk_profile', 'medium')
        
        recommendations = []
        
        # Age-based recommendations
        if age < 30:
            recommendations.append({
                'type': 'aggressive_growth',
                'allocation': {'stocks': 80, 'bonds': 15, 'cash': 5},
                'description': 'Young age allows for aggressive growth strategy'
            })
        elif age < 50:
            recommendations.append({
                'type': 'balanced_growth',
                'allocation': {'stocks': 65, 'bonds': 25, 'cash': 10},
                'description': 'Balanced approach for middle-aged investors'
            })
        else:
            recommendations.append({
                'type': 'conservative',
                'allocation': {'stocks': 45, 'bonds': 40, 'cash': 15},
                'description': 'Conservative approach for retirement preparation'
            })
        
        # Risk-based adjustments
        if risk_profile == 'low':
            recommendations[0]['allocation']['bonds'] += 10
            recommendations[0]['allocation']['stocks'] -= 10
        elif risk_profile == 'high':
            recommendations[0]['allocation']['stocks'] += 10
            recommendations[0]['allocation']['bonds'] -= 10
        
        return recommendations
    
    def _get_feature_importance(self, feature_names):
        """Get feature importance for the prediction"""
        if not self.is_loaded or 'model' not in self.pipeline:
            return {}
        
        try:
            if hasattr(self.pipeline['model'].best_estimator_, 'feature_importances_'):
                importances = self.pipeline['model'].best_estimator_.feature_importances_
                selected_features = self.pipeline.get('selected_features', feature_names)
                
                importance_dict = {}
                for i, feature in enumerate(selected_features):
                    if i < len(importances):
                        importance_dict[feature] = float(importances[i])
                
                return importance_dict
        except Exception as e:
            print(f"Warning: Could not get feature importance: {e}")
        
        return {}

# Global instance for easy import
ml_service = FiSightMLService()

def predict_user_action(user_data):
    """Simple function for easy integration"""
    return ml_service.predict_financial_action(user_data)

def get_user_insights(user_data):
    """Simple function to get comprehensive insights"""
    return ml_service.get_financial_insights(user_data)

if __name__ == "__main__":
    import json
    
    # Check if we're being called with user data from Node.js
    if len(sys.argv) > 1:
        try:
            # Parse user data from command line argument
            user_data = json.loads(sys.argv[1])
            
            # Get ML insights
            insights_result = get_user_insights(user_data)
            
            # Format response for API
            api_response = {
                'predicted_action': insights_result['ml_prediction']['predicted_action'],
                'confidence': insights_result['ml_prediction']['confidence'],
                'all_probabilities': insights_result['ml_prediction']['all_probabilities'],
                'insights': insights_result['insights'],
                'risk_assessment': insights_result['risk_assessment'],
                'savings_recommendations': insights_result['savings_recommendations']
            }
            
            # Output JSON for Node.js to parse
            print(json.dumps(api_response))
            
        except Exception as e:
            error_response = {'error': str(e)}
            print(json.dumps(error_response))
        
        sys.exit(0)
    
    # Test the service (original test code)
    test_user = {
        'age': 28,
        'income': 65000,
        'account_balance': 15000,
        'credit_score': 720,
        'num_transactions': 45,
        'avg_transaction_value': 85.50,
        'spending_category': 'groceries',
        'risk_profile': 'medium'
    }
    
    print("Testing FiSight ML Service")
    print("=" * 40)
    
    # Test prediction
    result = predict_user_action(test_user)
    print(f"Prediction: {result['predicted_action']}")
    print(f"Confidence: {result['confidence']:.1%}")
    
    # Test insights
    insights = get_user_insights(test_user)
    print(f"\nGenerated {len(insights['insights'])} insights")
    for insight in insights['insights']:
        print(f"   • {insight['title']}")
    
    print(f"\nRisk Assessment: {insights['risk_assessment']['level']} ({insights['risk_assessment']['description']})")
    print("Service working correctly!")
