# Product Catalog Service

This service provides a Restful API for search along product variant
attributes and free text search products and its variants.

## Dependencies

- Node.js v22.15
- Meilisearch: For full-text search and product variant attribute search.
- Postgresql: For storing all the data.
- Rabbitmq: For event processing.
- Docker: For running the project.

## API Documentation

``GET: /api/catalog/search``

### Query Parameters

- query (string): Free text search query.
- category (string): filter by product's category.
- material (string): filter by variant material.
- specifications (string): filter by variant specification.
- quantity (number): filter by variant quantity.
- page (number): page number (1 by default).
- perPage (number): number of items per page (20 by default).

## Running the project

- Make sure you have docker installed. And ``.env`` file exists,
  check [Env example](./.env.example) for more details.
- The default port is 8000 unless changed.

### Running with Docker:

``docker compose up --build``

``docker exec -it <container id or name> sh``

Then:
These commands must be run in the container.

``npx sequelize-cli db:migrate``

``npx sequelize-cli db:seed:all``

### Running without Docker:

First,

``npm install``

Then:

``npm start``

``npx sequelize-cli db:migrate``

``npx sequelize-cli db:seed:all``

**Note: There might be some error with unique values in categories
table or user emails due to using random faker package,
So you can run** ``sequelize-cli db:seed:undo:all``
**then run seeders again**

