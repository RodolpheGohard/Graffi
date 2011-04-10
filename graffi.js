/*
 * @author Rodolphe Gohard
 */


(function() {
	
	/**
	 * Graffi is both the namespace object and like a 'façade' to create charts
	 * @method Graffi
	 * @param block where to create the space to hold graphics. Can be an Id, an HTML element,
	 * or an already intaciated Raphael Paper.
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
	 */
	Graffi.IteratorFactory={};
	Graffi.IteratorFactory.create1DIteratorFrom1DArray = function( data ) {
		var labels = [],
			l = data.length;
			colors = Graffi.IteratorFactory.generateWheelColors( l );
		labels.length = l;
		colors.length = l;
		return new Graffi.Iterator1D( data, labels, colors );
	};
	
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
	Graffi.IteratorFactory.generateWheelColors = function( l ) {
		var i;
		var valueRolls = l / 8;
		var generatedColors = [];
		
		generatedColors.length = l;
		
		for ( i=0; i<l ; i++ ) {
			generatedColors[i] = Graffi.hsl2rgb( hues8[ i%8 ], 255, 180- ( i*100/(valueRolls*8) )  );
		}
		
		return generatedColors;
	}
	
	/**
	 *
	 * implemented from http://en.wikipedia.org/wiki/HSL_color_space#From_HSL
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
		m = Math.floor( m*256 )

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
	
	


	
	
	
	window.Graffi = Graffi;
	
})();