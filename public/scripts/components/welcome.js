define([
    'core/fetch',
    'text!templates/welcome.html'
],function(fetch, templateText){
    return {
        init: function(options){
            fetch('/users').then(user => {
                const welcomeSection = document.querySelector(options.selector);
                const template = Handlebars.compile(templateText);
                welcomeSection.innerHTML = template({ person: user.email });

                welcomeSection.querySelector('.btn-logout').onclick = () => {
                    localStorage.setItem('__token', '');
                    location.href = '/login.html';
                }
            });
        }
    }
});
