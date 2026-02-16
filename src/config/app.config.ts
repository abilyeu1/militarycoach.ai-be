import { registerAs } from '@nestjs/config';
export default registerAs('app', () => ({
    port: parseInt(process.env.PORT, 10) || 3100,
    openai_secret: process.env.OPEN_AI_SK,
    openai_assistant_id: process.env.OPEN_AI_ASSISTANT_ID,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_KEY: process.env.S3_SECRET_KEY,
    serpapi_key: process.env.SERPAPI_KEY,
}));
