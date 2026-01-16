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
exports.StreamGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const tools_enum_1 = require("./types/enums/tools.enum");
let StreamGateway = class StreamGateway {
    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log('Connected');
        });
    }
    handleMessage(userID, message, chatID, toolName) {
        if (toolName && !chatID) {
            this.server.emit(`${userID}_${toolName}`, message);
            return;
        }
        else {
            this.server.emit(`${userID}_${chatID}`, message);
            return;
        }
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], StreamGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], StreamGateway.prototype, "handleMessage", null);
StreamGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: [
                'http://localhost:3000',
                'http://localhost:8000/socket.io',
                'https://app.militarycoach.ai/',
                'https://staging.militarycoach.ai/',
                'https://milcoach.vercel.app/',
                'https://api.militarycoach.ai/',
            ],
            methods: ['GET', 'POST'],
        },
    })
], StreamGateway);
exports.StreamGateway = StreamGateway;
//# sourceMappingURL=stream.gateway.js.map