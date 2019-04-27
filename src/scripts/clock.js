function startClock() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    let ampm = "AM";
    m = checkClock( m );
    s = checkClock( s );
    if ( h > 11 ) {
        ampm = "PM";
    }
    if ( h > 12 ) {
        h -= 12;
    }
    $( "#clock" ).text( `${h  }:${  m  }:${  s  } ${  ampm}` );
    const t = setTimeout( startClock, 500 );
}

function checkClock( i ) {
    if ( i < 10 ) {
        i = `0${  i}`;
    } // add zero in front of numbers < 10
    return i;
}

module.exports = {
    startClock
};
