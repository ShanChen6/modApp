
FROM node:16-alpine

RUN apk --no-cache add git g++ make py3-pip

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package.json ./

USER node

RUN npm install --omit=dev

COPY --chown=node:node . .

EXPOSE 4000

CMD ["npm", "run", "start"]