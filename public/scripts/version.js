fetch('/info')
    .then(r => r.json())
    .then(data => {
        const element = document.querySelector('#version');
        element.textContent = `Activity Tracker v${data.version}`;
    });
