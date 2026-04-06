import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 50051,
};

export default config;
