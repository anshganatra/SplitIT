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


def add_user_expense_record(bot, user_id, record_to_be_added, member_list, convert_value_str):
    user_list = read_json()
    if str(user_id) not in user_list:
        user_list[str(user_id)] = createNewUserRecord()

    for member in member_list:
        if not user_list[str(user_id)]['details'].get(member):
            user_list[str(user_id)]['details'][member] = float(convert_value_str)
        else:
            user_list[str(user_id)]['details'][member] += float(convert_value_str)

    user_list[str(user_id)]['expense'].append(record_to_be_added)
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


def expense_date(message, bot, category, individual_amount, date_entered, member_list):
    try:
        chat_id = message.chat.id
        user_id = message.from_user.id
        amount = individual_amount
        currency = category

        formatted_date = date_entered.strftime('%Y-%m-%d')
        date_object = datetime.strptime(formatted_date, '%Y-%m-%d')
        start_date = datetime.strptime('1999-01-01', '%Y-%m-%d')
        end_date = datetime.today()

        # Check if the date falls within the range
        if start_date <= date_object <= end_date:
            amountval = actual_curr_val(currency, amount, formatted_date)
        else:
            raise Exception(f"The date {formatted_date} is outside the range ({start_date} -- {end_date}).")

        date_str, amount_str, convert_value_str, currency_str = str(formatted_date), str(amount), str(amountval), str(category)
        write_json(add_user_expense_record(bot, user_id, "{},{},{},{},{}".format(date_str, convert_value_str, currency_str, amount_str, member_list), member_list, convert_value_str))
        bot.send_message(chat_id, 'The following expenditure has been recorded: You have spent ${} in group expenses on {}. Actual currency is {} and value is {}\n'.format(convert_value_str, date_str, currency_str,amount_str))
        restart_script()

    except Exception as e:
        error_message = f'Oh no. An error occurred:\n{e}'
        bot.reply_to(message, error_message)
        logging.exception(str(e))
        restart_script()


def amount_validation(message, bot, total_members, category, member_list):
    try:
        print(member_list)
        chat_id = message.chat.id
        markup = types.ReplyKeyboardMarkup(one_time_keyboard=True)
        total_amount = message.text

        if not total_amount.isnumeric() or not int(total_amount) > 0:
            raise ValueError(f"Please enter a valid expense.")

        individual_amount = float(total_amount) / (total_members + 1)

        calendar, step = DetailedTelegramCalendar().build()
        bot.send_message(chat_id, f"Select {LSTEP[step]}", reply_markup=calendar)

        @bot.callback_query_handler(func=DetailedTelegramCalendar.func())
        def cal(c):
            result, key, step = DetailedTelegramCalendar().process(c.data)

            if not result and key:
                bot.edit_message_text(
                    f"Select {LSTEP[step]}",
                    c.message.chat.id,
                    c.message.message_id,
                    reply_markup=key,
                )
            elif result:
                print(member_list)
                expense_date(message, bot, category, individual_amount, result, member_list)
                bot.edit_message_text(
                    f"Date is set: {result}",
                    c.message.chat.id,
                    c.message.message_id,
                )


    except Exception as e:
        logging.exception(str(e))
        helper.throw_exception(e, message, bot, logging)
        restart_script()


def currency_category(message, bot, total_members, member_list):
    try:
        markup = types.ReplyKeyboardMarkup(one_time_keyboard=True)
        category = message.text

        if category not in helper.getCurrencyOptions():
            raise ValueError(f"Please enter a valid currency type.")

        message = bot.reply_to(message, f'Enter the total amount spent.', reply_markup=markup)
        bot.register_next_step_handler(message, lambda msg: amount_validation(msg, bot, total_members, category, member_list))

    except Exception as e:
        helper.throw_exception(e, message, bot, logging)
        restart_script()


def members_validation(message, bot, total_members):
    try:
        markup = types.ReplyKeyboardMarkup(one_time_keyboard=True)
        curr_member = message.text

        member_list = curr_member.split(',')
        if len(member_list) != total_members:
            raise ValueError(f"Please enter {total_members} members.")

        options = helper.getCurrencyOptions()
        markup.row_width = 3

        for c in options.values():
            markup.add(c)

        reply = bot.reply_to(message, 'Select Currency', reply_markup=markup)
        bot.register_next_step_handler(reply, lambda msg: currency_category(msg, bot, total_members, member_list))

    except Exception as e:
        helper.throw_exception(e, message, bot, logging)
        restart_script()


def post_member_selection(message, bot):
    try:
        markup = types.ReplyKeyboardMarkup(one_time_keyboard=True)
        chat_id = message.chat.id
        total_members_text = message.text

        if total_members_text.isnumeric() and int(total_members_text) > 0:
            total_members = int(total_members_text)
        else:
            bot.send_message(chat_id, 'Invalid', reply_markup=types.ReplyKeyboardRemove())
            raise ValueError("Please enter a valid number of members.")

        message = bot.reply_to(message, f'Enter the names of members involved with you separated by comma.', reply_markup=markup)
        bot.register_next_step_handler(message, lambda msg: members_validation(msg, bot, total_members))
    except Exception as e:
        helper.throw_exception(e, message, bot, logging)
        restart_script()
