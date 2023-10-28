from fastapi import APIRouter
import logging
from pydantic import BaseModel  # リクエストbodyを定義するために必要


router = APIRouter()
logger = logging.getLogger("uvicorn")
logger.level = logging.DEBUG

from user_repo import UserRepository

import json

db = UserRepository()

# {
#  group_id:
#  user_name:
# attr: [
#   {
#      “key”: str
#      “value”: True/False
#   },
# ],
# dates:[
# {
#  “date”: str
#  “from”: str
#  “to”: str
# }
# ]
# }

class User(BaseModel):
    name: str
    group_id: str

@ router.post("/users")
def add_users(user: User):
    logger.info(f"Receive user: {user}")
    id = db.add_user(user.name, user.group_id)
    return {"message": f"user received: {user}: {id}"}
