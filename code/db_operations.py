from jproperties import Properties
from pymongo import MongoClient
from models import *
configs = Properties()

with open('user.properties', 'rb') as read_prop:
    configs.load(read_prop)

mongodb_uri = str(configs.get('mongodb_uri').data)

client = MongoClient(mongodb_uri)
db = client['splitIt']  

collection = db['user_transactions']

def create_user_transaction(user_transaction):
    """Create a new user transaction document."""
    result = collection.insert_one(user_transaction.to_dict())
    print(f"Created document with ID: {result.inserted_id}")
    return result.inserted_id

def read_user_transaction(user_id):
    """Read a user transaction document by user ID and return as a UserTransactions instance."""
    result = collection.find_one({"user_id": user_id})
    if result:
        user_transaction = UserTransactions.from_dict(result)
        print(f"Retrieved document: {user_transaction}")
        return user_transaction
    else:
        print("No document found with that user ID.")
        return None

def update_user_transaction(user_id, update_data):
    """Update a user transaction document by user ID."""
    result = collection.update_one({"user_id": user_id}, {"$set": update_data})
    if result.matched_count > 0:
        updated_doc = collection.find_one({"user_id": user_id})
        user_transaction = UserTransactions.from_dict(updated_doc)
        print(f"Updated document: {user_transaction}")
        return user_transaction
    else:
        print("No document found to update.")
        return None

def delete_user_transaction(user_id):
    """Delete a user transaction document by user ID."""
    result = collection.delete_one({"user_id": user_id})
    print(f"Deleted {result.deleted_count} document(s).")
    return result.deleted_count