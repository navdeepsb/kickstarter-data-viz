let navLinks = document.getElementsByClassName( "navlink" );
let siteSections = document.getElementsByClassName( "section" );
let header = document.querySelector( ".header" );

Array.prototype.forEach.call( navLinks, link => {
    link.addEventListener( "click", e => {
        e.preventDefault();
        navigateTo( e.target.getAttribute( "data-target" ) );
    });
});

let navigateTo = ( screenId ) => {
    Array.prototype.forEach.call( siteSections, sect => {
        sect.classList.remove( "active" );
        if( "#" + sect.id == screenId ) {
            sect.classList.add( "active" );
        }
    });
};

let loadFile = ( fileName, cb ) => {
    const request = new XMLHttpRequest();
    request.open( "GET", fileName, true );

    request.onload = () => {
        if( request.status >= 200 && request.status < 400 ) {
            // Success!
            cb( JSON.parse( request.responseText ) );
        } else {
            // We reached our target server, but it returned an error
            console.log( "An error occurred while loading JSON file..." )
        }
    };

    request.onerror = function() {
        console.log( "Connection error occurred..." )
    };

    request.send();
};

navigateTo( "#" + document.querySelector( ".section.active" ).id );