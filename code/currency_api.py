import json
import currencyapicom


def update_json_file(file_path, data):
    data = json.dumps(data, indent=4)
    with open(file_path, 'w') as json_file:
        json_file.write(data)


def update_currencies(json_file_path, json_data, new_date):
    supported_currencies = ['USD','EUR','JPY','GBP','AUD','CAD','CHF','HKD','NZD','SEK','KRW','NOK','INR','MXN','TWD','ZAR','BRL','DKK','PLN']

    client = currencyapicom.Client('cur_live_SK4mbEd6jq9PhfhQ9JbYxvky4nTOkVQcn1pGi00c')
    new_json_data = json_data
    result = client.historical(new_date)

    new_json_data["meta"]["last_updated_at"] = result["meta"]["last_updated_at"]

    for curr in result["data"]:
        if curr in supported_currencies:
            new_json_data["data"][curr] = result["data"][curr]

    data_to_update = new_json_data
    update_json_file(json_file_path, data_to_update)
    print("New Currency Values Fetched")
    return data_to_update
