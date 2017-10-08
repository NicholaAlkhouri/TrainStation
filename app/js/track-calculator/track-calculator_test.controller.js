describe('Controller: trackCalculatorController', function () {
    beforeEach(module('drawLineModule'));
    beforeEach(module('trackCalculator'));

    var ctrl, drawLineService, trackCalculatorService;

    beforeEach(inject(function (_$controller_) {
        ctrl = _$controller_("trackCalculatorController");
    }));

    describe('trains and elements', function () {
        
        it('keep track of all elements and trains added', function () {

            ctrl.createRawElementTrain(new TrainLocomotive());
            ctrl.createRawElementTrain(new TrainCarriage());

            expect(ctrl.trains.length).toEqual(2);
            expect(ctrl.elementsHeap.length).toEqual(2);
        });

        it('connect two trains into one ', function () {

            ctrl.createRawElementTrain(new TrainLocomotive());
            ctrl.createRawElementTrain(new TrainCarriage());

            //Before connecting trains controller has 2 trains
            expect(ctrl.trains.length).toEqual(2);

            ctrl.connectTrains(ctrl.trains[0], ctrl.trains[0].head, ctrl.trains[1], ctrl.trains[1].head);

            //Before connecting trains controller has 1 train
            expect(ctrl.trains.length).toEqual(1);

        });

    });
});