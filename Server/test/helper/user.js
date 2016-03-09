module.exports = function() {
    this.loadJSON = function(json) {
        this.userId = json.userId;
        this.token = json.token;
        this.userName = json.userName;
        this.group = json.group;
    }
        
    this.validate = function()
    {
        if( this.userId !== undefined &&
            this.userName !== undefined &&
            this.token !== undefined &&
            this.group !== undefined &&
            this.group.sn !== undefined &&
            this.group.member !== undefined &&
            this.group.inviteCode !== undefined &&
            this.group.active !== undefined )
            return true;
        else
            return false;
    }
}