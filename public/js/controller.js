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
  routesCtrl.maxGrade = "";
  routesCtrl.minGrade = "";
  routesCtrl.maxGradeMenu = "5.0";
  routesCtrl.minGradeMenu = "5.15c";
  routesCtrl.username = ""

  routesCtrl.getGrades = function () {

       $http.get("/userGrades")
       .then(function success(res) {
          routesCtrl.maxGrade = res.data.maxGrade
          routesCtrl.minGrade = res.data.minGrade
          routesCtrl.username = res.data.username
          console.log("USER DATA: ", res.data);
          routesCtrl.getRoutes();
         })
       }

   routesCtrl.getGrades();

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

                var diffRange = ["5.0", "5.1", "5.2", "5.3", "5.4", "5.5", "5.6", "5.7", "5.8", "5.9", "5.10a", "5.10b", "5.10c", "5.10d", "5.11a", "5.11b", "5.11c", "5.11d", "5.12a", "5.12b", "5.12c", "5.12d", "5.13a", "5.13b", "5.13c", "5.13d", "5.14a", "5.14a", "5.14b", "5.14c", "5.14d", "5.15a", "5.15b", "5.15c"]

                var minDiff = parseInt(routesCtrl.minGrade) - 1;
                var maxDiff = parseInt(routesCtrl.maxGrade) - 1;

                routesCtrl.maxGradeMenu = diffRange[maxDiff];
                routesCtrl.minGradeMenu = diffRange[minDiff];
                console.log("MAXGRADEMENUE: ", routesCtrl.maxGradeMenu)

                console.log("Range: ", minDiff, maxDiff)
                var searchArray = [];

                for (var index = minDiff; index<= maxDiff; index++){
                  console.log('pushing for search: ',diffRange[index])
                    searchArray.push(diffRange[index])
                }

                routesCtrl.routeInfo.forEach(function(element) {
                    var matchEl = element;
                    searchArray.forEach(function(el){
                      console.log('checking: '+el+' against: '+matchEl.original)
                        if (el === matchEl.original) {
                          console.log('found route: ',matchEl)
                            routesCtrl.routesClimbable.push(matchEl)
                        }
                    })
                })

                console.log("Routes Climbable", routesCtrl.routesClimbable);

              }, function errorCallbck(response){
                  console.log("error retrieving information")
          });
        };



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

   routesCtrl.profile = {
       maxGrade: "",
       minGrade: ""
   };






   routesCtrl.updateGrade = {
     message: ""
   };

   routesCtrl.updateGrade = function () {

            $http.put('/gradeUpdate', routesCtrl.profile)
              .then(function success(response) {
                  console.log("Updated grade range")

                  routesCtrl.updateGrade.message = response.data;

                  $http.get("/userGrades")
                        .then(function success(res) {
                      routesCtrl.profile.maxGrade = res.data.maxGrade
                      routesCtrl.profile.minGrade = res.data.minGrade
                      console.log(res.data);
                  })
                })
                .catch(function(err){console.log("Update via put failed, caught error: ",err)})
    };

};
