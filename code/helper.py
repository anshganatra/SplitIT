import re
import json
import os
from datetime import datetime
from models import *
from db_operations import *

choices = ['Date', 'Category', 'Cost']
plot = ['Bar with budget', 'Pie','Bar without budget']
spend_display_option = ['Day', 'Month']
spend_categories = ['Food','Groceries','Utilities','Transport','Shopping','Miscellaneous']
spend_estimate_option = ['Next day', 'Next month']
update_options = {
    'continue': 'Continue',
    'exit': 'Exit'
}

budget_options = {
    'update': 'Add/Update',
    'view': 'View',
    'delete': 'Delete'
}

budget_types = {
    'overall': 'Overall Budget',
    'category': 'Category-Wise Budget'
}

data_format = {
    'income_data': [],
    'expense_data': [],
    'budget': {
        'overall': None,
        'category': None
    }
}

category_options = {
    'add': 'Add a Category',
    'delete': 'Delete a Category',
    'view': 'Show Categories'
}

income_or_expense_options = {
    'income': 'Income',
    'expense': 'Expense'
}

# currency_options = {
#     'Euro': 'Euro',
#     'USD': 'USD',
#     'INR': 'INR'
# }

currency_options = {
    'USD': 'USD',
    'EUR': 'EUR',
    'JPY': 'JPY',
    'GBP': 'GBP',
    'AUD': 'AUD',
    'CAD': 'CAD',
    'CHF': 'CHF',
    'HKD': 'HKD',
    'NZD': 'NZD',
    'SEK': 'SEK',
    'KRW': 'KRW',
    'NOK': 'NOK',
    'INR': 'INR',
    'MXN': 'MXN',
    'TWD': 'TWD',
    'ZAR': 'ZAR',
    'BRL': 'BRL',
    'DKK': 'KK',
    'PLN': 'PLN'
}


# set of implemented commands and their description
commands = {
    'menu': 'Display this menu',
    'add': 'Record/Add a new Spending or Income',
    'add_recurring': 'Add a new recurring expense/income for future months',
    'add_group_exp': 'Add a group expense',
    'visualize': 'Get visual representation of the money you spent or earned in different categories.',
    'display': 'Show sum of expenditure for the current day/month',
    'estimate': 'Show an estimate of expenditure for the next day/month',
    'history': 'Display spending.income history',
    'delete': 'Clear/Erase all your records',
    'edit': 'Edit/Change spending details',
    'budget': 'Add/Update/View/Delete budget',
    'category': 'Add/Delete/Show custom categories',
    'pdf': 'Generate a pdf for Income or History'
}


dateFormat = '%d-%b-%y'
timeFormat = '%H:%M'
monthFormat = '%b-%Y'


# function to load .json expense record data
def read_json():
    try:
        if not os.path.exists('expense_record.json'):
            with open('expense_record.json', 'w') as json_file:
                json_file.write('{}')
            return json.dumps('{}')
        elif os.stat('expense_record.json').st_size != 0:
            with open('expense_record.json') as expense_record:
                expense_record_data = json.load(expense_record)
            return expense_record_data

    except FileNotFoundError:
        print("---------NO RECORDS FOUND---------")


def write_json(user_list):
    try:
        with open('expense_record.json', 'w') as json_file:
            json.dump(user_list, json_file, ensure_ascii=False, indent=4)
    except FileNotFoundError:
        print('Sorry, the data file could not be found.')


def validate_entered_amount(amount_entered):
    if amount_entered is None:
        return 0
    if re.match("^[1-9][0-9]{0,14}\\.[0-9]*$", amount_entered) or re.match("^[1-9][0-9]{0,14}$", amount_entered):
        amount = round(float(amount_entered), 2)
        if amount > 0:
            return str(amount)
    return 0


def validate_entered_date(date_entered):
    if date_entered is None:
        return datetime.today().strftime(getDateFormat() + ' ' + getTimeFormat())
    else:
    	# try:
        return datetime.strftime(date_entered, getDateFormat() + ' ' + getTimeFormat())
        # except ValueError:
        #     msg = "Not a valid date: '{0}'.".format(date_entered)
        #     raise argparse.ArgumentTypeError(msg)


def validate_entered_duration(duration_entered):
    if duration_entered is None:
        return 0
    if re.match("^[1-9][0-9]{0,14}", duration_entered):
        duration = int(duration_entered)
        if duration > 0:
            return str(duration)
    return 0


def getUserIncomeHistory(user_id):
    data = getUserData(user_id)
    if data is not None:
        return data.transactions['income_data']
    return None

def getUserExpenseHistory(user_id):
    data = getUserData(user_id)
    if data is not None:
        return data.transactions['expense_data']
    return None

def getUserHistory(user_id, selectedType):
    if selectedType == "Income":
        return getUserIncomeHistory(user_id)
    else:
        return getUserExpenseHistory(user_id)
    

def getUserData(user_id):
    userTransaction = read_user_transaction(user_id)

    if userTransaction == None:
        return None
    
    return userTransaction


def throw_exception(e, message, bot, logging):
    logging.exception(str(e))
    bot.reply_to(message, 'Oh no! ' + str(e))


def createNewUserRecord():
    return data_format


def getOverallBudget(userId):
    data = getUserData(userId)
    if data is None:
        return None
    return data['budget']['overall']


def getCategoryBudget(userId):
    data = getUserData(userId)
    if data is None:
        return None
    return data['budget']['category']


def getCategoryBudgetByCategory(userId, cat):
    if not isCategoryBudgetByCategoryAvailable(userId, cat):
        return None
    data = getCategoryBudget(userId)
    return data[cat]


def canAddBudget(userId):
    return (getOverallBudget(userId) is None) and (getCategoryBudget(userId) is None)


def isOverallBudgetAvailable(userId):
    return getOverallBudget(userId) is not None


def isCategoryBudgetAvailable(userId):
    return getCategoryBudget(userId) is not None


def isCategoryBudgetByCategoryAvailable(userId, cat):
    data = getCategoryBudget(userId)
    if data is None:
        return False
    return cat in data.keys()


def display_remaining_budget(message, bot, cat):
    user_id = message.from_user.id
    if isOverallBudgetAvailable(user_id):
        display_remaining_overall_budget(message, bot)
    elif isCategoryBudgetByCategoryAvailable(user_id, cat):
        display_remaining_category_budget(message, bot, cat)


def display_remaining_overall_budget(message, bot):
    print('here')
    chat_id = message.chat.id
    user_id = message.from_user.id
    remaining_budget = calculateRemainingOverallBudget(user_id)
    print("here", remaining_budget)
    if remaining_budget >= 0:
        msg = '\nRemaining Overall Budget is $' + str(remaining_budget)
    else:
        msg = '\nBudget Exceded!\nExpenditure exceeds the budget by $' + str(remaining_budget)[1:]
    bot.send_message(chat_id, msg)


def calculateRemainingOverallBudget(user_id):
    budget = getOverallBudget(user_id)
    history = getUserExpenseHistory(user_id)
    query = datetime.now().today().strftime(getMonthFormat())
    queryResult = [value for index, value in enumerate(history) if str(query) in value]

    return float(budget) - calculate_total_spendings(queryResult)


def calculate_total_spendings(queryResult):
    total = 0

    for row in queryResult:
        s = row.split(',')
        total = total + float(s[2])
    return total


def display_remaining_category_budget(message, bot, cat):
    chat_id = message.chat.id
    user_id = message.from_user.id
    remaining_budget = calculateRemainingCategoryBudget(user_id, cat)
    if remaining_budget >= 0:
        msg = '\nRemaining Budget for ' + cat + ' is $' + str(remaining_budget)
    else:
        msg = '\nBudget for ' + cat + ' Exceded!\nExpenditure exceeds the budget by $' + str(abs(remaining_budget))
    bot.send_message(chat_id, msg)


def calculateRemainingCategoryBudget(user_id, cat):
    budget = getCategoryBudgetByCategory(user_id, cat)
    history = getUserExpenseHistory(user_id)
    query = datetime.now().today().strftime(getMonthFormat())
    queryResult = [value for index, value in enumerate(history) if str(query) in value]

    return float(budget) - calculate_total_spendings_for_category(queryResult, cat)


def calculate_total_spendings_for_category(queryResult, cat):
    total = 0

    for row in queryResult:
        s = row.split(',')
        if cat == s[1]:
            total = total + float(s[2])
    return total

def getSpendCategories():
    with open("categories.txt", "r") as tf:
        spend_categories = tf.read().split(',')
    return spend_categories

def getIncomeCategories():
    with open("income_categories.txt","r") as tf:
        income_categories = tf.read().split(',')
    return income_categories

def getCategories(selectedType):
    if selectedType == "Income":
        income_categories = getIncomeCategories()
        return income_categories
    else:
        spend_categories = getSpendCategories()
        return spend_categories

def getplot():
    return plot

def getSpendDisplayOptions():
    return spend_display_option


def getSpendEstimateOptions():
    return spend_estimate_option


def getCommands():
    return commands


def getDateFormat():
    return dateFormat


def getTimeFormat():
    return timeFormat


def getMonthFormat():
    return monthFormat


def getChoices():
    return choices


def getBudgetOptions():
    return budget_options


def getBudgetTypes():
    return budget_types


def getUpdateOptions():
    return update_options


def getCategoryOptions():
    return category_options

def getIncomeOrExpense():
    return income_or_expense_options

def getCurrencyOptions():
    return currency_options
