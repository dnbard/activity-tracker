const token = localStorage.getItem('__token');

if (!token){
    throw new Error('Token should be defined in LocalStorage!');
}

const application = document.querySelector('main');
const weeksWrapper = document.createElement('div');
weeksWrapper.className = 'weeks';

application.appendChild(weeksWrapper);


const today = new Date();
let floatingDate = today;
floatingDate.setHours(0, 0, 0, 0);
const dayOfTheWeek = today.getDay();

const thisWeek = document.createElement('div');
thisWeek.className = 'week';
weeksWrapper.appendChild(thisWeek);

for(var i = 0 ; i < dayOfTheWeek; i ++){
    const day = document.createElement('div');
    day.className = 'day';
    day.setAttribute('data-timestamp', floatingDate);
    day.setAttribute('title', floatingDate.toDateString());

    thisWeek.insertBefore(day, thisWeek.childNodes[0]);

    floatingDate.setDate(floatingDate.getDate() - 1);
}

for(var weekIndex = 1; weekIndex < 53; weekIndex ++){
    let week = document.createElement('div');
    week.className = 'week';
    weeksWrapper.insertBefore(week, weeksWrapper.childNodes[0]);

    for(var dayIndex = 0; dayIndex < 7; dayIndex ++){
        const day = document.createElement('div');
        day.className = 'day';
        day.setAttribute('data-timestamp', floatingDate);
        day.setAttribute('title', floatingDate.toDateString());

        week.insertBefore(day, week.childNodes[0]);

        const previousMonth = floatingDate.getMonth();
        floatingDate.setDate(floatingDate.getDate() - 1);
        const nextMonth = floatingDate.getMonth();

        if (previousMonth !== nextMonth){
            week.className = 'week week-first';

            for(var _dayIndex = 0; _dayIndex < 7 - dayIndex - 1; _dayIndex ++){
                const day = document.createElement('div');
                day.className = 'day transparent';
                week.insertBefore(day, week.childNodes[0]);
            }

            week = document.createElement('div');
            week.className = `week`;
            weeksWrapper.insertBefore(week, weeksWrapper.childNodes[0]);
        }
    }
}

let reportsCollection = [];

fetch('/reports', {
    headers: { authorization: token }
}).then(r => r.json()).then(reports => {
    reports.forEach(r => {
        let date = new Date(r.timestamp);
        date.setHours(0, 0, 0, 0);

        const el = document.querySelector(`.day[data-timestamp="${date}"]`);
        el._report = r;

        if (r.score > 0){
            el.style.background = 'green';
        }
    });

    reportsCollection = reports;
});


const explorerTemplate = Handlebars.compile(document.querySelector("#explorer-template").innerHTML);
weeksWrapper.onclick = function(e){
    const element = document.querySelector('#explorer');

    if (e.target.className !== 'day' || !e.target._report){
        element.innerHTML = '';
        return;
    }

    const report = e.target._report;

    element.innerHTML = explorerTemplate({
        date: new Date(report.timestamp).toDateString(),
        score: report.score
    });
}
