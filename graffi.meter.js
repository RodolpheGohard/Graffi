
(function() {
	
	var ratioToAngle = Math.PI*2;
	var radToDeg = 180/Math.PI;
	
	/**
	 * draws a meter chart
	 * @author Rodolphe Gohard
	 * @class Meter
	 * @extends Chart
	 * @constructor
	 * @param holder the Raphael paper to print on
	 * @param iterator the iterator over the data set to 'query'
	 * @param parameters some options for customizing
	 */
	Graffi.Meter = function( holder, iterator, parameters ) {
		if ( !holder || !iterator || !parameters) return;
		
		this.holder = holder;
		this.iterator = iterator;
		
		this.width = holder.width-70;
		this.height = holder.height-70;
		
		this.renderer.drawFrame( this,30,30,360,260 );
		this.renderer.drawNeedle( this, 30,30,360,260, 50 );
	};
	Graffi.Meter.prototype = new Graffi.Chart();
	
	Graffi.Meter.prototype.renderer = {
		drawNeedle: function( meter, a, d, label, color ) {
			
		},
		
		drawFrame: function( meter,x,y,w,h ) {
			var path = new Graffi.PathWrapper();
			var ouverture = Math.PI / 3;
			var fermeture = Math.PI/2 - ouverture;
			var radius = w / (2*Math.cos(fermeture)); //w = 2 opposés = 2cos(o)*R <=> R=W/2cos(o) 
			var meterHeight = radius*0.2;
			var smallRadius = radius - meterHeight;
			//The point A is where the ouverture line meets the circle on the left
			var Ay = Math.sin( Math.PI/2+ouverture )*radius;
			var Ax = Math.cos( Math.PI/2+ouverture )*radius;
			//the Arc will start so that it will be at top a y=0(svg coords)
			var startY = y + radius - Ay;
			
			path.M( x, startY )
				.a( radius, radius, 0, 0, 1, w, 0 )
				//.l( h*.2*Math.cos(angle),h*.2*Math.sin(angle) )
				.L( Math.round( Math.cos(fermeture)*smallRadius + x + w/2 ),
					Math.round( -Math.sin(fermeture)*smallRadius + y + radius )  )
				.a( smallRadius, smallRadius, 0, 0, 0,
					Math.round( -w * smallRadius/radius ),
					0
				).Z();
				
			return meter.holder.path( path ).attr({
				stroke: '#666',
				'stroke-width': 1,
				fill: '90-#777-#EEE'
			});
		},
		
		drawNeedle: function( meter,x,y,w,h,amount) {
			var path = new Graffi.PathWrapper();
			path.M( x+w/2, y+10 )
				.l( 7 , 20 )
				.v( 25 )
				.l( -14 , 0 )
				.v(-25 )
				.Z();
			return meter.holder.path( path ).attr({
				fill:'red',
				stroke: '#600'
			});
		},
		
		highlight: function( needle ) {
			needle.element.toFront();
			needle.element.attr({
				'stroke-width':6
			});
		},
		
		unhighlight: function( needle ) {
			needle.element.attr({
				'stroke-width':0
			});
		}
	};
	
	Graffi.Meter.prototype.highlight = function( oid ) {
		return this.renderer.highlight( this.needles[oid] );	
	}
	
	Graffi.Meter.prototype.unhighlight = function( oid ) {
		return this.renderer.unhighlight( this.needles[oid] );	
	}
	
})();
