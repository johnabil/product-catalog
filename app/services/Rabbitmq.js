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
  // amqp.connect(process.env.RABBITMQ_HOST, function (channelErr, connection) {
  //   if (channelErr) {
  //     console.log(channelErr);
  //   }
  //   connection.createChannel(function (error1, channel) {
  //     if (error1) {
  //       console.log(error1);
  //     }
  //     const msg = JSON.stringify(data);
  //
  //     channel.assertExchange(exchange, 'fanout', {
  //       durable: true
  //     });
  //     channel.publish(exchange, '', Buffer.from(msg));
  //   });
  //
  //   setTimeout(function () {
  //     connection.close();
  //   }, 500);
  // });
}

module.exports = {publishMessage};
