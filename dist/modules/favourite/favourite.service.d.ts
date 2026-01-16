import { FavouriteDocument } from 'src/schemas/favourites/favourites.schema';
import { UserDocument } from 'src/schemas/users/user.schema';
import { ToolDocument } from 'src/schemas/tools/tools.schema';
import { Model } from 'mongoose';
import { AddFavDto } from './DTO/addFav.dto';
import { IAddFav } from './Interfaces/addFav.interface';
export declare class FavouriteService {
    private favModel;
    private userModel;
    private toolModel;
    constructor(favModel: Model<FavouriteDocument>, userModel: Model<UserDocument>, toolModel: Model<ToolDocument>);
    addFav(user_id: string, favDocument: AddFavDto): Promise<{
        favourites: IAddFav[];
    }>;
    getFav(user_id: string): Promise<{
        favourites: IAddFav[];
    }>;
    deleteFav(user_id: string, fav_id: string): Promise<{
        favourites: IAddFav[];
    } | any>;
}
