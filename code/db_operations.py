from jproperties import Properties
from pymongo import MongoClient
from models import *
configs = Properties()

with open('user.properties', 'rb') as read_prop:
    configs.load(read_prop)

mongodb_uri = str(configs.get('mongodb_uri').data)

client = MongoClient(mongodb_uri)
db = client['splitIt']  

collectionUserTransactions = db['user_transactions']
collectionUsers = db['users']

def create_user_transaction(user_transaction):
    """Create a new user transaction document."""
    result = collectionUserTransactions.insert_one(user_transaction.to_dict())
    print(f"Created document with ID: {result.inserted_id}")
    return result.inserted_id

def read_user_transaction(telegram_user_id):
    """Read a user transaction document by user ID and return as a UserTransactions instance."""
    result = collectionUserTransactions.find_one({"telegram_user_id": telegram_user_id})
    if result:
        user_transaction = UserTransactions.from_dict(result)
        print(f"Retrieved document: {user_transaction}")
        return user_transaction
    else:
        print("No document found with that user ID.")
        return None

def update_user_transaction(telegram_user_id, update_data):
    """Update a user transaction document by user ID."""
    result = collectionUserTransactions.update_one({"telegram_user_id": telegram_user_id}, {"$set": update_data})
    if result.matched_count > 0:
        updated_doc = collectionUserTransactions.find_one({"telegram_user_id": telegram_user_id})
        user_transaction = UserTransactions.from_dict(updated_doc)
        print(f"Updated document: {user_transaction}")
        return user_transaction
    else:
        print("No document found to update.")
        return None

def delete_user_transaction(telegram_user_id):
    """Delete a user transaction document by user ID."""
    result = collectionUserTransactions.delete_one({"telegram_user_id": telegram_user_id})
    print(f"Deleted {result.deleted_count} document(s).")
    return result.deleted_count

def link_user(telegram_id, email_id, link_code):
    """Link a telegram user's account with his email linked SplitIt account """

    user = read_user_with_email(email_id=email_id)

    if user == None:
        print("No document found to update.")
        return None
    else:
        if link_code != user.link_code:
            return None
        
        user.telegram_user_id = telegram_id
        result = collectionUsers.update_one({"email": email_id}, {"$set": user.to_dict()})
        if result.matched_count > 0:
            updated_doc = collectionUsers.find_one({"email": email_id})
            updated_user = User.from_dict(updated_doc)
            print(f"Updated document: {updated_user}")
            return updated_user
        else:
            print("No document found to update.")
            return None

def read_user_with_email(email_id):
    """Read a user by email id and return user instance."""
    result = collectionUsers.find_one({"email": email_id})
    if result:
        user = User.from_dict(result)
        print(f"Retrieved document: {user}")
        return user
    else:
        print("No user found with that email id.")
        return None