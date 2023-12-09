import amqp from 'amqplib';
import {sendEmail} from './src/EmailManager'

async function connectWithRetry(amqpUrl: string, maxRetries: number = 10) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      console.log(`Attempt ${retries + 1}: Connecting to RabbitMQ...`);
      const conn = await amqp.connect(amqpUrl);
      console.log("Successfully connected to RabbitMQ");
      return conn;
    } catch (error: any) {
      console.error(`Connection attempt ${retries + 1} failed:`, error.message);
      retries++;
      if (retries < maxRetries) {
        console.log(`Retrying in 5 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
  throw new Error('All connection attempts failed');
}

async function start() {
  const amqpUrl: string = "amqp://user:password@172.19.0.2:5672";
  const queue: string = 'pdf';

  try {
    const conn = await connectWithRetry(amqpUrl);
    const channel = await conn.createChannel();
    console.log("Channel created");

    await channel.assertQueue(queue, { durable: false });
    console.log("Waiting for messages in %s.", queue);

    channel.consume(queue, (msg) => {
        if (msg) {
          const msgContent = msg.content.toString();
          console.log("Received:", msgContent);
      
          try {
            const data = JSON.parse(msgContent);
            const pdfLocation = data.locationOfPdf;
            const userEmail = data.userEmail;
      
            console.log("PDF Location:", pdfLocation);
            console.log("User Email:", userEmail);

            sendEmail(userEmail, pdfLocation);
          } catch (error) {
            console.error("Error parsing message content:", error);
          }
      
          channel.ack(msg);
        }
      }, {
        noAck: false
      });
      
  } catch (error: any) {
    console.error("Error:", error);
  }
}

start();
