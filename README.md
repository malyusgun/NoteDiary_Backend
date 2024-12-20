# NoteDiary_Backend

Этот репозиторий является бэкенд-частью приложения NoteDiary
с использованием Node.js, Express, Typescript, PostgresQL и Prisma. 
Кодовая база разделена на модули routes, 
controllers, services, interfaces (хранящим типы данных).

## Хранение данных

Некоторые типы данных хранятся в виде массивов строк с хешированием, а именно - разделением частей внутренних данных каким-то спецсимволами, например "$" или "($#$#$)". 
Ниже приведена таблица, иллюстрирующая соответствие полей данных и формата хеширования:

| Объект  |      Поле       |                         Формат хранения                          |
|:-------:|:---------------:|:----------------------------------------------------------------:|
|  Sheet  | sheet_entities  |                   [entity_type]$[entity_uuid]                    |
|  User   |           | [sheet_uuid]$[sheet_title]$[sheet_icon]$[sheet_children] |

### Настройка окружения

```sh
yarn
```

### Запуск дев-режима

```sh
yarn start
```

### Запуск в режиме production

```sh
yarn build
```