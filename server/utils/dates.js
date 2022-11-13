let getDateFromStringDate = (date) => {
    const d = new Date();
    d.setDate(parseInt(date.split('/')[0]));
    d.setMonth(parseInt(date.split('/')[1])-1);
    d.setFullYear(parseInt(date.split('/')[2]));
    d.setHours(1);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d;
}

module.exports = { getDateFromStringDate }