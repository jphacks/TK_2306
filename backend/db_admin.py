import logging
import sqlite3
from abc import ABCMeta, abstractmethod

from pydantic.types import OptionalInt

logger = logging.getLogger("uvicorn")
logger.level = logging.DEBUG

db_path = "../db/db.sqlite3"

class AdminRepository:
    def get_group_id_by_name(self, name) -> OptionalInt:
        try:
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """SELECT id from events where name = ?""", (name,))
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
        
    def get_date_id_by_group_id(self, group_id) -> OptionalInt:
        try:
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """SELECT id from event_dates where group_id = ?""", (group_id,))
            res = cur.fetchall()
            con.close()
            if len(res) > 0:
                return res[0][0]
            else:
                return None
        except sqlite3.Error as err:
            logger.debug(err)
            return None
        
    def add_date(self, event_name, date, time_from, time_to, max_people, min_people):
        try:
            group_id = self.get_group_id_by_name(event_name)
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
        
    def add_attribute(self, event_name, max_people, min_people):
        try:
            group_id = self.get_id_by_name(event_name)
            if not group_id:
                logger.debug("err")
                return {}
            date_id = self.get_date_id_by_group_id(group_id)
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """INSERT INTO event_attributes (date_id, max_poeple, min_people)
                   VALUES(?,?,?) RETERNING id;""",
                (date_id, max_people, min_people))
            res = cur.fetchall()[0][0]
            con.commit()
            con.close()
            return res
        except sqlite3.Error as err:
            logger.debug(err)
            return {}


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
#                    VALUES(?,?,?,?,?,?) RETERNING id;""",
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
#                    VALUES(?,?,?) RETERNING id;""",
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
