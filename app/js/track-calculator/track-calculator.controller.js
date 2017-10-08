'use strict';

angular.module('trackCalculator').controller('trackCalculatorController', trackCalculatorController);

trackCalculatorController.$inject = ['$timeout', 'drawLineService', 'trackCalculatorService'];

function trackCalculatorController($timeout, drawLineService, trackCalculatorService) {

    var vm = this;

    //Default arrival and departure time
    vm.defaultArrivalTime = new Date();
    vm.defaultDepartureTime = new Date();
    vm.defaultDepartureTime.setHours(vm.defaultDepartureTime.getHours() + 1);

    //Element in Block A by default
    vm.rawElements = [new TrainLocomotive(), new TrainCarriage()];

    //List of all elements in BlockB
    vm.elementsHeap = [];           

    //List of all Trains
    vm.trains = [];

    vm.selectedElement = null;
    vm.selectedDomTarget = null;
    vm.calculationResult = null;

    vm.getElementUnique = getElementUnique;
    vm.createRawElementTrain = createRawElementTrain;
    vm.connectTrains = connectTrains;
    vm.calculateTracks = calculateTracks;
    vm.elementDropped = elementDropped;
    vm.elementDrag = elementDrag
    vm.connectionClick = connectionClick;
    vm.drawElementConnection = drawElementConnection;
    vm.removeTrainIfEmpty = removeTrainIfEmpty;
    vm.renderConnections = renderConnections;
    vm.removeConnectionDOM = removeConnectionDOM;
    
    
    

    function getElementUnique(element)
    {
        //Unique id for each element
        return "train-element-" + vm.elementsHeap.indexOf(element);
    }

    function createRawElementTrain(element)
    {
        //Create new instance according to the element
        var newElement = null;
        if (element instanceof TrainLocomotive) {
            newElement = new TrainLocomotive();
        } else if (element instanceof TrainCarriage) {
            newElement = new TrainCarriage();
        }

        //Create new train and add it to the trains list
        var newTrain = new Train(newElement, angular.copy(vm.defaultArrivalTime), angular.copy(vm.defaultDepartureTime));
        vm.trains.push(newTrain);

        //Push the new Element to the elements heap 
        vm.elementsHeap.push(newElement);

        return newElement;
    }

    function connectTrains(train1, element1, train2, element2) {
        //Link the two elements by merging the two trains
        trackCalculatorService.mergeTrains(train1, element1, train2, element2);

        vm.removeTrainIfEmpty(train1);
        vm.removeTrainIfEmpty(train2);
    }

    function calculateTracks() {
        vm.calculationResult = trackCalculatorService.calculateMinTracksRequired(vm.trains);
    }

    //Triggered when an element from BlockA dropped into BlockB
    function elementDropped(event, ui)
    {
        //Get the dropped element
        var droppedElement = angular.element(ui.draggable).scope().element;

        var newElement = vm.createRawElementTrain(droppedElement);

        //Reserve the initial dropped position
        newElement.initialPosition = {
            left: ui.position.left - $(event.target).offset().left,
            top: ui.position.top - $(event.target).offset().top,
            position: "absolute"
        }
    }

    function elementDrag(event, ui) {
        vm.renderConnections();
    }

    function connectionClick(event, train, element)
    {
        //If already another item clicked, link between the two elements (merge trains).
        if(vm.selectedElement)
        {
            //Don nothing if same element already clicked 
            if (vm.selectedElement != element)
            {
                vm.connectTrains(vm.selectedTrain, vm.selectedElement, train, element)

                //Render the new connections
                vm.renderConnections();

                //Remove mouse cursor line handler
                document.getElementById("blockB")
                        .removeEventListener("mousemove", drawConnectionToMouse);

                //Remove temporary line and empty selected values
                $('#temp-link').remove();
                vm.selectedElement = null;
                vm.selectedTrain = null;
                vm.selectedDomTarget = null;
            }
        }
        else
        {
            vm.selectedElement = element;
            vm.selectedTrain = train;
            vm.selectedDomTarget = event.target

            //Add event handler to draw line from element to mouse cursor
            document.getElementById("blockB")
                .addEventListener("mousemove", drawConnectionToMouse);
        }
        
    }

    //Draw line between preserved selected item and mouse cursor
    function drawConnectionToMouse(event)
    {
        //the clicked item
        var element = vm.selectedDomTarget;

        //Mouse cursor location
        var off1 = {
            left: event.pageX,
            top: event.pageY,
            width: 0,
            height: 0
        };

        var off2 = drawLineService.getElementOffset(element);

        //Draw line between selected Element and mouse cursor
        drawLineService.connectPoints(off1, off2, "red", 1, "temp-link");
    }

    //Draw line between element and its next Element
    function drawElementConnection(element)
    {
        if (element.nextElement)
        {
            var DOMElement1 = document.getElementById("train-element-" + vm.elementsHeap.indexOf(element));
            var DOMElement2 = document.getElementById("train-element-" + vm.elementsHeap.indexOf(element.nextElement));

            drawLineService.connectElements(DOMElement1, DOMElement2, "red", 1, "connection-" + vm.elementsHeap.indexOf(element));
        }
    }

    function renderConnections()
    {
        $timeout(function () {
            angular.forEach(vm.elementsHeap, function (element) {
                //Remove old connection
                vm.removeConnectionDOM(element);
                //Draw new connection
                vm.drawElementConnection(element);
            });
        })
        
    }

    function removeConnectionDOM(element)
    {
        $("#connection-" + vm.elementsHeap.indexOf(element)).remove();
    }
    
    function removeTrainIfEmpty(train)
    {
        if (!train.head) {
            vm.trains.splice(vm.trains.indexOf(train), 1);
        }
    }
}