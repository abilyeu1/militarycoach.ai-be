/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { HydratedDocument } from 'mongoose';
import { Tools } from 'src/types/enums/tools.enum';
export type FavouriteDocument = HydratedDocument<Favourite>;
export declare class Favourite {
    userID: string;
    toolName: Tools;
    bullet: string;
    translation: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const FavouriteSchema: import("mongoose").Schema<Favourite, import("mongoose").Model<Favourite, any, any, any, import("mongoose").Document<unknown, any, Favourite> & Favourite & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Favourite, import("mongoose").Document<unknown, {}, Favourite> & Favourite & {
    _id: import("mongoose").Types.ObjectId;
}>;
