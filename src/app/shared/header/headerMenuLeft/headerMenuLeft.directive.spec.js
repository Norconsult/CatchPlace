describe ('headerMenuLeft test', function(){

    beforeEach(module('headerMenuLeft', 'shared/header/headerMenuLeft/headerMenuLeft.html'));
    var element,
        $scope;

    beforeEach(inject(function($rootScope, $compile) {
        $scope = $rootScope.$new(true);
        element = $compile('<div header-menu-left></div>')($scope);
        $scope.$digest();
    }));

    it ('headerMenuLeft should be defined', function(){
        expect($scope).toBeDefined();
    });

});
