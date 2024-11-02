import os
import json
#from mock.mock import patch
from unittest.mock import patch
from bson import ObjectId
from telebot import types
from telebot_code import add
from mock import ANY
from unittest.mock import Mock, ANY
from datetime import datetime, timedelta
from telegram_bot_calendar import DetailedTelegramCalendar
from telebot_code import db_operations
from telebot_code.models import *

dateFormat = '%d-%b-%Y' 
timeFormat = '%H:%M'
monthFormat = '%b-%Y'
id = 1234


@patch('telebot.telebot')
def test_run(mock_telebot, mocker):
    mc = mock_telebot.return_value
    mc.reply_to.return_value = True
    message = create_message("hello from test run!")
    message.from_user = types.User(11, False, 'test')
    add.run(message, mc)
    assert(mc.reply_to.called)


@patch('telebot.telebot')
def test_post_category_selection_working(mock_telebot, mocker):
    mc = mock_telebot.return_value
    mc.send_message.return_value = True

    message = create_message("hello from testing!")
    message.from_user = types.User(11, False, 'test')
    add.post_category_selection(message, mc, "Income")
    assert(mc.send_message.called)


@patch('telebot.telebot')
def test_post_category_selection_noMatchingCategory(mock_telebot, mocker):
    mc = mock_telebot.return_value
    mc.send_message.return_value = []
    mc.reply_to.return_value = True

    mocker.patch.object(add, 'helper')
    add.helper.getSpendCategories.return_value = None

    message = create_message("hello from testing!")
    message.from_user = types.User(11, False, 'test')
    add.post_category_selection(message, mc, "Income")
    assert(mc.reply_to.called)


@patch('telebot.telebot')
def test_post_amount_input_working(mock_telebot, mocker):
    mc = mock_telebot.return_value
    mc.send_message.return_value = True

    message = create_message("hello from testing!")
    message.from_user = types.User(11, False, 'test')
    add.post_category_selection(message, mc, "Income")
    assert(mc.send_message.called)


@patch('telebot.telebot')
def test_post_amount_input_working_withdata(mock_telebot, mocker):
    mc = mock_telebot.return_value
    mc.send_message.return_value = True
    mocker.patch.object(add, 'helper')
    add.helper.validate_entered_amount.return_value = 10
    add.helper.write_json.return_value = True
    add.helper.getDateFormat.return_value = dateFormat
    add.helper.getTimeFormat.return_value = timeFormat

    mocker.patch.object(add, 'option')
    add.option.return_value = {11, "here"}

    message = create_message("hello from testing!")
    message.from_user = types.User(11, False, 'test')
    add.post_amount_input(message, mc, 'Income')
    assert(mc.send_message.called)
    

@patch('telebot.telebot')
def test_post_amount_input_nonworking(mock_telebot, mocker):
    mc = mock_telebot.return_value
    mc.send_message.return_value = True
    mc.reply_to.return_value = True
    mocker.patch.object(add, 'helper')
    add.helper.validate_entered_amount.return_value = 0
    message = create_message("hello from testing!")
    message.from_user = types.User(11, False, 'test')
    add.post_amount_input(message, mc, 'Income')
    assert(mc.reply_to.called)


# @patch('telebot.telebot')
# def test_post_amount_input_working_withdata_chatid(mock_telebot, mocker):
#     mc = mock_telebot.return_value
#     mc.send_message.return_value = True
#     mocker.patch.object(add, 'helper')
#     add.helper.validate_entered_amount.return_value = 10
#     add.helper.write_json.return_value = True
#     test_option = {11: "here"}
#     mocker.patch.object(add, 'option', new=test_option)
#     mocker.patch.object(DetailedTelegramCalendar, 'build')
#     calendar_markup = "mock_calendar_markup"
#     step = "day" 
#     DetailedTelegramCalendar.build.return_value = (calendar_markup, step)
#     mocker.patch.object(DetailedTelegramCalendar, 'process')
#     selected_date = "2023-10-15"
#     DetailedTelegramCalendar.process.return_value = (True, selected_date, step)
#     message = create_message("Select a date from the calendar")
#     add.post_amount_input(message, mc, 'Income')
#     assert mc.send_message.called

@patch('db_operations.create_user_transaction')
@patch('db_operations.read_user_transaction')
def test_add_user_record_nonworking(mocker2, mocker1):
    mocker1.return_value = ObjectId('54f112defba522406c9cc208')
    mocker2.return_value = UserTransactions(telegram_user_id=1234)
    add.helper.read_json.return_value = {}
    addeduserrecord = add.add_user_income_record(1, 1234, "record : test")
    assert(addeduserrecord)

@patch('db_operations.create_user_transaction')
@patch('db_operations.read_user_transaction')
def test_add_user_record_working(mocker2, mocker1):
    MOCK_USER_DATA = UserTransactions(12345)
    mocker1.return_value = ObjectId('54f112defba522406c9cc208')
    mocker2.return_value = UserTransactions(telegram_user_id=1234)
    add.helper.read_json.return_value = MOCK_USER_DATA
    addeduserrecord = add.add_user_income_record(1, 12345,"record : test")
    if(addeduserrecord != None):
        assert True


def create_message(text):
    params = {'messagebody': text}
    chat = types.User(11, False, 'test')
    return types.Message(1, None, None, chat, 'text', params, "")


def test_read_json():
    try:
        if not os.path.exists('./test/dummy_expense_record.json'):
            with open('./test/dummy_expense_record.json', 'w') as json_file:
                json_file.write('{}')
            return json.dumps('{}')
        elif os.stat('./test/dummy_expense_record.json').st_size != 0:
            with open('./test/dummy_expense_record.json') as expense_record:
                expense_record_data = json.load(expense_record)
            return expense_record_data

    except FileNotFoundError:
        print("---------NO RECORDS FOUND---------")


# @patch('telebot.telebot')
# def test_post_amount_input_future_date(mock_telebot, mocker):
#     mc = mock_telebot.return_value
#     mc.send_message.return_value = True
#     mocker.patch.object(add, 'helper')

#     # Set up mock responses for helper functions
#     add.helper.validate_entered_amount.return_value = 10
#     add.helper.write_json.return_value = True
#     add.helper.getDateFormat.return_value = dateFormat
#     add.helper.getTimeFormat.return_value = timeFormat
#     mocker.patch.object(add, 'option')
#     add.option.return_value = {11, "here"}

#     # Set up future date
#     future_date = datetime.now() + timedelta(days=7)  # 7 days into the future
#     future_date_str = future_date.strftime(dateFormat)

#     # Create a message with future date
#     message_text = f"hello from testing! {future_date_str}"
#     message = create_message(message_text)
#     message.from_user = types.User(11, False, 'test')

#     # Call the function to be tested
#     add.post_amount_input(message, mc, 'Income')

#     # Assert that the appropriate response is sent
#     mc.reply_to.assert_called_with(message, "Error: Future dates are not allowed.")

