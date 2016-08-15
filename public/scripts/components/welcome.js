define([
    'core/fetch'
],function(fetch){
    return {
        init: function(options){
            fetch('/users').then(user => {
                const welcomeSection = document.querySelector(options.selector);
                const template = Handlebars.compile(document.querySelector("#welcome-template").innerHTML);
                welcomeSection.innerHTML = template({ person: user.email });

                welcomeSection.querySelector('.btn-logout').onclick = () => {
                    localStorage.setItem('__token', '');
                    location.href = '/login.html';
                }
            });
        }
    }
});
