angular.module("tradApp", ["ngRoute"])
       .config(angularRouter)

angularRouter.$inject = ['$routeProvider']
function angularRouter ($routeProvider) {
    $routeProvider
        .when('/',
            {
                templateUrl: '/htmlPartials/homePage.html',
                controller: 'homeCtrl',
                controllerAs: 'home',
            })

}
