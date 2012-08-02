/**
 * @author Rodolphe Gohard
 */

(function(){
	



	/**
	 * Draws a single line chart
	 * @class Line
	 * @param holder a pointer to a raphael paper
	 * @param iterator a pointer to an iterator over the data to be displayed
	 * @param parameters some additional parameters to control the displaying
	 */
	Graffi.Line = function ( holder, iterator, parameters ) {
		if ( !holder || !iterator || !parameters) return;
		
		var ymin = parameters.yMin || 0,
			xmin = parameters.xMin || 0,
			ymax = parameters.yMax || iterator.max() || 10,
			xmax = parameters.xMax || iterator.length || 10, //those "|| 10" prevent divisions by zero
			xscale,
			yscale;
		
		this.holder = holder;
		this.iterator = iterator;
		
		this.width = holder.width-50;
		this.height = holder.height-40;
		
		this.xMin = xmin;
		this.xMax = xmax;
		this.yMin = ymin;
		this.yMax = ymax;
		
		
		//this.drawGrid( 40, 10, this.width, this.height, xmax, ymax, 10, 5, true);
		this.drawGridOptions( 40, 10, this.width, this.height, xmin, ymin, xmax, ymax, parameters );
		//this.drawAxis( 40, 10, this.width, this.height, xmin, ymin, parameters.yAxis, parameters.xAxis );
		
		//which width for a bar
		xscale = this.width / (xmax-xmin);
		//which height is a unit
		yscale = this.height / (ymax-ymin);
		
		
		this.drawer = parameters.lineDrawer || Graffi.Line.straightLineDrawer;
		this.drawLines( 40, this.height+10, this.width, this.height, this.width/iterator.length, yscale );
		
		if ( parameters.dots ) {
			this.drawDots(
				parameters.dots, 
				40, this.height+10, 
				this.width, 
				this.height, 
				this.width/iterator.length, 
				yscale, 
				parameters.dotsHrefs
			);
		}
	};
	
	Graffi.Line.prototype = new Graffi.Chart();
	
	Graffi.Line.prototype.drawDots = function( dots,x,y,w,h,xscale,yscale,dotsHrefs ) {
		
		var current,
			i=0,
			points = [],
			color = this.iterator.getColor();
	
		this.iterator.reset();
		
		//TODO: merge the points generation on drawLines and drawDots
		while ( current = this.iterator.next() ) {
			var point = new Graffi.Component( this );
			point.x = (i)*xscale+x;
			point.y = y-(current[0]-this.yMin)*yscale;
			point.element = this.holder.circle( point.x, point.y, 5 ).attr( {
				fill: color,
				stroke: Graffi.ColorTools.darkenRGBabs( color, 20 ),
				'stroke-width' : 2
			} );
			
			//if a content is specified, we place it
			if ( dots[i] ) point.tooltip( dots[i] );
			if ( dotsHrefs && dotsHrefs[i] ) point.element.attr( 'href', dotsHrefs[i] );
			i++;
		}
	};
	
	Graffi.Line.prototype.drawLines = function( x,y,w,h,xscale,yscale ) {
		//assuming one series only, and x-fixed intervals
		var current,
			i=0,
			points = [],
			color = this.iterator.getColor();
		
		while ( current = this.iterator.next() ) {
			points.push( [ (i)*xscale+x, y-(current[0]-this.yMin)*yscale  ] );
			//color = current[2];
			i++;
		}
		
		this.drawer.drawLine( this.holder, points, color );
	};
	
	Graffi.Line.prototype.drawer = Graffi.Line.straightLineDrawer = {
		drawLine: function( holder, points, color ) {
			var i=0,
				l=points.length,
				path;
			if ( points.length==0 ) return;
			
			path = 'M'+points[0][0]+' '+points[0][1];
			
			for ( i=1 ; i<l ; i++) {
				path += 'L'+points[i][0]+' '+points[i][1];
			}
			
			holder.path( path ).attr( {
				stroke: color,
				'stroke-width':2,
				'stroke-linecap': 'round',
				'stroke-linejoin': 'round'
			} );
			
			//path += 'L'+points[i][0]
		}
		
	};
	/**
	 * Warning: shitty behaviour for non positive curves
	 */
	Graffi.Line.FilledLineDrawer = {
		drawLine: function( holder, points, color, curvebounds ) {
			var i=0,
				l=points.length,
				path;
			if ( points.length==0 ) return;
			
			if ( curvebounds ) {
				path = 'M'+curvebounds[0]+' '+curvebounds[1] +
						'L'+points[0][0]+' '+points[0][1];
			} else
				path = 'M'+points[0][0]+' '+points[0][1];
			
			for ( i=1 ; i<l ; i++) {
				path += 'L'+points[i][0]+' '+points[i][1];
			}
			
			if ( curvebounds )
				path += 'L'+curvebounds[2]+' '+curvebounds[3];
			
			holder.path( path ).attr( {
				stroke: color,
				'stroke-width':2,
				'stroke-linecap': 'round',
				'stroke-linejoin': 'round',
				'fill': color,
				'fill-opacity': 0.3
			} );
			
			//path += 'L'+points[i][0]
		}
	};
	Graffi.Line.TsmoothLineDrawer = {
			drawLine: function( holder, points, color ) {
				var i=0,
					l=points.length,
					path;
				if ( points.length==0 ) return;
				
				path = new Graffi.PathWrapper().M( points[0][0] , points[0][1] );
				
				for ( i=1 ; i<l ; i++) {
					path.T( points[i][0], points[i][1] );
				}
				
				holder.path( path ).attr( {
					stroke: color,
					'stroke-width':2,
					'stroke-linecap': 'round',
					'stroke-linejoin': 'round'
				} );

			}
	};
	
	/**
	 * Draws a multi - lines chart
	 * @class MultiLine
	 * @param holder a pointer to a raphael paper
	 * @param iterator a pointer to an iterator over the data to be displayed
	 * @param parameters some additional parameters to control the displaying
	 */
	Graffi.MultiLine = function( holder, iterator, parameters ) {
		if ( !holder || !iterator || !parameters) return;
		
		var ymin = parameters.yMin || 0,
	        xmin = parameters.xMin || 0,
	        ymax = parameters.yMax || iterator.max() || 10,
	        xmax = parameters.xMax || iterator.get(0).iterator.length-1,
	        xscale,
	        yscale;
		
		this.holder = holder;
		this.iterator = iterator;
		
		this.width = holder.width-50;
		this.height = holder.height-40;
		
		this.xMin = xmin;
        this.xMax = xmax;
        this.yMin = ymin;
        this.yMax = ymax;
		
		this.drawGridOptions( 40, 10, this.width, this.height, xmin, ymin, xmax, ymax, parameters );
		
		//which width for a bar
		xscale = this.width / xmax;
		//which height is a unit
		yscale = this.height /ymax;
		

		this.drawer = parameters.lineDrawer || Graffi.Line.straightLineDrawer;
		this.drawLines( 40, this.height+10, this.width, this.height, xscale, yscale );
	};
	Graffi.MultiLine.prototype = new Graffi.Line();
	Graffi.MultiLine.prototype.drawLines = function( x,y,w,h,xscale,yscale ) {
		var currentSeries,
			currentValue,
			is=0,
			iv=0,
			points,
			color;
		
		//Looop the series
		while ( currentSeries = this.iterator.next() ) {
			is=0;
			points = [];
			color = currentSeries.color;
			//Loop values in current Series
			while ( currentValue = currentSeries.iterator.next() ) {
				points.push( [ is*xscale+x, y-currentValue[0]*yscale  ] );
				is++;
			}
			//Draw current series
			this.drawer.drawLine( this.holder, points, color, [x,y,x+w,y] );
			iv++;
		}
	};
	
})();
