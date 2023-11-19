# About MyExpenseBot's `/add` Feature

This feature enables the user to add a new income or expense to their income or expense tracker.

## Expense Categories (Default)
- Food
- Groceries
- Utilities
- Transport
- Shopping
- Miscellaneous

## Income Categories (Default)
- Work
- Volunteering
- Part-Time
- Prizes
- Miscellaneous

The user can choose a category from the income or expense set and add the amount they have spent or received to be stored in the income and expense tracker.

## Location of Code for this Feature

The code that implements this feature can be found [here](https://github.com/nainisha-b/MyExpenseBot/blob/main/code/add.py).

## Code Description

### Functions

1. **run(message, bot):**
    - Main function to implement the add feature.
    - Requests the user to choose their income or expense category.
    - Control is given to `post_type_selection(message, bot)` for further processing.

2. **post_type_selection(message, bot):**
    - Takes two arguments - `message` and `bot`.
    - Pops up a menu to choose the type (income or expense).
    - Asks the user to choose their income or expense category.
    - Control is given to `post_category_selection(message, bot, selectedType)` for further processing.

3. **post_category_selection(message, bot, selectedType):**
    - Takes three arguments - `message`, `bot`, and `selectedType`.
    - Stores the category selected from `post_type_selection(message, bot)`.
    - Requests the user to select the type of currency and passes control to `post_currency_input(message, bot, selectedType, selected_category)`.

4. **post_currency_input(message, bot, selectedType, selected_category):**
    - Takes four arguments - `message`, `bot`, `selectedType`, and `selected_category`.
    - Stores the type of currency.
    - Requests the user to enter the amount spent on the chosen category.
    - Passes control to `post_amount_input(message, bot, selectedType, selected_category, converted_currency)`.

5. **post_amount_input(message, bot, selectedType, selected_category, converted_currency):**
    - Takes five arguments - `message`, `bot`, `selectedType`, `selected_category`, and `converted_currency`.
    - Validates the amount entered.
    - Pops up a calendar for the user to input the income or expense date.
    - Passes control to `post_date_input(message, date_entered, bot, selectedType, selected_category, converted_currency, amount_value)`.

6. **post_date_input(message, date_entered, bot, selectedType, selected_category, converted_currency, amount_value):**
    - Takes six arguments - `message`, `date_entered`, `bot`, `selectedType`, `selected_category`, and `converted_currency`.
    - Validates the selected date using a calendar.
    - Converts the amount input from the input currency type to the default type (USD).
    - Calls `add_user_income_record` or `add_user_expense_record` based on `selectedType` to store the data.

7. **add_user_income_record(chat_id, record_to_be_added):**
    - Takes two arguments - `chat_id` and `record_to_be_added`.
    - Stores the income record in the store.

8. **add_user_expense_record(chat_id, record_to_be_added):**
    - Takes two arguments - `chat_id` and `record_to_be_added`.
    - Stores the expense record in the store.

9. **convert_usd_to(currency, amount):**
    - Takes two arguments - `currency` and `amount`.
    - Called in `post_date_input(...)` to convert the custom currency type to the default currency type (USD).

10. **actual_curr_val(currency, amount, formatted_date):**
    - Converts the given amount from the specified currency to USD based on the exchange rates obtained from a JSON file.
    - If the exchange rates are not available or outdated, it fetches the latest rates and updates the JSON file.

## How to Run This Feature

Once the project is running (please follow the instructions given in the main `README.md` for this), please type `/add` into the Telegram bot.

## Example
Once the project is running(please follow the instructions given in the main README.md for this), please type /add into the telegram bot.

Below you can see an example in text format:

ExpenseBot, [10/18/2023 11:56 PM]
Select Income or Expense

Anvitha, [10/18/2023 11:56 PM]
Income

ExpenseBot, [10/18/2023 11:56 PM]
Select Category

Anvitha, [10/18/2023 11:56 PM]
Work

ExpenseBot, [10/18/2023 11:56 PM]
Select Currency

Anvitha, [10/18/2023 11:56 PM]
Euro

ExpenseBot, [10/18/2023 11:56 PM]
How much did you receive through Work? 
(Enter numeric values only)

Anvitha, [10/18/2023 11:56 PM]
60

ExpenseBot, [10/18/2023 11:56 PM]
Date is set: 2022-12-21

ExpenseBot, [10/18/2023 11:56 PM]
The following expenditure has been recorded: You have spent/received $63.0 for Work on 21-Dec-22. Actual currency is Euro and value is 60.0

