import jwt from 'jsonwebtoken';
import ClientSQL, { Client } from '../db/ClientSQL.js';
import CryptoJS from 'crypto-js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Should be in .env
const ACCESS_TOKEN_EXPIRY = '1h';
const REFRESH_TOKEN_EXPIRY = '7d';

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: Client;
}

class AuthService {
    static async login(login: string, password: string): Promise<LoginResponse | null> {
        return new Promise((resolve, reject) => {
            const hashedPassword = CryptoJS.SHA256(password).toString();
            ClientSQL.findByLoginAndPassword({ login, password: hashedPassword }, (error, client) => {
                if (error) return reject(error);
                if (!client) return resolve(null);

                const payload = {
                    id: client.id,
                    username: client.username || client.login,
                    role: 'user' // Default role
                };

                const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
                const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

                resolve({ accessToken, refreshToken, user: client });
            });
        });
    }

    static verifyToken(token: string): string | jwt.JwtPayload | null {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (e) {
            return null;
        }
    }
}

export default AuthService;
