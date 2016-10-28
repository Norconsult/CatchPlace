angular.module('processApp')
    .factory('processAppFactory', [
        function(){


            var userObjectId = "";
            var userName = "";

            return {
                setUserObjectId: function (value) {
                    userObjectId = value;
                },
                getUserObjectId: function () {
                    return userObjectId;
                },

                setUserName: function (value) {
                    userName = value;
                },

                getUserName: function () {
                    return userName;
                }


            };
        }]
    );