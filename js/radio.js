let shouldSkipRange = document.querySelector( "input[name=skipRange]:checked").value === "true";
const slider = document.getElementById( "rangeSlider" );
const radios = document.getElementsByName( "skipRange" );

const onRadioChange = ( e ) => {
    shouldSkipRange = document.querySelector( "input[name=skipRange]:checked").value === "true";

    slider.classList[ shouldSkipRange ? "add" : "remove" ]( "hide" );
};

Array.prototype.forEach.call( radios, radio => {
    radio.addEventListener( "change", onRadioChange );
});

