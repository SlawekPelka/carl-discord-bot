FROM node:7
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD pm2 restart carl2