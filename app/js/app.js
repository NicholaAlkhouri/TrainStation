'use strict';

angular.module('trainStationApp', [
    'ngRoute',
    'ngDragDrop',
    'ui.bootstrap',
    'drawLineModule',
    'trackCalculator'
]);

angular.module('trainStationApp').config(routingConfig);

routingConfig.$inject = ['$routeProvider'];

function routingConfig($routeProvider)
{
    $routeProvider.when('/', {
        templateUrl: 'js/track-calculator/templates/track-calculator.html',
        controller: 'trackCalculatorController',
        controllerAs: '$ctrl'
    });
}
