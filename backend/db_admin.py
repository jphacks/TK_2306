import logging
import sqlite3
from abc import ABCMeta, abstractmethod

from pydantic.types import OptionalInt

logger = logging.getLogger("uvicorn")
logger.level = logging.DEBUG

db_path = "../db/db.sqlite3"




class EventsRepository(metaclass=ABCMeta):
    @abstractmethod
    def get_id_by_name(self, name) -> OptionalInt:
        pass

    @abstractmethod
    def add_events(self, id, name) -> OptionalInt:
        pass


class EventDatesRepository(metaclass=ABCMeta):
    def __init__(self):
        pass

    @abstractmethod
    def get_items(self) -> dict:
        pass

    @abstractmethod
    def get_item_by_id(self, id) -> dict:
        pass

    @abstractmethod
    def add_items(self, name, category, filename) -> dict:
        pass

    @abstractmethod
    def search_items_by_name(self, name) -> dict:
        pass


class SqliteEventsRepository(EventsRepository):
    def get_id_by_name(self, name) -> OptionalInt:
        try:
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """SELECT id from categories where name = ?""", (name,))
            res = cur.fetchall()
            con.close()
            if len(res) > 0:
                return res[0][0]
            else:
                return None
        except sqlite3.Error as err:
            logger.debug(err)
            return None

    def add_event(self, id, name) -> OptionalInt:
        try:
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """INSERT INTO categories (id, name) VALUES(?, ?)""", (id, name,))
            res = id
            con.commit()
            con.close()
            return res

        except sqlite3.Error as err:
            logger.debug(err)
            return None


class SqliteEventDatesRepository(EventDatesRepository):
    def __init__(self):
        pass

    def __convert_date_list_to_dict(self, list):
        res = {"dates": []}
        for (date, time_from, time_to, min_people, max_people, attr) in list:
            res["dates"].append(
                {"date"      : date, 
                 "from"      : time_from, 
                 "to"        : time_to,
                 "min_people": min_people, 
                 "max_people": max_people, 
                 "attr"      : attr})
        return res

    def get_items(self) -> dict:
        try:
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """SELECT items.id, categories.name, items.name, items.image_name FROM items
                JOIN categories ON items.category_id = categories.id;""")
            res = self.__convert_item_list_to_dict(cur.fetchall())
            con.close()
            return res
        except sqlite3.Error as err:
            logger.debug(err)
            return {}

    def get_item_by_id(self, id) -> dict:
        try:
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """SELECT items.id, categories.name, items.name, items.image_name FROM items
                    JOIN categories ON items.category_id = categories.id WHERE items.id = ?;""", id)
            res = self.__convert_item_list_to_dict(cur.fetchall())
            con.close()
            return res
        except sqlite3.Error as err:
            logger.debug(err)
            return {}

    def add_event_date(self, event_name, date, time_from, time_to, max_people, min_people):
        try:
            events_repo = SqliteEventDatesRepository()
            group_id = events_repo.get_id_by_name(event_name)
            if not group_id:
                logger.debug("err")
                return {}
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """INSERT INTO event_dates (group_id, date, time_from, time_to, max_poeple, min_people)
                   VALUES(?,?,?,?,?,?) RETERNING id;""",
                (group_id, date, time_from, time_to, max_people, min_people))
            res = cur.fetchall()[0][0]
            con.commit()
            con.close()
            return res
        except sqlite3.Error as err:
            logger.debug(err)
            return {}

    def search_items_by_name(self, keyword):
        try:
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """SELECT items.id, categories.name, items.name, items.image_name FROM items
                    JOIN categories ON items.category_id = categories.id
                    WHERE items.name LIKE ?""", (f'%{keyword}%',))
            res = self.__convert_item_list_to_dict(cur.fetchall())
            con.close()
            return res
        except sqlite3.Error as err:
            logger.debug(err)
            return {}
