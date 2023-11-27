import pytest
from unittest.mock import patch, mock_open
from code import visualize

@pytest.fixture
def mock_open_function():
    return mock_open(read_data='''{
        "6619121674": {
            "expense_data": [
                "2022-08-28,2.9,JPY,400.0", 
                "2022-01-01,189.52,EUR,166.66666666666666",
                "2022-01-11,0.03,JPY,4.0",
                "2023-05-18,7.33,USD,7.333333333333333",
                "2023-05-31,8.98,JPY,1250.0",
                "2023-02-14,30.28,AUD,43.333333333333336"
            ],
            "details": {
                "Nisarg": 11.91,
                "Aniruddha": 2.9,
                "Chaitanya": 198.53,
                "Mitesh": 198.5,
                "Wolf": 7.33,
                "Pack": 7.33,
                "Abdul": 30.28,
                "Bari": 30.28
            }
        }
    }''')


def test_grp_exp_plot(mock_open_function):
    # Ensure that the file is opened with the correct path
    with patch('builtins.open', mock_open_function) as mock_open:
        with patch('matplotlib.pyplot.savefig') as mock_savefig:
            visualize.grp_exp_plot()

    # Add assertions based on your expected behavior
    mock_open.assert_called_once_with('./grp_expense_record.json', 'r')
    mock_savefig.assert_called_once_with('./graphs/grp_expense_chart.pdf')

def test_income_plot(mock_open_function):
    # Ensure that the file is opened with the correct path
    with patch('builtins.open', mock_open_function) as mock_open:
        with patch('matplotlib.pyplot.savefig') as mock_savefig:
            visualize.income_plot()

    # Add assertions based on your expected behavior
    mock_open.assert_called_once_with('./expense_record.json', 'r')
    mock_savefig.assert_called_once_with('./graphs/income_chart.pdf')

def test_expense_plot(mock_open_function):
    # Ensure that the file is opened with the correct path
    with patch('builtins.open', mock_open_function) as mock_open:
        with patch('matplotlib.pyplot.savefig') as mock_savefig:
            visualize.expense_plot()

    # Add assertions based on your expected behavior
    mock_open.assert_called_once_with('./expense_record.json', 'r')
    mock_savefig.assert_called_once_with('./graphs/expense_chart.pdf')
