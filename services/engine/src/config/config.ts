import dotenv from 'dotenv';

dotenv.config();

export  const config = {
    port: process.env.PORT || 3000,
    // accessTokenSecret: process.env.JWT_ACCESS_SECRET!,
    // refreshTokenSecret: process.env.JWT_REFRESH_SECRET!,
    // accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    // refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
};

export default config;
