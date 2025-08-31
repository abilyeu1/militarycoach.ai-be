import { Tools } from "src/types/enums/tools.enum";

export type IAddFav = {
    userID: string;
    toolName: Tools;
    bullet: string;
    translation: string;
};