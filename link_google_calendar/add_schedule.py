# before executing, just run `pip3 install google-api-python-client google-auth`!!

import datetime
from google.oauth2 import service_account
from googleapiclient.errors import HttpError
from googleapiclient.discovery import build

# Create a new schedule
    # |summary|    : the name of the event(string)
    # |start_time| : the starting time (formated type such as: datetime.datetime(2023, 10, 28, 9, 0, 0))
    # |end_time|   : the ending time (formated type such as: datetime.datetime(2023, 10, 28, 9, 0, 0))
    # |calendar_id|: user email address

def create_event(summary, start_time, end_time, calendar_id):
    creds = service_account.Credentials.from_service_account_file('jphack-tk-2306-100a02fa5204.json')
    service = build('calendar', 'v3', credentials=creds)
    event = {
        'summary': summary,
        'start': {
            'dateTime': start_time.strftime('%Y-%m-%dT%H:%M:%S'),
            'timeZone': 'Asia/Tokyo',
        },
        'end': {
            'dateTime': end_time.strftime('%Y-%m-%dT%H:%M:%S'),
            'timeZone': 'Asia/Tokyo',
        },
    }
    try:
        event = service.events().insert(calendarId=calendar_id, body=event).execute()
        print(f'Event created: {event.get("htmlLink")}')
    except HttpError as error:
        print(f'An error occurred: {error}')
        event = None
    return event