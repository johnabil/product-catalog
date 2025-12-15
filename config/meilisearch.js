const {Meilisearch} = require("meilisearch");
const meilisearch = new Meilisearch({
  host: process.env.MEILISEARCH_URL,
  apiKey: process.env.MEILISEARCH_KEY,
});

async function syncAttributes(index, sortableAttributes = [], rankingRules = [], filterableAttributes = []) {
  if (sortableAttributes.length > 0) {
    await index.updateSortableAttributes(sortableAttributes).waitTask();
  }
  if (filterableAttributes.length > 0) {
    await index.updateFilterableAttributes(filterableAttributes).waitTask();
  }
  if (rankingRules.length > 0) {
    await index.updateRankingRules(rankingRules).waitTask();
  }
}

async function formatVariants(variants) {
  return variants.map(variant => {
    const product = {
      name: variant.product.name,
      description: variant.product.description,
      categories: variant.product?.categories.map(category => category.name),
    };
    return {
      id: variant.id,
      name: variant.name,
      description: variant.description,
      price: variant.price,
      quantity: variant.quantity,
      quantity_sold: variant.quantity_sold,
      product: product,

      attributes: variant.attributes?.reduce((acc, attribute) => {
        acc[attribute.name] = attribute.value;
        return acc;
      }, {}),
    }
  });
}

module.exports = {meilisearch, syncAttributes, formatVariants};
