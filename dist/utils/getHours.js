"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHoursLeft = void 0;
const getHoursLeft = async (userCreatedAt) => {
    const currentTime = new Date();
    const timeDifferenceMs = currentTime.getTime() - new Date(userCreatedAt).getTime();
    const hoursPassed = timeDifferenceMs / (1000 * 60 * 60);
    const roundedHours = hoursPassed.toFixed(2);
    return roundedHours;
};
exports.getHoursLeft = getHoursLeft;
//# sourceMappingURL=getHours.js.map