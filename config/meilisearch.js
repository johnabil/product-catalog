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

module.exports = {meilisearch, syncAttributes};
