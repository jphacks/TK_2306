FROM alpine

WORKDIR /app

COPY db/items.sql db/items.sql
COPY backend backend


RUN apk --update-cache add \
    python3 \
    python3-dev \
    py3-pip \
		sqlite

RUN cat /app/db/items.sql | sqlite3 /app/db/db.sqlite3


RUN pip install --upgrade pip
RUN pip install -r /app/backend/requirements.txt


WORKDIR /app/backend

CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0",  "--port", "9000"]

