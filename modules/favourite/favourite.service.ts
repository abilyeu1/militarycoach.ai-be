// Nest JS Imports
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// Types, Schema & DTO Imports
import { Favourite, FavouriteDocument } from 'src/schemas/favourites/favourites.schema';
import { User, UserDocument } from 'src/schemas/users/user.schema';
import { Tool, ToolDocument } from 'src/schemas/tools/tools.schema';

// Mongoose Imports
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// DTO Imports
import { AddFavDto } from './DTO/addFav.dto';

// Interfaces Imports
import { IAddFav } from './Interfaces/addFav.interface';


@Injectable()
export class FavouriteService {
  constructor(
    @InjectModel(Favourite.name) private favModel: Model<FavouriteDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Tool.name) private toolModel: Model<ToolDocument>,
  ) {}

//#region : FAVOURITE CRUD

    /**
   * @description Add a new favourite to database.
   * @param {AddFavDto} favDocument - The chat messages to be saved.
   * @param {string} user_id - The unique identifier for the user.
   * @returns {Promise<{ favourites: IAddFav[] }>} A Promise that resolves to an array of object.
   */
    async addFav(
        user_id: string, 
        favDocument: AddFavDto
    ): Promise<{ favourites: IAddFav[] }>{
        try{
            const { toolName } = favDocument;
            const [userExist, toolExist ] = await Promise.all([
                this.userModel.findById(user_id),
                this.toolModel.findOne({
                    name: toolName,
                })
            ]);
            if(!userExist){
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            if(!toolExist){
                throw new HttpException('Tool not found', HttpStatus.NOT_FOUND);
            }

            const newFav = new this.favModel({
                ...favDocument,
                userID: user_id,
            });
        
            await newFav.save();

            const allFav = await this.favModel.find({
                status: true,
                userID: user_id
            });

            return {
                favourites: allFav
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @description Get favourites from database.
     * @param {string} user_id - The unique identifier for the user.
     * @returns {Promise<{ favourites: IAddFav[] }>} A Promise that resolves to an array of object.
     */
    async getFav(
        user_id:string
    ): Promise<{ favourites: IAddFav[] }> {
        try{
            const userExist = this.userModel.findById(user_id)
            if(!userExist){
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            const allFav = await this.favModel.find({
                status: true,
                userID: user_id
            });
            return {
                favourites: allFav
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @description Delete favourite by Id from database.
     * @param {string} user_id - The unique identifier for the user.
     * @param {string} fav_id - The unique identifier for the fav.
     * @returns {Promise<{ favourites: IAddFav[] } | any >} A Promise that resolves to an array of object.
     */
    async deleteFav(
        user_id:string,
        fav_id: string
    ): Promise<{ favourites: IAddFav[] } | any > {
        try{
            const userExist = this.userModel.findById(user_id);
            if(!userExist){
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            const updateData = {
                status: false,
            };
    
            // After updating the status, fetch the updated user.
            const updateFav = await this.favModel.findOne({
                _id: fav_id,
                status: true
            });
            if(!updateFav){
                throw new HttpException('Favourite by Id not found', HttpStatus.NOT_FOUND);
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
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//#endregion

}
