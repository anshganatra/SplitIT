# MyExpenseBot - `plot_graphs` Module Documentation

## Overview

The `plot_graphs` module in MyExpenseBot is responsible for interacting with the `visualize` module to generate and share visual representations of financial data. It utilizes the `telebot`, `types`, and other relevant libraries to communicate with users and trigger the graph generation process.

### Location of Code

The source code for the `plot_graphs` module can be found [here](path/to/plot_graphs.py).

## Functions

### 1. `run(message, bot):`

#### Description

The `run` function initiates the visualization process by prompting users to select a category (Income, Expense, or Group Expense). It utilizes the `telebot` library to create a keyboard with category options and waits for the user's selection. The control is then passed to the `post_category_selection` function.

### 2. `post_category_selection(message, bot):`

#### Description

The `post_category_selection` function handles the user's category selection and triggers the appropriate visualization function from the `visualize` module (`income_plot`, `expense_plot`, or `grp_exp_plot`). It communicates with the user using the `telebot` library, informing them that the graph is being generated and sending the resulting graph as a document. In case of an invalid category, it raises a `ValueError` and notifies the user.

## How to Run

1. Ensure that the required libraries (`telebot`, `types`, `json`, `dateutil`, `currency_api`, `add`, and `visualize`) are installed.
2. Make sure that the `visualize` module is properly implemented and includes the required graph generation functions.
3. Adjust the file paths in the code to point to the correct locations of the generated graph files.
4. Execute the script to run the MyExpenseBot and interact with users to trigger graph generation.
5. View the generated graphs shared by the bot.

For detailed instructions on running the entire project, refer to the main README.md file.
