describe('Service: trackCalculatorService', function () {
    beforeEach(module('trackCalculator'));

    var service;

    beforeEach(inject(function (trackCalculatorService) {
        service = trackCalculatorService;
    }));

    describe('Service methods functionality', function () {

        it('Get the last element of the train (tail)', function () {

            var train = new Train();
            var element1 = new TrainElement();
            var element2 = new TrainElement();
            train.head = element1;
            element1.nextElement = element2;

            expect(service.getTrainTail(train)).toEqual(element2);
        });


        it('Should sort list of train by arriving time', function () {

            var train1 = new Train(null, new Date(2001, 1, 1, 6, 0, 0));
            var train2 = new Train(null, new Date(2001, 1, 1, 6, 20, 0));
            var train3 = new Train(null, new Date(2001, 1, 1, 5, 45, 0));

            var list = [train1, train2, train3];

            service.sortTrainsByArrivalTime(list);

            expect(list).toEqual([train3, train1, train2]);
        });

        it('Should revert the elements of the train (head become tail)', function () {
            
            var element1 = new TrainElement();
            var element2 = new TrainElement();
            var element3 = new TrainElement();

            element1.nextElement = element2;

            element2.previousElement = element1;
            element2.nextElement = element3;

            element3.previousElement = element2;

            var train = new Train(element1);

            service.reverseTrainElements(train);

            expect(train.head).toEqual(element3);
            expect(service.getTrainTail(train)).toEqual(element1);
        });

        it('Should calculate the minimum required track fo list of trains', function () {

            var train1 = new Train(null, new Date(2001, 1, 1, 6, 56, 0), new Date(2001, 1, 1, 7, 54, 0));
            var train2 = new Train(null, new Date(2001, 1, 1, 7, 00, 0), new Date(2001, 1, 1, 8, 50, 0));
            var train3 = new Train(null, new Date(2001, 1, 1, 8, 00, 0), new Date(2001, 1, 1, 8, 05, 0));

            var list1 = [train1, train2, train3];
            var list2 = [train1, train3];
            var list3 = [train2, train3];
            
            expect(service.calculateMinTracksRequired(list1)).toEqual(2);
            expect(service.calculateMinTracksRequired(list2)).toEqual(1);
            expect(service.calculateMinTracksRequired(list3)).toEqual(2);
        });

    });
});