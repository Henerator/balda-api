FROM node:20-alpine AS build

LABEL org.opencontainers.image.source=https://github.com/Henerator/balda-api
LABEL org.opencontainers.image.description="balda-api"
LABEL org.opencontainers.image.licenses=MIT

WORKDIR /app

# add package json only. to cache the layer
COPY package*.json ./

# install dependencies
RUN npm ci

# copy all other files
COPY . .

# build the app
RUN npm run build && npm prune --production

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/dist/ /app/dist/
COPY --from=build /app/node_modules/ /app/node_modules/

# run
CMD ["node", "dist/main.js"]
