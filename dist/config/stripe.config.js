"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('stripe', () => ({
    secret_key: process.env.STRIPE_SECRET_KEY,
}));
//# sourceMappingURL=stripe.config.js.map