const app = require('express')();

async function search(Request, Response) {
  const meilisearchClient = Request.app.get('meiliSearchClient');

  if (!meilisearchClient) {
    return Response.json({});
  }

  const query = Request.query.query;
  const page = Number(Request.query.page) || 1;
  const perPage = Number(Request.query.perPage) || 20;
  let results = await meilisearchClient.index('variants').search(query, {
    page: page,
    hitsPerPage: perPage,
    sort: ['quantity_sold:desc'],
    filter: `product.categories = "${Request.query?.category}" 
    OR attributes.Material = "${Request.query?.material}" 
    OR attributes.Specification = "${Request.query?.specification}" 
    OR price = ${Request.query?.price} 
    OR quantity = ${Request.query?.quantity}`
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
