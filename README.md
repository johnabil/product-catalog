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
- category (string): filter by products category.
- material (string): filter by variant material.
- specifications (string): filter by variant specification.
- quantity (number): filter by variant quantity.
- page (number): page number.
- perPage (number): number of items per page.

## Running the project

First run:

``docker compose up --build``
``docker exec -it <container id or name> sh``

Then:

``npx sequelize-cli db:migrate``
``npx sequelize-cli db:seed:all``

**Note: There might be some error with unique values in categories
table or user emails, so you can run** ``sequelize-cli db:seed:undo:all``
**then run seeders again**

