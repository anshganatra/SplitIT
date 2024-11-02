import helper
from db_operations import *

def run(message, bot):
    global user_list
    chat_id = message.chat.id
    user_id = message.from_user.id
    delete_history_text = ""
    userTransaction = read_user_transaction(user_id)
    if userTransaction != None:
        delete_user_transaction(user_id=user_id)
    else:
        delete_history_text = "No records there to be deleted. Start adding your expenses to keep track of your spendings!"
    bot.send_message(chat_id, delete_history_text)


# function to delete a record
def deleteHistory(user_id):
    global user_list
    if (str(user_id) in user_list):
        del user_list[str(user_id)]
    return user_list
