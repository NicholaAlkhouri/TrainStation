angular.module('drawLineModule', []).service('drawLineService', drawLineService);

drawLineService.$inject = [];

function drawLineService()
{
	var service = this;

	service.getLinHtml = getLinHtml;
	service.connectPoints = connectPoints;
	service.connectElements = connectElements;
	service.getElementOffset = getElementOffset;

	//Generate html content of a line to connect between two points in the DOM 
	function getLinHtml(point1, point2, color, thickness, lineId) {
		// bottom right
		var x1 = point1.left + (point1.width / 2);
		var y1 = point1.top + (point1.height / 2);
		// top right
		var x2 = point2.left + (point2.width / 2);
		var y2 = point2.top + (point2.height / 2);
		// distance
		var length = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
		// center
		var cx = ((x1 + x2) / 2) - (length / 2);
		var cy = ((y1 + y2) / 2) - (thickness / 2);
		// angle
		var angle = Math.atan2((y1 - y2), (x1 - x2)) * (180 / Math.PI);
		// make hr
		var htmlLine = "<div id='" + lineId + "' style='padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";

		return htmlLine;
	}

	//Draw line between two points 
	function connectPoints(point1, point2, color, thickness, lineId) {
		var htmlLine = getLinHtml(point1, point2, color, thickness, lineId);

		//Remove previous
		$('#' + lineId).remove();

		$(htmlLine).appendTo("body");

		return;
	}

	//Draw line between two dom elements
	function connectElements(DOMElement1, DOMElement2, color, thickness, lineId) {
		var offset1 = getElementOffset(DOMElement1);
		var offset2 = getElementOffset(DOMElement2);

		connectPoints(offset1, offset2, color, thickness, lineId);
	}

	function getElementOffset(el) {
		var rect = el.getBoundingClientRect();

		return {
			left: rect.left + window.pageXOffset,
			top: rect.top + window.pageYOffset,
			width: rect.width || el.offsetWidth,
			height: rect.height || el.offsetHeight
		};
	}
}