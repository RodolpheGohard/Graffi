
(function() {
	
	var ratioToAngle = Math.PI*2;
	var radToDeg = 180/Math.PI;
	
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
		
		if ( !holder || !iterator || !parameters) return;
		
		this.holder = holder;
		this.iterator = iterator;
		
		this.width = holder.width-50;
		this.height = holder.height-40;
		
		this.r = Math.min( this.width, this.height )/2;
		this.ox = holder.width/2; 
		this.oy = holder.height/2;
		
		//We get the total
		while( current = iterator.next() ) {
			total += current[0];
			values.push( current );
		}
		
		//Maybe some ordering here
		
		//We compute the relative shares
		var amount;
		for ( i=0,l=values.length ; i<l ; i++ ) {
			shares[i] = values[i][0]/total;
			amount = shares[i]*ratioToAngle;
			this.renderer.drawSlice( this, currentAngle, amount, values[i][1], values[i][2] );
			currentAngle -= amount;
			
		}
		
		
		
		
	};
	Graffi.Pie.prototype = new Graffi.Chart();
	
	Graffi.Pie.prototype.renderer = {
		drawSlice: function( pie, a, d, label, color ) {
			var r=pie.r;
			var slice = {};
			var x1 = pie.ox + Math.cos(a)*pie.r;
			var y1 = pie.oy - Math.sin(a)*pie.r;
			a -= d;
			var x2 = pie.ox + Math.cos(a)*pie.r;
			var y2 = pie.oy - Math.sin(a)*pie.r;			
			pathStr = 
				"M"+pie.ox+","+pie.oy+
				' L'+x1+','+y1+
				' A'+r+','+r	+' '+d*radToDeg	+' 0,1 '	+x2+','+y2+
				'z';
			
			console.log( pathStr );
			slice.path = pie.holder.path( pathStr );
			slice.path.attr({
				fill:color,
				stroke:'#333'
			});
			
		}	
	};
	
})();
