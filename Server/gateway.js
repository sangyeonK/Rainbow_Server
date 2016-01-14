var gateway = {};

module.exports = function( url, callback ) {
    
    if( gateway[ url ] ) gateway[ url ]( callback );
    else    callback ( null );
};