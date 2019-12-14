const fileUtil = require('./file');
const crypto = require('./crypto');

async function getState(stateFilePath) {
    if (!stateFilePath) {
        throw new Error('No file path');
    }

    const exists = await fileUtil.exists(stateFilePath);
    if (!exists) {
        return {};
    }

    const buffer = await fileUtil.readFile(stateFilePath);
    const decrypted = await crypto.decrypt(buffer.toString());
    const state = JSON.parse(decrypted);
    return state;
}

async function setState(stateFilePath, newState) {
    if (!stateFilePath) {
        throw new Error('No file path');
    }

    const oldState = await getState(stateFilePath);
    const data = JSON.stringify(Object.assign(oldState, newState));
    const encrypted = await crypto.encrypt(data);
    await fileUtil.writeFile(stateFilePath, encrypted);
}

module.exports = {
    getState,
    setState,
};
