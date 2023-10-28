import logging
import sqlite3
from abc import ABCMeta, abstractmethod

from pydantic.types import OptionalInt

logger = logging.getLogger("uvicorn")
logger.level = logging.DEBUG

db_path = "../db/db.sqlite"

class ShiftRepository:
    def add_shift(self, group_id, user_id, time_from, time_to):
        try:
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """INSERT INTO shift(group_id, user_id, time_from, time_to) VALUES (?, ?, ?, ?)""", (group_id, user_id, time_from, time_to))
            con.commit()
            con.close()
            return True
        except sqlite3.Error as err:
            logger.debug(err)
            return False

    def get_shifts(self, group_id):
        try:
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """SELECT * from shift where group_id = ?""", (group_id,))
            res = cur.fetchall()
            con.close()
            return res
        except sqlite3.Error as err:
            logger.debug(err)
            return None

    def get_shifts_by_user_id(self, user_id):
        try:
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """SELECT * from shift where user_id = ?""", (user_id,))
            res = cur.fetchall()
            con.close()
            return res
        except sqlite3.Error as err:
            logger.debug(err)
            return None