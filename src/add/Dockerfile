FROM node:13

WORKDIR /app

COPY . ./

RUN yarn install

EXPOSE 3000

CMD [ "node", "-r", "esm", "src/add" ]
