export interface NonceData {
    nonce: string;
    wallet: string;
    created_at: number;
}
export interface User {
    id: number;
    wallet: string;
    display_name: string | null;
    created_at: string;
}
export declare const authService: {
    /**
     * Generate a random nonce for wallet verification
     */
    generateNonce: () => {
        nonce: string;
        expiresIn: number;
    };
    /**
     * Verify nonce exists and hasn't expired
     */
    verifyNonce: (nonce: string) => boolean;
    /**
     * Store nonce with wallet association
     */
    storeNonceForWallet: (nonce: string, wallet: string) => void;
    /**
     * Generate JWT token
     */
    generateToken: (wallet: string) => string;
    /**
     * Verify JWT token
     */
    verifyToken: (token: string) => {
        wallet: string;
    } | null;
    /**
     * Get or create user by wallet
     */
    getOrCreateUser: (wallet: string) => Promise<User>;
    /**
     * Get user by wallet
     */
    getUserByWallet: (wallet: string) => Promise<User | null>;
};
//# sourceMappingURL=authService.d.ts.map