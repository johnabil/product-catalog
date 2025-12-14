const amqp = require('amqplib');

async function publishMessage(data, exchange = 'default') {

  try {
    const msg = JSON.stringify(data);
    let connection = await amqp.connect(process.env.RABBITMQ_HOST);
    let channel = await connection.createChannel();
    await channel.assertExchange(exchange, 'fanout', {durable: true});
    await channel.publish(exchange, '', Buffer.from(msg));
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error(error);
  }
}

async function initializeRabbitmq() {
  const connection = await amqp.connect(process.env.RABBITMQ_HOST);
  const channel = await connection.createChannel();

  // Declare an exchange
  const exchangeName = 'products_exchange';
  await channel.assertExchange(exchangeName, 'fanout', {durable: true});

  // Declare a queue
  const queueName = process.env.QUEUE_NAME;
  await channel.assertQueue(queueName, {durable: true});

  // Bind queue to exchange
  await channel.bindQueue(queueName, exchangeName, '');
}

module.exports = {publishMessage, initializeRabbitmq};
