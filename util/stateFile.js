const fileUtil = require('./file');

async function getState(stateFilePath) {
    if (!stateFilePath) {
        throw new Error('No file path');
    }

    const exists = await fileUtil.exists(stateFilePath);
    if (!exists) {
        return {};
    }

    const buffer = await fileUtil.readFile(stateFilePath);
    const state = JSON.parse(buffer);
    return state;
}

async function setState(stateFilePath, newState) {
    if (!stateFilePath) {
        throw new Error('No file path');
    }

    const oldState = await getState(stateFilePath);
    const data = JSON.stringify(Object.assign(oldState, newState));
    await fileUtil.writeFile(stateFilePath, data);
}

module.exports = {
    getState,
    setState,
};
