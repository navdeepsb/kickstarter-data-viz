// ...
const pointRadius = 1.5;
const innerCircleRadius = 50;
const VIZ_W = 500;
const VIZ_H = 500;
const SVG_NS = "http://www.w3.org/2000/svg";
const svgElem = document.getElementById( "main" );
const dataElem = document.getElementById( "data" );
const loaderElem = document.getElementById( "loader" );
const tipElem = document.getElementById( "tooltip" );
const filtersElem = document.getElementById( "filters" );
const offsetCheckElem = document.getElementById( "showOffsetCheck" );
const anchorCheckElem = document.getElementById( "anchorMonthCheck" );
const monthSelectorElem = document.getElementById( "monthSelector" );
const activeMonthElem = document.getElementById( "activeMonth" );
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
const months = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec"
];


// ...
let categories = {};
let categoriesToShow = [];
let pointElems = [];
let showOffset = offsetCheckElem.checked;
let tipInfo = null;
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
let getCategoryClassName = ( s ) => "path__point--cat" + Object.keys( categories ).indexOf( s );
let getMonthClassName    = ( s ) => "path__point--month" + s;
let getPropsToShow = ( d ) => {
    let _d = {};
    Object.keys( tipData ).forEach( ( k ) => _d[ k ] = d[ k ] );
    return _d;
};


// ...
let getPointToRender = ( datum ) => {
    let pointElem   = null;
    let thisCatg    = getCategoryClassName( datum.category_name );
    let monthIdx    = +datum.launch_date.substr( 5, 2 ) - 1;;
    let monthAngle  = monthIdx / 12 * 360;
    let offsetAngle = showOffset ? datum.score * 15 : 0;
    let percPledged = Math.round( datum.perc_pledged );

    pointElem = document.createElementNS( SVG_NS, "circle" );
    pointElem.setAttribute( "cx", 250 );
    pointElem.setAttribute( "cy", 250 );
    pointElem.setAttribute( "r", pointRadius );
    pointElem.setAttribute( "data-info", JSON.stringify( getPropsToShow( datum ) ) );
    pointElem.setAttribute( "data-month-angle", monthAngle );
    pointElem.setAttribute( "data-offset-angle", datum.score * 15 );
    pointElem.setAttribute( "data-perc-pledged", percPledged );
    pointElem.setAttribute( "data-cat", thisCatg );
    pointElem.setAttribute( "transform", `
        rotate(${ window.isNaN( monthAngle + offsetAngle ) ? 0 : monthAngle + offsetAngle } 250,250)
        translate(${ innerCircleRadius + percPledged } 0)
        ` );
    pointElem.addEventListener( "mouseover", showTip );
    pointElem.addEventListener( "mouseleave", hideTip );
    pointElem.classList.add( "path", "path__point", thisCatg, `${ getMonthClassName( monthIdx ) }` );

    pointElems.push( pointElem );

    return pointElem;
};

let updatePointsToRender = () => {
    let pointElem = null;

    for( let j = pointElems.length - 1; j >= 0; j-- ) {
        pointElem = pointElems[ j ];

        // Decide whether to show/hide this data point on the basis
        // of categories filter:
        pointElem.classList.remove( "path__point--hidden" );
        if( categoriesToShow.indexOf( pointElem.getAttribute( "data-cat" ) ) < 0 ) {
            pointElem.classList.add( "path__point--hidden" );
        }
    }
};

let loadVIz = ( data ) => {

    for( let i = 0, len = data.length; i < len; i++ ) {
        let d = data[ i ];
        let c = d.category_name;

        // Aggregate categories:
        if( !categories.hasOwnProperty( c ) ) {
            categories[ c ] = 0;
        }
        ++categories[ c ];

        // Append the data point to DOM:
        dataElem.appendChild( getPointToRender( d ) );
    }

    // Make filters:
    let ct = null;
    let li = null;
    Object.keys( categories ).forEach( ( c ) => {
        ct = getCategoryClassName( c );
        li = document.createElement( "li" );
        li.classList.add( "filter", ct );
        li.innerHTML = `
            <input type="checkbox" id="${ ct }" checked="checked" data-cat="${ ct }" />
            <label for="${ ct }">${ c } (${ categories[ c ] })</label>
        `;

        li.querySelector( "input[type=checkbox]" ).addEventListener( "change", () => {
            updateCurrCategories();
            updatePointsToRender();
        });

        filtersElem.appendChild( li );
    });

    // And update current categories initially:
    updateCurrCategories();

    // Hide the loader:
    loaderElem.innerText = "Hover over each project to view details...";
};


// ...
let toggleSentimentOffset = () => {
    showOffset = !showOffset;

    let ma = oa = pp = null;
    Array.prototype.forEach.call( document.getElementsByClassName( "path__point" ), ( pt ) => {
        ma = +pt.getAttribute( "data-month-angle"  );
        oa = showOffset ? +pt.getAttribute( "data-offset-angle" ) : 0;
        pp = +pt.getAttribute( "data-perc-pledged" );

        pt.setAttribute( "transform", `
            rotate(${ window.isNaN( ma + oa ) ? 0 : ma + oa } 250,250)
            translate(${ innerCircleRadius + pp } 0)
            ` );
    });
};
let focusSelectedMonthProjects = () => {
    let mi = +monthSelectorElem.value;
    const DEFAULT = -1;

    // Show this month:
    activeMonthElem.innerHTML = months[ mi ] || "";

    // Add/remove `inactive` class to the project points based on month selected:
    Array.prototype.forEach.call( document.getElementsByClassName( "path__point" ), ( pt ) => {
        pt.classList.remove( "path__point--inactive" );
        if( !pt.classList.contains( getMonthClassName( mi ) ) && mi !== DEFAULT ) {
            pt.classList.add( "path__point--inactive" );
        }
    });
};
let anchorVizToSelectedMonth = () => {
    let mi = anchorCheckElem.checked ? +monthSelectorElem.value : 0;
    svgElem.setAttribute( "transform", `rotate(${ ( ( !( mi + 1 ) ? 0 : mi ) / 12 * -360 ) - 90 } 250,250)` );
};
let updateCurrCategories = () => {
    categoriesToShow = [];
    Array.prototype.forEach.call( document.querySelectorAll( ".filter input[type=checkbox]" ), ( c ) => {
        if( c.checked ) categoriesToShow.push( c.getAttribute( "data-cat" ) );
    });
};


// ...
Object.keys( tipData ).forEach( ( k ) => {
    tipInfo = document.createElement( "div" );
    tipInfo.classList.add( "row" );
    tipInfo.innerHTML = `
        <div class="col col--right"><p>${ tipData[ k ] }:</p></div>
        <div class="col"><p><span id="${ k }">x</span></p></div>
    `;

    tipElem.appendChild( tipInfo );
});

months.forEach( ( m, i ) => {
    let monthOption = document.createElement( "option" );
    monthOption.value = i;
    monthOption.innerText = m;
    monthSelectorElem.appendChild( monthOption );
});

offsetCheckElem.addEventListener( "change", toggleSentimentOffset );
anchorCheckElem.addEventListener( "change", anchorVizToSelectedMonth );
monthSelectorElem.addEventListener( "change", focusSelectedMonthProjects );

anchorVizToSelectedMonth();




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


