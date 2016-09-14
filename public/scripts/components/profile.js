define([
    'core/fetch',
    'text!templates/profile.html'
], (fetch, templateText) => {
    return {
        init: function(options){
            let userId = null;

            fetch('/users').then(user => {
                const profileSection = document.querySelector(options.selector);
                const template = Handlebars.compile(templateText);
                const date = new Date(user.updatedAt);

                profileSection.innerHTML = template({
                    email: user.email,
                    updated: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
                    weight: user.weight
                });

                userId = user._id;
            });
        }
    };
});
