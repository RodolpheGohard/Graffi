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
		
		},
		/**
		 * 		gridXStep: Math.PI/3,
				gridYStep: 0.5,
				gradXStep: Math.PI/6,
				gradYStep: 0.1,
				xMin: 0,
				xMax: Math.PI * 2,
				yMin: -1.4,
				yMax: 1.4,
				axisX: -1,
				axisY: 0,
				axisXName: 'x',
				axisYName: 'sin(x)',
		 * @param options
		 */
		drawGridOptions: function( ox,oy,w,h,xmin,ymin,xmax,ymax,options ) {
			//From raphael analytics.js
//			var color = options.gridColor || "#666",
//				path = new Graffi.PathWrapper(),
//				
//				xgrad=(options.gradXStep||10),
//				ygrad=(options.gradYStep||10),
//				gradsRowHeight = h/ ygrad,
//				gradsColumnWidth = w/ xgrad ,
//				
//				gridRows = 20,
//				gridCols = 20,
//				gridRowHeight = h/ (options.gridYStep||20),
//				gridColumnWidth = w/ (options.gridXStep||20);
			
			var color,
				path,
				
				xgrads,
				ygrads,
				gradsRowHeight,
				gradsColumnWidth,
				
				gridRows,
				gridColumns,
				gridRowHeight,
				gridColumnWidth,
				gridYStep,
				gridXStep,
				
				xrange = xmax - xmin,
				yrange = ymax - ymin,
				
				gridAttributes;
			
			color = options.gridColor || "#666";
			gridAttributes = {font: '12px Helvetica, Arial', fill: color};
			path = new Graffi.PathWrapper();
			
			//How many Rows and their Height
			if ( options.gridYStep !== undefined ) {
				gridYStep = options.gridYStep;
				gridRows = Math.floor( yrange / gridYStep);
				gridRowHeight = gridYStep * h / yrange;
			} else {
				gridRows = options.gridRows || 10;
				gridRowHeight = h / gridRows;
				gridYStep = yrange / gridRows;
			}
			
			//How many Columns and their width
			if ( options.gridXStep !== undefined ) {
				gridXStep = options.gridXStep;
				gridColumns = Math.floor( xrange / options.gridXStep );
				gridColumnWidth = options.gridXStep * w / xrange;
			} else {
				gridColumns = options.gridColumns || 10;
				gridColumnWidth = w / gridColumns;
				gridXStep = xrange / gridColumns;
			}

			
			//initial rectangle
			path.M( Math.round(ox), Math.round(oy) )
				.H( Math.round(ox + w) )
				.V( Math.round(oy + h) )
				.H( Math.round(ox) )
				//.V( Math.round(oy) );
				.Z();
			
			//Grid Horizontals
			for (var i = 1; i < gridRows; i++) {
				path.M( ox, Math.round(oy + h - i * gridRowHeight) )
					.H( Math.round(ox + w) );
				
				this.holder.text(
					ox-15,
					Math.round(oy + h - i * gridRowHeight),
					(ymin + i*gridYStep).toFixed(2)
				).attr( gridAttributes );
			}
			
			
			// Grid Verticles
			for (var i = 1; i < gridColumns; i++) {
				path.M( Math.round(ox + i * gridColumnWidth), oy )
					.V( Math.round( oy + h ) );
				
				this.holder.text(
					Math.round(ox + i * gridColumnWidth),
					oy + h + 10,
					(xmin + i*gridXStep).toFixed(1)
				).attr( gridAttributes );
			}
			
			
			//AXis
			x = options.yAxis || 0;
			y = options.xAxis || 0;
			this.holder.path(
				new Graffi.PathWrapper()
					.M( Math.round(ox), Math.round(oy)+h + (-y+ymin)*h/yrange )
					.H( Math.round(ox + w) )
					.M( ox - (-x+xmin)*w/xrange , oy)
					.V( Math.round(oy + h) ).toString()
			).attr({
				classname: 'axis',
				stroke:'#666',
				'stroke-width': '3px'
			});
			
			//Title
			if ( options.title )
				this.holder.text(
					ox+w/2,
					oy+15,
					options.title
				).attr({
					fill: 'White',
					'font-family': 'sans-serif',
					'font-size' : '16px'
				});
			
			if ( options.axisXName )
				this.holder.text(
						ox+w/2,
						oy+h+23,
						options.axisXName
					).attr({
						fill: 'White',
						'font-family': 'sans-serif',
						'font-size' : '12px'
					});
			if ( options.axisYName )
				this.holder.text(
						5,
						oy+h/2,
						options.axisYName
					).attr({
						fill: 'White',
						'font-family': 'sans-serif',
						'font-size' : '12px'
					})
					.rotate(-90);
			//axisXName: 'x',
			//axisYName: 'sin(x)',

			
			return this.holder.path( path.toString() ).attr({stroke: color});
		},
		
		drawAxis: function( ox,oy,w,h,xmin,ymin,x,y ) {
			x = x || 0;
			y = y || 0;
			new Graffi.PathWrapper()
				.M( Math.round(ox), Math.round(oy)+h + (y+ymin)*h/yrange )
				.H( Math.round(ox + w) )
				.M( ox - (x+xmin)*w/xrange , oy)
				.V( Math.round(oy + h) );
			
			return this.holder.path( path.toString() ).attr({
				classname: 'axis',
				stroke:'#666',
				'stroke-width': '2px'
			});
		}
	
	};
	
})();