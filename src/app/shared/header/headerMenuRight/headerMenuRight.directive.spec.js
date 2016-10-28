describe ('headerMenuRight test', function(){

    beforeEach(module('headerMenuRight', 'shared/header/headerMenuRight/headerMenuRight.html'));
    var element,
        $scope;

    beforeEach(inject(function($rootScope, $compile) {
        $scope = $rootScope.$new(true);
        element = $compile('<div header-menu-right></div>')($scope);
        $scope.$digest();
    }));

    it ('languages should have 2 languages', function(){
        expect($scope.languages.length).toBe(2);
    });

});
