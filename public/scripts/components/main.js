define([
    'core/token',
    'core/fetch',
    'contributions',
    'helpers/dom',
    'helpers/holiday'
], function(tokenProvider, fetch, Contributions, DOM, Holiday){
    return {
        init: function(){
            const token = tokenProvider.get();

            const MAX_WEEKS = window.mobileAndTabletCheck() ? 8 : 53;
            const MAX_DAYS = 7;

            if (!token){
                console.error('Token should be defined in LocalStorage!');
                location.href = '/login.html';
            }

            const application = document.querySelector('main');
            const weeksWrapperNew = DOM.createCustomDiv(application, 'weeks');
            const weeksWrapper = DOM.createCustomDiv(weeksWrapperNew);


            const today = new Date();
            let floatingDate = today;
            floatingDate.setHours(0, 0, 0, 0);
            const dayOfTheWeek = today.getDay();

            const thisWeek = DOM.createCustomDiv(weeksWrapper, 'week');

            for(var i = 0 ; i < dayOfTheWeek; i ++){
                const dayElement = DOM.createCustomDiv(thisWeek, 'day', 'insertBefore', [{
                    name: 'data-timestamp',
                    value: floatingDate
                },{
                    name: 'title',
                    value: floatingDate.toDateString()
                }]);

                if (Holiday.isHoliday(floatingDate)){
                    dayElement.classList.add('holiday');
                }

                DOM.createCustomDiv(dayElement, 'day-counter');
                floatingDate.setDate(floatingDate.getDate() - 1);
            }

            for(var weekIndex = 1; weekIndex < MAX_WEEKS; weekIndex ++){
                let week = DOM.createCustomDiv(weeksWrapper, 'week', 'insertBefore');

                for(var dayIndex = 0; dayIndex < MAX_DAYS; dayIndex ++){
                    const dayElement = DOM.createCustomDiv(week, 'day', 'insertBefore', [{
                        name: 'data-timestamp',
                        value: floatingDate
                    },{
                        name: 'title',
                        value: floatingDate.toDateString()
                    }]);

                    if (Holiday.isHoliday(floatingDate)){
                        dayElement.classList.add('holiday');
                    }

                    DOM.createCustomDiv(dayElement, 'day-counter');
                    const dateArray = floatingDate.toDateString().split(' ');

                    const previousMonth = floatingDate.getMonth();
                    const previousYear = floatingDate.getYear();
                    floatingDate.setDate(floatingDate.getDate() - 1);
                    const nextMonth = floatingDate.getMonth();
                    const nextYear = floatingDate.getYear();

                    const isLastDay = weekIndex + 1 === MAX_WEEKS && dayIndex + 1 === MAX_DAYS;

                    if (previousMonth !== nextMonth || isLastDay){
                        if (!isLastDay){
                            week.className = `week week-first ${previousYear !== nextYear ? 'week-new_year': ''}`;
                        }

                        const dateLabel = DOM.createCustomDiv(week, 'date-label', 'insertBefore');
                        dateLabel.textContent = `${dateArray[1]} ${dateArray[3]}`;

                        for(var _dayIndex = 0; _dayIndex < MAX_DAYS - dayIndex - 1; _dayIndex ++){
                            DOM.createCustomDiv(week, 'day transparent', 'insertBefore');
                        }

                        if (!isLastDay){
                            week = DOM.createCustomDiv(weeksWrapper, 'week', 'insertBefore');
                        }
                    }
                }
            }

            const colors = {
                5: '#1e6823',
                4: '#44a340',
                3: '#8cc665',
                2: '#d6e685',
                1: '#f9e58f'
            };

            function colorCell(report){
                let date = new Date(report.timestamp);
                date.setHours(0, 0, 0, 0);

                const el = document.querySelector(`.day[data-timestamp="${date}"]`);

                if (!el){
                    //DOM element not found; maybe old record
                    return;
                }

                el._report = report;

                if (report.kind === 'activity.biking' && report.score > 0){
                    el.style.background = colors[report.score];
                } else if (report.kind === 'activity.pushups') {
                    el.querySelector('.day-counter').classList.add('set');
                }
            }

            function formatScore(reports){
                if (reports.length === 0){
                    return;
                }

                const maxScore = reports.map(r => r.score).reduce((a, b) => a > b ? a : b) || 1;

                reports.forEach(r => {
                    r.calories = r.score;
                    r.score = (r.score / maxScore * 5).toFixed(0);
                });
            }

            fetch('/reports').then(reports => {
                formatScore(reports);
                reports.forEach(colorCell);

                Contributions.init({
                    container: weeksWrapperNew,
                    reports: reports
                });
            });

            const explorerReportElement = document.querySelector("#explorer-report");
            let selectedReport = null;

            weeksWrapper.onclick = function(e){
                const element = document.querySelector('#explorer');
                const report = e.target._report;

                if (e.target.className.indexOf('day') === -1){
                    element.innerHTML = '';
                    explorerReportElement.style.display="none";
                    return;
                }

                if (!report){
                    element.innerHTML = '';
                    explorerReportElement.style.display="block";
                    explorerReportElement.querySelector('.date').textContent = e.target.title;
                    explorerReportElement._date = e.target.getAttribute('data-timestamp');

                    document.querySelector('#distance .input').value = '';
                    document.querySelector('#distance .input').focus();
                    document.querySelector('#duration .input').value = '';
                    document.querySelector('#score').style.display = 'none';

                    selectedReport = null;
                } else {
                    element.innerHTML = '';
                    explorerReportElement.style.display="block";
                    explorerReportElement.querySelector('.date').textContent = e.target.title;
                    explorerReportElement._date = e.target.getAttribute('data-timestamp');

                    selectedReport = report;

                    document.querySelector('#distance .input').value = report.distance;
                    document.querySelector('#duration .input').value = report.duration;
                    document.querySelector('#score').style.display = '';
                    document.querySelector('#score .input').value = report.calories.toFixed(0);
                }
            }

            let starSelected = -1;

            explorerReportElement.querySelector('.btn.send').onclick = function(e){
                const distance = document.querySelector('#distance .input').value;
                const duration = document.querySelector('#duration .input').value;

                if (!distance || !duration){
                    return;
                }

                function onScoreChanges(report){
                    explorerReportElement.style.display="none";
                    colorCell(report);
                    location.reload();
                }

                function onScoreChangeFailure(){
                    explorerReportElement.style.display="none";
                }

                if (selectedReport == null){
                    fetch('/reports', {
                        method: 'post',
                        body: JSON.stringify({
                            duration: duration,
                            distance: distance,
                            timestamp: explorerReportElement._date
                        })
                    }).then(onScoreChanges).catch(onScoreChangeFailure);
                } else {
                    fetch(`/reports/${selectedReport._id}`, {
                        method: 'post',
                        body: JSON.stringify({
                            duration: duration,
                            distance: distance
                        })
                    }).then(onScoreChanges).catch(onScoreChangeFailure);
                }
            }
        }
    }
});
