// ...
const innerCircleRadius = 50;
const SVG_NS = "http://www.w3.org/2000/svg";
const dataElem = document.getElementById( "data" );
const loaderElem = document.getElementById( "loader" );
const showOffset = true;
const dataFile = "/data/final-data-opt-500rec.min.json";
// const dataFile = "/data/final-data-opt-140862rec.min.json";


// ...
$.getJSON( dataFile, ( data, msg ) => {
	let d = null;
	let pointElem = null;
	let monthIdx = null;
	let offsetAngle = null;

	for( let i = 0, len = data.length; i < len; i++ ) {
		d = data[ i ];

		pointElem = document.createElementNS( SVG_NS, "circle" );
		pointElem.setAttribute( "cx", 250 );
		pointElem.setAttribute( "cy", 250 );
		pointElem.setAttribute( "r", 0.7 );
		pointElem.classList.add( "path", "path--filled" );

		monthIdx = window.parseInt( d.launch_date.substr( 5, 2 ) );
		offsetAngle = ( monthIdx / 12 * 360 ) + ( showOffset ? d.score * 15 : 0 );

		pointElem.setAttribute( "transform", `
			rotate(${ window.isNaN( offsetAngle ) ? 0 : offsetAngle } 250,250)
			translate(${ innerCircleRadius + Math.round( d.perc_pledged )} 0)
			` );

		// console.log( pointElem )
		dataElem.appendChild( pointElem );
	}

	loaderElem.remove();
});


