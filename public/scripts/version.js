define(function(){
    return {
        init: function(options){
            fetch('/info')
                .then(r => r.json())
                .then(data => {
                    const element = document.querySelector(options.selector);
                    element.innerHTML = `<hr/>Activity Tracker v${data.version}`;
                });

        }
    };
});
