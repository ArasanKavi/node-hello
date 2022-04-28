FROM node:8-alpine
RUN mkdir -p /usr/src/new1
WORKDIR /usr/src/new1
COPY . .
RUN npm install
EXPOSE 3059
CMD [ "node", "index.js" ]
