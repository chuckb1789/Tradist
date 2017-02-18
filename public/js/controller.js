angular.module("tradApp")
       .controller('routesController', routesFunction)

routesFunction.$inject = ['$http']
      var routesCtrl = this

function routesFunction($http) {

  routesCtrl.name=[];

  routesCtrl.getRoutes = function () {
    var url =window.location.protocol+'//'+window.location.host+'/NBastille'
    console.log("looking for", routesCtrl.name , "at", url);
    $http.get(url)
      .then(function success(response) {
        console.log(response.data)
      },
      function failure(response) {
        console.log("ERROR", response)
      })
  };
  routesCtrl.getRoutes()
}
