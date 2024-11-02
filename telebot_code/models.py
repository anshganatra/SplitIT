from datetime import datetime
from bson import ObjectId

class UserTransactions:
    def __init__(self, telegram_user_id, user_id=None, transactions=None, budget=None, created_at=None):
        self.user_id = ObjectId(user_id)
        self.telegram_user_id = telegram_user_id
        self.transactions = transactions or {'income_data': [], 'expense_data': []}
        self.budget = budget or {'overall': None, 'category': {}}
        self.created_at = created_at or datetime.utcnow()
    
    def to_dict(self):
        """Convert UserTransactions instance to a dictionary for MongoDB."""
        return {
            "user_id": ObjectId(self.user_id),
            "telegram_user_id": self.telegram_user_id,
            "transactions": self.transactions,
            "budget": self.budget,
            "created_at": self.created_at
        }

    @classmethod
    def from_dict(cls, data):
        """Create a UserTransactions instance from a dictionary."""
        return cls(
            user_id=data['user_id'],
            telegram_user_id = data['telegram_user_id'],
            transactions=data.get('transactions', {}),
            budget=data.get('budget', {'overall': None, 'category': {}}),
            created_at=data.get('created_at', datetime.utcnow())
        )

class ExpenseRecord:
    def __init__(self, title, date, category, amount, currency, amountUSD=None):
        self.title = title
        self.date = date
        self.category = category
        self.amount = amount
        self.currency = currency
        self.amountUSD = amountUSD or amount  # Default to original amount if no conversion

    def to_dict(self):
        """Convert ExpenseRecord to a dictionary for MongoDB."""
        return {
            "title": self.title,
            "date": self.date,
            "category": self.category,
            "amount": self.amount,
            "currency": self.currency,
            "amountUSD": self.amountUSD
        }

    @classmethod
    def from_dict(cls, data):
        """Create an ExpenseRecord instance from a dictionary."""
        return cls(
            title=data.get("title"),
            date=data.get("date"),
            category=data.get("category"),
            amount=data.get("amount"),
            currency=data.get("currency"),
            amountUSD=data.get("amountUSD")
        )
    
class User:
    def __init__(self, _id, telegram_user_id, name, email, password_hash, link_code, created_at):
        self._id = ObjectId(_id)
        self.name = name
        self.email = email
        self.telegram_user_id = telegram_user_id
        self.link_code = link_code
        self.password_hash = password_hash
        self.created_at = created_at

    def to_dict(self):
        """Convert User to a dictionary for MongoDB."""
        return {
            "_id": ObjectId(self._id),
            "name": self.name,
            "email": self.email,
            "telegram_user_id": self.telegram_user_id,
            "password_hash": self.password_hash,
            "link_code": self.link_code,
            "created_at": self.created_at
        }

    @classmethod
    def from_dict(cls, data):
        """Create an User instance from a dictionary."""
        return cls(
            _id = data.get("_id"),
            name = data.get("name"),
            email = data.get("email"),
            telegram_user_id = data.get("telegram_user_id"),
            password_hash = data.get("password_hash"),
            link_code = data.get("link_code"),
            created_at = data.get("created_at")
        )