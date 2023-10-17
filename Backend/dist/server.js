"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.my_mongo = void 0;
const app_1 = __importDefault(require("./app"));
const server_routes_1 = __importDefault(require("./server-routes"));
const server_dependencies_1 = __importDefault(require("./server-dependencies"));
const init_1 = require("./mongodb/init");
(0, server_dependencies_1.default)(app_1.default);
(0, server_routes_1.default)(app_1.default);
exports.my_mongo = new init_1.My_Mongo();
const server_start = () => __awaiter(void 0, void 0, void 0, function* () {
    //waiting to connect to mongo db before running server
    try {
        yield exports.my_mongo.mongo_connect();
    }
    catch (err) {
        //terminating process if error occurs
        process.exit(1);
    }
    app_1.default.listen(5612, () => {
        console.log("Server listening at 5612....");
    });
});
server_start();
