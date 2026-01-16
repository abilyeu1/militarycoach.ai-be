"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsNotEmptyArray = void 0;
const class_validator_1 = require("class-validator");
function IsNotEmptyArray(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isNotEmptyArray',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    return Array.isArray(value) && value.length > 0;
                },
                defaultMessage(args) {
                    return `${args.property} must not be an empty array`;
                },
            },
        });
    };
}
exports.IsNotEmptyArray = IsNotEmptyArray;
//# sourceMappingURL=isNotEmptyArray.js.map