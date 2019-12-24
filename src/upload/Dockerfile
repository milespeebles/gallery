FROM node:13

WORKDIR /app

COPY . ./

ENV REMOTE_URL "http://localhost:8080/db"

RUN yarn install

EXPOSE 3000

CMD [ "node", "-r", "esm", "src/upload" ]
