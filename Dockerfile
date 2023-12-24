FROM node:16-alpine

WORKDIR /app
COPY . .

RUN apk add --update bash && rm -rf /var/cache/apk/*
RUN npm install
RUN npm install -g serve
RUN npm run build

CMD chmod +x ./env.sh; sync; ./env.sh; sync; serve -l 5000 -s build 
EXPOSE 5000