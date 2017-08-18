var Typer={
	text: null,
	accessCountimer:null,
	header:"<span id=\"a\">emzatos@utaustin</span>:<span id=\"b\">~</span><span id=\"c\">$</span>",
	index:0, // current cursor position
	speed:2, // speed of the Typer
	file:"", //file, must be setted
	accessCount:0, //times alt is pressed for Access Granted
	deniedCount:0, //times caps is pressed for Access Denied
	init: function(){// inizialize Hacker Typer
		accessCountimer=setInterval(function(){Typer.updLstChr();},500); // inizialize timer for blinking cursor
		$.get(Typer.file,function(data){// get the text file
			Typer.text=data;// save the textfile in Typer.text
			Typer.text = Typer.text.slice(0, Typer.text.length-1);
		});
	},

	content:function(){
		return $("#console").html();// get console content
	},

	write:function(str){// append to console content
		$("#console").append(str);
		return false;
	},

	makeAccess:function(){//create Access Granted popUp      FIXME: popup is on top of the page and doesn't show is the page is scrolled
		Typer.hidepop(); // hide all popups
		Typer.accessCount=0; //reset count
		var ddiv=$("<div id='gran'>").html(""); // create new blank div and id "gran"
		ddiv.addClass("accessGranted"); // add class to the div
		ddiv.html("<h1>ACCESS GRANTED</h1>"); // set content of div
		$(document.body).prepend(ddiv); // prepend div to body
		return false;
	},
	makeDenied:function(){//create Access Denied popUp      FIXME: popup is on top of the page and doesn't show is the page is scrolled
		Typer.hidepop(); // hide all popups
		Typer.deniedCount=0; //reset count
		var ddiv=$("<div id='deni'>").html(""); // create new blank div and id "deni"
		ddiv.addClass("accessDenied");// add class to the div
		ddiv.html("<h1>ACCESS DENIED</h1>");// set content of div
		$(document.body).prepend(ddiv);// prepend div to body
		return false;
	},

	hidepop:function(){// remove all existing popups
		$("#deni").remove();
		$("#gran").remove();
	},

	addText:function(key){//Main function to add the code

		if(key.keyCode==18){// key 18 = alt key
			Typer.accessCount++; //increase counter 
			if(Typer.accessCount>=3){// if it's presed 3 times
				Typer.makeAccess(); // make access popup
		}
		}else if(key.keyCode==20){// key 20 = caps lock
			Typer.deniedCount++; // increase counter
			if(Typer.deniedCount>=3){ // if it's pressed 3 times
				Typer.makeDenied(); // make denied popup
		}
		}else if(key.keyCode==27){ // key 27 = esc key
			Typer.hidepop(); // hide all popups
		}else if(Typer.text){ // otherway if text is loaded
			var cont=Typer.content(); // get the console content
			if(cont.substring(cont.length-1,cont.length)=="|") // if the last char is the blinking cursor
				$("#console").html($("#console").html().substring(0,cont.length-1)); // remove it before adding the text
			if(key.keyCode!=8){ // if key is not backspace
				Typer.index+=Typer.speed;	// add to the index the speed
			}else{
				if(Typer.index>0) // else if index is not less than 0 
					Typer.index-=Typer.speed;//	remove speed for deleting text
			}
			var text=Typer.text.substring(0,Typer.index)// parse the text for stripping html enities
			var rtn= new RegExp("\n", "g"); // newline regex

			$("#console").html(text.replace(rtn,"<br/>"));// replace newline chars with br, tabs with 4 space and blanks with an html blank
			window.scrollBy(0,50); // scroll to make sure bottom is always visible
		}
		if ( key.preventDefault && key.keyCode != 122 ) { // prevent F11(fullscreen) from being blocked
			key.preventDefault()
		};  
		if(key.keyCode != 122){ // otherway prevent keys default behavior
			key.returnValue = false;
		}
	},

	updLstChr:function(){ // blinking cursor
		

		var cont=this.content(); // get console 
		if(cont.substring(cont.length-1,cont.length)=="|") // if last char is the cursor
			$("#console").html($("#console").html().substring(0,cont.length-1)); // remove it
		else
			this.write("|"); // else write it

	}
}


function replaceUrls(text) {
	var http = text.indexOf("http://");
	var space = text.indexOf(".me ", http);
	if (space != -1) { 
		var url = text.slice(http, space-1);
		return text.replace(url, "<a href=\""  + url + "\">" + url + "</a>");
	} else {
		return text
	}
}
Typer.speed=3;
Typer.file="emranshafaq.txt";
Typer.init();

var timer = setInterval("t();", 30);
function t() {
	Typer.addText({"keyCode": 123748});
	if (Typer.index > Typer.text.length) {
		clearInterval(timer);
		Typer.write(Typer.header);
		clearInterval(accessCountimer);
		add()
	}
}

function add() {

//Create an input type dynamically.

var element = document.createElement("input");


//Assign different attributes to the element.
element.setAttribute("type", "text");
element.setAttribute("value", "");
element.setAttribute("name", "Test Name");
element.setAttribute("spellcheck", "false");
element.setAttribute("style", "width:500px");
element.classList.add('text');



element.onkeypress = function(e) {
	if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13'){
      if(e.target.value == "ls"){
      	alert("under construction");
      } else {
      	e.target.disabled = true;
      	Typer.write("<br>-bosch: " + e.target.value + ": command not found</br>" + Typer.header);
      	add();
      }
    }
}



// 'foobar' is the div id, where new fields are to be added
var foo = document.getElementById("console");

//Append the element in page (in span).
foo.appendChild(element);
element.focus();

}


