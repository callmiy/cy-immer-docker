FROM node:14.9-buster-slim AS dev

ARG NODE_ENV

ENV BUILD_DEPS="build-essential" \
  APP_DEPS="curl iputils-ping" \
  NODE_ENV=$NODE_ENV \
  IMMER_CY_APP_NAME="be"

ADD \
  https://raw.githubusercontent.com/humpangle/wait-until/v0.1.1/wait-until \
  /usr/local/bin

COPY \
  ./entrypoint.sh \
  /usr/local/bin

RUN \
  chmod 755 /usr/local/bin/wait-until && \
  chmod 755 /usr/local/bin/entrypoint.sh && \
  mkdir -p /app/_shared &&  \
  mkdir -p /app/packages/shared &&  \
  mkdir -p /app/packages/be && \
  chown -R node:node /app && \
  apt-get update && \
  apt-get install -y --no-install-recommends ${BUILD_DEPS} &&  \
  [ "$NODE_ENV" != "production" ] &&  \
    apt-get install -y --no-install-recommends ${APP_DEPS} &&  \
  rm -rf /var/lib/apt/lists/* &&  \
  rm -rf /usr/share/doc && rm -rf /usr/share/man &&  \
  apt-get purge -y --auto-remove ${BUILD_DEPS} &&  \
  apt-get clean

USER node

WORKDIR /app

######### ROOT FILES ##########
COPY  \
  --chown=node:node \
  ./package-scripts.js \
  ./package.json \
  ./yarn.lock \
  ./.yarnrc \
  ./babel.config.js \
  ./

########## SHARED FOLDER ##########
COPY  \
  --chown=node:node \
  ./_shared \
  ./_shared/

######## PACKAGES/SHARED ##########
COPY  \
  --chown=node:node \
  ./packages/shared \
  ./packages/shared/
######## END PACKAGES/SHARED ########

######## CRA ##########
COPY  \
  --chown=node:node \
  ./packages/be \
  ./packages/be/
######## END CRA ########

RUN \
  yarn install --frozen-lockfile

CMD ["/bin/bash"]

############################### build stage ###############################

FROM dev as build

ENV NODE_ENV="production"

USER node

WORKDIR /app
# CMD ["/bin/bash"]

RUN yarn start be.b

############################### run stage ###############################

FROM node:14.9-buster-slim AS run

RUN  \
  # latest npm kept innstalling dev dependencies
  # npm install npm@latest -g && \
  mkdir -p /app && \
  chown -R node:node /app

ENV \
  NODE_ENV="production" \
  PORT=4000

USER node
WORKDIR /app

COPY \
  --from=build \
  --chown=node:node \
  /app/packages/be/package.json \
  .

RUN \
  npm install \
    --production

COPY \
  --from=build \
  --chown=node:node \
  /app/packages/be/build \
  .

EXPOSE 4000

CMD ["node", "./app.js"]
