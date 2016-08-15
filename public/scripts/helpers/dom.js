define(function(){
    function createCustomDiv(parent, className, insertionType, attrs){
        const el = document.createElement('div');

        if (typeof className === 'string'){
            el.className = className;
        }

        if (Array.isArray(attrs)){
            attrs.forEach(a => el.setAttribute(a.name, a.value));
        }

        if (typeof insertionType !== 'string' || insertionType === 'append'){
            parent.appendChild(el);
        } else if (insertionType === 'insertBefore'){
            parent.insertBefore(el, parent.childNodes[0]);
        } else {
            throw new Error('Unknown insertion type');
        }

        return el;
    }

    return {
        createCustomDiv: createCustomDiv
    };
});
