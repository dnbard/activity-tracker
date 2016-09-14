define([
    'core/token',
    'components/welcome',
    'components/profile',
    'version',

    'requireJsConfig'
], (tokenProvider, WelcomeComponent, ProfileComponent, version) => {
    const token = tokenProvider.get();

    if (!token){
        console.error('Token should be defined in LocalStorage!');
        location.href = '/login.html';
    }

    WelcomeComponent.init({
        selector: '#welcome'
    });
    version.init({
        selector: '#version'
    });
    ProfileComponent.init({
        selector: 'main'
    });
});
