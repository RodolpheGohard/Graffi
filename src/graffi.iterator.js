/**
 * @author Rodolphe Gohard
 */
(function(){

	/**
	 * generate an iterator over a 1dimensionnal dataset
	 * @class Iterator1D
	 */
	Graffi.Iterator1D = function( data, labels, colors ) {
		this.index = 0;
		this.length = data.length;
		
		this.get = function( n ) {
			return [ data[n], labels[n], colors[n] ];
		};
		this.next = function() {
			if (this.index == this.length) return null;
			return this.get(this.index++);
		}
	};
	
	/**
	 * generate an iterator over several 1dimensionnal series
	 * @class Iterator1dMulti
	 */
	Graffi.Iterator1dMulti = function( data, labels, colors ) {
		this.index = 0;
		this.length = data.length;
		
		this.get = function( n ) {
			var voidarray = [];
			voidarray.length = data[n].length;
			//Maybe cache this returned object
			return {
				iterator: new Graffi.Iterator1D( data[n], voidarray, voidarray ),
				label: labels[n],
				color: colors[n]
			};
		};
		this.next = function() {
			if (this.index == this.length) return null;
			return this.get(this.index++);
		}
	}
	
})();