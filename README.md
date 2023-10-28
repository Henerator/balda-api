## Description

API for balda game

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Init mongo db

- mongo-init.sh

```shell
set -e

mongosh <<EOF
db = db.getSiblingDB('$MONGO_DB')

db.createUser({
  user: '$MONGO_USER',
  pwd: '$MONGO_PASSWORD',
  roles: [{ role: 'readWrite', db: '$MONGO_DB' }],
});
db.createCollection('words')

EOF
```

- docker-compose-mongo.yml

```shell
version: '3.8'
services:
  mongo:
    image: mongo
    container_name: balda-api-mongo
    hostname: mongo
    restart: always
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_INIT_USER}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_INIT_PASSWORD}
      - MONGO_DB=${MONGO_DB}
      - MONGO_USER=${MONGO_USER}
      - MONGO_PASSWORD=${MONGO_PASSWORD}
    ports:
      - 27017:27017
    volumes:
      - ./mongo-data:/data/db
      - ./mongo-init.sh:/docker-entrypoint-initdb.d/mongo-init.sh:ro
    command: --wiredTigerCacheSizeGB 1.5

```

### Notes

- hostname does not work for local run
- `dbName` option for MongooseModule does not work. Set db name in connection uri

### Start mongo in docker

- `docker compose -f .\docker-compose-mongo.yml up`

### Connect to db in docker terminal

- `mongosh --port 27017 --authenticationDatabase 'admin' -u 'admin' -p`
- `mongosh --port 27017 --authenticationDatabase 'balda' -u 'balda' -p`

## Authentication

### Generate password hash

```typescript
const salt = await genSalt(10);
const passwordHash = await hash(dto.password, salt);
```
