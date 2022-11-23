## Description

This is the repository for VNP backend.

## Installation

```bash
npm install
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout vn-backend.key -out vn-backend.crt
chmod +r vn-backend.key
chmod +r vn-backend.crt
cp .env.example .env
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

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Auth

Authorization is done with cookies and users are stored in sessions. Not production-ready and will at least be migrated to another session storage.
For now JWT don't make much sense, but when I add claim-based auth they will and then will be added.
