import logging
import sqlite3

from typing import Optional

logger = logging.getLogger("uvicorn")
logger.level = logging.DEBUG

db_path = "../db/db.sqlite"

class UserRepository:
    def add_user(self, name: str, group_id: str) -> Optional[int]:
        try:
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """INSERT INTO users(user_name, group_id) VALUES (?, ?);""", (name, group_id))
            res = cur.lastrowid
            con.commit()
            con.close()
            return res
        except sqlite3.Error as err:
            logger.debug(err)
            return None

    def get_user_id_by_name(self, name: str, group_id: str) -> Optional[int]:
        try:
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """SELECT id from users where user_name = ? and group_id = ?""", (name, group_id))
            res = cur.fetchall()
            con.close()
            if len(res) > 0:
                return res[0][0]
            else:
                return None
        except sqlite3.Error as err:
            logger.debug(err)
            return None

    def add_user_attributes(self, user_id:int, attr_id: int, value: bool) -> bool:
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

    def add_user_dates(self, user_id: int, date: str, time_from: str, time_to:str) -> bool:
        try:
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """INSERT INTO user_dates(user_id, date, time_from, time_to) VALUES (?, ?, ?, ?)""", (user_id, date, time_from, time_to))
            con.commit()
            con.close()
            return True
        except sqlite3.Error as err:
            logger.debug(err)
            return False