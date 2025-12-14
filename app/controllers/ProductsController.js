const app = require('express')();

async function search(Request, Response) {
  const meilisearchClient = Request.app.get('meiliSearchClient');

  if (!meilisearchClient) {
    return Response.json({});
  }

  const query = Request.query.query;
  const page = Number(Request.query.page) || 1;
  const perPage = Number(Request.query.perPage) || 20;
  const category = Request.query.category;
  const material = Request.query.material;
  const specification = Request.query.specification;
  const quantity = Request.query.quantity;
  let filters = '';
  if (category) filters += `product.categories = "${category}" OR `;
  if (material) filters += `attributes.Material = "${material}" OR `;
  if (specification) filters += `attributes.Specification = "${specification}" OR `;
  if (quantity) filters += `quantity = ${quantity}`;

  let results = await meilisearchClient.index('variants').search(query, {
    page: page,
    hitsPerPage: perPage,
    sort: ['quantity_sold:desc'],
    filter: filters
  });

  return Response.json({
    data: results.hits,
    metadata: {
      totalCount: results.totalHits,
      totalPages: results.totalPages,
      page: results.page,
      perPage: results.hitsPerPage
    }
  });
}

module.exports = {search};
