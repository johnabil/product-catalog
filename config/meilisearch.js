const {Meilisearch} = require("meilisearch");
const meilisearch = new Meilisearch({
  host: process.env.MEILISEARCH_URL,
  enqueued: false
});

async function syncAttributes(index, sortableAttributes = [], rankingRules = []) {
  if (sortableAttributes.length > 0) {
    await index.updateSortableAttributes(sortableAttributes).waitTask();
  }
  if (rankingRules.length > 0) {
    await index.updateRankingRules(rankingRules).waitTask();
  }
}

module.exports = {meilisearch, syncAttributes};
