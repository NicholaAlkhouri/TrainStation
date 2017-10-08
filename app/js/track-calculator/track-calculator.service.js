'use strict';

angular.module('trackCalculator').service('trackCalculatorService', trackCalculatorService);

trackCalculatorService.$inject = [];

function trackCalculatorService()
{
    var service = this;

    service.mergeTrains = mergeTrains;
    service.getTrainTail = getTrainTail;
    service.calculateMinTracksRequired = calculateMinTracksRequired;
    service.sortTrainsByArrivalTime = sortTrainsByArrivalTime;
    service.reverseTrainElements = reverseTrainElements;

    //Merge two trains at a specific elements
    function mergeTrains(train1, element1, train2, element2)
    {
        var finalTrain = null;
        var trainToRemove = null;
        var mergeStartElement = null;

        //If both trains have TrainLocomotive don't merge
        if (train1.head instanceof TrainLocomotive && train2.head instanceof TrainLocomotive)
        {
            return;
        }

        //If one of the elements has no more connection left, don't merge
        if (element1.isFullyConnected() || element2.isFullyConnected())
        {
            return;
        }

        //Decide which train to merge into the other one
        if (train1.head instanceof TrainLocomotive || train2.head instanceof TrainLocomotive)
        {
            //If one of the trains has a locomotive, merge into it
            if (train1.head instanceof TrainLocomotive) {
                finalTrain = train1;
                trainToRemove = train2;
                mergeStartElement = element2;
            } else if (train2.head instanceof TrainLocomotive) {
                finalTrain = train2;
                trainToRemove = train1;
                mergeStartElement = element1;
            }
        }
        else //Merging two list of carriges
        {
            if (train1.head == element1)
            {
                //reverse order of element inside train1
                service.reverseTrainElements(train1);
            }
            finalTrain = train1;
            trainToRemove = train2;
            mergeStartElement = element2;
        }

        var tempElement = finalTrain.head;

        var trainTail = service.getTrainTail(finalTrain);

        //Add to the target train
        while (mergeStartElement)
        {
            var nextElement = null;

            //decide if next or previous
            if (mergeStartElement.nextElement)
            {
                nextElement = mergeStartElement.nextElement;
            } else {
                nextElement = mergeStartElement.previousElement;
            }

            trainTail.nextElement = mergeStartElement;
            if (mergeStartElement.previousElement)
            {
                mergeStartElement.previousElement.nextElement = null;
            }
            if (mergeStartElement.nextElement)
            {
                mergeStartElement.nextElement.previousElement = null;
            }
            mergeStartElement.previousElement = trainTail;

            trainTail = mergeStartElement;

            //move to the next item
            mergeStartElement = nextElement;
        }
        
        //Remove from source train
        trainToRemove.head = null;
    }

    //Get the last item of a train
    function getTrainTail(train)
    {
        var temp = train.head;

        while (temp)
        {
            if (!temp.nextElement)
            {
                return temp;
            }

            temp = temp.nextElement;
        }

        return temp;
    }

    function calculateMinTracksRequired(trainsList)
    {
        service.sortTrainsByArrivalTime(trainsList);

        var maxTracks = 0;
        var trainsAtTheSameTime = [];

        for (var i = 0; i < trainsList.length; i++)
        {
            //add current train
            trainsAtTheSameTime.push(trainsList[i]);

            //remove trains that already left when current train arrives
            for (var j = 0; j < trainsAtTheSameTime.length; j++)
            {
                if (trainsAtTheSameTime[j].departureDate <= trainsList[i].arrivalDate)
                {
                    trainsAtTheSameTime.splice(j, 1);
                    j--;
                }
            }

            maxTracks = Math.max(maxTracks, trainsAtTheSameTime.length);
        }

        return maxTracks;
    }

    function sortTrainsByArrivalTime(trainsList) {
        trainsList.sort(function (a, b) {

            return a.arrivalDate.getTime() - b.arrivalDate.getTime();
        });
    }

    function reverseTrainElements(train)
    {
        var temp = train.head;

        while (temp)
        {
            var next = temp.nextElement;

            temp.nextElement = temp.previousElement;
            temp.previousElement = next;

            if (next)
            {
                train.head = next;
            }
            temp = next;
        }

         
    }
}
