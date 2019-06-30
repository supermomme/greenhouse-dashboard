FROM node:10.9.0-alpine
ENV TZ=Europe/Berlin
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app
RUN apk update && apk add python make g++
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3030
CMD ["npm", "start"]
