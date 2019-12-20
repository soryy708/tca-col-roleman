function isAuthenticated(userId) {
    const adminsStr = process.env.ADMINS;
    if (!adminsStr) {
        return false;
    }
    const admins = JSON.parse(adminsStr);
    return admins.includes(userId);
}

module.exports = {
    isAuthenticated,
};
