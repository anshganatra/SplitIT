from itertools import combinations
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import mongo
from bson.objectid import ObjectId
from datetime import datetime

groups_bp = Blueprint('groups', __name__)

@groups_bp.route('/', methods=['POST'])
@jwt_required()
def create_group():
    data = request.get_json()
    user_id = ObjectId(get_jwt_identity())

    title = data.get('title')
    members = [ObjectId(uid) for uid in data.get('members')]
    members.append(user_id)
    expenses = [] 

    group = {
        'title': title,
        'members': members,
        'expenses': expenses,
        'created_at': datetime.utcnow()
    }

    result = mongo.db.groups.insert_one(group)
    group_id = str(result.inserted_id)

    # Ensure that all group members are friends with each other
    for member_i, member_j in combinations(members, 2):
        # Add member_j to member_i's friends list
        user_balance_i = mongo.db.user_balances.find_one({'user': member_i})
        if member_j not in user_balance_i.get('friends', []):
            mongo.db.user_balances.update_one(
                {'user': member_i},
                {'$addToSet': {'friends': member_j}}
            )

        # Add member_i to member_j's friends list
        user_balance_j = mongo.db.user_balances.find_one({'user': member_j})
        if member_i not in user_balance_j.get('friends', []):
            mongo.db.user_balances.update_one(
                {'user': member_j},
                {'$addToSet': {'friends': member_i}})

    group['_id'] = group_id
    group['members'] = [str(member) for member in members]
    group['expenses'] = []  

    return jsonify(group), 201


@groups_bp.route('/', methods=['GET'])
@jwt_required()
def get_groups():
    user_id = ObjectId(get_jwt_identity())
    groups = mongo.db.groups.find({'members': user_id})
    group_list = []
    for group in groups:
        group['_id'] = str(group['_id'])
        group['members'] = [str(member) for member in group['members']]
        group['expenses'] = [str(expense) for expense in group['expenses']]
        group_list.append(group)
    return jsonify(group_list), 200


@groups_bp.route('/<group_id>/add_member', methods=['POST'])
@jwt_required()
def add_member_to_group(group_id):
    data = request.get_json()
    user_id = ObjectId(get_jwt_identity())

    # Get the user ID of the friend to add
    friend_id_str = data.get('user_id')
    if not friend_id_str:
        return jsonify({'message': 'User ID is required to add to the group'}), 400

    try:
        friend_id = ObjectId(friend_id_str)
    except:
        return jsonify({'message': 'Invalid user ID format'}), 400

    # Check if the friend exists
    if not mongo.db.users.find_one({'_id': friend_id}):
        return jsonify({'message': 'User not found'}), 404

    # Find the group
    group = mongo.db.groups.find_one({'_id': ObjectId(group_id)})

    if not group:
        return jsonify({'message': 'Group not found'}), 404

    # Check if the requesting user is a member of the group
    if user_id not in group['members']:
        return jsonify({'message': 'You are not a member of this group'}), 403

    # Check if the friend is already a member of the group
    if friend_id in group['members']:
        return jsonify({'message': 'User is already a member of the group'}), 400

    # Add the friend to the group's members list
    mongo.db.groups.update_one(
        {'_id': ObjectId(group_id)},
        {'$addToSet': {'members': friend_id}}
    )

    return jsonify({'message': 'User added to group successfully'}), 200
