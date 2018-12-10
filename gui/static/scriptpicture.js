var url2 = "https://"+window.location.hostname+"/snapshot";
var d = new Date();
var picturename = d.getFullYear()+"_"+(d.getMonth() + 1)+"_"+d.getDate()+"_"+d.getHours()+"_"+d.getMinutes()+"_"+d.getSeconds()+"_"+d.getMilliseconds()+"_Picture";

window.onload = function InitFunction2() {
	document.getElementById("foto").setAttribute("src", url2);
	document.getElementById("fotolink").setAttribute("href", url2);
}

