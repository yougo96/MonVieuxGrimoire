FROM node:18
RUN mkdir /app
WORKDIR /app
COPY . ./app
COPY package*.json ./
RUN npm i
EXPOSE 3000
CMD [ "npm", "run", "start" ]