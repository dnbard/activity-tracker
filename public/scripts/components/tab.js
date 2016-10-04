define([
    'helpers/dom'
], (DOM) => {
    const tabs = [];


    return {
        init: function(parent, icon, isSelected){
            const tabEl = DOM.createCustomDiv(parent, 'tab');
            tabEl._id = icon;

            if (isSelected){
                tabEl.classList.add('selected');
            }

            tabEl.onclick = function(){
                tabs.forEach((el) => {
                    el.classList.remove('selected');

                    if (el._id !== tabEl._id){
                        const tabContent = document.querySelector(`[data-id="${el._id}"]`);
                        if (tabContent){
                            tabContent.style.display = "none";
                        }
                    }


                });

                tabEl.classList.add('selected');
                const tabContent = document.querySelector(`[data-id="${tabEl._id}"]`);
                if (tabContent){
                    tabContent.style.display = "block";
                }
            }

            tabEl.innerHTML = `<i class="large material-icons">${icon}</i>`;
            tabs.push(tabEl);

            return tabEl;
        }
    }
});
