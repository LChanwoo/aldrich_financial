FROM node:18 AS development


RUN mkdir -p /usr/src/app/

WORKDIR /usr/src/app

COPY package*.json ./

COPY . /usr/src/app

RUN yarn install

RUN npm install --unsafe-perm

RUN npm run build

FROM node:18-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

COPY . /usr/src/app

RUN npm install 

VOLUME /var/log/nestjs


EXPOSE 4100:4100


COPY --from=development /usr/src/app/.next ./.next

CMD ["node", ".next/production-server/src/main.js"]
