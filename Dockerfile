FROM node:8-alpine
RUN mkdir -p /usr/src/new
WORKDIR /usr/src/new
COPY . .
RUN npm install
EXPOSE 3054
CMD [ "node", "index.js" ]
