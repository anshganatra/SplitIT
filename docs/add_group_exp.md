# MyExpenseBot - `add_group_expense` Module Documentation

## Overview

The `add_group_expense` module plays a pivotal role in MyExpenseBot, functioning as the core component responsible for managing and recording group expenses. It handles user inputs related to expenses, currency conversion, and date selections. Additionally, the module records and updates user-specific expense data in a JSON file, ensuring accurate and detailed tracking.

### Location of Code

The source code for the `add_group_expense` module can be found [here](https://github.com/NCSU-Group70-CSC505-SE-Fall-23/MyExpenseBot/blob/project3/code/add_group_exp.py).

## Functions

### 1. `restart_script():`

#### Description

The `restart_script` function serves the critical purpose of restarting the MyExpenseBot script by executing a bash script (`run.sh`). This ensures proper script restart permissions and execution, enhancing the overall reliability of the system.

### 2. `run(message, bot):`

#### Parameters

- `message`: The message received from the user.
- `bot`: The Telegram bot object.

#### Description

The `run` function acts as the entry point for the group expense recording process. It initiates the process by prompting the user to input the number of members involved, setting the stage for subsequent steps.

### 3. `createNewUserRecord():`

#### Description

The `createNewUserRecord` function is a utility that initializes a new user record template. This template includes an empty expense list and details dictionary, laying the groundwork for comprehensive user-specific expense tracking.

### 4. `read_json():`

#### Description

The `read_json` function facilitates the reading of existing expense records from a JSON file (`grp_expense_record.json`). In the absence of the file, it creates an empty file to ensure seamless data management.

### 5. `write_json(user_list):`

#### Parameters

- `user_list`: The user-specific expense record to be written.

#### Description

The `write_json` function is responsible for updating existing expense data with new user records. It then writes the updated data back to the JSON file, ensuring persistence and integrity of recorded information.

### 6. `add_user_expense_record(bot, chat_id, record_to_be_added, member_list, convert_value_str):`

#### Parameters

- `bot`: The Telegram bot object.
- `chat_id`: The unique identifier for the chat.
- `record_to_be_added`: The formatted string representing the expense record.
- `member_list`: List of members involved.
- `convert_value_str`: Converted value of the expense.

#### Description

The `add_user_expense_record` function augments the user-specific data by adding a new expense record. It comprehensively includes details for each member involved, facilitating detailed and accurate tracking.

### 7. `actual_curr_val(currency, amount, formatted_date):`

#### Parameters

- `currency`: The currency code for the expense.
- `amount`: The original expense amount.
- `formatted_date`: The formatted date of the expense.

#### Description

The `actual_curr_val` function manages actual currency value conversion based on the latest data from a JSON file (`currencies.json`). It ensures accuracy and timeliness in the conversion process, enhancing the reliability of recorded expenses.

### 8. `expense_date(message, bot, category, individual_amount, date_entered, member_list):`

#### Parameters

- `message`: The message received from the user.
- `bot`: The Telegram bot object.
- `category`: The currency code for the expense.
- `individual_amount`: The individual expense amount per member.
- `date_entered`: The selected date for the expense.
- `member_list`: List of members involved.

#### Description

The `expense_date` function validates the expense date, performs currency conversion, and records the expense details. It then promptly notifies the user about the successfully recorded expenditure, ensuring transparency and user feedback.

### 9. `amount_validation(message, bot, total_members, category, member_list):`

#### Parameters

- `message`: The message received from the user.
- `bot`: The Telegram bot object.
- `total_members`: The total number of members involved.
- `category`: The currency code for the expense.
- `member_list`: List of members involved.

#### Description

The `amount_validation` function ensures the validation of the total expense amount entered by the user. It further initiates the date selection process, fostering a user-friendly and error-resistant experience.

### 10. `currency_category(message, bot, total_members, member_list):`

#### Parameters

- `message`: The message received from the user.
- `bot`: The Telegram bot object.
- `total_members`: The total number of members involved.
- `member_list`: List of members involved.

#### Description

The `currency_category` function prompts the user to select the currency for the expense, adding an additional layer of customization and flexibility to the group expense recording process.

### 11. `members_validation(message, bot, total_members):`

#### Parameters

- `message`: The message received from the user.
- `bot`: The Telegram bot object.
- `total_members`: The total number of members involved.

#### Description

The `members_validation` function validates the list of members entered by the user, ensuring it matches the expected number of participants. It then initiates the currency selection process, contributing to a streamlined and error-tolerant user interaction.

### 12. `post_member_selection(message, bot):`

#### Parameters

- `message`: The message received from the user.
- `bot`: The Telegram bot object.

#### Description

The `post_member_selection` function serves as a trigger, initiating the group expense recording process. It prompts the user to input the number of members involved, setting the stage for a seamless and user-centric experience.

## How to Run

1. Start the MyExpenseBot project.
2. Enter the desired command to initiate group expense recording.
3. Follow the on-screen prompts to provide necessary details, including the number of members, member names, expense amount, currency, and date.
4. The system will record the group expense and provide a confirmation message.

For detailed instructions on running the entire project, refer to the main README.md file.
