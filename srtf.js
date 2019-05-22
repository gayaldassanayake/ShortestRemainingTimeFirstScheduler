var readyQueue = new Array();
var processList = new Array();
var processListDup = new Array();

var totalExecTime = 0;
var timeFrame = new Array();
var currentProcess = null;
var start = 0;
var check;




/***************************
This should be improved to suport time gaps between bursts
***************************/

/************************CLASS BURST**************************/
function Burst(process,startTime,duration){
    var processTemp = process;
    var startTime = startTime;
    var duration = duration;

    this.getProcess = function(){
        return processTemp;
    } 
    this.getStartTime = function(){
        return startTime;
    } 
    this.getDuration = function(){
        return duration;
    } 
}

/************************CLASS PROCESS****************************/
function Process(id,arrivalTime,burstTime,color){         
    var id = id;
    var arrivalTime = arrivalTime;
    var burstTime = burstTime;
    var remainingTime = burstTime;
    var color=color;
    var responseTime ;
    var turnaroundTime;
    
    this.getBurstTime = function(){
        return burstTime;
    } 
    this.getArrivalTime = function(){
        return arrivalTime;
    }
    this.getRemainingTime = function(){
        return remainingTime;
    }
    this.getId = function(){
        return id;
    }
    this.getColor = function(){
        return color;
    }

    this.getResponseTime = function(){
        return responseTime;
    }

    this.setResponseTime = function(resTime){
        responseTime = resTime;
    }

    this.getTurnaroundTime = function(){
        return turnaroundTime;
    }

    this.setTurnaroundTime = function(turTime){
        turnaroundTime = turTime;
    }

    //reduces the cpu running time
    this.run = function(){
        remainingTime--;
    }
}

//comparer built for the sort function
function compare(a,b) {
    if (a.getRemainingTime() < b.getRemainingTime())
       return -1;
    if (a.getRemainingTime() > b.getRemainingTime())
      return 1;
    return 0;
}

//sorts based on the descending order of remaining burst time 
let sort = function(queue){
    queue.sort(compare);
}

//adds new processes to the readyqueue from the processqueue when the arrival time is now and sorts ready queue
let addToProcessQueue = function(presentTime){
    
    // for(var i=0;i<processList.length;i++){
    
    //     if(processList[i].getArrivalTime() ==  presentTime){
    //         for(var j=0;j<processList.length;j++){
    //             console.log(i," ",j," 7889 ",processList[j].getId()," ",processList.length);}
    //         readyQueue.push(processList.splice(i,1)[0]);
    //         for(var j=0;j<processList.length;j++){
    //             console.log(i," ",j," 1223 ",processList[j].getId()," ",processList.length);}
    //     }
        
    // }
    var i = 0;
    while(i<processList.length){
        if(processList[i].getArrivalTime() ==  presentTime){
            readyQueue.push(processList.splice(i,1)[0]);
        }else{
            i++;
        }
    }
    sort(readyQueue);
    // console.log("!!!",readyQueue.length);
}

//a running process is added back to the readyqueue 
let addRunningToProcessQueue = function(){
    readyQueue.push(currentProcess);
    sort(readyQueue);
}


let calcTurnaroundTime = function(){
    
    
}

let calcResponseTime = function(){
    var avgrt = 0;
    var avgtat=0;

    for(var i =0;i<timeFrame.length;i++){
        thisProcess = timeFrame[i].getProcess();
        if(thisProcess.getResponseTime()==undefined){
            // console.log(timeFrame[i].getStartTime(),thisProcess.getArrivalTime());
            thisProcess.setResponseTime(timeFrame[i].getStartTime()-thisProcess.getArrivalTime());
        }
        thisProcess.setTurnaroundTime(timeFrame[i].getStartTime()+timeFrame[i].getDuration()-thisProcess.getArrivalTime())
    }
    for(var each in processListDup){
        avgrt += processListDup[each].getResponseTime();
        avgtat += processListDup[each].getTurnaroundTime();
    }
    avgrt =avgrt/processListDup.length;
    avgtat =avgtat/processListDup.length;
    // console.log(avgrt);
    var returnArray = new Array();
    returnArray.push(avgrt);
    returnArray.push(avgtat);
    return returnArray;
}
//timeFrame keeps all the bursts 

//check checks if the code runs through at least one of  the if/else if conditions
//so the running processed is removed and a new process from the ready queue
//should be added back 




function main() {
    
    for (var i = 0; i < names.length; i++) {
        processList.push(new Process(names[i], startTimes[i], burstTimes[i], colors[i]));
        // console.log(typeof processList[i]);
    }
    processListDup = processList.slice();
    var i=0;
    while(true){
        addToProcessQueue(i);
        
        if (currentProcess != null) {
            if (currentProcess.getRemainingTime() == 0) {
                // console.log("### ",i);
                timeFrame.push(new Burst(currentProcess, start, i-start));
                currentProcess = null;
            }
            else if (!(readyQueue[0] == undefined) && (currentProcess.getRemainingTime() > readyQueue[0].getRemainingTime())) {
                timeFrame.push(new Burst(currentProcess, start, i-start));
                addRunningToProcessQueue(currentProcess);
                currentProcess = null;
            }
        }
        // if(i<2){console.log("### ",i," ",readyQueue.length);}
        if(processList.length==0 && readyQueue.length==0 && currentProcess == null){
            break;
        }
        if (readyQueue.length > 0 && currentProcess == null){
            // console.log("## ",i);
            currentProcess = readyQueue.shift();
            start = i;
            // console.log( currentProcess.getId());
        }
        if(currentProcess!=null){
            // console.log("# ",i);
            // console.log( currentProcess.getId());
            currentProcess.run();
        }
        i++;
     
    }
  
    lastBurst = timeFrame[timeFrame.length - 1];
    totalExecTime = lastBurst.getStartTime()+lastBurst.getDuration();
    var compResults = calcResponseTime();
    console.log(calcResponseTime());
    document.getElementById("resTime").innerHTML = Math.round(compResults[0] * 100) / 100;
    document.getElementById("turnTime").innerHTML = Math.round(compResults[1] * 100) / 100;
    createGantChart();
}
