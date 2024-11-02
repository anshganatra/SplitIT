import json
import matplotlib.pyplot as plt
import numpy as np
from db_operations import *

def grp_exp_plot():
    plt.title('Expense Details')

    # Read JSON data from file
    with open('./grp_expense_record.json', 'r') as file:
        json_data = file.read()

    # Load JSON data
    data = json.loads(json_data)

    # Extract details
    details = data["6619121674"]["details"]

    # Create a bar chart
    names = list(details.keys())
    values = list(details.values())

    plt.bar(names, values)
    plt.xlabel('Names')
    plt.ylabel('Values')

    # Saves the figure as a PNG image
    plt.savefig('./graphs/grp_expense_chart.pdf')

    # plt.show()

    # clean the plot to avoid the old data remains on it
    plt.clf()
    plt.cla()
    plt.close()


def income_plot(user_id):
    data = read_user_transaction(user_id)

    # Extract income data
    income_data = data.transactions["income_data"]

    # Create a dictionary to store income per category
    income_per_category = {}

    # Calculate total income
    total_income = 0.0
    for entry in income_data:
        amount = float(entry["amount"])
        total_income += amount
        income_per_category[entry["category"]] = income_per_category.get(entry["category"], 0.0) + amount

    # Calculate percentages and actual values
    percentages = [(category, income / total_income * 100) for category, income in income_per_category.items()]

    # Create a pie chart
    labels, values = zip(*percentages)
    explode = [0.1] * len(labels)  # explode the slices for better visibility

    # Create a function to format the autopct
    def autopct_format_income(pct):
        values_array = np.array(values)
        close_values = np.isclose(pct / 100 * total_income, values_array, rtol=1e-05, atol=1e-08)

        # Check if any values are close to the calculated value
        if any(close_values):
            idx = np.where(close_values)[0][0]
            return f'{pct:.1f}% ({income_per_category[labels[idx]]:.2f})' if income_per_category[labels[idx]] > 0 else f'{pct:.1f}%'

        return f'{pct:.1f}%' if total_income > 0 else 'No income data'

    plt.pie(values, labels=labels, autopct=autopct_format_income, startangle=140, explode=explode)
    plt.axis('equal')  # Equal aspect ratio ensures that the pie chart is drawn as a circle.
    plt.title('Income Distribution by Category')
    plt.savefig('./graphs/income_chart.pdf')
    # plt.show()

    # clean the plot to avoid the old data remains on it
    plt.clf()
    plt.cla()
    plt.close()


def expense_plot(user_id):
    data = read_user_transaction(user_id)

    # Extract Expense data
    expense_data = data.transactions["expense_data"]

    # Create a dictionary to store Expense per category
    expense_per_category = {}

    # Calculate total Expense
    total_expense = 0.0
    for entry in expense_data:
        amount = float(entry["amount"])
        total_expense += amount
        expense_per_category[entry["category"]] = expense_per_category.get(entry["category"], 0.0) + amount

    # Calculate percentages and actual values
    percentages = [(category, expense / total_expense * 100) for category, expense in expense_per_category.items()]

    # Create a pie chart
    labels, values = zip(*percentages)
    explode = [0.1] * len(labels)  # explode the slices for better visibility

    # Create a function to format the autopct
    def autopct_format_expense(pct):
        values_array = np.array(values)
        close_values = np.isclose(pct / 100 * total_expense, values_array, rtol=1e-05, atol=1e-08)

        # Check if any values are close to the calculated value
        if any(close_values):
            idx = np.where(close_values)[0][0]
            return f'{pct:.1f}% ({expense_per_category[labels[idx]]:.2f})' if expense_per_category[labels[idx]] > 0 else f'{pct:.1f}%'

        return f'{pct:.1f}%' if total_expense > 0 else 'No expense data'

    plt.pie(values, labels=labels, autopct=autopct_format_expense, startangle=140, explode=explode)
    plt.axis('equal')  # Equal aspect ratio ensures that the pie chart is drawn as a circle.
    plt.title('Expense Distribution by Category')
    plt.savefig('./graphs/expense_chart.pdf')
    # plt.show()

    # clean the plot to avoid the old data remains on it
    plt.clf()
    plt.cla()
    plt.close()
