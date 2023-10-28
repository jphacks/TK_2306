## SetUp
```
cd backend
pip install -r requirements.txt
```
## App立ち上げ
```
uvicorn main:app --reload --port 9000
```
## DB作成
```
cd db
cat items.sql | sqlite3  db.sqlite
```
