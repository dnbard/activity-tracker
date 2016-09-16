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

                document.querySelector('#save-btn').onclick = function(){
                    const weightValue = parseInt(document.querySelector('#weight .input').value);

                    fetch(`/users/${userId}`, {
                        method: 'post',
                        body: JSON.stringify({
                            weight: weightValue
                        })
                    });
                }
            });
        }
    };
});
