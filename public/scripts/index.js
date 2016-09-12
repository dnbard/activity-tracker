requirejs([
    'components/welcome',
    'components/main',
//    'components/goals',
    'version',

    'core/mobile'
], function(WelcomeComponent, MainComponent, /*GoalsComponent,*/ version){
    WelcomeComponent.init({
        selector: '#welcome'
    });
    version.init({
        selector: '#version'
    });
//    GoalsComponent.init({
//        selector: '#goals',
//        template: '#goal-template'
//    });

    MainComponent.init();
});
