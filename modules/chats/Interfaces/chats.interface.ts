import { OPENAI_ROLES, Tools } from "src/types/enums/tools.enum";

export type IChats = {
    userID: string;
    toolName: Tools;
    conversation: Conversation[];
  };
  
  export type Conversation = {
    role: OPENAI_ROLES;
    content: string;
  };
  