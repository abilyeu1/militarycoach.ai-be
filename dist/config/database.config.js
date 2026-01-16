"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('database', () => ({
    mongo_connection: process.env.MONGO_CONNECTION,
}));
//# sourceMappingURL=database.config.js.map