exports.getDay=function(){
    let today = new Date();

    let options={
        weekday:"long",        
    };
    
    let day =today.toLocaleDateString("en-US",options);
    return day;
}
