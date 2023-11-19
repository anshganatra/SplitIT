# Currency Updater

## Overview
The `update_currencies` module provides functionality to update currency values in a JSON file based on the latest exchange rates. It utilizes the `currencyapicom` library to interact with a currency API.

## Code Location
The code implementing this currency update feature can be found [here](path_to_update_currencies.py).

## Code Description

### Functions

#### 1. `update_json_file(file_path, data)`
   - Updates a JSON file with the provided data.
   - Arguments:
     - `file_path` (str): Path to the JSON file to be updated.
     - `data` (dict): Data to be written to the JSON file.

#### 2. `update_currencies(json_file_path, json_data, new_date)`
   - Updates currency values in a JSON file based on the latest exchange rates.
   - Arguments:
     - `json_file_path` (str): Path to the JSON file containing currency data.
     - `json_data` (dict): Current currency data stored in the JSON file.
     - `new_date` (str): Date for which to fetch the latest exchange rates.
   - Returns:
     - `dict`: Updated currency data after fetching the latest values.

### Dependencies
- `json`: Standard Python library for JSON handling.
- `currencyapicom`: External library for interacting with a currency API.

### How to Run
1. Ensure the `currencyapicom` library is installed (`pip install currencyapicom`).
2. Execute the script with appropriate arguments or integrate it into your project.
3. The function fetches the latest exchange rates for supported currencies and updates the JSON file.

### Example
```python
import json
import currencyapicom

# Sample usage
json_file_path = 'path/to/currency_data.json'
json_data = {
    "meta": {"last_updated_at": "2022-01-01"},
    "data": {
        "USD": {"value": 1.0},
        "EUR": {"value": 0.85},
        # ... other currencies
    }
}
new_date = "2023-11-15"

updated_data = update_currencies(json_file_path, json_data, new_date)
print("Updated Currency Values:", updated_data)
