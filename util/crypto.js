const fileUtil = require('./file');
const crypto = require('crypto');

const encryptionKey = 'Apg68N4WH00L8l6ygICnKNNqWSqybFrq'; // Has to be 256 bits = 32 bytes
let encryptionIv = null;

async function getEncryptionIv() {
    const encryptionIvFilePath = 'secrets_iv.txt';

    if (!encryptionIv) {
        const exists = await fileUtil.exists(encryptionIvFilePath);
        if (exists) {
            encryptionIv = await fileUtil.readFile(encryptionIvFilePath);
        } else {
            encryptionIv = crypto.randomBytes(16);
            await fileUtil.writeFile(encryptionIvFilePath, encryptionIv);
        }
    }

    return encryptionIv;
}

async function encrypt(text) {
    const iv = await getEncryptionIv();
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted.toString('hex');
}

async function decrypt(encryptedText) {
    const iv = await getEncryptionIv();
    const encryptedData = Buffer.from(encryptedText, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted.toString();
}

module.exports = {
    encrypt,
    decrypt,
};
