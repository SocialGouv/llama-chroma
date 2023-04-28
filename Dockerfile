FROM node:16

WORKDIR /app

COPY package.json yarn.lock tsconfig.json /app/
COPY ./src /app/src

RUN mkdir dist

RUN yarn install --frozen-lockfile && yarn build && yarn --production && yarn cache clean

CMD ["yarn", "start"]