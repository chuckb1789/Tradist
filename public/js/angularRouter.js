angular.module("tradApp")
       .config(angularRouter)

angularRouter.$inject = ['$routeProvider']

function angularRouter ($routeProvider) {
    $routeProvider
        .when('/areas',
            {
              templateUrl: '/htmlPartials/areas.html'
            })
        .when('/boulder',
            {
                templateUrl: '/htmlPartials/boulder.html',
            })
        .when('/golden',
            {
              templateUrl: '/htmlPartials/golden.html'
            })
        .when('/lyons',
            {
              templateUrl: '/htmlPartials/lyons.html'
            })
        .when('/sPlatte',
            {
              templateUrl: '/htmlPartials/sPlatte.html'
            })
        .when('/eldo',
            {
              templateUrl: '/htmlPartials/eldo.html',
              controller: 'routesController'
            })
        .when('/outerFace',
            {
              templateUrl: '/htmlPartials/outerFace.html'
            })
        .when('/weather',
              {
                controller: 'routesController'
              })


}
