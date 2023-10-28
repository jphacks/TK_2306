import datetime
from google.oauth2 import service_account
from googleapiclient.errors import HttpError
from googleapiclient.discovery import build

# input example ("2023-08-01", "2023-08-03", "09:00", "18:00")

def get_free_time_list(start_date, end_date, start_time, end_time):
    start_formated_date = datetime.datetime(int(start_date[0:4]), int(start_date[5:7]), int(start_date[8:]))
    end_formated_date = datetime.datetime(int(end_date[0:4]), int(end_date[5:7]), int(end_date[8:]))
    day_delta = str(end_formated_date - start_formated_date)
    day_lapse = int(day_delta[0:2]) if day_delta[3] == 'd' else int(day_delta[0])

    free_time_list = []

    tmp_date = start_formated_date

    for i in range(day_lapse+1):
        free_time_list.append(get_free_time(tmp_date, start_time, end_time))
        tmp_date += datetime.timedelta(days=1)

def get_free_time(date, start_time, end_time, calendarId):
    creds = service_account.Credentials.from_service_account_file('jphack-tk-2306-100a02fa5204.json')
    service = build('calendar', 'v3', credentials=creds)
    day = {
        "00:00-00:29": 1,
        "00:30-00:59": 1,
        "01:00-01:29": 1,
        "01:30-01:59": 1,
        "02:00-02:29": 1,
        "03:00-03:29": 1,
        "03:30-03:59": 1,
        "04:00-04:29": 1,
        "04:30-04:59": 1,
        "05:00-05:29": 1,
        "05:30-05:59": 1,
        "06:00-06:29": 1,
        "06:30-06:59": 1,
        "07:00-07:29": 1,
        "07:30-07:59": 1,
        "08:00-08:29": 1,
        "08:30-08:59": 1,
        "09:00-09:29": 1,
        "09:30-09:59": 1,
        "10:00-10:29": 1,
        "10:30-10:59": 1,
        "11:00-11:29": 1,
        "11:30-11:59": 1,
        "12:00-12:29": 1,
        "12:30-12:59": 1,
        "13:00-13:29": 1,
        "13:30-13:59": 1,
        "14:00-14:29": 1,
        "14:30-14:59": 1,
        "15:00-15:29": 1,
        "15:30-15:59": 1,
        "16:00-16:29": 1,
        "16:30-16:59": 1,
        "17:00-17:29": 1,
        "17:30-17:59": 1,
        "18:00-18:29": 1,
        "18:30-18:59": 1,
        "19:00-19:29": 1,
        "19:30-19:59": 1,
        "20:00-20:29": 1,
        "20:30-20:59": 1,
        "21:00-21:29": 1,
        "21:30-21:59": 1,
        "22:00-22:29": 1,
        "22:30-22:59": 1,
        "23:00-23:29": 1,
        "23:30-23:59": 1
    }
    day_keys = list(day.keys())
    j = 0
    while day_keys[j][0:5] != start_time:
        day[day_keys[j]] = 0
        j += 1
    while day_keys[j][0:5] != end_time:
        j += 1
    while j < len(day):
        day[day_keys[j]] = 0
        j += 1

    page_token = None
    while True:
        events = service.events().list(calendarId=calendarId, pageToken=page_token).execute()
        for event in events['items']:
            if 'dateTime' in event['start'].keys():
                if event['start']['dateTime'][0:10] == str(date)[0:10]:
                    event_start_time = event['start']['dateTime'][11:16]
                    event_end_time = event['end']['dateTime'][11:16]

                    tmp_left_time = 0
                    if 0 <= int(event_start_time[3:]) and int(event_start_time[3:]) < 30:
                        tmp_left_time = int(event_start_time[0:2])
                    elif 30 <= int(event_start_time[3:]):
                        tmp_left_time = int(event_start_time[0:2]) + 0.5

                    tmp_right_time = 0
                    if 0 <= int(event_end_time[3:]) and int(event_end_time[3:]) <= 30:
                        tmp_right_time = int(event_end_time[0:2]) + 0.5
                    elif 30 < int(event_end_time[3:]) or int(event_end_time[3:]) == 60:
                        tmp_right_time = int(event_end_time[0:2]) + 1

                    while tmp_left_time < tmp_right_time:
                        updated_keys = [key for key in day.keys() if event_start_time in key]
                        for key in updated_keys:
                            day[key] = 0
                        tmp_left_time += 0.5
                        event_start_time = str(int(tmp_left_time)) + ':' + ("30" if (tmp_left_time - int(tmp_left_time) > 0) else "00")
            elif 'date' in event['start'].keys():
                if event['start']['date'][0:10] == str(date)[0:10]:
                    for key in day_keys:
                        day[key] = 0
        if not page_token:
            break