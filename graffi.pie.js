
(function() {
	
	var ratioToAngle = Math.PI*2;
	var radToDeg = 180/Math.PI;
	
	/**
	 * draws a delicious looking piechart
	 * @author Rodolphe Gohard
	 * @class Pie
	 * @extends Chart
	 * @constructor
	 * @param holder the Raphael paper to print on
	 * @param iterator the iterator over the data set to 'query'
	 * @param parameters some options for customizing
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
		
		this.width = holder.width-70;
		this.height = holder.height-70;
		
		this.r = Math.min( this.width, this.height )/2;
		this.ox = holder.width/2; 
		this.oy = holder.height/2;
		
		//We get the total
		while( current = iterator.next() ) {
			total += current[0];
			values.push( current );
		}
		
		//Maybe some ordering here
		
		//Frame drawing
		this.renderer.drawFrame( this );
		
		//We compute and draw the relative shares
		var amount;
		this.slices = [];
		for ( i=0,l=values.length ; i<l ; i++ ) {
			shares[i] = values[i][0]/total;
			amount = shares[i]*ratioToAngle;
			this.slices.push( this.renderer.drawSlice( this, currentAngle, amount, values[i][1], values[i][2] ) );
			currentAngle -= amount;
		}
		
		
		
		
	};
	Graffi.Pie.prototype = new Graffi.Chart();
	
	Graffi.Pie.prototype.renderer = {
		drawSlice: function( pie, a, d, label, color ) {
			var r=pie.r;
			var slice = new Graffi.Component( pie );
			var x1 = pie.ox + Math.cos(a)*pie.r;
			var y1 = pie.oy - Math.sin(a)*pie.r;
			a -= d;
			var x2 = pie.ox + Math.cos(a)*pie.r;
			var y2 = pie.oy - Math.sin(a)*pie.r;
			pathStr = new Graffi.PathWrapper()
				.M( pie.ox,pie.oy) //Start at center
				.L( x1,y1 ) //line to starting angle
//				.A( r,r , d*radToDeg, 0,1, x2,y2 ) //Circle arc to end angle
				.A( r,r , 1, (d>Math.PI?1:0),1, x2,y2 ) //Circle arc to end angle
				.Z().toString(); //We close and have our slice path
			
//			pathStr = 
//				"M"+pie.ox+","+pie.oy+
//				' L'+x1+','+y1+
//				' A'+r+','+r	+' '+d*radToDeg	+' 0,1 '	+x2+','+y2+
//				'z';
			
			slice.element = slice.path = pie.holder.path( pathStr );
			slice.path.attr({
				fill:color,
				stroke: Graffi.ColorTools.darkenRGBabs( color, 20 )
			});
//			slice.x = (x1+x2+pie.ox)/3;
//			slice.y = (y1+y2+pie.oy)/3;
			slice.x = x1;
			slice.y = y1;
			
			if(label)slice.tooltip( label );
			
			return slice;
		},
		
		drawFrame: function( pie ) {
			return pie.holder.circle( pie.ox, pie.oy, pie.r+6 ).attr( {
				fill:'#446',
				stroke:'#333',
				'stroke-width': '5px'
			} );
		},
		
		highlight: function( slice ) {
			slice.element.toFront();
			slice.element.attr({
				'stroke-width':6
			});
		},
		
		unhighlight: function( slice ) {
			slice.element.attr({
				'stroke-width':0
			});
		}
	};
	
	Graffi.Pie.prototype.highlight = function( oid ) {
		return this.renderer.highlight( this.slices[oid] );	
	}
	
	Graffi.Pie.prototype.unhighlight = function( oid ) {
		return this.renderer.unhighlight( this.slices[oid] );	
	}
	
})();
