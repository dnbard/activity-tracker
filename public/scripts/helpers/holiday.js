define(() => {
    const genericHolidays = [{
        name: 'New Year',
        day: 1,
        month: 0
    }, {
        name: 'Christmas',
        day: 7,
        month: 0
    }, {
        name: 'Women Day',
        day: 8,
        month: 2
    }, {
        name: 'Labour Day',
        day: 1,
        month: 4
    }, {
        name: 'Labour Day',
        day: 2,
        month: 4
    }, {
        name: 'Victory Day',
        day: 9,
        month: 4
    }, {
        name: 'Constitution Day',
        day: 29,
        month: 5
    }, {
        name: 'Independence Day',
        day: 24,
        month: 7
    }, {
        name: 'Defender Day',
        day: 14,
        month: 9
    }];


    function getSpecificHoliday(date){
        const day = date.getDate(),
              month = date.getMonth();

        const holiday = genericHolidays.filter(h => h.day === day && h.month === month)[0];

        return holiday || null;
    }

    function isHoliday(date){
        const day = date.getDay();

        return day === 6 || day === 0 || !!getSpecificHoliday(date);
    }

    return {
        isHoliday: isHoliday
    };
});
