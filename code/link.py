import helper
import logging
import telebot
import calendar
import json
from telegram_bot_calendar import DetailedTelegramCalendar, LSTEP
from telebot import types
from datetime import datetime, date
from currency_api import update_currencies
from models import *
from db_operations import *

option = {}
selectedTyp = {}
selectedCat = {}
selectedAm = {}
selectedCurr = {}


def run(message, bot):
    chat_id = message.chat.id
    user_id = message.from_user.id
    
    msg = bot.reply_to(message, 'Enter the Email id you want to link to: ')
    
    bot.register_next_step_handler(msg, post_email_input, bot) 

def post_email_input(message, bot):
    try:
        user_id = message.from_user.id
        email_id = message.text

        msg = bot.reply_to(message, 'Enter the Link Verfication Code:')
        bot.register_next_step_handler(msg, post_code_input, bot, email_id)

    except Exception as e:
        # print("hit exception")
        helper.throw_exception(e, message, bot, logging)

def post_code_input(message, bot, email_id):
    try:
        chat_id = message.chat.id
        user_id = message.from_user.id
        
        link_code = message.text
        result = link_user(user_id, email_id, link_code)

        if result != None:
            bot.send_message(chat_id, 'Yayyy! User has been successfully linked to the email.')
        else:
            bot.reply_to(message, 'Oh no. Failed to Link User to email due to invalid Email/Link Code')
    except Exception as e:
        logging.exception(str(e))
        bot.reply_to(message, 'Oh no. ' + str(e))
