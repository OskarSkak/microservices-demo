import amqp from 'amqplib';

async function start() {
  const amqpUrl = "amqp://user:password@rabbitmq:5672";
  const queue = 'statement-request';

  try {
    const conn = await amqp.connect(amqpUrl);
    const channel = await conn.createChannel();

    await channel.assertQueue(queue, { durable: false });

    console.log("Waiting for messages in %s. ", queue);
    channel.consume(queue, (msg) => {
      if (msg) {
        console.log("Received: %s", msg.content.toString());
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
  }
}

start();