// ...
const pointRadius = 2.5;
const W = window.innerWidth;
const H = 840;
const hc = W / 2;
const vc = H / 2;
const AXIS_LEN = H - 100;
const innerCircleRadius = 75;
const SVG_NS = "http://www.w3.org/2000/svg";
const svgElem = document.getElementById( "svg" );
const mainGrpElem = document.getElementById( "main" );
const axesGrpElem = document.getElementById( "axes" );
const dataGrpElem = document.getElementById( "data" );
const tipElem = document.getElementById( "tooltip" );
const filtersElem = document.getElementById( "filters" );
const offsetCheckElem = document.getElementById( "showOffsetCheck" );
const anchorCheckElem = document.getElementById( "anchorMonthCheck" );
const monthSelectorElem = document.getElementById( "monthSelector" );
const activeMonthElem = document.getElementById( "activeMonth" );
const sidebarElem = document.getElementById( "sidebar" );
const sidebarCTA = document.querySelector( "#sidebar__cta a" );
const filterImgElem = document.querySelector( "img.filter" );
const dataFile = "data/final-data-opt-photography-4301rec.min.json";
// const dataFile = "data/final-data-opt-2000rec.min.json";
const tipData = {
    "name": "Name",
    "category_name": "Category",
    "launch_date": "Launched on",
    "backers_count": "# of backers",
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
let colors = [
    { "val": "rgb(230,  25,  75)", "hex": "#e6194b" },
    { "val": "rgb( 60, 180,  75)", "hex": "#3cb44b" },
    { "val": "rgb(255, 225,  25)", "hex": "#ffe119", isLowContrast: true },
    { "val": "rgb(  0, 130, 200)", "hex": "#0082c8" },
    { "val": "rgb(245, 130,  48)", "hex": "#f58231" },
    { "val": "rgb(145,  30, 180)", "hex": "#911eb4" },
    { "val": "rgb( 70, 240, 240)", "hex": "#46f0f0", isLowContrast: true },
    { "val": "rgb(240,  50, 230)", "hex": "#f032e6" },
    { "val": "rgb(210, 245,  60)", "hex": "#d2f53c", isLowContrast: true },
    { "val": "rgb(250, 190, 190)", "hex": "#fabebe" },
    { "val": "rgb(  0, 128, 128)", "hex": "#008080" },
    { "val": "rgb(230, 190, 255)", "hex": "#e6beff", isLowContrast: true },
    { "val": "rgb(170, 110,  40)", "hex": "#aa6e28" },
    { "val": "rgb(255, 250, 200)", "hex": "#fffac8", isLowContrast: true },
    { "val": "rgb(128,   0,   0)", "hex": "#800000" },
    { "val": "rgb(170, 255, 195)", "hex": "#aaffc3", isLowContrast: true },
    { "val": "rgb(128, 128,   0)", "hex": "#808000" },
    { "val": "rgb(255, 215, 180)", "hex": "#ffd8b1", isLowContrast: true },
    { "val": "rgb(  0,   0, 128)", "hex": "#000080" },
    { "val": "rgb(128, 128, 128)", "hex": "#808080" }
];
let showTip = ( e ) => {
    if( e.target.classList.contains( "path__point--inactive" ) ) return;

    let currInfo = JSON.parse( e.target.getAttribute( "data-info" ) );
    Object.keys( tipData ).forEach( ( k ) => {
        document.getElementById( k ).innerText = currInfo[ k ];
    });
    let catgIdx = Array.prototype.filter.call( e.target.classList, c => { return c.indexOf( "path__point--cat" ) >= 0 })[ 0 ].split( "path__point--cat" )[ 1 ];
    let color = colors[ catgIdx ];
    tipElem.style.left = e.clientX + 20 + "px";
    tipElem.style.top = e.clientY - 140 + "px";
    tipElem.style.background = color.val.substr( 0, color.val.length - 2 ) + ", 0.9)";
    tipElem.style.color = color.isLowContrast ? "#333" : "#eee";
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
    let monthIdx    = +datum.launch_date.substr( 5, 2 ) - 1 || 0;
    let monthAngle  = monthIdx / 12 * 360;
    let sentimentScore = datum.score = Math.round( datum.score * 100 ) / 100;
    let offsetAngle = showOffset ? sentimentScore * 15 : 0;
    let percPledged = datum.perc_pledged = Math.round( datum.perc_pledged );

    pointElem = document.createElementNS( SVG_NS, "circle" );
    pointElem.setAttribute( "cx", hc );
    pointElem.setAttribute( "cy", vc );
    pointElem.setAttribute( "r", pointRadius );
    pointElem.setAttribute( "data-info", JSON.stringify( getPropsToShow( datum ) ) );
    pointElem.setAttribute( "data-month-angle", monthAngle );
    pointElem.setAttribute( "data-offset-angle", sentimentScore * 15 );
    pointElem.setAttribute( "data-perc-pledged", percPledged );
    pointElem.setAttribute( "data-cat", thisCatg );
    pointElem.setAttribute( "transform", `
        rotate(${ window.isNaN( monthAngle + offsetAngle ) ? 0 : monthAngle + offsetAngle } ${ hc },${ vc })
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
        dataGrpElem.appendChild( getPointToRender( d ) );
    }

    // Make filters:
    let ct = null;
    let li = null;
    Object.keys( categories ).forEach( ( c ) => {
        ct = getCategoryClassName( c );
        li = document.createElement( "li" );
        li.classList.add( "filter", "path__point--cat", ct );
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
};


// ...
let toggleSentimentOffset = () => {
    showOffset = !showOffset;

    let ma = oa = pp = null;
    Array.prototype.forEach.call( document.getElementsByClassName( "path__point" ), ( pt ) => {
        ma = +pt.getAttribute( "data-month-angle" );
        oa = showOffset ? +pt.getAttribute( "data-offset-angle" ) : 0;
        pp = +pt.getAttribute( "data-perc-pledged" );

        pt.setAttribute( "transform", `
            rotate(${ window.isNaN( ma + oa ) ? 0 : ma + oa } ${ hc },${ vc })
            translate(${ innerCircleRadius + pp } 0)
            ` );
    });
};
let focusSelectedMonthProjects = () => {
    let mi = +monthSelectorElem.value;
    const DEFAULT = -1;

    // Show this month:
    activeMonthElem.setAttribute( "x", hc );
    activeMonthElem.setAttribute( "y", 30 );
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
    axesGrpElem.setAttribute( "transform", `rotate(${ ( ( !( mi + 1 ) ? 0 : mi ) / 12 * -360 ) - 90 } ${ hc },${ vc })` );
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
        <div class="col col--right"><p>${ tipData[ k ] } :</p></div><!--
        --><div class="col"><p><span id="${ k }">x</span></p></div>
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


// ...
let isSidebarShown = true;
sidebarCTA.addEventListener( "click", ( e ) => {
    e.preventDefault();
    sidebarElem.style.right = ( isSidebarShown ? 0 : ( -1 * sidebarElem.offsetWidth ) ) + "px";
    filterImgElem.src = `img/filter${ isSidebarShown ? "-filled" : "" }.svg`;
    isSidebarShown = !isSidebarShown;
});


// ...
svgElem.setAttribute( "width",  W + "px" );
svgElem.setAttribute( "height", H + "px" );
svgElem.setAttribute( "viewBox", `0 0 ${ W } ${ H }` );
loadFile( dataFile, loadVIz );

// Offset the axis so the first month aligns to the vertical axis:
mainGrpElem.setAttribute( "transform", `rotate(-90 ${ hc },${ vc })`);

axesGrpElem.innerHTML = `
    <g class="axes">
        <path class="path path--dashed" d="M${ hc },50 v${ AXIS_LEN }" />
        <path class="path path--dashed" d="M${ hc },50 v${ AXIS_LEN }" transform="rotate( 90 ${ hc },${ vc })" />
        <path class="path path--dashed" d="M${ hc },50 v${ AXIS_LEN }" transform="rotate( 30 ${ hc },${ vc })" />
        <path class="path path--dashed" d="M${ hc },50 v${ AXIS_LEN }" transform="rotate(-30 ${ hc },${ vc })" />
        <path class="path path--dashed" d="M${ hc },50 v${ AXIS_LEN }" transform="rotate( 60 ${ hc },${ vc })" />
        <path class="path path--dashed" d="M${ hc },50 v${ AXIS_LEN }" transform="rotate(-60 ${ hc },${ vc })" />
    </g><!-- #axes2 -->
    <g class="axes" transform="rotate(15 ${ hc },${ vc })">
        <path class="path path--alt" d="M${ hc },50 v${ AXIS_LEN }" />
        <path class="path path--alt" d="M${ hc },50 v${ AXIS_LEN }" transform="rotate( 90 ${ hc },${ vc })" />
        <path class="path path--alt" d="M${ hc },50 v${ AXIS_LEN }" transform="rotate( 30 ${ hc },${ vc })" />
        <path class="path path--alt" d="M${ hc },50 v${ AXIS_LEN }" transform="rotate(-30 ${ hc },${ vc })" />
        <path class="path path--alt" d="M${ hc },50 v${ AXIS_LEN }" transform="rotate( 60 ${ hc },${ vc })" />
        <path class="path path--alt" d="M${ hc },50 v${ AXIS_LEN }" transform="rotate(-60 ${ hc },${ vc })" />
        <circle class="path path--filled" cx="${ hc }" cy="${ vc }" r="${ innerCircleRadius }" />
        <circle class="path path--alt path--dashed hide" cx="${ hc }" cy="${ vc }" r="100" />
    </g><!-- #axes -->
`;