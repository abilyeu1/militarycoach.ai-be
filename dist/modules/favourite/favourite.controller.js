"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavouriteController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_guard_1 = require("../../Guard/jwt.guard");
const favourite_service_1 = require("./favourite.service");
const addFav_dto_1 = require("./DTO/addFav.dto");
let FavouriteController = class FavouriteController {
    constructor(favService) {
        this.favService = favService;
    }
    async addFav(fav, req) {
        const { user } = req;
        return await this.favService.addFav(user.id, fav);
    }
    async getFav(req) {
        const { user } = req;
        return await this.favService.getFav(user.id);
    }
    async delFav(fav_id, req) {
        const { user } = req;
        return await this.favService.deleteFav(user.id, fav_id);
    }
};
__decorate([
    (0, common_1.Post)('/add-fav'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [addFav_dto_1.AddFavDto, Object]),
    __metadata("design:returntype", Promise)
], FavouriteController.prototype, "addFav", null);
__decorate([
    (0, common_1.Get)('/get-fav'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FavouriteController.prototype, "getFav", null);
__decorate([
    (0, common_1.Delete)('/delete/:id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FavouriteController.prototype, "delFav", null);
FavouriteController = __decorate([
    (0, swagger_1.ApiTags)('Favourites'),
    (0, common_1.Controller)('favourites'),
    __metadata("design:paramtypes", [favourite_service_1.FavouriteService])
], FavouriteController);
exports.FavouriteController = FavouriteController;
//# sourceMappingURL=favourite.controller.js.map