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
import visualize


def run(message, bot):
    chat_id = message.chat.id
    markup = types.ReplyKeyboardMarkup(one_time_keyboard=True)

    options = ['Income', 'Expense', 'Group Expense']
    markup.row_width = 3

    for option in options:
        markup.add(option)

    msg = bot.reply_to(message, 'Please select the category you want to visualize', reply_markup=markup)
    bot.register_next_step_handler(msg, post_category_selection, bot)


def post_category_selection(message, bot):
    try:
        markup = types.ReplyKeyboardMarkup(one_time_keyboard=True)
        chat_id = message.chat.id
        category = message.text

        if category == "Income":
            message = bot.reply_to(message, f'Generating your Income graph', reply_markup=markup)
            visualize.income_plot()
            bot.send_document(chat_id, open("./graphs/income_chart.pdf", "rb"))
        elif category == "Expense":
            message = bot.reply_to(message, f'Generating your Expense graph', reply_markup=markup)
            visualize.expense_plot()
            bot.send_document(chat_id, open("./graphs/expense_chart.pdf", "rb"))
        elif category == "Group Expense":
            message = bot.reply_to(message, f'Generating your Group Expense graph', reply_markup=markup)
            visualize.grp_exp_plot()
            bot.send_document(chat_id, open("./graphs/grp_expense_chart.pdf", "rb"))
        else:
            bot.send_message(chat_id, 'Invalid', reply_markup=types.ReplyKeyboardRemove())
            raise ValueError("Please enter a valid category.")

    except Exception as e:
        helper.throw_exception(e, message, bot, logging)
