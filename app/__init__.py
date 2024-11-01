from flask import Flask
from app.config import Config
from app.models import User, Expense
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager

mongo = PyMongo()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    mongo.init_app(app, uri=app.config['MONGO_URI'])
    jwt.init_app(app)

    with app.app_context():
        mongo.db = mongo.cx['splitIt']

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.users import users_bp
    from app.routes.expenses import expenses_bp

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(users_bp, url_prefix='/users')
    app.register_blueprint(expenses_bp, url_prefix='/expenses')

    return app
