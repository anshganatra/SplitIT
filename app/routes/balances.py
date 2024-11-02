from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import mongo
from bson.objectid import ObjectId

balances_bp = Blueprint('balances', __name__)

@balances_bp.route('/', methods=['GET'])
@jwt_required()
def get_balances():
    user_id = ObjectId(get_jwt_identity())
    user_balance = mongo.db.user_balances.find_one({'user': user_id})
    if user_balance:
        user_balance['_id'] = str(user_balance['_id'])
        user_balance['user'] = str(user_balance['user'])
        user_balance['friends'] = [str(friend) for friend in user_balance['friends']]
        
        # Convert balances keys from ObjectId to str
        balances = {}
        for friend_id, currencies in user_balance['balances'].items():
            balances[str(friend_id)] = currencies
        user_balance['balances'] = balances

        return jsonify(user_balance), 200
    else:
        return jsonify({'message': 'No balance information found'}), 404

@balances_bp.route('/friends', methods=['GET'])
@jwt_required()
def get_friends():
    user_id = ObjectId(get_jwt_identity())

    # Retrieve the user's friends list from the user_balances collection
    user_balance = mongo.db.user_balances.find_one({'user': user_id}, {'friends': 1})
    if not user_balance or 'friends' not in user_balance:
        return jsonify({'message': 'No friends found'}), 404

    friend_ids = user_balance['friends']
    
    # Fetch the name and email for each friend from the users collection
    friends_data = mongo.db.users.find(
        {'_id': {'$in': friend_ids}},
        {'name': 1, 'email': 1}
    )

    # Map each friend ID to their name and email
    friends = {str(friend['_id']): {'name': friend['name'], 'email': friend['email']} for friend in friends_data}
    
    return jsonify({'friends': friends}), 200

@balances_bp.route('/pending_balances', methods=['GET'])
@jwt_required()
def get_balances_only():
    user_id = ObjectId(get_jwt_identity())

    # Retrieve the user's balances with friends
    user_balance = mongo.db.user_balances.find_one({'user': user_id}, {'balances': 1})
    if not user_balance or 'balances' not in user_balance:
        return jsonify({'message': 'No balances found'}), 404

    # Convert ObjectId keys to strings for JSON serialization
    balances = {}
    for friend_id, friend_balances in user_balance['balances'].items():
        balances[str(friend_id)] = friend_balances

    return jsonify({'balances': balances}), 200
