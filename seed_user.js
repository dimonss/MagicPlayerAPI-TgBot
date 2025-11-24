import ClientSQL from './src/db/ClientSQL.js';
import CryptoJS from 'crypto-js';

const seedUser = () => {
    const login = 'test_tg_user';
    const password = 'password123';
    const hashedPassword = CryptoJS.SHA256(password).toString();

    const user = {
        firstName: 'Test',
        lastName: 'BotUser',
        username: login,
        token: null,
        chatId: '123456789',
        phoneNumber: '1234567890',
        photo: '',
        discount: 0,
        regDate: new Date().toISOString()
    };

    console.log('Seeding user...');
    ClientSQL.registration(user, (err) => {
        if (err) {
            console.error('Error seeding user (might already exist):', err.message);
        } else {
            console.log('User seeded via ClientSQL.registration');
            // Now set password
            ClientSQL.updatePassword({
                password: hashedPassword,
                login: login,
                chatId: user.chatId
            }, (err) => {
                if (err) console.error('Error setting password:', err);
                else console.log('Password set successfully');
            });
        }
    });
};

seedUser();
