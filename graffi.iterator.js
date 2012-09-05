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
		};
		this.max = function() {
			return Math.max.apply(this, data);
		};
		this.reset = function() {
			this.index = 0;
			return this;
		};
		this.getColor = function() { return colors[0];};
		this.csv = function() {
			var i=0,
				l=data.length,
				csv = '';
			for ( ; i<l ; i++ ) {
				csv += data[i];
				csv += ((labels&&labels[i])?labels[i]+',':'') + '\n';
			}
			return csv;
		};
	};
	/*Graffi.Iterator1D.prototype.max = function() {
		
	};*/
	
	/**
	 * generate an iterator over several 1dimensionnal series
	 * @class Iterator1dMulti
	 */
	Graffi.Iterator1dMulti = function( data, labels, colors ) {
		this.index = 0;
		this.length = data.length;
		
		this.get = function( n ) {
			var voidarray = [];
			var rvalue;
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
		};

		this.reset = function() {
			this.index = 0;
			return this;
		};
		this.max = function() {
			if ( this.maxValue === undefined ) {
				for (var i=0;i<this.length;i++) {
					for (var j=0;j<data[i].length;j++) {
						if ( !(data[i][j] < this.maxValue) )
							this.maxValue = data[i][j];
					}
				}
			}
			return this.maxValue;
		};
		this.csv = function() {
			this.reset();
			var subIt,series,csv='';
			while( series = this.next() ) {
				subIt = series.iterator.reset();
				csv += series.label;
				var subs;
				while( subs = subIt.next() ) {
					csv += ',' + subs[0];
				}
				csv += '\n';
			}
			return csv;
		};
		this.openCsv = function( title ){
			var url = 'data:text/csv;charset=utf-8;,' + encodeURIComponent( this.csv() );
			window.open( url, title||'_blank' );
		};
	};
	
})();