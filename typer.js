var Typer={
	text: null,
	accessCountimer:null,
	index:0, // current cursor position
	speed:2, // speed of the Typer
	file:"", //file, must be setted
	path:"",
	header:"<span id=\"a\">emzatos@utaustin</span>:<span id=\"b\">~</span><span id=\"c\">$</span>",
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
	window.onkeypress = function(e){
		Typer.speed = 1000;
	}
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
element.setAttribute("style", "width:400px");
element.classList.add('text');



element.onkeypress = function(e) {
	if (!e) e = window.event;
	var keyCode = e.keyCode || e.which;
	if (keyCode == '13'){
		let command = e.target.value.split(" ")[0];
		let args = e.target.value.split(" ")[1];

		if(e.target.value.length == 0)
			Typer.write(builder([]));
		else if(command == "ls"){
			if(Typer.path == "")
				Typer.write(builder(["Projects/", "Experience/", "Skills/", "Extracurricular/", "education.txt", "emranshafaq.txt"]));

			else if(Typer.path == "/Projects")
				Typer.write(builder(["november_sky.txt", "boSWEmian_rhapsody.txt", "mandeljs.txt", "twilysis.txt", "conductor_hero.txt",
					"other_projects.txt"]));

			else if(Typer.path == "/Extracurricular")
				Typer.write(builder(["hum.txt", "kvrx.txt"]));

			else{
				Typer.write(builder([]));
			}


		}

		else if(command == "cd") {
			if(args == "..") {
				if(Typer.path == ""){
					Typer.write(builder([]));


				}
				else {
					Typer.path = Typer.path.substring(0,Typer.path.lastIndexOf("/"));
					Typer.write(builder([]));
				}
			}
			else if(args == ".") {
				Typer.write(builder([]));
			}
			else if(Typer.path == "") {
				let subdirs = ["/Projects", "/Experience", "/Skills", "/Extracurricular"];
				let found = false;
				for(let a of subdirs){
					if(("/" + args) == a){
						found = true;
						Typer.path+=a;
					}
				}
				if(!found){
					Typer.write("<br>-bosch: " + command + ": " + args + ": No such file or directory</br>" + make_header());
				} else {
					Typer.write(builder([]));
				}
			}else {

				Typer.write("<br>-bosch: " + command + ": " + args + ": No such file or directory</br>" + make_header());

			}
		}

		else if(command == "clear") {
			document.getElementById("console").innerHTML = make_header();
		} 

		else if(command == "cat") {
			Typer.write(builder([]));
		}

		else {
			Typer.write("<br>-bosch: " + command + ": command not found</br>" + make_header());
		}


		e.target.disabled = true;
		add();

	}
}



// 'foobar' is the div id, where new fields are to be added
var foo = document.getElementById("console");

//Append the element in page (in span).
foo.appendChild(element);
element.focus();

}

function color_repo(str) {
	return "<span id=\"repo\">" + str + "</span>/";
}

function make_header() {
	return Typer.header.replace("~", "~"+Typer.path);
}

function builder(names) {
	var result = "<br>";
	var tab = " &emsp; ";

	if(names.length == 0){
		return "<br>" + make_header();
	}

	for(let str of names) {

		if(str.endsWith("/")){
			result+=color_repo(str.substring(0,str.length-1));
			result+=tab;
		}else {
			result+=str;
			result+=tab;
		}


	}
	result+="</br>" + make_header();

	return result;
}



