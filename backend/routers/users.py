from fastapi import APIRouter
import logging
from pydantic import BaseModel  # リクエストbodyを定義するために必要


router = APIRouter()
logger = logging.getLogger("uvicorn")
logger.level = logging.DEBUG

from user_repo import UserRepository

import json

db = UserRepository()

class Attr(BaseModel):
    attr_id: int
    value: bool

class Date(BaseModel):
    date: str
    time_from: str
    time_to: str

class User(BaseModel):
    name: str
    group_id: str
    attrs: list[Attr]
    dates: list[Date]

@ router.post("/users")
def add_users(user: User):
    logger.info(f"Receive user: {user}")
    id = db.add_user(user.name, user.group_id)
    if id is None:
        return {"message": "error"}
    for attr in user.attrs:
        db.add_user_attributes(id, attr.attr_id, attr.value)
    for date in user.dates:
        db.add_user_dates(id, date.date, date.time_from, date.time_to)
    return {"message": f"user received: {user}: {id}"}
