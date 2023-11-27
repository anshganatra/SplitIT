# MyExpenseBot - `visualize` Module Documentation

## Overview

The `visualize` module in MyExpenseBot facilitates the generation of graphical representations for group expenses, income distribution, and expense distribution. It utilizes the `matplotlib` library for creating bar charts and pie charts, providing users with visual insights into their financial data.

### Location of Code

The source code for the `visualize` module can be found [here](https://github.com/NCSU-Group70-CSC505-SE-Fall-23/MyExpenseBot/blob/project3/code/visualize.py).

## Functions

### 1. `grp_exp_plot():`

#### Description

The `grp_exp_plot` function generates a bar chart illustrating group expense details. It reads JSON data from the `grp_expense_record.json` file, extracts user-specific expense details, and creates a bar chart representing individual expenses. The resulting chart is saved as a PDF file in the specified directory.

### 2. `income_plot():`

#### Description

The `income_plot` function generates a pie chart depicting the distribution of income by category. It reads JSON data from the `expense_record.json` file, extracts income data, calculates total income, and creates a pie chart with percentages and actual values. The resulting chart is saved as a PDF file in the specified directory.

### 3. `expense_plot():`

#### Description

The `expense_plot` function generates a pie chart illustrating the distribution of expenses by category. It reads JSON data from the `expense_record.json` file, extracts expense data, calculates total expenses, and creates a pie chart with percentages and actual values. The resulting chart is saved as a PDF file in the specified directory.

## How to Run

1. Ensure that the required libraries (`json`, `matplotlib`, and `numpy`) are installed.
2. Adjust the file paths in the code to point to the correct locations of `grp_expense_record.json` and `expense_record.json`.
3. Execute the script to generate visualizations of group expenses, income distribution, and expense distribution.
4. View the generated charts in the specified directory.

For detailed instructions on running the entire project, refer to the main README.md file.
