import logging
import sqlite3
from abc import ABCMeta, abstractmethod

from pydantic.types import OptionalInt

logger = logging.getLogger("uvicorn")
logger.level = logging.DEBUG

db_path = "../db/db.sqlite3"


class CategoriesRepository(metaclass=ABCMeta):
    @abstractmethod
    def get_id_by_name(self, name) -> OptionalInt:
        pass

    @abstractmethod
    def add_category(self, name) -> OptionalInt:
        pass


class ItemsRepository(metaclass=ABCMeta):
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


class SqliteCategoriesRepository(CategoriesRepository):
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

    def add_category(self, name) -> OptionalInt:
        try:
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """INSERT INTO categories (name) VALUES(?) RETURNING id;""", (name,))
            res = cur.fetchall()[0][0]
            con.commit()
            con.close()
            return res

        except sqlite3.Error as err:
            logger.debug(err)
            return None


class SqliteItemsRepository(ItemsRepository):
    def __init__(self):
        pass

    def __convert_item_list_to_dict(self, list):
        res = {"items": []}
        for (id, category, name, filename) in list:
            res["items"].append(
                {"id": id, "name": name, "category": category, "image_filename": filename})
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

    def add_items(self, name, category, filename):
        try:
            categories_repo = SqliteCategoriesRepository()
            category_id = categories_repo.get_id_by_name(category)
            if not category_id:
                category_id = categories_repo.add_category(category)
            if not category_id:
                logger.debug("err")
                return {}
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute(
                """INSERT INTO items (name, category_id, image_name) VALUES(?,?,?);""",
                (name, category_id, filename,))
            con.commit()
            con.close()
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
