import { randomUUID } from "crypto";
import * as dotenv from "dotenv";
import { Kafka } from "kafkajs";
dotenv.config();

async function bootstrap() {
  const kafka = new Kafka({
    clientId: "kafka-producer-sample",
    brokers: [process.env.KAFKA_BROKER],
    sasl: {
      mechanism: process.env.KAFKA_SASL_MECHANISM,
      username: process.env.KAFKA_SASL_USERNAME,
      password: process.env.KAFKA_SASL_PASSWORD,
    },
    ssl: true,
  });

  const producer = kafka.producer();

  await producer.connect();
  await producer.send({
    topic: "notifications.send-notification",
    messages: [
      {
        value: JSON.stringify({
          recipientId: randomUUID(),
          content: "Você tem uma nova solicitação de amizade.",
          category: "social",
        }),
      },
    ],
  });

  await producer.disconnect();
}

bootstrap();
