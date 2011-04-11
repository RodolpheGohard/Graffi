/**
 * a mother class of all Graffi Charts.
 * @class Chart
 * @author Rodolphe Gohard
 */
(function(){

	Graffi.Chart = function() {};

	Graffi.Chart.prototype = {
		/**
		 * Draw a grid to the holder.
		 * Largely inspired from raphael example "analytics.js",
		 * see http://raphaeljs.com/analytics.html
		 * @method drawGrid
		 * @param ox <Number> the top left point x - coord
		 * @param oy <Number> the top left point y - coord
		 * @param w <Number> the width
		 * @param h <Number> the height
		 * @param xmax <Number> the value of x on the rightmost of the grid
		 * @param ymax <Number> the value of y on the topmost of the grid 
		 * @param xgrad <Number> the number of x(horiz.) graduations to be printed
		 * @param ygrad <Number>  the number of y(vert.) graduations to be printed
		 */		
		drawGrid : function( ox, oy, w, h, xmax, ymax, xgrad, ygrad, grid ) {
			
			//From raphael analytics.js
			var color = color || "#666";
			var path = [
				"M",
				Math.round(ox),
				Math.round(oy),
				"L",
				Math.round(ox + w),
				Math.round(oy),
				Math.round(ox + w),
				Math.round(oy + h),
				Math.round(ox),
				Math.round(oy + h),
				Math.round(ox),
				Math.round(oy)
				],
				rowHeight = h/ygrad,
				columnWidth = w/xgrad;
			for (var i = 1; i < ygrad; i++) {
				path = path.concat(
					[
						"M",
						Math.round(ox),
						Math.round(oy + i * rowHeight),
						"H",
						Math.round(ox + w)
					]
				);
				this.holder.text(
					Math.round(ox)-15,
					Math.round(oy + i * rowHeight),
					Math.round( (ygrad-i)*ymax/ygrad )
				).attr( {font: '12px Helvetica, Arial', fill: color} );  
			}
			for (i = 1; i <xgrad; i++) {
				path = path.concat(
					[
						"M", 
						Math.round(ox + i * columnWidth),
						Math.round(oy),
						"V",
						Math.round(oy + h)
					]
				);
				this.holder.text(
					Math.round(ox + i * columnWidth),
					Math.round(oy+h)+ 10,
					i*xmax/xgrad
				).attr( {font: '12px Helvetica, Arial', fill: color} );
			}
			return this.holder.path(path.join(",")).attr({stroke: color});
		
		}
	
	};
	
})();