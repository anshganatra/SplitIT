from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import mongo
from bson.objectid import ObjectId
from datetime import datetime

transactions_bp = Blueprint('transactions', __name__)

@transactions_bp.route('/add', methods=['POST'])
@jwt_required()
def add_transaction():
    user_id = get_jwt_identity()
    data = request.get_json()
    transaction_type = data.get('type')  # 'income' or 'expense'

    if transaction_type not in ['income', 'expense']:
        return jsonify({'message': 'Invalid transaction type'}), 400

    transaction_data = {
        'title': data.get('title'),
        'date': data.get('date'),
        'category': data.get('category'),
        'amount': data.get('amount'),
        'currency': data.get('currency'),
        'amount_usd': data.get('amount_usd') if data.get('amount_usd') != None else None
    }

    # Update user's transactions
    user_transactions = mongo.db.user_transactions.find_one({'user_id': ObjectId(user_id)})

    transactions = user_transactions['transactions']

    # Append the new transaction
    transactions_key = 'income_data' if transaction_type == 'income' else 'expense_data'
    transactions[transactions_key].append(transaction_data)

    # Update the document
    mongo.db.user_transactions.update_one(
        {'user_id': ObjectId(user_id)},
        {'$set': {'transactions': transactions}},
        upsert=True
    )

    return jsonify({'message': 'Transaction added successfully'}), 201

@transactions_bp.route('/', methods=['GET'])
@jwt_required()
def get_transactions():
    user_id = get_jwt_identity()
    user_transactions = mongo.db.user_transactions.find_one({'user_id': ObjectId(user_id)})

    if user_transactions:
        user_transactions['_id'] = str(user_transactions['_id'])
        user_transactions['user_id'] = str(user_transactions['user_id'])

    return jsonify(user_transactions), 200

@transactions_bp.route('/budget', methods=['POST'])
@jwt_required()
def set_budget():
    user_id = get_jwt_identity()
    data = request.get_json()
    overall_budget = data.get('overall')
    category_budget = data.get('category')  # Should be a dictionary

    if overall_budget is None and not category_budget:
        return jsonify({'message': 'No budget data provided'}), 400

    user_transactions = mongo.db.user_transactions.find_one({'user_id': ObjectId(user_id)})

    if not user_transactions:
        # Create a new document if it doesn't exist
        transactions = {'income_data': [], 'expense_data': []}
        budget = {'overall': overall_budget, 'category': category_budget or {}}
        user_transactions = {
            'user_id': ObjectId(user_id),
            'transactions': transactions,
            'budget': budget,
            'created_at': datetime.utcnow()
        }
    else:
        budget = user_transactions.get('budget', {'overall': None, 'category': {}})
        if overall_budget is not None:
            budget['overall'] = overall_budget
        if category_budget:
            budget['category'].update(category_budget)

    # Update the document
    mongo.db.user_transactions.update_one(
        {'user_id': ObjectId(user_id)},
        {'$set': {'budget': budget}},
        upsert=True
    )

    return jsonify({'message': 'Budget updated successfully'}), 200

@transactions_bp.route('/budget', methods=['GET'])
@jwt_required()
def get_budget():
    user_id = get_jwt_identity()
    user_transactions = mongo.db.user_transactions.find_one({'user_id': ObjectId(user_id)})

    if not user_transactions or 'budget' not in user_transactions:
        return jsonify({'message': 'No budget found'}), 404

    budget = user_transactions['budget']
    return jsonify({'budget': budget}), 200
