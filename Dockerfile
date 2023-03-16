FROM node:16


COPY package*.json ./

RUN npm install
EXPOSE 8080
CMD ["node", "index.js"]
