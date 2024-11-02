from app import mongo
from bson.objectid import ObjectId

def update_user_balances(expense):
    paid_by = expense['paid_by']  # ObjectId
    shares = expense['shares']    # Dict of user_id (str): amount (float)
    currency = expense['currency']
    amount = expense['amount']

    for user_id_str, share_amount in shares.items():
        user_id = ObjectId(user_id_str)
        if user_id != paid_by:
            # Update balance for the payer (increase the amount others owe to the payer)
            mongo.db.user_balances.update_one(
                {'user': paid_by},
                {
                    '$addToSet': {'friends': user_id},
                    '$inc': {f'balances.{user_id_str}.{currency}': share_amount}
                },
                upsert=True
            )
            # Update balance for the participant (increase the amount they owe)
            mongo.db.user_balances.update_one(
                {'user': user_id},
                {
                    '$addToSet': {'friends': paid_by},
                    '$inc': {f'balances.{str(paid_by)}.{currency}': -share_amount}
                },
                upsert=True
            )
