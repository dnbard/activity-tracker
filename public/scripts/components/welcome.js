define([
    'core/token'
],function(tokenProvider){
    const token = tokenProvider.get();

    return {
        init: function(options){
            fetch('/users', {
                headers: {
                    authorization: token,
                    'content-type': 'application/json'
                }
            }).then(r => r.json()).then(user => {
                const welcomeSection = document.querySelector(options.selector);
                welcomeSection.textContent = `Hello, ${user.email}.`;
            });
        }
    }
});
