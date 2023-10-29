from fastapi import APIRouter
import logging
from pydantic import BaseModel  # リクエストbodyを定義するために必要


router = APIRouter()
logger = logging.getLogger("uvicorn")
logger.level = logging.DEBUG

from shift_repo import ShiftRepository

import json

db = ShiftRepository()

class Date(BaseModel):
    date: str
    time_from: str
    time_to: str
    user_name: str

class Shift(BaseModel):
    group_id: str
    shifts: list[Date]


@ router.get("/shift/{group_id}")
def get_shifts(group_id: str) -> Shift:
    logger.info(f"Receive group_id: {group_id}")
    shifts = db.get_shifts(group_id)
    if shifts is None:
        return {"message": "error"}
    return {"shifts": shifts}

from solve import solve
from datetime import datetime

from db_admin import AdminRepository
db_event = AdminRepository()
from user_repo import UserRepository
db_user = UserRepository()

def _get_min_date_and_days(group_id: str) -> tuple[datetime, int]:
    dates = db_event.get_dates(group_id)
    if dates is None:
        return None
    dates = [datetime.strptime(date.date, "%Y/%m/%d") for date in dates]
    return (min(dates), len(set(dates)))

def _convert_time_to_id(time: str) -> int:
    str_list = time.split(":")
    return int(str_list[0]) * 2 + int(int(str_list[1]) / 30)

def _get_date_id(min_date: datetime, date: str) -> int:
    return (datetime.strptime(date, "%Y/%m/%d") - min_date).days

def _get_shift_requirements(group_id: str, days: int, min_date: datetime) -> list[list[tuple[int, int]]]:
    dates = db_event.get_date_details(group_id)
    shift_requirements = [[(0, 0) for _ in range(48)] for _ in range(days)]
    for date in dates:
        date_id = _get_date_id(min_date, date.date)
        time_from = _convert_time_to_id(date.time_from)
        time_to = _convert_time_to_id(date.time_to)
        for i in range(time_from, time_to + 1):
            shift_requirements[date_id][i] = (date.min_people, date.max_people)
    return shift_requirements

def _get_shift_preferences(group_id: str, users: list[int], min_date: datetime, days: int) -> list[list[list[tuple[int, int]]]]:
    user_dates = db_user.get_user_dates(group_id)
    shift_preferences = [[[] for _ in range(days)] for _ in range(len(users))]
    for user_date in user_dates:
        user_id, date, time_from, time_to = user_date
        user_id = users.index(user_id)
        date_id = _get_date_id(min_date, date)
        time_from = _convert_time_to_id(time_from)
        time_to = _convert_time_to_id(time_to)
        shift_preferences[user_id][date_id].append((time_from, time_to))
    return shift_preferences

def _get_workers_attributes(group_id: str, attrs: list[int], users: list[int]) -> list[list[int]]:
    user_attrs = db_user.get_user_attrs(group_id)
    workers_attributes = [[] for _ in range(len(users))]
    for user_attr in user_attrs:
        user_id = users.index(user_attr[0])
        attr_id = attrs.index(user_attr[1])
        attr_value = user_attr[2]
        if attr_value:
            workers_attributes[user_id].append(attr_id)
    return workers_attributes

def _get_min_time(group_id: str, users: list[int]) -> list[int]:
    user_dates = db_user.get_user_dates(group_id)
    min_time = [0 for _ in range(len(users))]
    for user_date in user_dates:
        user_id = users.index(user_date[0])
        min_time[user_id] += 1
    return min_time

def _get_contraints(group_id: str) -> list[tuple[list[int]]]:
    return []

def _get_user_ids(group_id: str) -> list[int]:
    users = db_user.get_user_ids(group_id)
    users = [user[0] for user in users]
    users.sort()
    return users

def _get_attr_ids(group_id: str) -> list[int]:
    attrs = db_event.get_attr_details(group_id)
    attrs = [attr[0] for attr in attrs]
    attrs.sort()
    return attrs

def _get_min_time(group_id: str, workers: int, days: int) -> list[int]:
    user_dates = db_user.get_user_dates(group_id)
    min_time = [[0 for _ in range(days)] for _ in range(workers)]
    return min_time

def _get_date_ids(group_id: str, min_date: datetime) -> {int: (int, int, int)}:
    dates = db_event.get_date_ids(group_id)
    date_ids = {}
    for date in dates:
        date_id = _get_date_id(min_date=min_date, date=date[1])
        time_from = _convert_time_to_id(date[2])
        time_to = _convert_time_to_id(date[3])
        date_ids[date[0]] = (date_id, time_from, time_to)
    return date_ids

def _get_attributes_requirements(group_id: str, attrs: list[int], date_ids: {int: (int, int, int)}, days: int) -> list[list[list[tuple[int, int]]]]:
    date_attrs = db_event.get_attr_details(group_id)
    attributes_requirements = [[[(0, 0) for _ in range(len(attrs))] for _ in range(48)] for _ in range(days)]
    for date_attr in date_attrs:
        date_id, attr_id, min_people, max_people = date_attr
        attr_id = attrs.index(attr_id)
        date_info = date_ids[date_id]
        for i in range(date_info[1], date_info[2] + 1):
            attributes_requirements[date_info[0]][i][attr_id] = (min_people, max_people)
    return attributes_requirements

@ router.post("/create_shifts/{group_id}") 
def add_shifts(group_id: str):
    users = _get_user_ids(group_id)
    min_date, days = _get_min_date_and_days(group_id)
    date_ids = _get_date_ids(group_id, min_date)
    attr_ids = _get_attr_ids(group_id)
    shift_preferences = _get_shift_preferences(group_id, users, min_date, days)
    shift_requirements = _get_shift_requirements(group_id, len(shift_preferences[0]), min_date)
    workers_attributes = _get_workers_attributes(group_id, attr_ids, users)
    constraints = _get_contraints(group_id)
    min_time = _get_min_time(group_id, workers=len(users), days=days)
    attribute_requirements = _get_attributes_requirements(group_id, attr_ids, date_ids, days)
    print((days, len(users), len(attr_ids), shift_preferences, shift_requirements, workers_attributes, attribute_requirements, min_time, constraints))
    shifts = solve((days, len(users), len(attr_ids), shift_preferences, shift_requirements, workers_attributes, attribute_requirements, min_time, constraints))
    logger.info(f"Receive shifts: {shifts}")
    for shift in shifts.shifts:
        user_id = db.get_user_id_by_name(shift.user_name, shifts.group_id)
        if user_id is None:
            return {"message": "error"}
        for date in shift.date:
            db.add_shift(shifts.group_id, user_id, date.time_from, date.time_to)
    return {"message": f"shifts received: {shifts}"}
