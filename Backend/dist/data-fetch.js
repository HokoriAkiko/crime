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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetch_graphs = exports.filter_data_using_words = exports.get_unique_words = void 0;
const server_1 = require("./server");
const mongodb_1 = require("mongodb");
const helpers_1 = require("./helpers");
const get_unique_words = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    let all_words = {};
    const result = server_1.my_mongo.db.collection(server_1.my_mongo.collection_names.words_array).find({});
    try {
        for (var _d = true, result_1 = __asyncValues(result), result_1_1; result_1_1 = yield result_1.next(), _a = result_1_1.done, !_a; _d = true) {
            _c = result_1_1.value;
            _d = false;
            const d = _c;
            const words_array = d.words_array;
            words_array.forEach(element => {
                if (!parseInt(element)) {
                    all_words[element] = element;
                }
            });
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = result_1.return)) yield _b.call(result_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    res.send(Object.keys(all_words));
});
exports.get_unique_words = get_unique_words;
const filter_data_using_words = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, e_2, _f, _g;
    const { words, limit, skip, operational } = req.body;
    console.log('data from front is: ', req.body);
    let result = [];
    console.log('preparing response');
    const words_array_cursor = server_1.my_mongo.db.collection(server_1.my_mongo.collection_names.words_array).find().limit(limit).skip(skip);
    try {
        for (var _h = true, words_array_cursor_1 = __asyncValues(words_array_cursor), words_array_cursor_1_1; words_array_cursor_1_1 = yield words_array_cursor_1.next(), _e = words_array_cursor_1_1.done, !_e; _h = true) {
            _g = words_array_cursor_1_1.value;
            _h = false;
            const cursor = _g;
            const { words_array, raw_id, _id } = cursor;
            const original = yield get_raw_file_filename(raw_id);
            const cleaned = (0, helpers_1.extract_words_from_string)(original, [' ', '_'], true).join(' ');
            const match = present_in_words_array(words, words_array);
            if (match) {
                const oper = yield fetch_operational_using_words_array_id(_id, operational, limit, skip);
                result.push({
                    from_chunk_collection: { cleaned },
                    words_array_id: operational === 'LIMIT_SKIP' || operational === 'ONE' ? cursor : {},
                    from_operational_collection: oper
                });
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (!_h && !_e && (_f = words_array_cursor_1.return)) yield _f.call(words_array_cursor_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    console.log('results count : ', result.length);
    res.send(result);
});
exports.filter_data_using_words = filter_data_using_words;
//filter data using words exported function helpers below 
const present_in_words_array = (from_front, from_db) => {
    let present = false;
    for (let w = 0; w < from_front.length; w++) {
        const word = from_front[w];
        for (let i = 0; (!!word && i < from_db.length); i++) {
            const a = from_db[i].toLocaleLowerCase();
            const b = word.toLowerCase();
            present = a.includes(b) || b.includes(a);
            if (present)
                break;
        }
    }
    return present;
};
const get_raw_file_filename = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _j, e_3, _k, _l;
    var _m;
    const cursor = server_1.my_mongo.bucket.find({ _id: id });
    let result = '';
    try {
        for (var _o = true, cursor_1 = __asyncValues(cursor), cursor_1_1; cursor_1_1 = yield cursor_1.next(), _j = cursor_1_1.done, !_j; _o = true) {
            _l = cursor_1_1.value;
            _o = false;
            const c = _l;
            result = (_m = c === null || c === void 0 ? void 0 : c.metadata) === null || _m === void 0 ? void 0 : _m.__filename;
            break;
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (!_o && !_j && (_k = cursor_1.return)) yield _k.call(cursor_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return result;
});
const fetch_operational_using_words_array_id = (id, dependency, limit = 0, skip = 0) => __awaiter(void 0, void 0, void 0, function* () {
    var _p, e_4, _q, _r;
    let arr = [];
    try {
        const cursor = server_1.my_mongo.db.collection(server_1.my_mongo.collection_names.operational).find({ words_array_id: id });
        if (dependency == 'NONE') {
            return arr;
        }
        else if (dependency == 'ONE') {
            cursor.limit(1);
        }
        else if (dependency == 'LIMIT_SKIP') {
            cursor.limit(limit).skip(skip);
        }
        try {
            for (var _s = true, cursor_2 = __asyncValues(cursor), cursor_2_1; cursor_2_1 = yield cursor_2.next(), _p = cursor_2_1.done, !_p; _s = true) {
                _r = cursor_2_1.value;
                _s = false;
                const c = _r;
                arr.push(c);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (!_s && !_p && (_q = cursor_2.return)) yield _q.call(cursor_2);
            }
            finally { if (e_4) throw e_4.error; }
        }
    }
    catch (err) {
        throw err;
    }
    return arr;
});
const fetch_graphs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _t, e_5, _u, _v;
    const { words_array_id } = req.body;
    const waid = new mongodb_1.ObjectId(words_array_id);
    let operational = [];
    try {
        const p1 = { projection: { raw_id: 0 } }; //not asking for raw_id only
        const wac = yield server_1.my_mongo.db.
            collection(server_1.my_mongo.collection_names.words_array).
            findOne({ _id: waid }, p1);
        const p2 = { projection: { _id: 0, words_array_id: 0 } };
        const cursor = server_1.my_mongo.db.collection(server_1.my_mongo.collection_names.operational).find({ words_array_id: waid }, p2);
        try {
            for (var _w = true, cursor_3 = __asyncValues(cursor), cursor_3_1; cursor_3_1 = yield cursor_3.next(), _t = cursor_3_1.done, !_t; _w = true) {
                _v = cursor_3_1.value;
                _w = false;
                const c = _v;
                operational.push(c);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (!_w && !_t && (_u = cursor_3.return)) yield _u.call(cursor_3);
            }
            finally { if (e_5) throw e_5.error; }
        }
        res.send({ wac, operational });
    }
    catch (err) {
        next(err);
    }
});
exports.fetch_graphs = fetch_graphs;
