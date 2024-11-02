# import unittest
# from unittest.mock import patch, MagicMock
# from telebot_code import plot_graphs
# import logging
# import sys
# import telebot

# sys.path.append('./code/helper.py')
# sys.path.append('./code/visualize.py')
# sys.path.append('./code/plot_graphs.py')

# # Replace 'YOUR_BOT_TOKEN' with the actual token obtained from BotFather
# api_token = '6678704280:AAF377dyGdJLbYGmLt46O9nwKY6PqShdlNw'
# bot = telebot.TeleBot(api_token)


# class TestYourModule(unittest.TestCase):
#     @patch('plot_graphs.visualize.income_plot')
#     @patch('telebot.TeleBot')
#     def test_run_income_category(self, mock_reply_markup, mock_income_plot):
#         bot = MagicMock()
#         message = MagicMock()
#         message.text = "Income"

#         plot_graphs.run(message, bot)

#         mock_reply_markup.assert_called_once()
#         bot.reply_to.assert_called_with(message, 'Please select the category you want to visualize', reply_markup=mock_reply_markup.return_value)
#         bot.register_next_step_handler.assert_called_once_with(bot.reply_to.return_value, plot_graphs.post_category_selection, bot)

#     @patch('plot_graphs.visualize.expense_plot')
#     @patch('telebot.TeleBot')
#     def test_run_expense_category(self, mock_reply_markup, mock_expense_plot):
#         bot = MagicMock()
#         message = MagicMock()
#         message.text = "Expense"

#         plot_graphs.run(message, bot)

#         mock_reply_markup.assert_called_once()
#         bot.reply_to.assert_called_with(message, 'Please select the category you want to visualize', reply_markup=mock_reply_markup.return_value)
#         bot.register_next_step_handler.assert_called_once_with(bot.reply_to.return_value, plot_graphs.post_category_selection, bot)

#     @patch('plot_graphs.visualize.grp_exp_plot')
#     @patch('telebot.TeleBot')
#     def test_run_group_expense_category(self, mock_reply_markup, mock_grp_exp_plot):
#         bot = MagicMock()
#         message = MagicMock()
#         message.text = "Group Expense"

#         plot_graphs.run(message, bot)

#         mock_reply_markup.assert_called_once()
#         bot.reply_to.assert_called_with(message, 'Please select the category you want to visualize', reply_markup=mock_reply_markup.return_value)
#         bot.register_next_step_handler.assert_called_once_with(bot.reply_to.return_value, plot_graphs.post_category_selection, bot)

#     @patch('plot_graphs.visualize.income_plot')
#     @patch('telebot.TeleBot')
#     @patch('telebot.TeleBot')
#     def test_post_category_selection_income(self, mock_send_document, mock_reply_markup, mock_income_plot):
#         bot = MagicMock()
#         message = MagicMock()
#         message.text = "Income"
#         message.chat.id = 123

#         plot_graphs.post_category_selection(message, bot)

#         mock_income_plot.assert_called_once()
#         bot.reply_to.assert_called_with(message, 'Generating your Income graph', reply_markup=mock_reply_markup.return_value)
#         mock_send_document.assert_called_once_with(123, open("/Users/nisargdoshi/Downloads/MyExpenseBot-main/graphs/income_chart.pdf", "rb"))

#     # Add similar tests for 'Expense' and 'Group Expense' scenarios

#     @patch('plot_graphs.helper.throw_exception')
#     @patch('telebot.TeleBot')
#     def test_post_category_selection_invalid_category(self, mock_reply_keyboard_remove, mock_throw_exception):
#         bot = MagicMock()
#         message = MagicMock()
#         message.text = "Invalid"

#         with self.assertRaises(ValueError):
#             plot_graphs.post_category_selection(message, bot)

#         mock_throw_exception.assert_called_once_with(ValueError, message, bot, logging)
#         bot.send_message.assert_called_once_with(message.chat.id, 'Invalid', reply_markup=mock_reply_keyboard_remove.return_value)


# if __name__ == '__main__':
#     unittest.main()
