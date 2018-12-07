var dutycycle;
var videostatus = false;
var url = "http://"+window.location.hostname+"/stream";
// var url = "http://"+window.location.hostname+":8080/?action=stream";
// var url = "https://raspyrover.pagekite.me/?action=stream";


window.onload = function InitFunction() {
	// Inizializza slider per velocità
	var slider = document.getElementById("myRange");
	var output = document.getElementById("velocity");
	output.innerHTML = slider.value;
	dutycycle = Number((45 + (0.55 * slider.value)).toFixed(2));
	slider.oninput = function SliderModify() {
		output.innerHTML = this.value;
		dutycycle = Number((45 + (0.55 * slider.value)).toFixed(2));
	}
	// Inizializza URL per Mjpg Streamer
	
}

function mouseDownAvanti() {
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "avanti?velocita=" + dutycycle, true);
	xhttp.send();
}

function mouseDownIndietro() {
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "indietro?velocita=" + dutycycle, true);
	xhttp.send();
}

function mouseDownGiraSx() {
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "girasx", true);
	xhttp.send();
}

function mouseDownGiraDx() {
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "giradx", true);
	xhttp.send();
}

function mouseUp() {
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "stop", true);
	xhttp.send();
}

function ScattaFoto() {
	document.getElementById("foto").style="width: 300px; height: 300px;";
	document.getElementById("foto").src="/static/pleasewait.gif";
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200){
			document.getElementById("foto").style="width: 800px; height: 600px;";
			document.getElementById("foto").src="/static/capture.jpg";
			document.getElementById("testofoto").innerHTML=this.responseText;
		}
	}
	xhttp.open("GET", "scattafoto", true);
	xhttp.send();
}

function Light() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200){
			if (xhttp.responseText == "off"){
				document.getElementById("lightbulb").src="/static/light.png";
			} else if (xhttp.responseText == "on"){
				document.getElementById("lightbulb").src="/static/lighton.png";
			}
		}
	}
	xhttp.open("GET", "light", true);
	xhttp.send();
}

function Video() {
	if (videostatus == false){
		document.getElementById("video").setAttribute("src", url);
		// document.getElementById("video").src="http://192.168.1.2:8080/?action=stream";
		document.getElementById("film").src="/static/filmon.png";
	} else if (videostatus == true){
		document.getElementById("video").src="/static/live.png";
		document.getElementById("film").src="/static/film.png";
	}
	videostatus = !(videostatus);
}

function Sysinfo() {
	var xhttp = new XMLHttpRequest();
	var info;
	xhttp.open("GET", "sysinfo", true);
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4) {
		console.log("State ready!");
		if (xhttp.status == 200){
			info = JSON.parse(xhttp.responseText);
			document.getElementById("date").innerHTML= info[0];
			document.getElementById("tempCPU").innerHTML= info[1];
			document.getElementById("ver").innerHTML= info[2];
			document.getElementById("ESSID").innerHTML= info[3];
			document.getElementById("quality").innerHTML= info[4];
			document.getElementById("level").innerHTML= info[5];
			document.getElementById("disk").innerHTML= info[6];
		} else {
			alert("Si e' verificato un problema con l'URL.");
		}
		}
	}
	console.log("sending request");
	xhttp.send();
}


