from fastapi import APIRouter
import logging



router = APIRouter()
logger = logging.getLogger("uvicorn")
logger.level = logging.DEBUG

from db_admin import Attr, Preference, DateDetails, Date, Event, AdminRepository

import json

db = AdminRepository()

@ router.post("/events")
def add_events(event: Event):
    # logger.info(f"Receive event: {event}")
    group_id = None
    group_id = db.add_event(event.group_id, event.name)
    logger.debug(f"{group_id}")
    if group_id is None:
        return {"message": "error"}
    for date in event.dates:
        date_id = db.add_date(group_id, date.date, date.time_from, date.time_to, date.max_people, date.min_people)
        for attr in date.attrs:
            pass
            db.add_attribute(date_id, attr.name, attr.max_people, attr.min_people)
        for pref in date.preferences:
            pass
            # db.add_event_preferences(id, pref.target, pref.value)
    return {"message": f"event received: {event}: {group_id}"}

@ router.get("/dates/{group_id}")
def get_dates(group_id: str):
    logger.info(f"Receive group_id: {group_id}")
    dates = []
    dates = db.get_dates(group_id)
    return {"dates": dates}

@ router.get("/attrs/{group_id}")
def get_attrs(group_id: str):
    logger.info(f"Receive group_id: {group_id}")
    attrs = db.get_attrs(group_id)
    return {"attrs": attrs}
