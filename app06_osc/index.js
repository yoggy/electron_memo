var remote = require('remote');
var osc = remote.require('node-osc');

var oscServer = null;

var svg_w = 400;
var svg_h = 400;
var circle_r = 200;

function init() {
	// for D3.js
	var svg  = d3.select("#svg_canvas");
	svg.attr("width", svg_w).attr("height", svg_h);
	var circle = svg.append("circle")
					.attr("cx", svg_w / 2)
					.attr("cy", svg_h / 2)
					.attr("r", circle_r / 2)
					.attr("fill", "#88aaff");

	// init osc server
	oscServer = new osc.Server(9000, '0.0.0.0');
	oscServer.on("message", function (msg, rinfo) {
		// receive osc packet
		var path = msg[0];
		if (path == "/audio/loud") {
			var val = msg[1];

			// set circle radius
			circle.attr("r", circle_r * val);
		}
	});
}
