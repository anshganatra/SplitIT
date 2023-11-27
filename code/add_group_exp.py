import helper
import logging
import telebot
import calendar
from telebot import types
from dateutil.relativedelta import relativedelta
from datetime import datetime
from telegram_bot_calendar import DetailedTelegramCalendar, LSTEP
import json
from datetime import datetime, date
from currency_api import update_currencies
from add import actual_curr_val

import os
import sys


def restart_script():
    script_path = os.path.abspath("./run.sh")
    os.chmod(script_path, 0o755)
    os.execl("/bin/bash", "/bin/bash", script_path)


option = {}
selectedTyp = {}
selectedCat = {}
selectedAm = {}
selectedCurr = {}


def run(message, bot):
    chat_id = message.chat.id
    markup = types.ReplyKeyboardMarkup(one_time_keyboard=True)
    msg = bot.reply_to(message, 'How many members were involved other than you?', reply_markup=markup)
    bot.register_next_step_handler(msg, post_member_selection, bot)


data_format = {
    "6619121674": {
        "expense": [
        ],
        "details": {
        }
    }
}

def createNewUserRecord():
    return data_format

def read_json():
    try:
        if not os.path.exists('grp_expense_record.json'):
            with open('grp_expense_record.json', 'w') as json_file:
                json_file.write('{}')
            return json.dumps('{}')
        elif os.stat('grp_expense_record.json').st_size != 0:
            with open('grp_expense_record.json') as expense_record:
                expense_record_data = json.load(expense_record)
            return expense_record_data

    except FileNotFoundError:
        print("---------NO RECORDS FOUND---------")
        restart_script()
        
def write_json(user_list):
    try:
        existing_data = read_json()

        # Update existing_data with new user_list
        existing_data.update(user_list)

        with open('grp_expense_record.json', 'w') as json_file:
            json.dump(existing_data, json_file, ensure_ascii=False, indent=4)
    except FileNotFoundError:
        print('Sorry, the data file could not be found.')
        restart_script()

def add_user_expense_record(bot, chat_id, record_to_be_added, member_list, convert_value_str):
    user_list = read_json()
    if str(chat_id) not in user_list:
        user_list[str(chat_id)] = createNewUserRecord()

    for member in member_list:
        if not user_list[str(chat_id)]['details'].get(member):
            user_list[str(chat_id)]['details'][member] = float(convert_value_str)
        else:
            user_list[str(chat_id)]['details'][member] += float(convert_value_str)

    user_list[str(chat_id)]['expense'].append(record_to_be_added)
    return user_list

def actual_curr_val(currency, amount, formatted_date):
    amount = float(amount)
    json_file_path = './currencies.json'
    json_data = ""

    with open(json_file_path, 'r') as file:
        json_data = json.load(file)

    last_updated_at = json_data['meta']['last_updated_at']
    last_updated_date = date(int(last_updated_at[:4]), int(last_updated_at[5:7]), int(last_updated_at[8:10]))
    if str(last_updated_date) != str(formatted_date):
        print(formatted_date, last_updated_date)
        updated_json_data = update_currencies(json_file_path, json_data, formatted_date)
    else:
        print("Used the old currency data")

    with open(json_file_path, 'r') as file:
        json_data = json.load(file)

    for curr in json_data['data']:
        if currency == json_data['data'][curr]['code']:
            amount /= json_data['data'][curr]['value']
            break
    amount = round(amount, 2)
    return amount


