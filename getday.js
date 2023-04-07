module.exports.getdate = getdate; 
function getdate(){
    let today = new Date();
    let options = {
       weekday : "long",
       day:"numeric",
       month:"long",
      
 
    }
    var day = today.toLocaleDateString('us-en', options)
    return day;
}
module.exports.getday = getday;
function getday(){
    let today = new Date();
    var options = {
      day:"numeric",
    }
    var day = today.toLocaleDateString('us-en', options)
    return day;
}
