angular.module('processApp')
    .factory('processAppFactory', [
        function(){

            // var pageList = [
            //     {
            //         "id": "processPage",
            //         "active": true
            //     },
            //     {
            //         "id": "authorizationPage",
            //         "active": false
            //     }
            // ];

            var userObjectId = "";

            return {
                setUserObjectId: function (value) {
                    userObjectId = value;
                },
                getUserObjectId: function () {
                    return userObjectId;
                }

                // getAllPages: function(){
                //     return pageList;
                // },
                //
                // getActivePage: function(){
                //     for (var i = 0; i < pageList.length; i++){
                //         if (pageList[i].active === true){
                //             return pageList[i];
                //         }
                //     }
                //     return undefined;
                // },
                //
                // getPageById: function(pageId){
                //     for (var i = 0; i < pageList.length; i++){
                //         if (pageList[i].id === pageId){
                //             return pageList[i];
                //         }
                //     }
                //     return undefined;
                // },
                //
                // setActivePageById: function(pageId){
                //     for (var i = 0; i < pageList.length; i++){
                //         pageList[i].active = pageList[i].id === pageId;
                //     }
                // },
                //
                // setAuthorizationPage: function(){
                //     for (var i = 0; i < pageList.length; i++){
                //         pageList[i].active = pageList[i].id === 'authorizationPage';
                //     }
                // },
                //
                // setProcessPage: function(){
                //     for (var i = 0; i < pageList.length; i++){
                //         pageList[i].active = pageList[i].id === 'processPage';
                //     }
                // },
                //
                // showAuthorizationPage: function(){
                //     for (var i = 0; i < pageList.length; i++) {
                //         if (pageList[i].id === 'authorizationPage') {
                //             return pageList[i].active;
                //         }
                //     }
                // },
                //
                // showProcessPage: function(){
                //     for (var i = 0; i < pageList.length; i++){
                //         if (pageList[i].id === 'processPage'){
                //             return pageList[i].active;
                //         }
                //     }
                // }
            };
        }]
    );