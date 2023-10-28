import logging
import sqlite3
from abc import ABCMeta, abstractmethod

from pydantic.types import OptionalInt

logger = logging.getLogger("uvicorn")
logger.level = logging.DEBUG

db_path = "../db/db.sqlite"

class UserRepository:
    def add_user(self, name, group_id):
        try:
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """INSERT INTO users(user_name, group_id) VALUES (?, ?) RETURNING id;""", (name, group_id))
            res = cur.fetchall()[0][0]
            con.commit()
            con.close()
            return res
        except sqlite3.Error as err:
            logger.debug(err)
            return None

    def add_user_attributes(self, user_id, attr_id, value):
        try:
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """INSERT INTO user_attributes(user_id, attr_id, value) VALUES (?, ?, ?)""", (user_id, attr_id, value))
            con.commit()
            con.close()
            return True
        except sqlite3.Error as err:
            logger.debug(err)
            return False

    def add_user_dates(self, user_id, time_from, time_to):
        try:
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """INSERT INTO user_dates(user_id, time_from, time_to) VALUES (?, ?, ?)""", (user_id, time_from, time_to))
            con.commit()
            con.close()
            return True
        except sqlite3.Error as err:
            logger.debug(err)
            return False