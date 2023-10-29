FROM node:18.12-alpine

WORKDIR /app/

COPY ./package.json ./
COPY ./pages ./pages
COPY ./styles ./styles
COPY ./public ./public

RUN npm install

CMD ["npm", "run", "dev"]
