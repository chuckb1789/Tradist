angular.module("tradApp", ["ngRoute"])
       .config(angularRouter)

angularRouter.$inject = ['$routeProvider']
function angularRouter ($routeProvider) {
    $routeProvider
        .when('/login',
            {
                templateUrl: '/htmlPartials/loginPage.html',
                controller: 'homeCtrl',
                controllerAs: 'home',
            })
        .when('/signup',
            {
              templateUrl: '/htmlPartials/signupPage.html'
            })
        .when('/profile',
            {
              templateUrl: '/htmlPartials/profilePage.html'
            });

}
