define([
    'core/fetch',
    'helpers/dom'
], (fetch, DOM) => {
    return {
        init: function(options){
            const template = Handlebars.compile(document.querySelector(options.template).innerHTML);
            const element = document.querySelector(options.selector);

            fetch('/goals').then((goals) => {
                goals.forEach(g => {
                    const goalElement = DOM.createCustomDiv(element, 'goal');
                    goalElement.innerHTML = template(g)
                });
            });
        }
    }
});
