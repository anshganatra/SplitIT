from datetime import datetime

class UserTransactions:
    def __init__(self, user_id, transactions=None, budget=None, created_at=None):
        self.user_id = user_id
        self.transactions = transactions or {'income_data': [], 'expense_data': []}
        self.budget = budget or {'overall': None, 'category': {}}
        self.created_at = created_at or datetime.utcnow()
    
    def to_dict(self):
        """Convert UserTransactions instance to a dictionary for MongoDB."""
        return {
            "user_id": self.user_id,
            "transactions": self.transactions,
            "budget": self.budget,
            "created_at": self.created_at
        }

    @classmethod
    def from_dict(cls, data):
        """Create a UserTransactions instance from a dictionary."""
        return cls(
            user_id=data['user_id'],
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