import helper
import logging
import telebot
import calendar
from telebot import types
from dateutil.relativedelta import relativedelta
from datetime import datetime
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
        markup.row_width = 2
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
        message = bot.send_message(chat_id, 'For how many months in the future will the expense/income be there? \n(Enter integer values only)')
        bot.register_next_step_handler(message, post_duration_input, bot, amount_value)
    except Exception as e:
        logging.exception(str(e))
        bot.reply_to(message, 'Oh no. ' + str(e))


def post_duration_input(message, bot, amount_value):
    try:
        chat_id = message.chat.id
        user_id = message.from_user.id
        amount = float(selectedAm[user_id])
        currency = str(selectedCurr[user_id])
        duration_value = message.text
        if currency == 'Euro':
            actual_value = float(amount) * 1.05
        elif currency == 'INR':
            actual_value = float(amount) * 0.012
        else:
            actual_value = float(amount) * 1.0
        amountval = round(actual_value, 2)
                
        for i in range(int(duration_value)):
            date_of_entry = (datetime.today() + relativedelta(months=+i)).strftime(helper.getDateFormat())
            date_str, category_str, amount_str, convert_value_str, currency_str = str(date_of_entry), str(selectedCat[user_id]), str(amount), str(amountval), str(selectedCurr[user_id])
            if str(selectedTyp[user_id])=="Income":
                expenseRecord = ExpenseRecord(title="Income", date=date_str, category=category_str, amount=amount_str, currency=currency_str, amountUSD=convert_value_str)
                add_user_income_record(bot,user_id, expenseRecord.to_dict())
            else:
                expenseRecord = ExpenseRecord(title="Expense", date=date_str, category=category_str, amount=amount_str, currency=currency_str, amountUSD=convert_value_str)
                add_user_expense_record(bot,user_id, expenseRecord.to_dict())
        bot.send_message(chat_id, 'The following expenditure has been recorded: You have spent/received ${} for {} for the next {} months. Actual currency is {} and value is {}\n'.format(convert_value_str, category_str, duration_value, currency_str,amount_str))
    except Exception as e:
        logging.exception(str(e))
        bot.reply_to(message, 'Oh no. ' + str(e))

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


