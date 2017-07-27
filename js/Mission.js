var Mission = function(name, points){
    this.name = name;
    this.points =  points;
    var date;
    
    this.setDate = function(_date){
        date = _date;
    };

    this.getDate = function(){
        return date;
    };
    
}