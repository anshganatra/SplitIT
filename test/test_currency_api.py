import unittest
from unittest.mock import patch, Mock
import json
from datetime import datetime
from telebot_code import currency_api

class TestCurrencyUpdate(unittest.TestCase):

    @patch('currencyapicom.Client')
    @patch('builtins.open')
    def test_update_currencies(self, mock_open, mock_client):
        # Mock the data
        mock_data = {
            "meta": {"last_updated_at": "2022-01-11T23:59:59Z"},
            "data": {
                "AUD": {"code": "AUD", "value": 1.38722},
                "BRL": {"code": "BRL", "value": 5.56869},
                "CAD": {"code": "CAD", "value": 1.25806},
                "CHF": {"code": "CHF", "value": 0.9236},
                "DKK": {"code": "DKK", "value": 6.54712},
                "EUR": {"code": "EUR", "value": 0.87974},
                "GBP": {"code": "GBP", "value": 0.73382},
                "HKD": {"code": "HKD", "value": 7.79576},
                "INR": {"code": "INR", "value": 73.7924},
                "JPY": {"code": "JPY", "value": 115.35387},
                "KRW": {"code": "KRW", "value": 1188.60315},
                "MXN": {"code": "MXN", "value": 20.40547},
                "NOK": {"code": "NOK", "value": 8.77185},
                "NZD": {"code": "NZD", "value": 1.47415},
                "PLN": {"code": "PLN", "value": 3.99299},
                "SEK": {"code": "SEK", "value": 9.04002},
                "TWD": {"code": "TWD", "value": 27.66534},
                "USD": {"code": "USD", "value": 1},
                "ZAR": {"code": "ZAR", "value": 15.52537},
            },
        }
        mock_open.return_value.__enter__.return_value.read.return_value = json.dumps(mock_data)

        # Mock the Currency API client
        mock_currency_api = Mock()
        mock_currency_api.historical.return_value = {
            "meta": {"last_updated_at": "2022-01-12T23:59:59Z"},
            "data": {
                "AUD": {"value": 1.4},
                "BRL": {"value": 5.6},
                "CAD": {"value": 1.26},
                "CHF": {"value": 0.1},
                "DKK": {"value": 6.6},
                "EUR": {"value": 0.9},
                "GBP": {"value": 0.7},
                "HKD": {"value": 7.8},
                "INR": {"value": 73.8},
                "JPY": {"value": 115.4},
                "KRW": {"value": 1188.6},
                "MXN": {"value": 20.4},
                "NOK": {"value": 8.8},
                "NZD": {"value": 1.5},
                "PLN": {"value": 4.0},
                "SEK": {"value": 9.0},
                "TWD": {"value": 27.7},
                "USD": {"value": 1},
                "ZAR": {"value": 15.5},
            },
        }
        mock_client.return_value = mock_currency_api

        # Run the function
        updated_data = currency_api.update_currencies('./currencies.json', mock_data, '2022-01-12')

        # Assertions
        self.assertEqual(updated_data["meta"]["last_updated_at"], "2022-01-12T23:59:59Z")
        # Include assertions for all currencies

        # Ensure that the update_json_file function was called
        mock_open.assert_called_with('./currencies.json', 'w')
        mock_open.return_value.__enter__.return_value.write.assert_called()

    @patch('builtins.open')
    def test_update_json_file(self, mock_open):
        # Mock the data
        data = {"key": "value"}

        # Run the function
        currency_api.update_json_file('./file.json', data)

        # Ensure that the open and write functions were called
        mock_open.assert_called_with('./file.json', 'w')
        mock_open.return_value.__enter__.return_value.write.assert_called_with(json.dumps(data, indent=4))

if __name__ == '__main__':
    unittest.main()
