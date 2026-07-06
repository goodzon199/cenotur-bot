"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDb = loadDb;
exports.saveDb = saveDb;
exports.getSubscriptions = getSubscriptions;
exports.addSubscription = addSubscription;
exports.removeSubscription = removeSubscription;
exports.getAllSubscriptions = getAllSubscriptions;
exports.getAllChatIds = getAllChatIds;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
let db = { users: {} };
function ensureDir() {
    const dir = path_1.default.dirname(config_1.config.db.path);
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
}
function loadDb() {
    ensureDir();
    if (fs_1.default.existsSync(config_1.config.db.path)) {
        try {
            db = JSON.parse(fs_1.default.readFileSync(config_1.config.db.path, 'utf-8'));
        }
        catch {
            db = { users: {} };
        }
    }
}
function saveDb() {
    ensureDir();
    fs_1.default.writeFileSync(config_1.config.db.path, JSON.stringify(db, null, 2), 'utf-8');
}
function getSubscriptions(chatId) {
    return db.users[chatId]?.subscriptions || [];
}
function addSubscription(chatId, sub) {
    if (!db.users[chatId]) {
        db.users[chatId] = { subscriptions: [] };
    }
    db.users[chatId].subscriptions.push(sub);
    saveDb();
}
function removeSubscription(chatId, index) {
    const subs = db.users[chatId]?.subscriptions;
    if (subs && index >= 0 && index < subs.length) {
        subs.splice(index, 1);
        saveDb();
    }
}
function getAllSubscriptions() {
    const result = [];
    for (const [chatIdStr, user] of Object.entries(db.users)) {
        for (const sub of user.subscriptions) {
            result.push({ chatId: Number(chatIdStr), sub });
        }
    }
    return result;
}
function getAllChatIds() {
    return Object.keys(db.users).map(Number);
}
//# sourceMappingURL=database.js.map