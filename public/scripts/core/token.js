define(function(){
    return {
        get: function(){
            return localStorage.getItem('__token');
        }
    };
});
