import * as redis from 'redis';
import { promisify } from 'util';

const client: any = redis.createClient({
  // username: process.env.REDIS_USERNAME as string,
  password: process.env.REDIS_PASSWORD as string,
  socket: {
    host: process.env.REDIS_HOST as string,
    port: process.env.REDIS_PORT as any,
  },
});
// const client: any = redis.createClient(process.env.REDIS_HOST as any);


// Log when the client is created
console.log('Redis client created.');

// Log any errors that occur with the client
client.on('error', (err: any) => console.log('Redis Client Error', err));


// Connect to Redis
client.connect();

// Log when the client is connected
client.on('connect', () => {
  console.log('Redis client connected.');
});

// Log when the client is ready to accept commands
client.on('ready', () => {
  console.log('Redis client ready.');
});

// Log when the client encounters a warning
client.on('warning', (warning: string) => {
  console.log('Redis client warning:', warning);
});

// Log when the client is closed
client.on('end', () => {
  console.log('Redis client closed.');
});

// Promisify Redis functions
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Log when the promisified functions are created
console.log('Promisified Redis functions created.');

export { client, getAsync, setAsync };
