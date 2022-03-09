FROM node:16 as base
WORKDIR /usr/src/app

COPY yarn.lock .
COPY tsconfig.json .
COPY package.json .
COPY src ./src

ENV MONGODB_URI $MONGODB_URI
ENV JWT_SECRET $JWT_SECRET

RUN yarn install --frozen-lockfile

CMD ["node", "dist/index.js"]
