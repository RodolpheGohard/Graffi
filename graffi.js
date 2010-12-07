/**
 * @author Rodolphe Gohard
 */


(function() {
	
	/**
	 * Graffi is both the namespace object and like a façade to create charts
	 */
	var Graffi = function( block, data, parameters ) {
		
		var holder,
			width,
			height,
			iterator;
		
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
		
		switch ( parameters.charType ) {
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
		
	}
	
	/**
	 * Irerator factory contains convenience methods to generate iterators and stuff
	 */
	Graffi.IteratorFactory={};
	Graffi.IteratorFactory.create1DIteratorFrom1DArray = function( data ) {
		var labels = [],
			l = data.length;
			colors = Graffi.IteratorFactory.generateColorsArray( l );
		labels.length = l;
		colors.length = l;
		return new Graffi.Iterator1D( data, labels, colors );
	};
	
	Graffi.IteratorFactory.createMulti1DIteratorFrom2DArray = function( data ) {
		var labels = [],
			l = data.length;
			colors = Graffi.IteratorFactory.generateColorsArray( l );
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
	}
	
	
	


	
	
	
	window.Graffi = Graffi;
	
})();