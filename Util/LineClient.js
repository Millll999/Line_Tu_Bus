import line from '@line/bot-sdk';
import dotenv from 'dotenv';
import "dotenv/config";


const env = dotenv.config().parsed;
const lineConfig = {
  channelAccessToken: env.ACCESS_TOKEN,
  channelSecret: env.SECRET_TOKEN,
};

const client = new line.Client(lineConfig);
const userId = 'Uf328c241d00b50cfb5a3fe500f8234ae';

export { client, userId, lineConfig};