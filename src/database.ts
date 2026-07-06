import fs from 'fs';
import path from 'path';
import { config } from './config';

export interface UserSubscription {
  chatId: number;
  originIata: string;
  originName: string;
  destinationIata: string;
  destinationName: string;
  departDate: string;
  returnDate?: string;
  maxPrice: number;
  currency: string;
  createdAt: string;
}

interface DbData {
  users: Record<number, { subscriptions: UserSubscription[] }>;
}

let db: DbData = { users: {} };

function ensureDir() {
  const dir = path.dirname(config.db.path);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function loadDb() {
  ensureDir();
  if (fs.existsSync(config.db.path)) {
    try {
      db = JSON.parse(fs.readFileSync(config.db.path, 'utf-8'));
    } catch {
      db = { users: {} };
    }
  }
}

export function saveDb() {
  ensureDir();
  fs.writeFileSync(config.db.path, JSON.stringify(db, null, 2), 'utf-8');
}

export function getSubscriptions(chatId: number): UserSubscription[] {
  return db.users[chatId]?.subscriptions || [];
}

export function addSubscription(chatId: number, sub: UserSubscription) {
  if (!db.users[chatId]) {
    db.users[chatId] = { subscriptions: [] };
  }
  db.users[chatId].subscriptions.push(sub);
  saveDb();
}

export function removeSubscription(chatId: number, index: number) {
  const subs = db.users[chatId]?.subscriptions;
  if (subs && index >= 0 && index < subs.length) {
    subs.splice(index, 1);
    saveDb();
  }
}

export function getAllSubscriptions(): Array<{ chatId: number; sub: UserSubscription }> {
  const result: Array<{ chatId: number; sub: UserSubscription }> = [];
  for (const [chatIdStr, user] of Object.entries(db.users)) {
    for (const sub of user.subscriptions) {
      result.push({ chatId: Number(chatIdStr), sub });
    }
  }
  return result;
}

export function getAllChatIds(): number[] {
  return Object.keys(db.users).map(Number);
}
