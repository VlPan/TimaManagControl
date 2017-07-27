
var Day = function(points,history,missionHistory){
    this.points = points || 0;
    this.history = history || [];
    this.date = [new Date().getYear(), new Date().getMonth(), new Date().getDay()];
    this.missionHistory = missionHistory || [];
}