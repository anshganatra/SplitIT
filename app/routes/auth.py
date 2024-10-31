from datetime import datetime
from flask import Blueprint, request, jsonify
from app import mongo
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if mongo.db.users.find_one({'email': email}):
        return jsonify({'message': 'User already exists'}), 409

    password_hash = generate_password_hash(password)
    user = {
        'name': name,
        'email': email,
        'password_hash': password_hash,
        'created_at': datetime.utcnow()
    }
    result = mongo.db.users.insert_one(user)
    user_id = str(result.inserted_id)

    access_token = create_access_token(identity=user_id)
    return jsonify({'access_token': access_token}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = mongo.db.users.find_one({'email': email})
    if user and check_password_hash(user['password_hash'], password):
        user_id = str(user['_id'])
        access_token = create_access_token(identity=user_id)
        return jsonify({'access_token': access_token}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401