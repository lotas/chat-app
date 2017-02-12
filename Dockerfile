FROM node:slim

RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY . /opt/app
RUN npm install
ENV PORT 1337
EXPOSE 1337

CMD ["npm", "start"]


