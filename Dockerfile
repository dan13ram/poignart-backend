FROM node:16 as base
WORKDIR /usr/src/app

COPY yarn.lock .
COPY tsconfig.json .
COPY package.json .
COPY src ./src

ENV MONGODB_URI $MONGODB_URI
ENV JWT_SECRET $JWT_SECRET
ENV CRON_PRIVATE_KEY $CRON_PRIVATE_KEY
ENV POIGNART_CONTRACT $POIGNART_CONTRACT
ENV RPC_URL $RPC_URL

RUN yarn install --frozen-lockfile

CMD ["node", "dist/index.js"]
