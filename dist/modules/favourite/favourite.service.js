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
exports.FavouriteService = void 0;
const common_1 = require("@nestjs/common");
const favourites_schema_1 = require("../../schemas/favourites/favourites.schema");
const user_schema_1 = require("../../schemas/users/user.schema");
const tools_schema_1 = require("../../schemas/tools/tools.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let FavouriteService = class FavouriteService {
    constructor(favModel, userModel, toolModel) {
        this.favModel = favModel;
        this.userModel = userModel;
        this.toolModel = toolModel;
    }
    async addFav(user_id, favDocument) {
        try {
            const { toolName } = favDocument;
            const [userExist, toolExist] = await Promise.all([
                this.userModel.findById(user_id),
                this.toolModel.findOne({
                    name: toolName,
                })
            ]);
            if (!userExist) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            if (!toolExist) {
                throw new common_1.HttpException('Tool not found', common_1.HttpStatus.NOT_FOUND);
            }
            const newFav = new this.favModel(Object.assign(Object.assign({}, favDocument), { userID: user_id }));
            await newFav.save();
            const allFav = await this.favModel.find({
                status: true,
                userID: user_id
            });
            return {
                favourites: allFav
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getFav(user_id) {
        try {
            const userExist = this.userModel.findById(user_id);
            if (!userExist) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            const allFav = await this.favModel.find({
                status: true,
                userID: user_id
            });
            return {
                favourites: allFav
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteFav(user_id, fav_id) {
        try {
            const userExist = this.userModel.findById(user_id);
            if (!userExist) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            const updateData = {
                status: false,
            };
            const updateFav = await this.favModel.findOne({
                _id: fav_id,
                status: true
            });
            if (!updateFav) {
                throw new common_1.HttpException('Favourite by Id not found', common_1.HttpStatus.NOT_FOUND);
            }
            updateFav.status = false;
            await updateFav.save();
            const allFav = await this.favModel.find({
                status: true,
                userID: user_id
            });
            return {
                favourites: allFav
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
FavouriteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(favourites_schema_1.Favourite.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(tools_schema_1.Tool.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], FavouriteService);
exports.FavouriteService = FavouriteService;
//# sourceMappingURL=favourite.service.js.map