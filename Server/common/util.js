
module.exports.checkParameter = function( params , request_body) {

    if( params.length != this.objectSize(request_body) )
    {
        return false;
    }
        
    for(var i = 0 ; i < params.length ; i++ )
    {
        if(request_body[ params[i] ] == undefined )
        {
            return false;
        }
    }
    return request_body;
};

module.exports.check_GET_Parameter = function( params , req) {

console.log(req.params);
console.log(req.body);
console.log(req.query);
    var result = {};
    for(var i = 0 ; i < params.length ; i++ )
    {
        result[ params[i] ] = req.param( params[i] );
        
        if(result[ params[i] ] == undefined )
        {
            return false;
        }
    }
    console.log(result);
    return result;
};

module.exports.objectSize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};