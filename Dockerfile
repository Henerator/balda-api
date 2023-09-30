FROM node:21-alpine

LABEL org.opencontainers.image.source=https://github.com/Henerator/balda-api
LABEL org.opencontainers.image.description="balda-api"
LABEL org.opencontainers.image.licenses=MIT

WORKDIR /app

# add package json only. to cache the layer
ADD package.json package.json

# install dependencies
RUN npm install

# add all other files
ADD . .

# build the app
RUN npm run build

# clean dev dependencies
RUN npm prune --production

# run
CMD ["node", "./dist/main.js"]
