const convertMs = (ms, units) => {
    const conversionMap = {
        MS: 1,
        SECONDS: 1000,
        MINUTES: 1000 * 60,
        HOURS: 1000 * 60 * 60,
    }
    return ms / conversionMap[units];
}

module.exports = {
    convertMs
}