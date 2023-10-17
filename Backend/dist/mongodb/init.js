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
exports.My_Mongo = void 0;
const mongodb_1 = require("mongodb");
class My_Mongo {
    constructor() {
        this.connection_string = `mongodb+srv://HokoriAkiko:RitaRossweisse6!@crimepracticecluster.l1jpdl0.mongodb.net/?retryWrites=true&w=majority`;
        this.client = new mongodb_1.MongoClient(this.connection_string, {
            serverApi: {
                version: mongodb_1.ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true
            }
        });
        this.collection_names = { words_array: 'words_array', operational: 'operational' };
        this.db = this.client.db('CRIME_DATA'); // gonna use CRIME_DATA DB as main one in my cluster
        this.bucket = new mongodb_1.GridFSBucket(this.db, { bucketName: 'raw_file_bucket' });
    }
    mongo_connect() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('\nConnecting to mongodb...\n');
            try {
                yield this.client.connect();
                console.log('Connected to mongodb successfully...');
            }
            catch (err) {
                console.log('\nError occured while connecting to mongodb...\n', err);
                throw err;
            }
        });
    }
}
exports.My_Mongo = My_Mongo;
