// ...
const pointRadius = 1.5;
const innerCircleRadius = 50;
const SVG_NS = "http://www.w3.org/2000/svg";
const dataElem = document.getElementById( "data" );
const loaderElem = document.getElementById( "loader" );
const tipElem = document.getElementById( "tooltip" );
const showOffset = true;
const dataFile = "/data/final-data-opt-500rec.min.json";
// const dataFile = "/data/final-data-opt-140862rec.min.json";
const tipData = {
	"name": "Name",
	"category_name": "Category",
	"launch_date": "Launched on",
	"goal": "Goal",
	"pledged": "Pledged",
	"perc_pledged": "% pledged",
	"score": "Sentiment score",
};


// ...
let tipInfo = null;
Object.keys( tipData ).forEach( ( k ) => {
	tipInfo = document.createElement( "div" );
	tipInfo.classList.add( "row" );
	tipInfo.innerHTML = `
		<div class="col col--right"><p>${ tipData[ k ] }:</p></div>
		<div class="col"><p><span id="${ k }">x</span></p></div>
	`;

	tipElem.appendChild( tipInfo );
});
let showTip = ( e ) => {
	let currInfo = JSON.parse( e.target.getAttribute( "data-info" ) );
	Object.keys( tipData ).forEach( ( k ) => {
		$( "#" + k ).text( currInfo[ k ] );
	});
	tipElem.classList.remove( "hide" );
};
let hideTip = ( e ) => {
	tipElem.classList.add( "hide" );
};


// ...
let categories = {};
let getCategoryClassName = ( s ) => "cat--" + s.replace( " ", "-" ).toLowerCase();


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
		pointElem.setAttribute( "r", pointRadius );
		pointElem.setAttribute( "data-info", JSON.stringify( d ) );
		pointElem.classList.add( "path", "path--point", `${ getCategoryClassName( d.category_name ) }` );

		pointElem.addEventListener( "mouseover", showTip );
		pointElem.addEventListener( "mouseleave", hideTip );

		monthIdx = window.parseInt( d.launch_date.substr( 5, 2 ) ) - 1;
		offsetAngle = ( monthIdx / 12 * 360 ) + ( showOffset ? d.score * 15 : 0 );

		pointElem.setAttribute( "transform", `
			rotate(${ window.isNaN( offsetAngle ) ? 0 : offsetAngle } 250,250)
			translate(${ innerCircleRadius + Math.round( d.perc_pledged )} 0)
			` );

		dataElem.appendChild( pointElem );

		if( !categories.hasOwnProperty( d.category_name ) ) {
			categories[ d.category_name ] = 0;
		}
		categories[ d.category_name ] += 1;
	}

	loaderElem.classList.add( "hide" );
	console.log( categories );
});


