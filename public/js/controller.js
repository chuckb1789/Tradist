angular.module("tradApp")
       .controller('routesController', routesFunction)

routesFunction.$inject = ['$http']

function routesFunction($http) {
  var routesCtrl = this;
  routesCtrl.title = "ROUTE FINDER";
  console.log(routesCtrl.title);

  routesCtrl.weather = [];
  routesCtrl.routeInfo=[];
  routesCtrl.routes = [];
  routesCtrl.routesRating = [];
  routesCtrl.routesClimbable = [];

  routesCtrl.getRoutes = function () {
              $http.get('/NBastille/routes')
              .then(function successCallback(response) {
                routesCtrl.routeInfo = response.data
                console.log("Route Info:", routesCtrl.routeInfo)
                //Create all routes in the North Bastille Region
                for (var i=0; i<32; i++) {
                  routesCtrl.routes.push(routesCtrl.routeInfo[i].name)
                }
                console.log("Route Names:", routesCtrl.routes)
                //Create all routes difficulty level
                for (var i=0; i<32; i++) {
                  routesCtrl.routesRating.push(routesCtrl.routeInfo[i].original)
                }
                console.log("Route Rating:", routesCtrl.routesRating)
                //Create list of routes with difficult level under 5.11
                for (var i=0; i<32; i++) {
                  if (routesCtrl.routeInfo[i].original === "5.5" ||
                      routesCtrl.routeInfo[i].original === "5.6" ||
                      routesCtrl.routeInfo[i].original === "5.7" ||
                      routesCtrl.routeInfo[i].original === "5.8" ||
                      routesCtrl.routeInfo[i].original === "5.9+" ||
                      routesCtrl.routeInfo[i].original === "5.10" ||
                      routesCtrl.routeInfo[i].original === "5.10a" ||
                      routesCtrl.routeInfo[i].original === "5.10b" ||
                      routesCtrl.routeInfo[i].original === "5.10c" ||
                      routesCtrl.routeInfo[i].original === "5.10d") {
                    routesCtrl.routesClimbable.push(routesCtrl.routeInfo[i].name)
                  }
                }
                console.log("Routes Climbable:", routesCtrl.routesClimbable)

              }, function errorCallbck(response){
                  console.log("error retrieving information")
              });
          };
  routesCtrl.getRoutes()

  routesCtrl.getWeather = function () {
        var url = window.location.protocol+'//'+window.location.host+'/weather'
        $http.get(url)
             .then(function successCallback(response) {
               routesCtrl.weather = response.data
               console.log("WEATHER INFO:", routesCtrl.weather)

             }, function errorCallbck(response){
                 console.log("error retrieving information")
             });
         };

};
