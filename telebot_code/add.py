import helper
import logging
import telebot
import calendar
import json
from telegram_bot_calendar import DetailedTelegramCalendar, LSTEP
from telebot import types
from datetime import datetime, date, timedelta
from currency_api import update_currencies
from models import *
from db_operations import *

option = {}
selectedTyp = {}
selectedCat = {}
selectedAm = {}
selectedCurr = {}


def run(message, bot):
    markup = types.ReplyKeyboardMarkup(one_time_keyboard=True)
    options = helper.getIncomeOrExpense()
    markup.row_width = 2
    for c in options.values():
        markup.add(c)
    msg = bot.reply_to(message, 'Select Income or Expense', reply_markup=markup)
    bot.register_next_step_handler(msg, post_type_selection, bot)


def post_type_selection(message, bot):
    try:
        markup = types.ReplyKeyboardMarkup(one_time_keyboard=True)
        user_id = message.from_user.id
        selectedType = message.text
        if selectedType == "Income":
            for c in helper.getIncomeCategories():
                markup.add(c)
        else:
            for c in helper.getSpendCategories():
                markup.add(c)
        msg = bot.reply_to(message, 'Select Category', reply_markup=markup)
        selectedTyp[user_id] = selectedType
        bot.register_next_step_handler(msg, post_category_selection, bot, selectedType)
    except Exception as e:
        # print("hit exception")
        helper.throw_exception(e, message, bot, logging)


def post_category_selection(message, bot, selectedType):
    try:
        chat_id = message.chat.id
        user_id = message.from_user.id
        selected_category = message.text
        if selectedType == "Income":
            categories = helper.getIncomeCategories()
        else:
            categories = helper.getSpendCategories()
        if selected_category not in categories:
            bot.send_message(chat_id, 'Invalid', reply_markup=types.ReplyKeyboardRemove())
            raise Exception("Sorry I don't recognise this category \"{}\"!".format(selected_category))
        selectedCat[user_id] = selected_category
        markup = types.ReplyKeyboardMarkup(one_time_keyboard=True)
        options = helper.getCurrencyOptions()
        markup.row_width = 3
        for c in options.values():
            markup.add(c)
        msg = bot.reply_to(message, 'Select Currency', reply_markup=markup)
        bot.register_next_step_handler(message, post_currency_selection, bot,selected_category)
    except Exception as e:
        logging.exception(str(e))
        bot.reply_to(message, 'Oh no. ' + str(e))


def post_currency_selection(message, bot, selected_category):
    try:
        markup = types.ReplyKeyboardMarkup(one_time_keyboard=True)
        chat_id = message.chat.id
        user_id = message.from_user.id
        selectedCurrency = message.text
        currencyOptions = helper.getCurrencyOptions()
        if selectedCurrency not in currencyOptions:
            bot.send_message(chat_id, 'Invalid', reply_markup=types.ReplyKeyboardRemove())
            raise Exception("Sorry I don't recognise this currency \"{}\"!".format(selectedCurrency))
        selectedCurr[user_id] = selectedCurrency
        if str(selectedTyp[user_id]) == "Income" :
            message = bot.send_message(chat_id, 'How much did you receive through {}? \n(Enter numeric values only)'.format(str(selected_category)))
        else:
            message = bot.send_message(chat_id, 'How much did you spend on {}? \n(Enter numeric values only)'.format(str(selected_category)))
        bot.register_next_step_handler(message, post_amount_input, bot, selectedCurrency)
    except Exception as e:
        # print("hit exception")
        helper.throw_exception(e, message, bot, logging)


def post_amount_input(message, bot, selectedCurrency):
    try:
        chat_id = message.chat.id
        user_id = message.from_user.id
        amount_entered = message.text
        amount_value = helper.validate_entered_amount(amount_entered)  # validate
        if amount_value == 0:  # cannot be $0 spending
            raise Exception("Spent amount has to be a non-zero number.")
        selectedAm[user_id] = amount_value   
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
                post_date_input(message,bot, result)
                bot.edit_message_text(
                    f"Date is set: {result}",
                    c.message.chat.id,
                    c.message.message_id,
                )
    except Exception as e:
        logging.exception(str(e))
        bot.reply_to(message, 'Oh no. ' + str(e))

#########################################################


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
        # print(updated_json_data)
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
################################################################


def post_date_input(message, bot, date_entered):
    try:
        chat_id = message.chat.id
        user_id = message.from_user.id
        amount = float(selectedAm[user_id])
        currency = str(selectedCurr[user_id])

        ####################################################

        formatted_date = date_entered.strftime('%Y-%m-%d')
        date_object = datetime.strptime(formatted_date, '%Y-%m-%d')
        start_date = datetime.strptime('1999-01-01', '%Y-%m-%d')
        end_date = datetime.today() + + timedelta(days=7)

        # Check if the date falls within the range
        if start_date <= date_object <= end_date:
            amountval = actual_curr_val(currency, amount, formatted_date)
        else:
            raise Exception(f"Error: Future dates are not allowed.")

        # if currency == 'Euro':
        #     actual_value = float(amount) * 1.05
        # elif currency == 'INR':
        #     actual_value = float(amount) * 0.012
        # else:
        #     actual_value = float(amount) * 1.0
        # amountval = round(actual_value, 2)

        ######################################################
        date_str, category_str, amount_str, convert_value_str, currency_str = str(formatted_date), str(selectedCat[user_id]), str(amount), str(amountval), str(selectedCurr[user_id])
        if str(selectedTyp[user_id])=="Income":
            expenseRecord = ExpenseRecord(title="Income", date=date_str, category=category_str, amount=amount_str, currency=currency_str, amountUSD=convert_value_str)
            add_user_income_record(bot,user_id, expenseRecord.to_dict())
        else:
            expenseRecord = ExpenseRecord(title="Expense", date=date_str, category=category_str, amount=amount_str, currency=currency_str, amountUSD=convert_value_str)
            add_user_expense_record(bot,user_id, expenseRecord.to_dict())
        bot.send_message(chat_id, 'The following expenditure has been recorded: You have spent/received ${} for {} on {}. Actual currency is {} and value is {}\n'.format(convert_value_str, category_str, date_str, currency_str,amount_str))
        helper.display_remaining_budget(message, bot, selectedCat[user_id])

    ####################################################
    except Exception as e:
        error_message = f'Oh no. An error occurred:\n{e}'
        bot.reply_to(message, error_message)
        logging.exception(str(e))
    ####################################################


def add_user_expense_record(bot,user_id, record_to_be_added):
    userTransaction = read_user_transaction(user_id)

    if userTransaction == None:
        userTransaction = UserTransactions(telegram_user_id=user_id)
        create_user_transaction(userTransaction)

    userTransaction.transactions["expense_data"].append(record_to_be_added)

    update_user_transaction(user_id, userTransaction.to_dict())

    return userTransaction


def add_user_income_record(bot,user_id, record_to_be_added):
    userTransaction = read_user_transaction(user_id)

    if userTransaction == None:
        userTransaction = UserTransactions(telegram_user_id=user_id)
        create_user_transaction(userTransaction)

    userTransaction.transactions["income_data"].append(record_to_be_added)

    update_user_transaction(user_id, userTransaction.to_dict())

    return userTransaction
