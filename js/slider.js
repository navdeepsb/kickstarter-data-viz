var category_min = 1;
var category_max = 100000;
var offset = 2000;

var marginMin = document.getElementById( "slider-margin-value-min" );
var marginMax = document.getElementById( "slider-margin-value-max" );
var marginSlider = document.getElementById( "slider-margin" );
var slider_min = slider_max = null;

noUiSlider.create( marginSlider, {
    start: [ category_min, category_max - offset ],
    connect: true,
    step: 10,
    range: {
        min: category_min,
        max: category_max
    }
});

marginSlider.noUiSlider.on( "update", function( values, handle ) {
    if ( handle ) {
        marginMax.innerHTML = "Maximum goal: USD " + parseInt( values[ handle ], 10 );
    } else {
        marginMin.innerHTML = "Minimum goal: USD " + parseInt( values[ handle ], 10 );
    }
});


document.getElementById( "read-button" ).addEventListener( "click", function() {
    var slider_min = parseInt( marginSlider.noUiSlider.get()[0], 10 );
    var slider_max = parseInt( marginSlider.noUiSlider.get()[1], 10 );
    document.getElementById( "range" ).innerHTML = [ slider_min, slider_max ];
});