// Nest JS Imports
import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    Delete,
    UseGuards,
    UsePipes,
    ValidationPipe,
  } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// Services Imports

// Guard Imports
import { JwtAuthGuard } from 'src/Guard/jwt.guard';

// Schema Imports
import { FavouriteService } from './favourite.service';

// DTO Imports
import { AddFavDto } from './DTO/addFav.dto';

// Interfaces Imports
import { ExtendedRequest } from 'src/utils/Templates/extented-request.interface';
import { IAddFav } from './Interfaces/addFav.interface';

@ApiTags('Favourites')
@Controller('favourites')
export class FavouriteController {
constructor(
    private favService: FavouriteService
) {}

//#region : FAVOURITE CRUD

    //=================== POST: ADD FAV ======================
    /**
     * @description This endpoint takes in fav data and saves them to the database.
     * @body {AddFavDto} fav
     * @returns {Promise<{ favourites: IAddFav[] }>}Returns a Promise that resolves an array of objects.
     */
    @Post('/add-fav')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    @ApiBearerAuth('jwt')
    async addFav(
        @Body() fav: AddFavDto,
        @Req() req: ExtendedRequest,
    ): Promise<{ favourites: IAddFav[] }> {
        const { user } = req;
        return await this.favService.addFav(user.id, fav);
    }

    //=================== GET: GET FAV ======================
    /**
     * @description This endpoint get all fav from the database.
     * @body no body
     * @returns {Promise<{ favourites: IAddFav[] }>} Returns a Promise that resolves an array of objects.
     */
    @Get('/get-fav')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('jwt')
    async getFav(
        @Req() req: ExtendedRequest,
    ): Promise<{ favourites: IAddFav[] }> {
        const { user } = req;
        return await this.favService.getFav(user.id);
    }

    //=================== DELETE: DELETE FAV ======================
    /**
     * @description This endpoint delete fav by id from the database.
     * @body {string} fav_id
     * @returns {Promise<{ favourites: IAddFav[] } | any >} Returns a Promise that resolves an array of objects.
     */
    @Delete('/delete/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('jwt')
    async delFav(
        @Param('id') fav_id: string,
        @Req() req: ExtendedRequest,
    ): Promise<{ favourites: IAddFav[] } | any > {
        const { user } = req;
        return await this.favService.deleteFav(user.id,fav_id);
    }

//#endregion

}
  