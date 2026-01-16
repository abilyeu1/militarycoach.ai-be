"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksModule = void 0;
const nestjs_modules_1 = require("@golevelup/nestjs-modules");
const common_1 = require("@nestjs/common");
const webhooks_contants_1 = require("./webhooks.contants");
const defaultModuleOptions = {
    requestRawBodyProperty: 'rawBody',
};
/**
 * Module that allows for configuration of the ConfigurableRawBodyMiddleware. Use the
 * module to specify which property on the request object that the raw body will be available on.
 * If not set, the property will default to "rawBody"
 */
let WebhooksModule = class WebhooksModule extends (0, nestjs_modules_1.createConfigurableDynamicRootModule)(webhooks_contants_1.WEBHOOK_MODULE_PROVIDED_CONFIG_TOKEN, {
    providers: [
        {
            provide: webhooks_contants_1.WEBHOOK_MODULE_CONFIG_TOKEN,
            useFactory: (providedConfig) => {
                return Object.assign(Object.assign({}, defaultModuleOptions), providedConfig);
            },
            inject: [webhooks_contants_1.WEBHOOK_MODULE_PROVIDED_CONFIG_TOKEN],
        },
    ],
    exports: [webhooks_contants_1.WEBHOOK_MODULE_PROVIDED_CONFIG_TOKEN, webhooks_contants_1.WEBHOOK_MODULE_CONFIG_TOKEN],
}) {
};
WebhooksModule = __decorate([
    (0, common_1.Module)({})
], WebhooksModule);
exports.WebhooksModule = WebhooksModule;
//# sourceMappingURL=webhooks.module.js.map