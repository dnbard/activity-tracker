define([
    'text!templates/contributions.html'
],function(template){
    function getMonday(d) {
        d = new Date(d);
        d.setHours(0, 0, 0, 0);

        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday

        return new Date(d.setDate(diff));
    }

    function getPreviousMonday(d) {
        d = new Date(d);
        d.setHours(0, 0, 0, 0);

        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1) - 7; // adjust when day is sunday

        return new Date(d.setDate(diff));
    }

    function daysPassedSinceMonday(d){
        const day = d.getDay();
        return day == 0 ? 7 : day;
    }


    return {
        init: function (options = {}) {
            const footer = document.createElement('div');
            footer.className = 'footer';
            options.container.appendChild(footer);

            const now = new Date();
            const weekMondayDiff = now - getMonday(now);
            const week2MondayDiff = now - getPreviousMonday(now);


            const contribsTemplate = Handlebars.compile(template);
            const reports = (options.reports || []);
            const reportsLength = reports.length;
            const reportsWeek = reports.filter(r => (now - new Date(r.timestamp)) <= weekMondayDiff);
            const reportsWeek2 = reports.filter(r => {
                const time = now - new Date(r.timestamp);
                return time <= week2MondayDiff && time > weekMondayDiff;
            });

            footer.innerHTML = contribsTemplate({
                contibsCount: reportsLength,
                contibsScore: reportsLength !== 0 ? (reports.map(r => r.calories).reduce((a, b) => a + b) / reportsLength).toFixed(1) : 0,
                weekScore: reportsWeek.length !== 0 ? (reportsWeek.map(r => r.calories).reduce((a, b) => a + b)).toFixed(1) : 0,
                lastWeekScore: reportsWeek2.length !== 0 ? (reportsWeek2.map(r => r.calories).reduce((a, b) => a + b)).toFixed(1) : 0
            });
        }
    }

});
