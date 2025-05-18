

interface AuthRecord {
    userEmail: string;
    expiresAt: number;
    sentAuthCookie: boolean;
    verifyToken: string;
    authCookie: string;
}

class AuthService {
    private inMemoryAuthCookieToUserEmail: Record<string, AuthRecord>;
    private inMemoryVerifyTokenToAuthRecord: Record<string, AuthRecord>;

    constructor() {
        this.inMemoryAuthCookieToUserEmail = {};
        this.inMemoryVerifyTokenToAuthRecord = {};
    }
    /**
     * Get the verify token for the given email. This should be sent to the user's email.
     * @param email 
     * @returns the verify token
     */
    getEmailVerifyToken(email: string): string {
        // Generate the verifyToken and authCookie
        const verifyToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const authCookie = Math.random().toString(36).substring(2, 30) + Math.random().toString(36).substring(2, 30);

        // store the token in inMemoryVerifyTokenToAuthRecord, add 10 minutes expiration
        this.inMemoryVerifyTokenToAuthRecord[verifyToken] = { userEmail: email as string, expiresAt: Date.now() + 1000 * 60 * 10, sentAuthCookie: false, verifyToken: verifyToken, authCookie: authCookie };
        return verifyToken;
    }
    
    /**
     * Get the auth cookie for the given verify token.
     *  The user should have clicked the link in the email.
     *  This should be sent to the user's browser, and will be used as auth for future requests
     * @param verifyToken 
     * @returns the auth cookie or null if the verify token is not valid
     */
    getAuthCookie(verifyToken: string | null | undefined): string | null {
        if (!verifyToken) {
            return null;
        }
        // check if token is in inMemoryTokenToAuthRecord
        if (verifyToken in this.inMemoryVerifyTokenToAuthRecord) {
            const record = this.inMemoryVerifyTokenToAuthRecord[verifyToken];
            if (record.sentAuthCookie) {
                console.log("Token already verified - cannot be used twice!");
                return null;
            } else if (record.expiresAt < Date.now()) {
                console.log("Token expired - cannot be used!");
                return null;
            } else {
                // delete the token from inMemoryVerifyTokenToAuthRecord
                delete this.inMemoryVerifyTokenToAuthRecord[verifyToken];

                // getting the 1 time auth cookie
                this.inMemoryAuthCookieToUserEmail[record.authCookie] = record;

                // Set expiration to 1 day
                record.expiresAt = Date.now() + 1000 * 60 * 24;

                // Record is verified
                record.sentAuthCookie = true;

                return record.authCookie;
            }
        }
        return null;
    }

    /**
     * Get the email for the given auth cookie.
     *  This should be used as authentication by each request.
     * @param authCookie 
     * @returns the email or null if the auth cookie is not valid
     */
    getEmailFromAuthCookie(authCookie: string | null | undefined): string | null {
        if (!authCookie) {
            return null;
        }
        if (authCookie in this.inMemoryAuthCookieToUserEmail) {
            if (this.inMemoryAuthCookieToUserEmail[authCookie].expiresAt > Date.now()) {
                return this.inMemoryAuthCookieToUserEmail[authCookie].userEmail;
            }
            console.log("getEmailFromAuthCookie() Failed, auth cookie expired");
            return null;
        }
        console.log("getEmailFromAuthCookie() Failed, auth cookie not in inMemoryAuthCookieToUserEmail");
        return null;
    }
}

const authService = new AuthService();

export { authService};