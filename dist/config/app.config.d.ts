declare const _default: (() => {
    port: number;
    openai_secret: string;
    S3_ACCESS_KEY: string;
    S3_SECRET_KEY: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    port: number;
    openai_secret: string;
    S3_ACCESS_KEY: string;
    S3_SECRET_KEY: string;
}>;
export default _default;
