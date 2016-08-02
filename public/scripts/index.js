(function(){
    const token = localStorage.getItem('__token');

    fetch('/users', {
        headers: {
            authorization: token,
            'content-type': 'application/json'
        }
    }).then(r => r.json()).then(user => {
        const welcomeSection = document.querySelector('#welcome');
        welcomeSection.textContent = `Hello, ${user.email}.`;
    });
})();
