from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    MONGO_URI = os.environ.get('MONGO_URI')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    MONGO_DBNAME = os.environ.get('MONGO_DBNAME')
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=1)

