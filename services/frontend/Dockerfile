FROM node:lts as builder
WORKDIR /storedog-app
COPY . .
EXPOSE 3000
RUN ["yarn","install"]