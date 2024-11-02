import helper
from db_operations import * 

def run(message, bot):
    chat_id = message.chat.id
    user_id = message.from_user.id
    print(user_id)
    userTransaction = read_user_transaction(user_id)
    print(userTransaction)

    if user_id != None:
        userTransaction.budget["overall"] = None
        userTransaction.budget["category"] = {}
        update_user_transaction(user_id, userTransaction.to_dict())

    bot.send_message(chat_id, 'Budget deleted!')
