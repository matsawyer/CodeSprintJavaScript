function processData(input) {
    //Enter your code here
    var _inp = JSON.parse(input);
    var speed = _inp.speed;     //speed at which the temperature will change.
    var inputs = _inp.inputs;   //Array of times that temperature will change.
    var endTime = _inp.endTime; //Time which temperature need be determined.  
    var initTemp = _inp.initialTemperature; //Starting temperature
    var permuteTemp = initTemp;             //Room temperature during changes
    var finalTemp = initTemp;               //Expected temperature at end time.
    if(1 === inputs.length ){   //Conditional for the test case with only 1 input.
        var changeTempTime = inputs[0].time;
        var targetTemp = inputs[0].temperature;
        var timeDifference = (Math.abs(new Date(endTime.replace(/-/g,'/'))) > Math.abs(new Date(changeTempTime.replace(/-/g,'/'))));
        if(targetTemp < initTemp){    finalTemp = initTemp - (speed *(timeDifference));}   
        if(targetTemp > initTemp){    finalTemp = initTemp + (speed *(timeDifference));}
    } 
    if( 1 < inputs.length){
        for(var i = 1; i < inputs.length; ++i){
            var j = i-1;
            var early_inp = inputs[j];
            var later_inp = inputs[i];
            var earlyTargetTemp = early_inp.temperature;
            var lateTargetTemp = later_inp.temperature;
            var lateTime = later_inp.time;
            var earlyTime = early_inp.time;           
               //Is ending time between the early time and the late time?
            if((Math.abs(new Date(endTime.replace(/-/g,'/'))) > Math.abs(new Date(earlyTime.replace(/-/g,'/')))) && (Math.abs(new Date(endTime.replace(/-/g,'/'))) <= Math.abs(new Date(lateTime.replace(/-/g,'/')))) )
            {
                //finding hour difference between the end time and the early time.
                var endEarlyTimeDif = (Math.abs(new Date(endTime.replace(/-/g,'/')) - new Date(earlyTime.replace(/-/g,'/'))))/3600000;            
                    //determine if cooling or heating.
                if(earlyTargetTemp < permuteTemp ){ //cool room to target temp.
                    permuteTemp = permuteTemp - (speed *( endEarlyTimeDif ) );
                    if (earlyTargetTemp >= permuteTemp) { permuteTemp = earlyTargetTemp;} 
                }   
                if(earlyTargetTemp > permuteTemp ){ //heat room to target temp.
                    permuteTemp = permuteTemp + (speed *( endEarlyTimeDif ) );
                    if (earlyTargetTemp <= permuteTemp) { permuteTemp = earlyTargetTemp;}
                }
                finalTemp = permuteTemp;        
                break; //found final temp, break loop.
            }
            else if(Math.abs(new Date(endTime.replace(/-/g,'/'))) <= Math.abs(new Date(earlyTime.replace(/-/g,'/'))) ){      //case which ending time is at or before the early time.   
                finalTemp = permuteTemp; //temperature is left unaltered.
                break;
            }
            else{   //ending time is after the observed later time, default case.
                var lateEarly_timeDif = (Math.abs(new Date(lateTime.replace(/-/g,'/')) - new Date(earlyTime.replace(/-/g,'/'))))/3600000;
                    //determine if we are cooling or heating the room.
                if(earlyTargetTemp < permuteTemp){    
                    permuteTemp = permuteTemp - (speed *(lateEarly_timeDif));
                        //if cooled to target temperature, stop cooling.
                    if (earlyTargetTemp >= permuteTemp) { permuteTemp = earlyTargetTemp;}               
                }   
                if(earlyTargetTemp > permuteTemp){    
                    permuteTemp = permuteTemp + (speed *(lateEarly_timeDif));
                        //if heated to target temperature, stop heating.
                    if (earlyTargetTemp <= permuteTemp) { permuteTemp = earlyTargetTemp;}               
                }                                                                                                                                
                    //last temp reading?
                if(inputs.length === (i+1)) {
                    var endLate_dif = (Math.abs(new Date(endTime.replace(/-/g,'/')) - new Date(lateTime.replace(/-/g,'/'))))/3600000;                                 
                    if(lateTargetTemp < permuteTemp){   finalTemp = permuteTemp - (speed *( endLate_dif ) );}
                    if(lateTargetTemp > permuteTemp){   finalTemp = permuteTemp + (speed *( endLate_dif ) );}
                    if(lateTargetTemp ===  permuteTemp){   finalTemp = permuteTemp ;}                    
                }          
            }
        }//end of for-loop
    }//end of if conditional    
    console.log(finalTemp);  
}

process.stdin.resume();
process.stdin.setEncoding("ascii");
_input = "";
process.stdin.on("data", function (input) {
    _input += input;
});

process.stdin.on("end", function () {
   processData(_input);
});
