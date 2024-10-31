import helper


def run(message, bot):
    global user_list
    chat_id = message.chat.id
    user_id = message.from_user.id
    delete_history_text = ""
    user_list = helper.read_json()
    if (str(user_id) in user_list):
        helper.write_json(deleteHistory(user_id))
        delete_history_text = "History has been deleted!"
    else:
        delete_history_text = "No records there to be deleted. Start adding your expenses to keep track of your spendings!"
    bot.send_message(chat_id, delete_history_text)


# function to delete a record
def deleteHistory(user_id):
    global user_list
    if (str(user_id) in user_list):
        del user_list[str(user_id)]
    return user_list
