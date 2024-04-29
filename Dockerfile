FROM node:latest

WORKDIR /logger 

COPY . .

EXPOSE 4000

RUN npm install 

CMD ["npm","run","dev"]

