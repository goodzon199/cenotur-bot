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
export declare function loadDb(): void;
export declare function saveDb(): void;
export declare function getSubscriptions(chatId: number): UserSubscription[];
export declare function addSubscription(chatId: number, sub: UserSubscription): void;
export declare function removeSubscription(chatId: number, index: number): void;
export declare function getAllSubscriptions(): Array<{
    chatId: number;
    sub: UserSubscription;
}>;
export declare function getAllChatIds(): number[];
//# sourceMappingURL=database.d.ts.map