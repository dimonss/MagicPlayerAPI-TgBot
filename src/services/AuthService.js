import jwt from 'jsonwebtoken';
import ClientSQL from '../db/ClientSQL.js';
import CryptoJS from 'crypto-js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Should be in .env
const ACCESS_TOKEN_EXPIRY = '1h';
const REFRESH_TOKEN_EXPIRY = '7d';

class AuthService {
    static async login(login, password) {
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

    static verifyToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (e) {
            return null;
        }
    }
}

export default AuthService;
