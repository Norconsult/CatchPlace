angular.module('processApp')
    .service('processAppService', ['$http',
       function($http){
           //template service
           this.test = function () {
               return $http.get("/test/test");
           };

       }

    ]);
