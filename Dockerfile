FROM node:11.8.0-alpine
LABEL maintainer="Senomas <agus@senomas.com>"

WORKDIR /home/node/app

COPY *.json yarn.lock *.yaml /home/node/app/
RUN yarn
COPY server.js /home/node/app/
COPY admin/dist /home/node/app/admin/dist

CMD [ "node", "server.js" ]
