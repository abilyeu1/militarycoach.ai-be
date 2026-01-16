export type IChat = {
    toolName: string;
    conversation: Conversation[];
};
export type Conversation = {
    role: string;
    content: string;
};
