define([
    'core/token',
    'core/fetch',
    'contributions',
    'helpers/dom'
], function(tokenProvider, fetch, Contributions, DOM){
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
                DOM.createCustomDiv(thisWeek, 'day', 'insertBefore', [{
                    name: 'data-timestamp',
                    value: floatingDate
                },{
                    name: 'title',
                    value: floatingDate.toDateString()
                }]);

                floatingDate.setDate(floatingDate.getDate() - 1);
            }

            for(var weekIndex = 1; weekIndex < MAX_WEEKS; weekIndex ++){
                let week = DOM.createCustomDiv(weeksWrapper, 'week', 'insertBefore');

                for(var dayIndex = 0; dayIndex < MAX_DAYS; dayIndex ++){
                    DOM.createCustomDiv(week, 'day', 'insertBefore', [{
                        name: 'data-timestamp',
                        value: floatingDate
                    },{
                        name: 'title',
                        value: floatingDate.toDateString()
                    }]);

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
                            DOM.createCustomDiv(week, 'day transparent', 'insertBefore')
                        }

                        if (!isLastDay){
                            week = DOM.createCustomDiv(weeksWrapper, 'week', 'insertBefore');
                        }
                    }
                }
            }

            let reportsCollection = [];

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

                if (report.score > 0){
                    el.style.background = colors[report.score];
                }
            }

            fetch('/reports').then(reports => {
                reports.forEach(colorCell);

                reportsCollection = reports;

                Contributions.init({
                    container: weeksWrapperNew,
                    reports: reports
                });
            });


            const explorerTemplate = Handlebars.compile(document.querySelector("#explorer-template").innerHTML);
            const explorerReportElement = document.querySelector("#explorer-report");

            weeksWrapper.onclick = function(e){
                const element = document.querySelector('#explorer');
                const report = e.target._report;

                if (e.target.className !== 'day'){
                    element.innerHTML = '';
                    explorerReportElement.style.display="none";
                    return;
                }

                if (!report){
                    element.innerHTML = '';
                    explorerReportElement.style.display="block";
                    explorerReportElement.querySelector('.date').textContent = e.target.title;
                    explorerReportElement._date = e.target.getAttribute('data-timestamp');
                    starSelected = -1;
                    highlightStars(-1);
                    return;
                }

                element.innerHTML = explorerTemplate({
                    date: new Date(report.timestamp).toDateString(),
                    score: report.score
                });
                explorerReportElement.style.display="none";
            }

            let starSelected = -1;
            function highlightStars(hoverIndex){
                for (var i = 0; i < 5; i ++){
                    explorerReportElement.querySelector(`[data-index="${i}"]`).className =
                        i <= Math.max(starSelected, hoverIndex) ? "large material-icons black" : "large material-icons gray";
                }
            }

            explorerReportElement.querySelector('.score').onmouseover = (e) => {
                if (e.target.className.indexOf('material-icons') === -1){
                    highlightStars(-1);
                    return;
                }

                const starIndex = parseInt(e.target.getAttribute('data-index'));
                highlightStars(starIndex);
            }

            explorerReportElement.querySelector('.score').onclick = function(e){
                if (e.target.className.indexOf('material-icons') === -1){
                    return;
                }

                const starIndex = parseInt(e.target.getAttribute('data-index'));
                starSelected = starIndex;
                highlightStars(-1);
            }

            explorerReportElement.querySelector('.btn.send').onclick = function(e){
                if (starSelected < 0){
                    return;
                }

                fetch('/reports', {
                    method: 'post',
                    body: JSON.stringify({
                        score: starSelected + 1,
                        timestamp: explorerReportElement._date
                    })
                }).then((report) => {
                    explorerReportElement.style.display="none";
                    colorCell(report);
                });
            }
        }
    }
});
