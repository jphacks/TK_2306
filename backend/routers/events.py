from fastapi import APIRouter
import logging
from pydantic import BaseModel  # リクエストbodyを定義するために必要


router = APIRouter()
logger = logging.getLogger("uvicorn")
logger.level = logging.DEBUG

from db_admin import AdminRepository

import json

db = AdminRepository()

class Attr(BaseModel):
    name: str
    max_people: int
    min_people: int

class Preference(BaseModel):
    target: str
    value: str

class DateDetails(BaseModel):
    date: str
    time_from: str
    time_to: str
    max_people: int
    min_people: int
    attrs: list[Attr]
    preferences: list[Preference]

class Date(BaseModel):
    date: str
    time_from: str
    time_to: str

class Event(BaseModel):
    name: str
    group_id: str
    dates: list[DateDetails]

@ router.post("/events")
def add_events(event: Event):
    # logger.info(f"Receive event: {event}")
    id = None
    id = db.add_event(event.name, event.group_id)
    if id is None:
        return {"message": "error"}
    for date in event.dates:
        db.add_date(id, date.date, date.time_from, date.time_to, date.max_people, date.min_people)
        for attr in date.attrs:
            pass
            db.add_attribute(id, attr.name, attr.max_people, attr.min_people)
        for pref in date.preferences:
            pass
            # db.add_event_preferences(id, pref.target, pref.value)
    return {"message": f"event received: {event}: {id}"}

@ router.get("/dates/{group_id}")
def get_dates(group_id: str) -> list[Date]:
    logger.info(f"Receive group_id: {group_id}")
    events = None
    # events = db.get_events(group_id)
    if events is None:
        return {"message": "error"}
    return {"dates": events}

@ router.get("/attrs/{group_id}")
def get_dates(group_id: str) -> list[str]:
    logger.info(f"Receive group_id: {group_id}")
    events = None
    # events = db.get_events(group_id)
    if events is None:
        return {"message": "error"}
    return {"attrs": events}
