/**
 * @author Rodolphe Gohard
 */

(function() {
	
	/**
	 * Bar draws bar charts
	 * @class Bar
	 * @param holder a pointer to a raphael paper
	 * @param iterator a pointer to an iterator over the data to be displayed
	 * @param parameters some additional parameters to control the displaying
	 */
	Graffi.Bar = function( holder, iterator, parameters ) {
		if ( !holder || !iterator || !parameters) return;
		
		var ymax=10,
			xmax=iterator.length
			xscale,
			yscale;
		
		this.holder = holder;
		this.iterator = iterator;
		
		this.width = holder.width-50;
		this.height = holder.height-40;
		
		this.drawGrid( 40, 10, this.width, this.height, xmax, ymax, iterator.length, 5, true);
		
		//which width for a bar
		var xscale = this.width / xmax;
		//which height is a unit
		var yscale = this.height /ymax;
		
		this.drawBars( 40, this.height+10, this.width, this.height, xscale, yscale );
	}
	
	Graffi.Bar.prototype = new Graffi.Chart();
	/**
	 * draw the bars on the specified 'viewport' delimited by paremeters.
	 * @method drawBars
	 * @protected
	 */
	Graffi.Bar.prototype.drawBars = function( x, y, w, h, xscale, yscale ) {
			var currentValue = null,
				i=0;
			while ( currentValue=this.iterator.next() ) {
				this.drawer.drawBar(
					this.holder, 
					x+i*xscale, 
					y-currentValue[0]*yscale,
					xscale,
					currentValue[0]*yscale,
					currentValue[2] );
				i++;
			}
		};
		
	Graffi.Bar.prototype.drawer = {
			drawBar: function( holder, x, y, w, h, color ) {
				var returnv = holder.rect(x,y,w,h,5).attr({color:color,fill:color});
				holder.rect(x+1,y+1,w/4-2,h-2,5).attr({stroke:'none',fill:'White',opacity:0.1});
				holder.rect(x+3*w/4,y+1,w/4-2,h-2,5).attr({stroke:'none',fill:'Black',opacity:0.1});
				return returnv;
			}
	}
	
	
	
	
	
	
	/**
	 * MultiBar draws bar charts for several series
	 * @class MultiBar
	 * @param holder a pointer to a raphael paper
	 * @param iterator a pointer to an iterator over the data to be displayed
	 * @param parameters some additional parameters to control the displaying
	 */
	Graffi.MultiBar = function( holder, iterator, parameters ) {
		var ymax=10,
			xmax=iterator.get(0).iterator.length
			xscale,
			yscale;
		
		this.holder = holder;
		this.iterator = iterator;
		
		this.width = holder.width-50;
		this.height = holder.height-40;
		
		this.drawGrid( 40, 10, this.width, this.height, xmax, ymax, iterator.length, 5, true);
		
		//which width for a bar
		var xscale = this.width / xmax;
		//which height is a unit
		var yscale = this.height /ymax;
		
		this.drawBars( 40, this.height+10, this.width, this.height, xscale, yscale );
	}
	
	Graffi.MultiBar.prototype = new Graffi.Bar();
	/**
	 * draw the bars on the specified 'viewport' delimited by paremeters.
	 * @method drawBars
	 * @protected
	 */
	Graffi.MultiBar.prototype.drawBars = function( x, y, w, h, xscale, yscale ) {
		var currentSeries,
			currentValue,
			is=0,
			iv=0,
			points,
			color;
	
		//Looop the series
		while ( currentSeries = this.iterator.next() ) {
			is=0;
			color = currentSeries.color;
			//Loop values in current Series
			while ( currentValue = currentSeries.iterator.next() ) {
				this.drawer.drawBar(
					this.holder, 
					x+is*xscale + iv*(xscale / this.iterator.length) + (xscale*0.333)*(this.iterator.length-iv)/this.iterator.length, //We shift the xoff by the size of a bar per previous series
					y-currentValue[0]*yscale,
					(xscale*0.66) / this.iterator.length, //We divide width by # to make them fill correctly the space
					currentValue[0]*yscale,
					color );
				is++;
			}
			iv++;
		}
	};

	
})();
