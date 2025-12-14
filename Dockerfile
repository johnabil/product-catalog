FROM node:22-alpine

RUN apk upgrade --no-cache

WORKDIR /src

COPY package.json .
RUN npm install

COPY . .


EXPOSE 8000

CMD ["npm", "start"]
