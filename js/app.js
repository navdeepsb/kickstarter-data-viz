// ...
const pointRadius = 1.5;
const innerCircleRadius = 50;
const SVG_NS = "http://www.w3.org/2000/svg";
const dataElem = document.getElementById( "data" );
const loaderElem = document.getElementById( "loader" );
const tipElem = document.getElementById( "tooltip" );
const filtersElem = document.getElementById( "filters" );
const showOffset = true;
const dataFile = "data/final-data-opt-2000rec.min.json";
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
        document.getElementById( k ).innerText = currInfo[ k ];
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
const request = new XMLHttpRequest();
request.open( "GET", dataFile, true );

request.onload = () => {
    if( request.status >= 200 && request.status < 400 ) {
        // Success!
        let startTime = Date.now();
        loadVIz( JSON.parse( request.responseText ) );
        console.log( "Time taken:\n" + ( ( Date.now() - startTime ) / 1000 ) + " seconds" )
    } else {
        // We reached our target server, but it returned an error
        console.log( "An error occurred..." )
    }
};

request.onerror = function() {
    console.log( "Connection error occurred..." )
};

request.send();
let loadVIz = ( data, msg ) => {
    let d = null;
    let pointElem = null;
    let monthIdx = null;
    let offsetAngle = null;
    let thisCatg = null;
    let currCatg = location.href.split( "filter=" )[ 1 ];

    for( let i = 0, len = data.length; i < len; i++ ) {
        d = data[ i ];
        thisCatg = getCategoryClassName( d.category_name );

        if( currCatg && ( currCatg !== thisCatg ) ) {
            continue;
        }

        monthIdx = window.parseInt( d.launch_date.substr( 5, 2 ) ) - 1;
        offsetAngle = ( monthIdx / 12 * 360 ) + ( showOffset ? d.score * 15 : 0 );

        try {
            pointElem = document.createElementNS( SVG_NS, "circle" );
            pointElem.classList.add( "path", "path--point", thisCatg );
            pointElem.setAttribute( "cx", 250 );
            pointElem.setAttribute( "cy", 250 );
            pointElem.setAttribute( "r", pointRadius );
            pointElem.setAttribute( "data-info", JSON.stringify( d ) );
            pointElem.setAttribute( "transform", `
                rotate(${ window.isNaN( offsetAngle ) ? 0 : offsetAngle } 250,250)
                translate(${ innerCircleRadius + Math.round( d.perc_pledged )} 0)
                ` );
            pointElem.addEventListener( "mouseover", showTip );
            pointElem.addEventListener( "mouseleave", hideTip );

            dataElem.appendChild( pointElem );

            // Aggregate categories:
            if( !categories.hasOwnProperty( d.category_name ) ) {
                categories[ d.category_name ] = 0;
            }
            categories[ d.category_name ] += 1;

        } catch( ex ) {}
    }

    loaderElem.innerText = "Hover over each project to view details...";
    console.log( categories );

    // Show filters:
    let li = null;
    let link = null;
    Object.keys( categories ).forEach( ( c ) => {
        li = document.createElement( "li" );
        link = document.createElement( "a" );
        link.setAttribute( "href", "?filter=" + getCategoryClassName( c ) )
        link.innerText = c + " (" + categories[ c ] + ")";
        link.classList.add( "filter", getCategoryClassName( c ) );
        li.appendChild( link );
        filtersElem.appendChild( li );
    });
};


