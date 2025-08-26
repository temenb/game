export * from './register';
export * from './producer';
export * from './consumer';
export * from './types';

// import { createProducer, createConsumer } from './kafka';
//
// const kafkaConfig = {
//   clientId: 'gateway',
//   brokers: 'localhost:9092',
// };
//
// const run = async () => {
//   const producer = await createProducer(kafkaConfig);
//   await producer.send({ topic: 'user.created' }, { userId: '123', name: 'Oleksii' });
//
//   await createConsumer(kafkaConfig, {
//     topic: 'user.created',
//     groupId: 'gateway-group',
//     handler: async (msg) => {
//       console.log('Received:', msg);
//     },
//   });
// };
//
// run();