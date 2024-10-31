# app/models.py

from datetime import datetime
from bson.objectid import ObjectId

class User:
    def __init__(self, name, email, password_hash, created_at=None, id=None):
        self.id = id or ObjectId()
        self.name = name
        self.email = email
        self.password_hash = password_hash
        self.created_at = created_at or datetime.utcnow()

class Expense:
    def __init__(self, title, currency, category, amount, selected_date, paid_by, shares, created_at=None, id=None):
        self.id = id or ObjectId()
        self.title = title
        self.currency = currency
        self.category = category
        self.amount = amount
        self.selected_date = selected_date  # Expected to be a datetime object
        self.paid_by = paid_by  # User ID (ObjectId)
        self.shares = shares  # Dict mapping user_id to their share of the expense
        self.created_at = created_at or datetime.utcnow()

class Group:
    def __init__(self, title, members, expenses, created_at=None, id=None):
        self.id = id or ObjectId()
        self.title = title
        self.members = members  # List of user IDs (ObjectId)
        self.expenses = expenses  # List of expense IDs (ObjectId)
        self.created_at = created_at or datetime.utcnow()

class UserBalance:
    def __init__(self, user, friends, balances, created_at=None, id=None):
        self.id = id or ObjectId()
        self.user = ObjectId(user)  # User ID
        self.friends = [ObjectId(friend) for friend in friends]  # List of user IDs
        self.balances = balances  # Nested dict as described
        self.created_at = created_at or datetime.utcnow()

class Transaction:
    def __init__(self, title, date, category, amount, currency, amount_usd):
        self.title = title
        self.date = datetime.strptime(date, '%d-%b-%y')  # Adjust date format if needed
        self.category = category
        self.amount = amount
        self.currency = currency
        self.amount_usd = amount_usd  # Converted amount in USD

class UserTransactions:
    def __init__(self, user_id, transactions=None, budget=None, created_at=None, id=None):
        self.id = id or ObjectId()
        self.user_id = ObjectId(user_id)  # User ID
        self.transactions = transactions or {'income_data': [], 'expense_data': []}
        self.budget = budget or {'overall': None, 'category': {}}
        self.created_at = created_at or datetime.utcnow()