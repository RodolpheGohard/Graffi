/*
The MIT License

Copyright (c) 2011 Rodolphe GOHARD

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
(function() {
	/**
	 * don't new it.
	 * @class Graffi
	 */
	/**
	 * Graffi is both the namespace object and like a 'façade' to create charts
	 * @method Graffi
	 * @param block where to create the space to hold graphics. Can be an Id, an HTML element,
	 * or an already instanciated Raphael Paper.
	 * @data the data to be drawn. Graffi accepts multiple kind of data and will try to detect
	 * how they are formed: 1d array, 2d array, sets of points, and consequently which type of 
	 * chart bests suits your data ... Those detections mechanisms can be disabled/forced with
	 * some options to set in parameters.
	 * @options options give you lot of controls to customize the rendering of your charts
	 * Here's what you can specify:
	 * .width
	 * .height
	 * .chartType
	 * You can alors specify extra options as they will be passed to the Chart constructor.
	 * please refer to each Chart's class documentation to read about them.
	 * 
	 */
	var Graffi = function( block, data, options ) {
		
		var holder,
			width,
			height,
			iterator,
			parameters= options;
		
		//Sanitizing parameters
		parameters = parameters || {};
		width = parameters.width || parameters.w || 450;
		height = parameters.height || parameters.h || 280;
		
		//Sanitizing block holder
		//TODO: make currect tests
		if ( !block ) {
			//block is nuthin
			block = document.createElement( 'div' );
			holder = Raphael( block, width, height );
		} else if ( block.split ) {
			//It's a str id
			block = document.getElementById( block ) || document.createElement( 'div' ); //in case str id is shit
			holder = Raphael( block, width, height );
		} else if ( block.nodeType == 1 ) {
			//It's a html element
			holder = Raphael( block, width, height );
		} else if ( block.raphael) {
			holder = block;
		}
		
		//We try to guess how data is formed. An iterator over the dataset is generated.
		if ( data.length ) {
			//it's an array
			if ( data[0].length ) {
				//2D or more array
				iterator = Graffi.IteratorFactory.createMulti1DIteratorFrom2DArray( data );
				
			} else {
				//One series only
				iterator = Graffi.IteratorFactory.create1DIteratorFrom1DArray( data );
			}
		}
		
		switch ( parameters.chartType ) {
			case 'line':
				return new Graffi.Line( holder, iterator, parameters );
			case 'multibar':
				return new Graffi.MultiBar( holder, iterator, parameters );
			case 'multiline':
				return new Graffi.MultiLine( holder, iterator, parameters );
			default:
			case 'bar':
				return new Graffi.Bar( holder, iterator, parameters );
			case 'pie':
				return new Graffi.Pie( holder, iterator, parameters );

		}
	};
	
	/**
	 * Iterator factory contains convenience methods to generate iterators and stuff
	 * @class IteratorFactory
	 * @static
	 */
	Graffi.IteratorFactory={};
	/**
	 * creates a 1 dimensionnal iterator for data like this: [0,2,54,12,X,Y...].
	 * Labels for each value will be empty and colors are generated per-value with generateWheelColors
	 * likely for piechart or barchart
	 * @method create1DIteratorFrom1DArray
	 */
	Graffi.IteratorFactory.create1DIteratorFrom1DArray = function( data ) {
		var labels = [],
			l = data.length;
			colors = Graffi.IteratorFactory.generateWheelColors( l );
		labels.length = l;
		colors.length = l;
		return new Graffi.Iterator1D( data, labels, colors );
	};
	/**
	 * creates a 1 dimensionnal iterator for data like this: [ [1,2,3,4],[1,4,9,16],[1,8,27,64] ].
	 * Labels for each series will be empty and colors are generated per-series with generateWheelColors
	 * @method createMulti1DIteratorFrom2DArray
	 */
	Graffi.IteratorFactory.createMulti1DIteratorFrom2DArray = function( data ) {
		var labels = [],
			l = data.length;
			colors = Graffi.IteratorFactory.generateWheelColors( l );
		labels.length = l;
		colors.length = l;
		return new Graffi.Iterator1dMulti( data, labels, colors );
	};
	
	/**
	 * Generates a collection of l colors, l given as parameter
	 * @method generateColorsArray
	 * @deprecated
	 */
	Graffi.IteratorFactory.generateColorsArray = function( l ) {
		//Ugly, but hum
		var colorsList = [
  			"Red",
  			"Green",
  			"Blue",
  			"Yellow",
  			"#444",
  			"White",
  			"Purple",
  			"Pink",
  			"Gray",
  			"AliceBlue",
  			"Plum",
  			"Magenta",
  			"Orange",
  			"Lime",
  			"Coral",
  			"DarkGray",
  			"Aquamarine",
  			"Bisque",
  			"BlueViolet",
  			"Chartreuse",
  			"CornflowerBlue",
  			"DarkGoldenRod"
  			];
  		colorsList = colorsList.concat(colorsList);
  		colorsList.splice( l, 1000 );
  		return colorsList;
	};
	
	var hues8 = [ 0, 32, 64, 96, 128, 160, 192, 224];
	/**
	 * generates an array of l colors with a nice spectrum distance between colors
	 * @generateWheelColors
	 */
	Graffi.IteratorFactory.generateWheelColors = function( l ) {
		var i;
		var valueRolls = l / 8;
		var generatedColors = [];
		
		generatedColors.length = l;
		
		for ( i=0; i<l ; i++ ) {
			generatedColors[i] = Graffi.hsl2rgb( hues8[ i%8 ], 255, 180- ( i*100/(valueRolls*8) )  );
		}
		
		return generatedColors;
	};
	
	/**
	 *
	 * implemented from http://en.wikipedia.org/wiki/HSL_color_space#From_HSL
	 * @method hsl2rgb
	 * @param   Number  h       The hue
	 * @param   Number  s       The saturation
	 * @param   Number  l       The lightness
	 * @return  Array           The RGB representation
	 */
	Graffi.hsl2rgb = function( h, s, l) {
		var chroma;
		var hue360 = h*360/256;
		var light1 = l/256;
		var sat1 = s/256;
		var hp;
		var m;
		var x;
		
		chroma = ( 1-Math.abs( 2*light1-1 ) ) * sat1 ;
		hp =hue360/60;		
		m = light1 - chroma/2;
		x = Math.floor( ( (chroma * ( 1-Math.abs( hp%2-1 ) )) +m)*256 ); ;		
		chroma = Math.floor( (chroma+m)*256 );
		m = Math.floor( m*256 );

		hp = Math.floor(hp);
		switch(hp) {
		case 0: return 'rgb('+[chroma,x,m]+')';
		case 1: return 'rgb('+[x,chroma,m]+')';
		case 2: return 'rgb('+[m,chroma,x]+')';
		case 3: return 'rgb('+[m,x,chroma]+')';
		case 4: return 'rgb('+[x,m,chroma]+')';
		case 5: return 'rgb('+[chroma,m,x]+')';
		}
	};
	
	
	/**
	 * represents a component of a chart: pie slice, bar ... etc and provides convenient methods to it like tooltips
	 * @class Component
	 * @param chart
	 */
	Graffi.Component = function( chart ) {
		this.chart = chart;
	};
	Graffi.Component.prototype = {
		chart: null,
		
		/**
		 * declares a tooltip hover this component, which text content is given as parameter
		 * @method tooltip
		 * @param contents a string that will be printed in the tooltip
		 */
		tooltip: function( contents ) {
			var _that = this;
			var tt = _that.getTooltip();
			
			this.element.hover( function(event){
				var re = _that.chart.tooltip[0];
				var rt = _that.chart.tooltip[1];
				var p = re[0].parentElement;
				p.appendChild( _that.element[0] );
				p.appendChild( re[0] );
				p.appendChild( rt[0] );
				
				_that.element.attr({
					'stroke-width' : '8px',
					'stroke-linecap' : 'round',
					'stroke-linejoin' : 'round'
				});
				tt	.show()
					.translate( _that.x - tt[0].attr('x'), _that.y - tt[0].attr('y') )
				.tttext.attr({text:contents});
				
				
			} );
			
			this.element.mouseout( function(event) {
				_that.element.attr({
					'stroke-width' : '2px'
				});
				_that.getTooltip().hide();
			});
		},
		
		/**
		 * lazily returns the tooltip set
		 * @method getTooltip
		 * @returns {Raphael.set} the tooltip
		 */
		getTooltip : function() {
			if( this.chart.tooltip ) {
				//TODO: ie-comply this shit
				return this.chart.tooltip;
			}
			else {
				this.chart.tooltip = this.chart.holder.set();
				this.chart.tooltip.tttext = this.chart.holder.text(0,0,'').attr({
					'font-family': 'sans-serif',
					'font-size': '16px',
					'stroke': 'none',
					'stroke-width': '0',
					'fill': 'white',
					'font-weight': 'normal'
				});
				this.chart.tooltip.push(
					this.chart.holder.rect(-40, -15, 80, 30, 10).attr({
						fill: "Black",
						stroke: "white",
						"stroke-width": "2px",
						"z-index": 7
					}),
					this.chart.tooltip.tttext
				);
				return this.chart.tooltip.hide();
			}
		}
	};


	/**
	 * A wrapper for writing SVG paths in a function-chaining manner
	 * it's called like:
	 * <code>var path = new Graffi.PathWrapper()
	 * 				.M(100,100)
	 * 				.V(50)
	 * 				.H(50)
	 * 				.L(150,150)
	 * 				.Z().toString();</code>
	 * TODO: implement relative commands: m,l,a,z,h ...etc
	 * @class PathWrapper
	 * @see http://www.w3.org/TR/SVG/paths.html
	 */
	Graffi.PathWrapper = function() {
		this.str = '';
	};
	Graffi.PathWrapper.prototype = {
		str: null,
		M: function(x,y) {
			this.str += ' M'+x+','+y;
			return this;
		},
		L: function(x,y) {
			this.str += ' L'+x+','+y;
			return this;
		},
		A: function( rx, ry , angleDegrees, arcFlag, sweepFlag,x, y) {
			this.str += ' A'+rx+','+ry	+' '+angleDegrees	+' '+(arcFlag?1:0)+','+(sweepFlag?1:0)+' '	+x+','+y;
			return this;
		},
		Z: function() {
			this.str += ' Z';
			return this;
		},
		H: function(x) {
			this.str += ' H'+x;
			return this;
		},
		V: function(y) {
			this.str += ' V'+y;
			return this;
		},
		C: function( x1,y1,x2,y2,x,y ) {
			var i,l,a;
			this.str += ' C'+x1+','+y1+' '+x2+','+y2+' '+x+','+y;
			for ( i=6,l=a.length ; i<l; i+=6 ) {
				this.str += ' C'+a[i]+','+a[i+1]+' '+a[i+2]+','+a[i+3]+' '+a[i+4]+','+a[i+5];
			}
			return this;
		},
		S: function( x2,y2,x,y ) {
			var i,l,a=arguments;
			this.str += ' C'+x2+','+y2+' '+x+','+y;
			for ( i=6,l=a.length ; i<l; i+=4 ) {
				this.str += ' C'+a[i]+','+a[i+1]+' '+a[i+2]+','+a[i+3];
			}
			return this;
		},
		Q: function( x1,y1,x,y ) {
			var i,l,a=arguments;
			this.str += ' C'+x1+','+y1+' '+x+','+y;
			for ( i=6,l=a.length ; i<l; i+=4 ) {
				this.str += ' C'+a[i]+','+a[i+1]+' '+a[i+2]+','+a[i+3];
			}
			return this;
		},
		T: function( x,y ) {
			var i,l,a=arguments;
			this.str += ' C'+x+','+y;
			for ( i=6,l=a.length ; i<l; i+=2 ) {
				this.str += ' C'+a[i]+','+a[i+1];
			}
			return this;
		},
		toString: function() { return this.str; }
	};
	
	/**
	 * provide some color tools used in charts generation
	 * @class ColorTools
	 * @static
	 */
	Graffi.ColorTools = {
		/**
		 * darken a RGB color like this: darkenRGBabs( '#ABC' , 10 ) = '#9AB'
		 * and:   darkenRGBabs( '#A40' , 30 ) = '#710'
		 * don't mess with negative amounts.
		 * @param color
		 * @param amount
		 * @returns {String} the newly generated color in rgb(12,34,255) format
		 */
		darkenRGBabs: function( color, amount ) {
			 var ocolor = Raphael.getRGB( color );
			 ocolor.r -= amount;
			 ocolor.g -= amount;
			 ocolor.b -= amount;
			 if(ocolor.r<0) ocolor.r = 0;
			 if(ocolor.g<0) ocolor.g = 0;
			 if(ocolor.b<0) ocolor.b = 0;
			 
			 return 'rgb('+ocolor.r+','+ocolor.g+','+ocolor.b+')';
		}
	};
	
	window.Graffi = Graffi;
	
})();