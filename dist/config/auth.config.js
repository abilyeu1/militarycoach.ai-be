"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('auth', () => ({
    jwt_secret: process.env.JWT_SECRET,
    jwt_refresh_expiry: parseInt(process.env.JWT_EXPIRY, 10) || 2592000,
}));
//# sourceMappingURL=auth.config.js.map