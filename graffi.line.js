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
		
		var ymax=10,
			xmax=iterator.length,
			xscale,
			yscale;
		
		this.holder = holder;
		this.iterator = iterator;
		
		this.width = holder.width-50;
		this.height = holder.height-40;
		
		
		this.drawGrid( 40, 10, this.width, this.height, xmax, ymax, 10, 5, true);
		
		//which width for a bar
		xscale = this.width / xmax;
		//which height is a unit
		yscale = this.height /ymax;
		
		
		this.drawLines( 40, this.height+10, this.width, this.height, xscale, yscale );
	};
	
	Graffi.Line.prototype = new Graffi.Chart();
	
	Graffi.Line.prototype.drawLines = function( x,y,w,h,xscale,yscale ) {
		//assuming one series only, and x-fixed intervals
		var current,
			i=0,
			points = [],
			color;
		
		while ( current = this.iterator.next() ) {
			points.push( [ i*xscale+x, y-current[0]*yscale  ] );
			color = current[2];
			i++;
		}
		
		this.drawer.drawLine( this.holder, points, color );
	};
	
	Graffi.Line.prototype.drawer = {
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
				'stroke-width':'4px',
				'stroke-linecap': 'round',
				'stroke-linejoin': 'round'
			} );
			
			//path += 'L'+points[i][0]
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
		var ymax=10,
			xmax=iterator.get(0).iterator.length,
			xscale,
			yscale;
		
		this.holder = holder;
		this.iterator = iterator;
		
		this.width = holder.width-50;
		this.height = holder.height-40;
		
		
		this.drawGrid( 40, 10, this.width, this.height, xmax, ymax, 10, 5, true);
		
		//which width for a bar
		xscale = this.width / xmax;
		//which height is a unit
		yscale = this.height /ymax;
		
		
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
			this.drawer.drawLine( this.holder, points, color );
			iv++;
		}
	};
	
})();
