FROM node:16-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn build && yarn --production && yarn cache clean

CMD ["yarn", "start"]