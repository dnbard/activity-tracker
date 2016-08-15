define(function(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
        document.querySelector('#viewport').setAttribute('content', 'width=device-width, initial-scale=1.2, maximum-scale=1.2');
    }
});
