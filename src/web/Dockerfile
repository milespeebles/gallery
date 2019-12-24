FROM node:13

WORKDIR /app

EXPOSE 5000

COPY package.json ./

RUN yarn install

COPY . ./

CMD [ "yarn", "start" ]

