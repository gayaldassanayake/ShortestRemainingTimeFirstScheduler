var table = null;

var names = new Array();
var colors = new Array();
var startTimes = new Array();
var burstTimes = new Array();



function fullColorHex(rgb) {   
    var red = parseInt(rgb[0], 10).toString(16);
    var green = parseInt(rgb[1], 10).toString(16);
    var blue = parseInt(rgb[2], 10).toString(16);
    if(red.length==1){
        red="0"+red;
    }
    if(green.length==1){
        green="0"+green;
    }
    if(blue.length==1){
        blue="0"+blue;
    }
    // console.log(red,green,blue);
    return "#"+red+green+blue;
}

function rbgToHex(rgb){
    var r,g,b;
    rgb = rgb.split("(")[1].split(")")[0];
    rgb = rgb.split(", ");
    // console.log(rgb);
    return fullColorHex(rgb);  
}

function singleton(){
    if(table==null){
        table = document.getElementById("processTable");
    }
}

function addField(){

    singleton();

    var row = table.insertRow(-1);

    var processColor = row.insertCell(0);
    var processName = row.insertCell(1);
    var arrivalTime = row.insertCell(2);
    var burstTime = row.insertCell(3);
    var deleteButton = row.insertCell(4);

    var processLetter = String.fromCharCode(table.rows.length+63);
    
    processColor.style.backgroundColor = document.getElementById("processColor").value;
    processName.innerHTML = processLetter;
    arrivalTime.innerHTML = document.getElementById("arrivalTime").value;
    burstTime.innerHTML = document.getElementById("burstTime").value;
    
    deleteButton.setAttribute("class","cellSpecial");
    
    var button = document.createElement('button');
    button.style.padding = "0";
    button.style.margin = "0";
    button.innerHTML = '<img src = "./Images/minusSign.jpg" width = "30px" height = "20px" >';
    button.setAttribute("onclick","removeField()");
    
    deleteButton.appendChild(button); 
    
    document.getElementById("arrivalTime").value = "";
    document.getElementById("burstTime").value ="";
    
} 

function addFields(){console.log("Hi");}

function removeField(){
    var td = event.target.parentNode.parentNode;
    var tr = td.parentNode;
    tr.parentNode.removeChild(tr);

    adjustProcessNames();
   
}

function adjustProcessNames(){
    for(i=1;i<table.rows.length;i++){
        var newLetter = String.fromCharCode(i+64);
        table.rows[i].cells[1].innerHTML = newLetter;
    }
}

function submit(){
    

    singleton();

    for(i=1;i<table.rows.length;i++){
        colors.push(rbgToHex(table.rows[i].cells[0].style.backgroundColor));
        names.push(table.rows[i].cells[1].innerHTML);
        startTimes.push(parseInt(table.rows[i].cells[2].innerHTML));
        burstTimes.push(parseInt(table.rows[i].cells[3].innerHTML));
    }


    main();
}