# ES-MAP

## Contents
1. [Installation](#instalation)
    - [Using NPM](#using-npm)
    - [Using Docker](#using-docker)



### Instalation

#### Using NPM

Clone repository:

```bash
git clone https://github.com/mixon00/es-map.git
```

Install dependencies:

```bash
npm install
```

Run development enviroment:

```bash
npm run dev
```

Build:

```bash
npm run build
```

#### Using Docker

Development:
```bash
docker-compose --profile dev up -d app-dev
```

Production:
```bash
docker-compose up -d
```