declare const _default: (() => {
    jwt_secret: string;
    jwt_refresh_expiry: number;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    jwt_secret: string;
    jwt_refresh_expiry: number;
}>;
export default _default;
