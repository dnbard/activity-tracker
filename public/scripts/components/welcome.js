define([
    'core/fetch'
],function(fetch){
    return {
        init: function(options){
            fetch('/users').then(user => {
                const welcomeSection = document.querySelector(options.selector);
                welcomeSection.textContent = `Hello, ${user.email}.`;
            });
        }
    }
});
