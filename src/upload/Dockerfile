FROM node:13

WORKDIR /app

ENV REMOTE_URL "http://localhost:8080/db"

EXPOSE 3000

COPY package.json ./

RUN yarn install

COPY . ./

CMD [ "node", "-r", "esm", "src/upload" ]

