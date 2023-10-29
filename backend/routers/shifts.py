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

@ router.post("/create_shifts/{group_id}")
def add_shifts(group_id: str):
    logger.info(f"Receive shifts: {shifts}")
    shifts = []
    for shift in shifts.shifts:
        user_id = db.get_user_id_by_name(shift.user_name, shifts.group_id)
        if user_id is None:
            return {"message": "error"}
        for date in shift.date:
            db.add_shift(shifts.group_id, user_id, date.time_from, date.time_to)
    return {"message": f"shifts received: {shifts}"}
