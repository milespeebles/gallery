FROM node:13

WORKDIR /app

COPY . ./

ENV REMOTE_URL "http://localhost:8080/db"

EXPOSE 3000

RUN yarn install

CMD [ "node", "-r", "esm", "src/upload" ]
