const Rabbitmq = require('amqplib/callback_api');
const {meilisearch, syncAttributes} = require('../../config/meilisearch');

Rabbitmq.connect(process.env.RABBITMQ_HOST, function (connectionErr, connection) {
  if (connectionErr) {
    console.error(connectionErr);
  }
  connection.createChannel(function (channelErr, channel) {
    if (channelErr) {
      console.error(channelErr);
    }

    const queue = process.env.QUEUE_NAME;

    channel.assertQueue(queue, {
      durable: true
    });

    // Processing Documents sent to the queue
    channel.consume(queue, async function (msg) {
      const data = JSON.parse(msg.content.toString());
      let index;
      switch (data.event) {
        case 'VariantsCreated':
          index = meilisearch.index('variants');
          await index.addDocuments(data.documents).waitTask();
          await syncAttributes(index, data.sortableAttributes, data.rankingRules, data.filterableAttributes);
          break;
        case 'VariantsUpdated':
          index = meilisearch.index('variants');
          await index.updateDocuments(data.documents).waitTask();
          await syncAttributes(index, data.sortableAttributes, data.rankingRules, data.filterableAttributes);
          break;
        case 'VariantsDeleted':
          index = meilisearch.index('variants');
          await index.deleteDocuments(data.documents).waitTask();
          break;
        case 'AllVariantsDeleted':
          index = meilisearch.index('variants');
          await index.deleteAllDocuments().waitTask();
          break;
        default:
          break;
      }

      setTimeout(function () {
      }, 500);
    }, {
      noAck: true
    });
  });
});
