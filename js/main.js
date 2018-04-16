// ...
let barChart = document.getElementsByClassName( "barchart" )[ 0 ];


// ...
const loadBars = ( data ) => {
    Object.keys( data ).forEach( k => {
        let d = data[ k ];
        let percS = Math.round( ( d.successful / ( d.successful + d.failed ) ) * 100 );

        barChart.innerHTML += `
            <div class="bar__group" titlez="Analyze '${ k }' category"
                onclick='onSelectCategory( "${ k }", ${ JSON.stringify( d ) } )'>
                <div class="bars">
                    <div class="bar bar--successful" style="width: ${ percS }%"></div><!--
                    --><div class="bar bar--failed" style="width: ${ 100 - percS }%"></div>
                </div><!--
                --><div class="bar__title">
                    ${ k }
                    <span class="bar__title-detail">
                        <span class="successful">${ percS }%</span>
                        <span class="failed">${ 100 - percS }%</span>
                    </span>
                </div><!--
                --><div class="bar__selector">
                    <img src="img/chevron-right.svg" alt="Analyze the ${ k } category" width="10" />
                </div>
            </div>
        `;
    });
};
const onSelectCategory = ( cat, datum ) => {
    Array.prototype.forEach.call( document.querySelectorAll( ".master-cat-name" ), span => {
        span.innerText = cat;
    });

    Array.prototype.forEach.call( document.querySelectorAll( ".master-cat-num-projs" ), span => {
        span.innerText = datum.successful + datum.failed;
    });

    navigateTo( datum.isSupported ? "#screen-3" : "#screen-5" );
}

// ...
loadFile( "data/categories-success-rate.json", loadBars );

