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
## 使い方
```
curl http://localhost:9000
```
{"message":"Hello, world!"}
```
curl -X POST \
  --url 'http://localhost:9000/items' \
  -F 'name=jacket' \
  -F 'category=fashion' \
  -F 'image=@images/local_image.jpg'
```

## Docker
```
docker build . --file backend/Dockerfile
```
