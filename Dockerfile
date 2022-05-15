FROM node:16

WORKDIR /express-file-upload-master

COPY package*.json ./

RUN npm install

RUN npm ci --only=production

COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]