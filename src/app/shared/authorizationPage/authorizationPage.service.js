angular.module('authorizationPage')
    .service('authorizationPageService',
        function () {

            var _token = "";
            var _url = "";
            var _instance = "";

            var _message = "";
            var _user;
            var _resources;

            this.init = function(url, instance) {
                _url = url;
                _instance = instance;
            };

            this.readToken = function() {
                var _message = "";
                $.ajax({
                    type: "POST",
                    url: _url + "readtoken",
                    data: {
                        "instance": _instance
                    },
                    success: function (data) {
                        if (data === undefined) {
                            _message = "Undefined user token.";
                        }
                        else if (data && (typeof data === 'string') && data.length === 0) {
                            _message = "Empty user token.";
                        }
                        else if (data && (typeof data === 'string') && data.length > 0) {
                            _token = data;
                            _message = "";
                        }
                    },
                    error: function () {
                        _message = "User token response error.";
                    }
                });
            };

            this.login = function(username, password) {
                var loginOk = false;

                if (username.length === 0 || password.length === 0) {
                    _message = "User login failed.";
                }
                else {
                    $.ajax({
                        type: "POST",
                        async: false,
                        url: _url + "login",
                        data: {
                            "instance": _instance,
                            "token": _token,
                            "username": username,
                            "password": password
                        },
                        success: function (data) {
                            if (data === undefined) {
                                _message = "Undefined user login response.";
                            }
                            else if (data && (typeof data === 'string') && data === "True") {
                                _message = "";
                                loginOk = true;
                            }
                            else if (data && (typeof data === 'string') && data === "False") {
                                _message = "Brukerpålogging feilet.";
                            }
                            else {
                                _message = "User login failed, unexpected error.";
                            }
                        },
                        error: function () {
                            _message = "User login response error.";
                        }
                    });
                }
                return loginOk;
            };

            this.readUser = function(username) {
                $.ajax({
                    type: "POST",
                    async: false,
                    url: _url + "readuser",
                    data: {
                        "instance": _instance,
                        "username": username
                    },
                    success: function (data) {
                        if (data === undefined) {
                            _message = "Undefined user login response.";
                        }
                        else if (data) {
                            _user = JSON.parse(data);
                            _message = "";
                        }
                    },
                    error: function () {
                        _message = "Get user information response error.";
                    }
                });
            };

            this.readResourcesForToken = function() {
                $.ajax({
                    type: "POST",
                    async: false,
                    url: _url + "readresourcesfortoken",
                    data: {
                        "instance": _instance,
                        "token": _token
                    },
                    success: function (data) {
                        if (data === undefined) {
                            _message = "Undefined user login response.";
                        }
                        else if (data) {
                            _resources = JSON.parse(data);
                            _message = "";
                        }
                    },
                    error: function () {
                        _message = "Get user information response error.";
                    }
                });
            };

            this.getUserForToken = function(token) {
                _token = token;
                $.ajax({
                    type: "POST",
                    async: false,
                    url: _url + "getuserfortoken",
                    data: {
                        "instance": _instance,
                        "token": _token
                    },
                    success: function (data) {
                        if (data === undefined) {
                            _message = "Undefined user login response.";
                        }
                        else if (data) {
                            _user = data;
                            _message = "";
                        }
                    },
                    error: function () {
                        _message = "Get user information response error.";
                    }
                });
            };

            this.getUser = function() {
                return _user;
            };

            this.getResources = function(){
                return _resources;
            };

            this.getMessage = function() {
                return _message;
            };

            this.getToken = function(){
                return _token;
            };
        }
    );