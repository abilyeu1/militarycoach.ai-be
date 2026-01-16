"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt = require("bcrypt");
const hashPassword = async (password) => {
    const salt = await bcrypt.genSaltSync();
    return await bcrypt.hashSync(password, salt);
};
exports.hashPassword = hashPassword;
const comparePassword = async (password, hash) => {
    return await bcrypt.compareSync(password, hash);
};
exports.comparePassword = comparePassword;
//# sourceMappingURL=bycrpt.js.map