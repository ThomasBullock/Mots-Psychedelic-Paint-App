$(function() {

var color = $(".selected").css("background-color");
var $canvas = $("canvas");
var context = $canvas[0].getContext("2d");   //this grabs the first element in the array of canvas elements
var canvas = $("#canvas");
var $increment = $("#increment");
var $decrement = $("#decrement");
var lastEvent;
var brushSize = 5;
var mode = 'source-over';
var mouseDown = false; // this helps with stoppping the mouse drawing after mouseUp
var colors = {
  red: 0,
  green: 0,
  blue: 0
}
let hue = 0;

// prepare background of canvas
canvas.bgColor = "#E11";
var w = canvas.width();
var h = canvas.height(); 
context.fillStyle = "#FFF";
context.fillRect(0, 0, w, h);

context.lineCap = 'round';

//when clicking on control list items
  $(".controls").on("click", "li", function() {  //on is used instead of click function while fire newly added colors  aswell
    //Deselect sibling elements
    $(this).siblings().removeClass("selected");
    //select clicked element
    $(this).addClass("selected");
    
    //cache current color
    color = $(this).css( "background-color"); 
    console.log(color);
  });

//When new color is pressed
  //Show color select or hide the color color select
$("#revealColorSelect").click(function() {
  changeColor();
  $("#colorSelect").toggle();  //toggles show()/hide()
});

//update the new color span 
  function changeColor() {
    console.log($('#red').val() +"," + $('#green').val() + "," + $('#blue').val());
    var r = colors.red;
    var g = colors.green;
    // var b = $('#blue').val()
    var b = colors.blue;
    console.log(b)
    $kuler = "rgb(" + r + "," + g + ","  + b +")";
    $("#newColor").css("background-color", $kuler);
  }

  $( ".slider" ).slider({
     min: 0,
     max: 255,
     animate:"slow",
     orientation: "horizontal",
     slide: function( event, ui ) {
        // console.log(event)
        colors[event.target.id] = ui.value;
        changeColor();
     }     
  });

//When color sliders change
  $("input[type=range]").change(changeColor);                     
                       

//When add color is pressed
  $("#addNewColor").click(function(){
    //Append the color to the control ul
    var $newColor = $("<li></li>");
    $newColor.css("background-color", $kuler);  //$("#newColor").css provids color for css function
    if( $(".controls ul li").length <= 8 ) {
      $(".controls ul").append($newColor);         
      $newColor.click();  
    } else {
      $(".controls ul li")[$(".controls ul li").length-1].remove()
      $(".controls ul").append($newColor);           
      $newColor.click();      
    }

    //Select the new color  

  
  });

//On mouse events on the canvas
$canvas.mousedown(function(e) {
  lastEvent = e;
  mouseDown = true; // this helps with stoppping the mouse drawing after mouseUp
}).mousemove(function(e) {
  if(mouseDown) {
    
    if( $('.rainbow').hasClass('selected') ) {

      context.strokeStyle = `hsl(${hue}, 100%, 50%)`;
      context.beginPath();
      context.moveTo(lastEvent.offsetX, lastEvent.offsetY);
      context.lineTo(e.offsetX, e.offsetY);
      context.lineWidth = brushSize;
      context.globalCompositeOperation = mode;   
      context.stroke();
      // [lastX, lastY] = [e.offsetX, e.offsetY]; //destructuring
      if(hue >= 360) {
        hue = 0;
      }
      hue++;
      lastEvent = e;  
      
    } else {
      context.beginPath();
      context.moveTo(lastEvent.offsetX, lastEvent.offsetY);
      context.lineTo(e.offsetX, e.offsetY);
      context.strokeStyle = color; //set stroke to previously cached color
      context.lineWidth = brushSize;
      context.globalCompositeOperation = mode;             
      context.stroke();
      lastEvent = e;  
    }
     



  }
}).mouseup(function() {
  mouseDown = false;
}).mouseleave(function() {
  $canvas.mouseup();
}); 
//Draw lines

$("#save").click(function() {
  console.log('save clicked')
  var png = ReImg.fromCanvas(document.getElementById('canvas')).toPng()
  console.log(png);
//  document.body.appendChild(png);
  ReImg.fromCanvas(document.getElementById('canvas')).downloadPng();  
});

$("#clear").click(function() {
  context.clearRect(0,0,canvas.width(),canvas.height());
});

function brushIncrement() {
  if(brushSize < 31) {
    brushSize++;
  } else {
    return
  }
}

function brushDecrement() {
  if(brushSize > 1) {
    brushSize--;
  } else {
    return
  }
}

$( "#save" ).button({
  classes: {
    "ui-button": "highlight"
  }
});

$( "#revealColorSelect" ).button({
  classes: {
    "ui-button": "highlight"
  }
});

$( "#clear" ).button({
  classes: {
    "ui-button": "highlight"
  }
});

$( "#addNewColor" ).button({
  classes: {
    "ui-button": "highlight"
  }
});


$( "#decrement" ).button({
  classes: {
    "ui-button": "highlight"
  }
});

$( "#increment" ).button({
  classes: {
    "ui-button": "highlight"
  }
});

$( "#help" ).button({
  classes: {
    "ui-button": "highlight"
  }
});

$(document).keydown(function (event) {
    if (event.keyCode === 219) {
      $("#decrement").mousedown();
      brushDecrement();      
    } 
});

$(document).keyup(function (event) {
    if (event.keyCode === 219) {
      $("#decrement").mouseup();
    } 
});

$(document).keydown(function (event) {
    if (event.keyCode === 221) {
      $("#increment").mousedown();
      brushIncrement();
    } 
});

$(document).keyup(function (event) {
    if (event.keyCode === 221) {
      $("#increment").mouseup();
    } 
});

// window.addEventListener('keydown', function(e){
//   if(e.keyCode === 219) {
//     $("#decrement").mousedown();
//     // $decrement.addClass('active')
//     // brushDecrement();
//     // $decrement.removeClass('active')     
//   }
//   if(e.keyCode === 221) {
//     $increment.mousedown();
//   }  
// })

$increment.on('click', brushIncrement);
$decrement.on('click', brushDecrement);

// $('#normal')

$( "#normal" ).button({
  classes: {
    "ui-button": "highlight"
  }
}).on('click', function(){
  mode = 'source-over';
});

$('#xor').button({
  classes: {
    "ui-button": "highlight"
  }
}).on('click', function(){
  mode = 'xor';
})

$('#overlay').button({
  classes: {
    "ui-button": "highlight"
  }
}).on('click', function(){
  mode = 'overlay';
})

$('#color-burn').button({
  classes: {
    "ui-button": "highlight"
  }
}).on('click', function(){
  mode = 'color-burn';
})





  
});