import logging
import sqlite3

from typing import Optional
from pydantic import BaseModel  # リクエストbodyを定義するために必要

logger = logging.getLogger("uvicorn")
logger.level = logging.DEBUG

db_path = "../db/db.sqlite"

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

class AdminRepository:
    def get_group_id_by_name(self, name) -> Optional[int]:
        try:
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """SELECT group_id from events where name = ?""", (name,))
            res = cur.fetchall()
            con.close()
            if len(res) > 0:
                return res[0][0]
            else:
                return None
        except sqlite3.Error as err:
            logger.debug(err)
            return None
        
    def add_event(self, id, name):
        try:
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """INSERT INTO events (group_id, name) VALUES(?, ?)""", (id, name,))
            res = id
            con.commit()
            con.close()
            return res

        except sqlite3.Error as err:
            logger.debug(err)
            return None
        
    def get_dates(self, group_id) -> list[Date]:
        try:
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """SELECT date, time_from, time_to, max_people, min_people from event_dates where group_id = ?""", (group_id,))
            res = cur.fetchall()
            con.close()
            dates = []
            for i in range(len(res)):
                res_date, res_time_from, res_time_to, _, _ = res[i]
                date = Date(date=res_date, time_from=res_time_from, time_to=res_time_to)
                dates.append(date)
            return dates
        except sqlite3.Error as err:
            logger.debug(err)
            return []

    def get_date_ids(self, group_id) -> list[(int, str, str, str)]:
        try:
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """SELECT id, date, time_from, time_to from event_dates where group_id = ?""", (group_id,))
            res = cur.fetchall()
            con.close()
            return res
        except sqlite3.Error as err:
            logger.debug(err)
            return []
        
    def get_date_details(self, group_id) -> list[DateDetails]:
        try:
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """SELECT date, time_from, time_to, max_people, min_people from event_dates where group_id = ?""", (group_id,))
            res = cur.fetchall()
            con.close()
            dates = []
            for i in range(len(res)):
                res_date, res_time_from, res_time_to, max_people, min_people = res[i]
                date = DateDetails(date=res_date, time_from=res_time_from, time_to=res_time_to, max_people=max_people, min_people=min_people, attrs=[], preferences=[])
                dates.append(date)
            return dates
        except sqlite3.Error as err:
            logger.debug(err)
            return []
        
    def add_date(self, group_id, date, time_from, time_to, max_people, min_people):
        try:
            # group_id = self.get_group_id_by_name(event_name)
            if not group_id:
                logger.debug("err")
                return {}
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """INSERT INTO event_dates (group_id, date, time_from, time_to, max_people, min_people)
                   VALUES(?,?,?,?,?,?)""",
                (group_id, date, time_from, time_to, max_people, min_people,))
            
            res = cur.lastrowid
            logger.debug(f"{res}")
            con.commit()
            con.close()
            return res
        except sqlite3.Error as err:
            logger.debug(err)
            return {}
        
    def add_attribute(self, date_id, attr_name, max_people, min_people):
        try:
            # group_id = self.get_group_id_by_name(event_name)
            # if not group_id:
            #     logger.debug("err")
            #     return {}
            # date_id = self.get_date_id_by_group_id(group_id)
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """INSERT INTO event_attributes (date_id, name, max_people, min_people)
                   VALUES(?,?,?,?)""",
                (date_id, attr_name, max_people, min_people,))
            res = cur.lastrowid
            con.commit()
            con.close()
            return res
        except sqlite3.Error as err:
            logger.debug(err)
            return {}
        
    def get_attrs(self, group_id) -> list[dict]:
        try:
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """SELECT id from event_dates where group_id = ?""", (group_id,))
            date_ids = cur.fetchall()
            con.close()

            attrs = []

            for i in range(len(date_ids)):
                date_id, = date_ids[i]
                con = sqlite3.connect(db_path)
                cur = con.cursor()
                cur.execute(
                    """SELECT id, name from event_attributes where date_id = ?""", (date_id,))
                res = cur.fetchall()
                con.close()
                for j in range(len(res)):
                    res_attr_id, res_sttr_name = res[j]
                    attrs.append({"id": res_attr_id, "name": res_sttr_name})
            # logger.debug(f"{attrs}")
            return attrs
        except sqlite3.Error as err:
            logger.debug(err)
            return []
    
    def get_attr_details(self, group_id: str) -> list[(int, int, int, int)]:
        try:
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """SELECT id, date_id, max_people, min_people from event_attributes where date_id in (select id from event_dates where group_id = ?)""", (group_id,))
            res = cur.fetchall()
            con.close()
            return res 
        except sqlite3.Error as err: 
            logger.debug(err)
            return []


# class SqliteEventsRepository:
#     def get_id_by_name(self, name) -> OptionalInt:
#         try:
#             con = sqlite3.connect(db_path)
#             cur = con.cursor()
#             cur.execute(
#                 """SELECT id from events where name = ?""", (name,))
#             res = cur.fetchall()
#             con.close()
#             if len(res) > 0:
#                 return res[0][0]
#             else:
#                 return None
#         except sqlite3.Error as err:
#             logger.debug(err)
#             return None

#     def add_event(self, id, name) -> OptionalInt:
#         try:
#             con = sqlite3.connect(db_path)
#             cur = con.cursor()
#             cur.execute(
#                 """INSERT INTO categories (id, name) VALUES(?, ?)""", (id, name,))
#             res = id
#             con.commit()
#             con.close()
#             return res

#         except sqlite3.Error as err:
#             logger.debug(err)
#             return None


# class SqliteEventDatesRepository:
#     def __init__(self):
#         pass

#     # def __convert_date_list_to_dict(self, list):
#     #     res = {"dates": []}
#     #     for (date, time_from, time_to, min_people, max_people, attr) in list:
#     #         res["dates"].append(
#     #             {"date"      : date, 
#     #              "from"      : time_from, 
#     #              "to"        : time_to,
#     #              "min_people": min_people, 
#     #              "max_people": max_people, 
#     #              "attr"      : attr})
#     #     return res

#     # def get_items(self) -> dict:
#     #     try:
#     #         con = sqlite3.connect(db_path)
#     #         cur = con.cursor()
#     #         cur.execute(
#     #             """SELECT items.id, categories.name, items.name, items.image_name FROM items
#     #             JOIN categories ON items.category_id = categories.id;""")
#     #         res = self.__convert_item_list_to_dict(cur.fetchall())
#     #         con.close()
#     #         return res
#     #     except sqlite3.Error as err:
#     #         logger.debug(err)
#     #         return {}

#     # def get_item_by_id(self, id) -> dict:
#     #     try:
#     #         con = sqlite3.connect(db_path)
#     #         cur = con.cursor()
#     #         cur.execute(
#     #             """SELECT items.id, categories.name, items.name, items.image_name FROM items
#     #                 JOIN categories ON items.category_id = categories.id WHERE items.id = ?;""", id)
#     #         res = self.__convert_item_list_to_dict(cur.fetchall())
#     #         con.close()
#     #         return res
#     #     except sqlite3.Error as err:
#     #         logger.debug(err)
#     #         return {}
        
#     def get_date_id_by_group_id(self, group_id) -> OptionalInt:
#         try:
#             con = sqlite3.connect(db_path)
#             cur = con.cursor()
#             cur.execute(
#                 """SELECT id from event_dates where group_id = ?""", (group_id,))
#             res = cur.fetchall()
#             con.close()
#             if len(res) > 0:
#                 return res[0][0]
#             else:
#                 return None
#         except sqlite3.Error as err:
#             logger.debug(err)
#             return None

#     def add_date(self, event_name, date, time_from, time_to, max_people, min_people):
#         try:
#             events_repo = SqliteEventDatesRepository()
#             group_id = events_repo.get_id_by_name(event_name)
#             if not group_id:
#                 logger.debug("err")
#                 return {}
#             con = sqlite3.connect(db_path)
#             cur = con.cursor()
#             cur.execute(
#                 """INSERT INTO event_dates (group_id, date, time_from, time_to, max_poeple, min_people)
#                    VALUES(?,?,?,?,?,?) RETURNING id;""",
#                 (group_id, date, time_from, time_to, max_people, min_people))
#             res = cur.fetchall()[0][0]
#             con.commit()
#             con.close()
#             return res
#         except sqlite3.Error as err:
#             logger.debug(err)
#             return {}

#     # def search_items_by_name(self, keyword):
#     #     try:
#     #         con = sqlite3.connect(db_path)
#     #         cur = con.cursor()
#     #         cur.execute(
#     #             """SELECT items.id, categories.name, items.name, items.image_name FROM items
#     #                 JOIN categories ON items.category_id = categories.id
#     #                 WHERE items.name LIKE ?""", (f'%{keyword}%',))
#     #         res = self.__convert_item_list_to_dict(cur.fetchall())
#     #         con.close()
#     #         return res
#     #     except sqlite3.Error as err:
#     #         logger.debug(err)
#     #         return {}

# class SqliteEventAttributesRepository:
#     def __init__(self):
#         pass

#     # def __convert__list_to_dict(self, list):
#     #     res = {"dates": []}
#     #     for (date, time_from, time_to, min_people, max_people, attr) in list:
#     #         res["dates"].append(
#     #             {"date"      : date, 
#     #              "from"      : time_from, 
#     #              "to"        : time_to,
#     #              "min_people": min_people, 
#     #              "max_people": max_people, 
#     #              "attr"      : attr})
#     #     return res

#     # def get_items(self) -> dict:
#     #     try:
#     #         con = sqlite3.connect(db_path)
#     #         cur = con.cursor()
#     #         cur.execute(
#     #             """SELECT items.id, categories.name, items.name, items.image_name FROM items
#     #             JOIN categories ON items.category_id = categories.id;""")
#     #         res = self.__convert_item_list_to_dict(cur.fetchall())
#     #         con.close()
#     #         return res
#     #     except sqlite3.Error as err:
#     #         logger.debug(err)
#     #         return {}

#     # def get_item_by_id(self, id) -> dict:
#     #     try:
#     #         con = sqlite3.connect(db_path)
#     #         cur = con.cursor()
#     #         cur.execute(
#     #             """SELECT items.id, categories.name, items.name, items.image_name FROM items
#     #                 JOIN categories ON items.category_id = categories.id WHERE items.id = ?;""", id)
#     #         res = self.__convert_item_list_to_dict(cur.fetchall())
#     #         con.close()
#     #         return res
#     #     except sqlite3.Error as err:
#     #         logger.debug(err)
#     #         return {}

#     def add_attribute(self, event_name, max_people, min_people):
#         try:
#             events_repo = SqliteEventDatesRepository()
#             event_dates_repo = SqliteEventDatesRepository()
#             group_id = events_repo.get_id_by_name(event_name)
#             if not group_id:
#                 logger.debug("err")
#                 return {}
#             date_id = event_dates_repo.get_date_id_by_group_id(group_id)
#             con = sqlite3.connect(db_path)
#             cur = con.cursor()
#             cur.execute(
#                 """INSERT INTO event_attributes (date_id, max_poeple, min_people)
#                    VALUES(?,?,?) RETURNING id;""",
#                 (group_id, max_people, min_people))
#             res = cur.fetchall()[0][0]
#             con.commit()
#             con.close()
#             return res
#         except sqlite3.Error as err:
#             logger.debug(err)
#             return {}

#     # def search_items_by_name(self, keyword):
#     #     try:
#     #         con = sqlite3.connect(db_path)
#     #         cur = con.cursor()
#     #         cur.execute(
#     #             """SELECT items.id, categories.name, items.name, items.image_name FROM items
#     #                 JOIN categories ON items.category_id = categories.id
#     #                 WHERE items.name LIKE ?""", (f'%{keyword}%',))
#     #         res = self.__convert_item_list_to_dict(cur.fetchall())
#     #         con.close()
#     #         return res
#     #     except sqlite3.Error as err:
#     #         logger.debug(err)
#     #         return {}
