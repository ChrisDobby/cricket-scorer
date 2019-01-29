export default (matchDate: Date | string) => {
    const maxDaysForMatch = 6;

    const matchesAvailableFrom = () => {
        const now = new Date();
        now.setDate(now.getDate() - maxDaysForMatch);
        return now;
    };

    return new Date(matchDate) < matchesAvailableFrom();
};
