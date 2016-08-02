const token = localStorage.getItem('__token');

if (!token){
    document.querySelector('#logout').setAttribute('disabled', 'disabled');
}

document.querySelector('#create').onclick = () => {
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    fetch('/users', {
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    }).then(r => r.json()).then(data => {
        localStorage.setItem('__token', data.token._id);

        location.href = '/';
    });
}

document.querySelector('#login').onclick = () => {
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    fetch('/login', {
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    }).then(r => r.json()).then(data => {
        localStorage.setItem('__token', data.token._id);

        location.href = '/';
    });
}

document.querySelector('#logout').onclick = () => {
    localStorage.setItem('__token', '');
    location.href = location.href;
}
