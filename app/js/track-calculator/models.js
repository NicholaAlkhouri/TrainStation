function Train(head, arrivalDate, departureDate)
{
    //The first element of the train is the head
    this.head = head;
    this.arrivalDate = arrivalDate;
    this.departureDate = departureDate;

    //Return an array of all train elements
    this.getTrainElements = getTrainElements;
    
    function getTrainElements()
    {
        var elementArray = [];
        var temp = this.head;

        while (temp)
        {
            elementArray.push(temp);
            temp = temp.nextElement;
        }

        return elementArray;
    }
}

function TrainElement(name, nextTrainElement, previousElement)
{
    this.name = name;
    this.nextElement = nextTrainElement;
    this.previousElement = previousElement;
}

function TrainLocomotive(nextTrainElement)
{
    TrainElement.call(this, "Locomotive", nextTrainElement);

    this.isFullyConnected = function ()
    {
        if (this.nextElement)
        {
            return true;
        }
        return false;
    };
}

function TrainCarriage(nextTrainElement, previousElement) {

    TrainElement.call(this, "Carriage", nextTrainElement, previousElement);

    this.isFullyConnected = function () {
        if (this.nextElement && this.previousElement)
        {
            return true;
        }
        return false;
    };
}