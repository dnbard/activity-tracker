define([
    'core/token'
],function(tokenProvider){
    return function(url, options){
        const token = tokenProvider.get();

        return fetch(url, Object.assign({
            headers: {
                authorization: token,
                'content-type': 'application/json'
            }
        }, options || {})).then(r => r.json());
    }
});
