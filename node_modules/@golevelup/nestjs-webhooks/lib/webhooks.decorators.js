"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectWebhookConfig = exports.InjectProvidedWebhookConfig = void 0;
const nestjs_common_1 = require("@golevelup/nestjs-common");
const webhooks_contants_1 = require("./webhooks.contants");
/**
 * Injects the Webhook Config provided to this module (may have optional values)
 */
exports.InjectProvidedWebhookConfig = (0, nestjs_common_1.makeInjectableDecorator)(webhooks_contants_1.WEBHOOK_MODULE_PROVIDED_CONFIG_TOKEN);
/**
 * Injects the final Webhook Config (optional values filled in with defaults) from this module
 */
exports.InjectWebhookConfig = (0, nestjs_common_1.makeInjectableDecorator)(webhooks_contants_1.WEBHOOK_MODULE_CONFIG_TOKEN);
//# sourceMappingURL=webhooks.decorators.js.map