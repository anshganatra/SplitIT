from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import mongo
from bson.objectid import ObjectId
from datetime import datetime

from app.utils.helpers import update_user_balances

expenses_bp = Blueprint('expenses', __name__)

@expenses_bp.route('/', methods=['POST'])
@jwt_required()
def create_expense():
    data = request.get_json()
    user_id = get_jwt_identity()

    title = data.get('title')
    currency = data.get('currency')
    category = data.get('category')
    amount = data.get('amount')
    selected_date = datetime.strptime(data.get('selected_date'), '%Y-%m-%d')
    paid_by = ObjectId(user_id)
    shares = {str(k): v for k, v in data.get('shares', {}).items()}  # Convert keys to strings
    group_id = data.get('group_id')

    expense = {
        'title': title,
        'currency': currency,
        'category': category,
        'amount': amount,
        'selected_date': selected_date,
        'paid_by': paid_by,
        'shares': shares,
        'created_at': datetime.utcnow()
    }

    if group_id:
        expense['group_id'] = ObjectId(group_id)

    # If group_id is provided, verify the group and members
    if group_id:
        group = mongo.db.groups.find_one({'_id': ObjectId(group_id)})
        if not group:
            return jsonify({'message': 'Group not found'}), 404

        group_members = group.get('members', [])
        group_member_ids = set(group_members)

        # Ensure that all users in shares are members of the group
        for user_id_str in shares.keys():
            if ObjectId(user_id_str) not in group_member_ids:
                return jsonify({'message': f'User {user_id_str} is not a member of the group'}), 400

    result = mongo.db.expenses.insert_one(expense)
    expense_id = str(result.inserted_id)

    # If group_id is provided, add the expense to the group's expenses list
    if group_id:
        mongo.db.groups.update_one(
            {'_id': ObjectId(group_id)},
            {'$addToSet': {'expenses': result.inserted_id}}
        )

    # Update balances between users
    update_user_balances(expense)
    
    return jsonify({'expense_id': expense_id}), 201

@expenses_bp.route('/', methods=['GET'])
@jwt_required()
def get_expenses():
    user_id = ObjectId(get_jwt_identity())
    expenses = mongo.db.expenses.find({'shares.' + str(user_id): {'$exists': True}})
    expense_list = []
    for expense in expenses:
        expense['_id'] = str(expense['_id'])
        expense['paid_by'] = str(expense['paid_by'])
        expense['shares'] = {str(k): v for k, v in expense['shares'].items()}
        expense_list.append(expense)
    return jsonify(expense_list), 200