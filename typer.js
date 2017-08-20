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


element.onkeydown = function(e) {
	if(e.keyCode == 9){
		e.preventDefault();
		if(Typer.path == "") {
			e.target.value = auto_complete(e.target.value, ["Projects/", "Experience/", "Skills/", "Extracurricular/", "education.txt", "emranshafaq.txt", "contact.txt"]);
		} else if(Typer.path == "/Projects") {
			e.target.value = auto_complete(e.target.value, ["november_sky.txt", "boSWEmian_rhapsody.txt", "mandeljs.txt", "twilysis.txt", "conductor_hero.txt","other_projects.txt"]);
		} else if(Typer.path == "/Extracurricular") {
			e.target.value = auto_complete(e.target.value, ["hum.txt", "kvrx.txt"]);
		}
	}
}

element.onkeypress = function(e) {
	if (!e) e = window.event;
	var keyCode = e.keyCode || e.which;
	if (keyCode == 13){
		let command = e.target.value.split(" ")[0];
		let args = e.target.value.split(" ")[1];

		if(e.target.value.length == 0)
			Typer.write(builder([]));
		else if(command == "ls"){
			if(Typer.path == "")
				Typer.write(builder(["Projects/", "Experience/", "Skills/", "Extracurricular/", "education.txt", "emranshafaq.txt", "contact.txt"]));

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
					if(("/" + args) == a || "/"+args.substring(0,args.length-1) == a && args.endsWith("/")){
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

		else if(command == "help") {
			Typer.write("<br>cat [filename] - display contents of file<br>cd [directory_name] - change directory<br>clear - reset console<br>echo [arg] - prints text to console<br>ls - list directory contents<br>" + make_header());
		}

		else if(command == "cat") {
			if(args == "meme" || args == "memes") {
				var meme = document.createElement("img");
				meme.setAttribute("src", "https://media.giphy.com/media/Hcw7rjsIsHcmk/giphy.gif");
				meme.style.width = 400;
				meme.style.height = 400;
				document.getElementById("console").appendChild(meme);
				Typer.write(builder([]));
			}

			else if(Typer.path == "/Extracurricular"){
				if(args == "hum.txt") {
					Typer.write("<br><span id=\"hum\">Hum A Cappella </span>is a collegiate South Asian fusion a cappella group. <p> Essentially, we take popular American songs and mash them up with popular Indian songs. We travel nationally to attend various competitions and events. </p> <p>I joined the team in the Fall of 2016 as a bass singer. The group has offered me a great way to express myself artistically while having a blast.</p> <p>I encourage you to visit the team's website: -link here eventually- </p>" + make_header());
				} else if(args == "kvrx.txt") {
					Typer.write("");
				} else {
					Typer.write("<br>-bosch: " + command + ": " + args + ": No such file or directory</br>" + make_header());
				}
			} 

			else if(Typer.path == "") {
				if(args == "education.txt") {

					Typer.write("<br>I am a junior at the University of Texas at Austin, studying computer science and pure mathematics. <br>I've always had a passion for mathematics, but it wasn't until my junior year of high school where I discovered my love for computer science. It sort of consolidated my understanding of math into a physical device.<br>This coming semester, I am planning on taking courses in abstract algebra, complex analysis, and algorithms, as well as an undergraduate research course. <br>" + make_header());


				} else if(args == "emranshafaq.txt"){
					Typer.write("<br>Hi, I\'m Emran Shafaq.<p>I am currently a student at the University of Texas at Austin studying computer science and mathematics.<\/p><p>My current interests include abstract algebra, artificial intelligence, and formal methods.<\/p>\r\nIf you would like to get in touch with me, feel free to send me an email. My email address is: <a href=\"mailto:emran.shafaq@gmail.com\" target=\"_blank\">emran.shafaq@gmail.com<\/a> and my Github is: <a href=\"http:\/\/github.com\/emzatos\" target=\"_blank\">emzatos<\/a>.\r\n<p>If you would like to see my artistic side, feel free to check out my <a href=\"http:\/\/www.flickr.com\/eshafaq\" target=\"_blank\">Flickr<\/a>.<\/p><p>My latest project is a Mandelbrot set viewer written in JS, which can be viewed <a href=\"http:\/\/www.cs.utexas.edu\/~eshafaq\/mandel.html\" target=\"_blank\">here<\/a>. <\/p><p>My resume can be found <a href=\"http:\/\/cs.utexas.edu\/~eshafaq\/Resume-electronic.pdf\" target=\"_blank\">here<\/a>.<\/p>" + make_header());
				}

				else if(args == "contact.txt") {
					Typer.write("<br>Mailing Address: 1023 W. 24th St., Austin, TX 78705 Apt. 906\
						<br>Phone Number: 817-734-8659\
						<br>Email: emran.shafaq@gmail.com\
						<br>Github ID: emzatos\
						<br>" + make_header());
				}

				else {
					Typer.write("<br>-bosch: " + command + ": " + args + ": No such file or directory</br>" + make_header());
				}

			}


			else {
				Typer.write("<br>-bosch: " + command + ": " + args + ": No such file or directory</br>" + make_header());
			}
		}

		else if(command == "echo") {
			Typer.write("<br>" + (args == undefined ? "" : args) + "<br>" + make_header());
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

function auto_complete(value, args) {
	let command = "";
	let current = "";

	if(value.indexOf(" ") != -1){
		command = value.split(" ")[0]
		current = value.split(" ")[1]
	} else {
		current = value;
	}

	let options = args;
	let result = "";
	for(let a of options) {
		if(a.substring(0,current.length) == current){
			current = a;
		}
	}


	return command == "" ? current : command + " " + current;
}


