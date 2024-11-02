from code import budget_delete
#from mock.mock import patch
from unittest.mock import patch
from telebot import types

from bson import ObjectId
from code import db_operations
from code.db_operations import * 
from code.models import *

@patch('telebot.telebot')
@patch('db_operations.read_user_transaction')
@patch('db_operations.update_user_transaction')
def test_run_normal_case(mock2, mock1, mock_telebot):
    mc = mock_telebot.return_value
    mc.send_message.return_value = True

    budget_delete.helper.read_json.return_value = {'11': {'budget': {'budget': 10, 'category': 100}}}
    budget_delete.helper.write_json.return_value = True

    mock2.return_value = UserTransactions(telegram_user_id=11)
    mock1.return_value = UserTransactions(telegram_user_id=11)
    
    print(read_user_transaction(1234))

    message = create_message("hello from testing")
    message.from_user = types.User(11, False, 'test')
    budget_delete.run(message, mc)

    # assert(mc.reply_to.called)
    mc.send_message.assert_called_with(11, 'Budget deleted!')


def create_message(text):
    params = {'messagebody': text}
    chat = types.User(11, False, 'test')
    message = types.Message(1, None, None, chat, 'text', params, "")
    message.text = text
    return message
