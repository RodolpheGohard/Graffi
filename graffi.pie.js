
(function() {
	
	/**
	 * @author Rodolphe Gohard
	 * @class Pie
	 */
	Graffi.Pie = function( holder, iterator, parameters ) {
		var shares = [], values=[];
		var total = 0;
		var currentAngle = Math.PI/2;
		var current;
		var i,l;
		
		//We get the total
		while( current = iterator.next() ) {
			total += current;
			values.push( current );
		}
		
		//Maybe some ordering here
		
		//We compute the relative shares
		for ( i=0,l=values.length ; i<l ; i++ ) {
			shares[i] = values[i]/total;
			
			this.portionRenderer.drawPortion( currentAngle, shares[i] );
			
		}
		
		
		
		
	};
	Graffi.Pie.prototype = new Graffi.Chart();
	
	Graffi.Pie.prototype.portionRenderer = {
		drawPortion: function( startAngle, amount ) {
			
		}	
	};
	
})();
