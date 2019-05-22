
//canvas created

var canvas = new fabric.StaticCanvas('c');


/***********************CLASS BurstDisplay***************************/
function BurstDisplay(color,length,leftPos,dur){
    
    //initializing class variables
    this.canvas = canvas;
    this.color = color;
    this.length = length;
    this.leftPos = leftPos;
    this.topPos = 20;
    this.duration = dur;
    // this.delay = delay;
    
    //defining the rectangle
    var rect = new fabric.Rect({
    left: this.leftPos,
    top: this.topPos,
    fill: this.color,
    stroke: '#000000',
    strokeWidth: 2,
    width :0,
    height:20
    });

    this.displayBurst = function(){
        
        this.canvas.add(rect);
        rect.animate('width',this.length,{
            onChange: canvas.renderAll.bind(canvas),
            duration: this.duration,
        });
    //canvas added and animated	
    
    }

    this.timeScale = function(time,lPos = this.leftPos,tPos = this.topPos){
        // console.log(lPos,tPos);
        var text = new fabric.Text(time.toString() , { left: lPos-8, top: tPos+20, fontSize:20 });
        canvas.add(text);
    }
}

/*********************CLASS GANTCHART*****************************/
function GantChart(total_time){
    //initializing
    this.burstList = new Array();
    this.currentLength =50;			//starting left position(padding in the canvas)
    this.maxLength = 700;			//the total usable length of gant chart
    this.speed = 0.1;
    this.delay = 0;				
    this.burstList = new Array();
    this.ratio = this.maxLength/total_time;	//ratio 
    this.delayList = new Array();
    this.startTimes = new Array();

    this.createBurst = function(color,startTime,time){
        this.startTimes.push(startTime);
        startLengthConv = startTime*this.ratio;
        startTimeConv = startLengthConv/this.speed;
        
        burstLength = time*this.ratio;	//relative length of a burst
        duration = burstLength / this.speed; //total duration one burst lasts(millis)
        this.burstList.push(new BurstDisplay(color,burstLength,startLengthConv+50,duration)); //color,length,leftPos,duration
        this.delayList.push(startTimeConv);
        this.currentLength+=burstLength;												
        this.delay = duration;
    }

    // async function 
    this.sleep = function(ms){
        return new Promise(resolve=>{
            setTimeout(resolve,ms);
        })
    }

    this.displayBursts = async function(){
        for(i=0;i<this.burstList.length;i++){
            await this.sleep(this.delayList[i]+100); 
            presentBurst = this.burstList[i];
            presentBurst.displayBurst();
            presentBurst.timeScale(this.startTimes[i]);
            if(i == this.burstList.length-1){
                presentBurst.timeScale(totalExecTime,750);
            }
        }
    }
    
}

function createGantChart(){
    var gant1 = new GantChart(totalExecTime);

    for(burst in timeFrame){
        gant1.createBurst(timeFrame[burst].getProcess().getColor(),timeFrame[burst].getStartTime(),timeFrame[burst].getDuration());
    }
    gant1.displayBursts();
}


// var gant1 = new GantChart(25);


// gant1.createBurst("red",5);
// gant1.createBurst("orange",3);
// gant1.createBurst("blue",2);
// gant1.createBurst("yellow",5);
// gant1.createBurst("black",5);
// gant1.createBurst("maroon",5);
// gant1.displayBursts();



