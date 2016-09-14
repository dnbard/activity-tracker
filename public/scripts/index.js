requirejs([
    'components/welcome',
    'components/main',
    'version',

    'core/mobile',
    'requireJsConfig'
], function(WelcomeComponent, MainComponent, version){
    WelcomeComponent.init({
        selector: '#welcome'
    });
    version.init({
        selector: '#version'
    });

    MainComponent.init();
});
