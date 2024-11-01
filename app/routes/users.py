from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import mongo  # Import mongo from app
from bson.objectid import ObjectId
from datetime import datetime
import re  # For email validation

users_bp = Blueprint('users', __name__)

@users_bp.route('/me', methods=['GET'])
@jwt_required()
def get_user():
    user_id = get_jwt_identity()
    user = mongo.db.users.find_one({'_id': ObjectId(user_id)}, {'password_hash': 0})
    if user:
        user['_id'] = str(user['_id'])
        return jsonify(user), 200
    else:
        return jsonify({'message': 'User not found'}), 404

@users_bp.route('/add_friend', methods=['POST'])
@jwt_required()
def add_friend():
    user_id = ObjectId(get_jwt_identity())
    data = request.get_json()
    friend_email = data.get('email')

    if not friend_email:
        return jsonify({'message': 'Email is required'}), 400

    # Validate email format
    email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    if not re.match(email_regex, friend_email):
        return jsonify({'message': 'Invalid email format'}), 400

    # Search for the friend in the users collection
    friend_user = mongo.db.users.find_one({'email': friend_email})

    if not friend_user:
        return jsonify({'message': 'User with that email does not exist'}), 404

    friend_user_id = friend_user['_id']

    # Ensure that the friend_user_id is an ObjectId
    if not isinstance(friend_user_id, ObjectId):
        friend_user_id = ObjectId(friend_user_id)

    # Check if the user is trying to add themselves
    if friend_user_id == user_id:
        return jsonify({'message': 'You cannot add yourself as a friend'}), 400

    # Initialize balances between users
    initial_balance = {"USD": 0.0}

    # Fetch the authenticated user's UserBalance document
    user_balance = mongo.db.user_balances.find_one({'user': user_id})

    # Fetch the friend's UserBalance document
    friend_balance = mongo.db.user_balances.find_one({'user': friend_user_id})

    # Update or create the authenticated user's UserBalance
    if not user_balance:
        # Create a new UserBalance document for the user
        user_balance = {
            'user': user_id,
            'friends': [friend_user_id],
            'balances': {str(friend_user_id): initial_balance},
            'created_at': datetime.utcnow()
        }
        mongo.db.user_balances.insert_one(user_balance)
    else:
        # Update the existing UserBalance document
        if friend_user_id not in user_balance.get('friends', []):
            mongo.db.user_balances.update_one(
                {'user': user_id},
                {
                    '$addToSet': {'friends': friend_user_id},
                    '$set': {f'balances.{str(friend_user_id)}': initial_balance}
                }
            )
        else:
            return jsonify({'message': 'Friend already added'}), 400

    # Update or create the friend's UserBalance
    if not friend_balance:
        # Create a new UserBalance document for the friend
        friend_balance = {
            'user': friend_user_id,
            'friends': [user_id],
            'balances': {str(user_id): initial_balance},
            'created_at': datetime.utcnow()
        }
        mongo.db.user_balances.insert_one(friend_balance)
    else:
        # Update the existing UserBalance document
        if user_id not in friend_balance.get('friends', []):
            mongo.db.user_balances.update_one(
                {'user': friend_user_id},
                {
                    '$addToSet': {'friends': user_id},
                    '$set': {f'balances.{str(user_id)}': initial_balance}
                }
            )
        else:
            # If the user is already a friend, we can proceed without error
            pass

    return jsonify({'message': 'Friend added successfully'}), 200