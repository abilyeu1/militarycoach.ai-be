import { FavouriteService } from './favourite.service';
import { AddFavDto } from './DTO/addFav.dto';
import { ExtendedRequest } from 'src/utils/Templates/extented-request.interface';
import { IAddFav } from './Interfaces/addFav.interface';
export declare class FavouriteController {
    private favService;
    constructor(favService: FavouriteService);
    addFav(fav: AddFavDto, req: ExtendedRequest): Promise<{
        favourites: IAddFav[];
    }>;
    getFav(req: ExtendedRequest): Promise<{
        favourites: IAddFav[];
    }>;
    delFav(fav_id: string, req: ExtendedRequest): Promise<{
        favourites: IAddFav[];
    } | any>;
}
