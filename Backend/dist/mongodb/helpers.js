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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongo_connect = void 0;
const mongodb_1 = require("mongodb");
const connection_string = `mongodb+srv://HokoriAkiko:RitaRossweisse6!@crimepracticecluster.l1jpdl0.mongodb.net/?retryWrites=true&w=majority`;
const mc = new mongodb_1.MongoClient(connection_string, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});
const mongo_connect = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('\nConnecting to mongodb...\n');
    try {
        const connection_result = yield mc.connect();
        console.log('\n\nconnection result to mongodb is : \n', connection_result);
    }
    catch (err) {
        console.log('\nError occured while connecting to mongodb...\n', err);
        throw err;
    }
});
exports.mongo_connect = mongo_connect;
