window.contibs = {
    init: function(options = {}){
        const footer = document.createElement('div');
        footer.className = 'footer';
        options.container.appendChild(footer);

        const contribsTemplate = Handlebars.compile(document.querySelector("#contributions-template").innerHTML);
        const reports = (options.reports || []);
        const reportsLength = reports.length;

        footer.innerHTML = contribsTemplate({
            contibsCount: reportsLength,
            contibsScore: reportsLength !== 0 ? (reports.map(r => r.score).reduce((a, b) => a + b) / reportsLength).toFixed(1) : 0
        });
    }
}
