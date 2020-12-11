/* -------------------------------------------------------------------------- */
/* Generator Stabla izraza (sa opcijama za pretvaranje infiksne notacije u    */
/* stablo izraza i prikaz čvorova                                             */
/* Copyright (C) 2020. Nikola Vukićević                                       */
/* -------------------------------------------------------------------------- */

const SVG_NS            = "http://www.w3.org/2000/svg";

// IVICE

var   ivicaDebljina     = 1.5;
var   ivicaBoja         = "#000";

// KRUGOVI

var   krugPoluprecnik1   = 16;
var   krugIvicaDebljina1 = 0.5;
var   krugIvicaBoja1     = "#000";
var   krugIspuna1        = "#083880";

var   krugPoluprecnik2   = 24;
var   krugIvicaDebljina2 = 0.5;
var   krugIvicaBoja2     = "#000";
var   krugIspuna2        = "#1070ff";

// TEKST (U KRUGOVIMA)

var   fontFamilija1     = "Montserrat, sans-serif";
var   fontFamilija1     = "Inconsolata, Consolas, monospace";
var   fontVelicina1     = "20px";
var   fontDebljina1     = 700;
var   fontBoja1         = "#fff";
var   fontOffsetY1      = -1;
var   fontOffsetYgpqy1  = -1;

var   fontFamilija2     = "Montserrat, sans-serif";
var   fontFamilija2     = "Inconsolata, Consolas, monospace";
var   fontVelicina2     = "24px";
var   fontDebljina2     = 400;
var   fontBoja2         = "#fff";
var   fontOffsetY2      = -1;
var   fontOffsetYgpqy2  = -3;

// TEKST NOTACIJE

var   fontFamilijaInfiks   = "Montserrat-Medium, sans-serif";
var   fontFamilijaInfiks   = "Inconsolata, Consolas, monospace";
var   fontVelicinaInfiks   = "22px";
var   fontDebljinaInfiks   = 700;
var   fontBojaInfiks       = "#1070ff";
var   fontOffsetXInfiks    = 20;
var   fontOffsetYInfiks    = 32;

var   fontFamilijaPrefiks  = "Montserrat-Medium, sans-serif";
var   fontFamilijaPrefiks  = "Inconsolata, Consolas, monospace";
var   fontVelicinaPrefiks  = "22px";
var   fontDebljinaPrefiks  = 700;
var   fontBojaPrefiks      = "#1070ff";
var   fontOffsetXPrefiks   = 20;
var   fontOffsetYPrefiks   = 64;

var   fontFamilijaPostfiks = "Montserrat-Medium, sans-serif";
var   fontFamilijaPostfiks = "Inconsolata, Consolas, monospace";
var   fontVelicinaPostfiks = "22px";
var   fontDebljinaPostfiks = 700;
var   fontBojaPostfiks     = "#1070ff";
var   fontOffsetXPostfiks  = 20;
var   fontOffsetYPostfiks  = 96;

// SVG_STABLO

var   svgPlatnoSirina      = "100%";
var   svgPlatnoVisina      = "800px";
var   stabloMarginaX       = 36;
var   stabloOffsetY        = 160;
var   razmakX              = 32;
var   razmakY              = 56;
var   kriticnaVisinaRazmak = 4;
var   dodatniRazmak        = 2;
var   KOREKCIJA            = 1000;

// GLAVNE STRUKTURE PODATAKA

var   RED;
var   STEK;
var   STABLO;
var   ISPIS;

class Cvor {
	constructor (tekstSadrzaj) {
		this.tekstSadrzaj  = tekstSadrzaj;
		
		// tip : 1 - operator
        //		 2 - operand

        // prioritet : 0 - operand (a-z)
        //		       1 - operator ("+" ili "-")
        //		       2 - operator ("+" ili "-")

		switch(this.tekstSadrzaj) {
			case "+" : this.tip = 1; this.prioritet = 1; break;
			case "-" : this.tip = 1; this.prioritet = 1; break;
			case "*" : this.tip = 1; this.prioritet = 2; break;
			case "/" : this.tip = 1; this.prioritet = 2; break;
			default:   this.tip = 2; this.prioritet = 0; break;
		}
		
		this.X             = 0;
		this.Y             = 0;
		this.xPom          = 0;
		this.yPom          = 0;
		this.visina        = 1;
		this.sirinaLevi    = 0;
		this.sirinaDesni   = 0;
		this.sledeciLevi   = 0;
		this.sledeciDesni  = 0;
		this.predakX       = 0;
		this.predakY       = 0;
		this.predakOffsetX = 0;
		this.predakOffsetY = 0;
		this.levi          = null;
		this.desni         = null;
	}
}

function popunjavanjeRedaOperand(c) {
	cvor = new Cvor(c);
    RED.push(cvor);
}

function popunjavanjeRedaPlusMinus(c) {
	if(STEK.length == 0 || STEK[STEK.length - 1].tekstSadrzaj == "(") {
		cvor = new Cvor(c);
	    STEK.push(cvor);
	}
	else {
        while(STEK.length > 0 && STEK[STEK.length - 1].tekstSadrzaj != "(") {
	    	RED.push(STEK.pop());
        }
	    cvor = new Cvor(c);
	    STEK.push(cvor);
	}		
}

function popunjavanjeRedaPutaKroz(c) {
    if(STEK.length == 0 || STEK[STEK.length - 1].tekstSadrzaj == "(" ||
       STEK[STEK.length - 1].tekstSadrzaj == '+' || STEK[STEK.length - 1].tekstSadrzaj == "-") {
    	cvor = new Cvor(c);
        STEK.push(cvor);
    }
    else {
        while(STEK.length > 0 && STEK[STEK.length - 1].tekstSadrzaj != "(") {
        	RED.push(STEK.pop());
        }
        cvor = new Cvor(c);
        STEK.push(cvor);
    }
}

function popunjavanjeRedaOtvorenaZagrada(c) {
	cvor = new Cvor(c);
    STEK.push(cvor);
}

function popunjavanjeRedaZatvorenaZagrada(c) {
    let c2 = STEK[STEK.length - 1];

    while(c2.tekstSadrzaj != '(') {
        RED.push(c2);
        STEK.pop();
        c2 = STEK[STEK.length - 1];
    }

    STEK.pop();
}

function popunjavanjeReda(s) {
	RED   = [];
	STEK  = [];
	let i;
	let d = s.length;
	let cvor;

	for(i = 0; i < d; i++) {
        let c = s[i];

        if((c >= 'a' && c <= 'z') ||
           (c >= 'A' && c <= 'Z')) {
            popunjavanjeRedaOperand(c);
            continue;
        }

        switch(c) {
        	case '+': popunjavanjeRedaPlusMinus(c);        break;
        	case '-': popunjavanjeRedaPlusMinus(c);        break;
        	case '*': popunjavanjeRedaPutaKroz(c);         break;
        	case '/': popunjavanjeRedaPutaKroz(c);         break;
        	case '(': popunjavanjeRedaOtvorenaZagrada(c);  break;
        	case ')': popunjavanjeRedaZatvorenaZagrada(c); break;
        	default: break;
        }
    }

    while(STEK.length > 0) {
        RED.push(STEK.pop());
    }
}

function generisanjeStabla() {
	let i;
	let d = RED.length;
	STEK  = [];

	for(i = 0; i < d; i++) {
		cv = RED[i];
		if(cv.tip == 2) {
			STEK.push(cv);
		}
		else {
			op_2 = STEK[STEK.length - 1];
			STEK.pop();
			op_1 = STEK[STEK.length - 1];
			STEK.pop();
			novi_cvor       = new Cvor(cv.tekstSadrzaj);
			novi_cvor.levi  = op_1;
			novi_cvor.desni = op_2;
			STEK.push(novi_cvor);
		}
	}

	STABLO = STEK[STEK.length - 1];
}

function pronalazenjeMaxXRed(red) {
	let i;
	let m;
	let max = -1000000000;

	for(i = 0; i < red.length; i++) {
		cv = red[i];
		if(cv.xPom > max){
			max = cv.xPom;
			if(cv.sledeciDesni > kriticnaVisinaRazmak) {
				m = dodatniRazmak;
			}
			else {
				m = 0;
			}
		}
	}

	return parseInt(m * KOREKCIJA) + max;
}

function pronalazenjeMinXRed(red) {
	let i;
	let m;
	let min = 1000000000;

	for(i = 0; i < red.length; i++) {
		cv = red[i];
		if(cv.xPom < min){
			min = cv.xPom;
			if(cv.sledeciLevi > kriticnaVisinaRazmak) {
				m = dodatniRazmak;
			}
			else {
				m = 0;
			}
		}
	}
	
	return parseInt(m * KOREKCIJA) + (-min);
}

function ucitavanjeDonjegSprata(red, redPom) {
	if(red.length == 0) return;
		
	for(i = 0; i < red.length; i++) {
		cvPom = red[i];
				
		if(cvPom.levi != null) {
			cvPom.levi.xPom = cvPom.xPom - cvPom.sledeciLevi;
			redPom.push(cvPom.levi);
		}
		
		if(cvPom.desni != null) {
			cvPom.desni.xPom = cvPom.xPom + cvPom.sledeciDesni;
			redPom.push(cvPom.desni);
		}
	}
}

function azuriranjeSirineCvora(cvor) {
	let imaDece  = true;
	let razmak   = 0;
	let dodatak  = 0;
	let redLe    = [];
	let redDe    = [];
	let redLePom = [];
	let redDePom = [];

	cvor.levi.xPom  = 0;
	cvor.desni.xPom = 0;
	
	redLe.push(cvor.levi);
	redDe.push(cvor.desni);

	do {
		let max_X_L  = pronalazenjeMaxXRed(redLe);
		let dodatakL = parseInt(Math.floor(max_X_L / KOREKCIJA));
		max_X_L      = max_X_L % KOREKCIJA;
		console.log("max_X_L: " + max_X_L);

		let max_X_D  = pronalazenjeMinXRed(redDe);
		let dodatakD = parseInt(Math.floor(max_X_D / KOREKCIJA));
		max_X_D      = max_X_D % KOREKCIJA;

		if(max_X_L + max_X_D > razmak) {
			razmak  = max_X_L + max_X_D;
			dodatak = dodatakL + dodatakD;
		}

		ucitavanjeDonjegSprata(redLe, redLePom);
		ucitavanjeDonjegSprata(redDe, redDePom);

		redLe    = redLePom;
		redDe    = redDePom;
		redLePom = [];
		redDePom = [];
		
		imaDece = redLe. length > 0 && redDe.length > 0;
	}
	while(imaDece);

	razmak   += dodatak;
	let levi  = parseInt(Math.ceil(razmak / 2));
	let desni = razmak - levi;
	
	cvor.sledeciLevi  = levi  + 1;
	cvor.sledeciDesni = desni + 1;
}

function procenaSirine(cvor) {
	if(cvor.levi.visina == 1 || cvor.desni.visina == 1) {
		cvor.sledeciLevi  =
		cvor.sledeciDesni = 1;
	}

	azuriranjeSirineCvora(cvor);
}

function azuriranjeStablaSirinaVisina(cvor) {
	if(cvor       == null ||
	   cvor.levi  == null ||
	   cvor.desni == null) return;

	azuriranjeStablaSirinaVisina(cvor.levi);
	azuriranjeStablaSirinaVisina(cvor.desni);

	// ŠIRINA:

	procenaSirine(cvor);

	cvor.sirinaLevi  = cvor.sledeciLevi  + cvor.levi.sirinaLevi;
	cvor.sirinaDesni = cvor.sledeciDesni + cvor.desni.sirinaDesni;
	
	if(cvor.desni.sirinaLevi - 1 > cvor.sirinaLevi) {
		cvor.sirinaLevi = cvor.desni.sirinaLevi - 1;
	}
	
	if(cvor.levi.sirinaDesni - 1 > cvor.sirinaDesni) {
		cvor.sirinaDesni = cvor.levi.sirinaDesni - 1;
	}

	// VISINA:

	cvor.visina = (cvor.levi.visina > cvor.desni.visina)?
		cvor.levi.visina  + 1 : 
		cvor.desni.visina + 1;
	
	//console.log(cvor.tekstSadrzaj + " SlL: " + cvor.sledeciLevi + " SlD: " + cvor.sledeciDesni);
}

function azuriranjeStablaXY() {
	let i;
	let visinaY = 1;
	RED = [];
	
	STABLO.X = stabloMarginaX + krugPoluprecnik2 + STABLO.sirinaLevi * razmakX;
	STABLO.Y = stabloOffsetY  +                    (visinaY - 1)     * razmakY;
	/*
	console.log("KOREN: " + STABLO.tekstSadrzaj + " " +
		         STABLO.sirinaLevi + " " +
		         STABLO.sirinaDesni);
	//*/

	if(STABLO.levi != null) {
		STABLO.levi.predakX       =  STABLO.X;
		STABLO.levi.predakY       =  STABLO.Y;
		STABLO.levi.predakOffsetX = -STABLO.sledeciLevi * razmakX;
		RED.push(STABLO.levi);
	}
	
	if(STABLO.desni != null) {
		STABLO.desni.predakX       = STABLO.X;
		STABLO.desni.predakY       = STABLO.Y;
		STABLO.desni.predakOffsetX = STABLO.sledeciDesni * razmakX;
		RED.push(STABLO.desni);
	}
	
	visinaY++;

	while(RED.length > 0) {
		let red_pom = [];

		for(i = 0; i < RED.length; i++) {
			let cv_pom = RED[i];
			cv_pom.X = cv_pom.predakX + cv_pom.predakOffsetX;
			cv_pom.Y = cv_pom.predakY + razmakY;

			if(cv_pom.levi != null) {
				cv_pom.levi.predakX       = cv_pom.X;
				cv_pom.levi.predakY       = cv_pom.Y;
				cv_pom.levi.predakOffsetX = -cv_pom.sledeciLevi * razmakX;
				red_pom.push(cv_pom.levi);
			}

			if(cv_pom.desni != null) {
				cv_pom.desni.predakX       = cv_pom.X;
				cv_pom.desni.predakY       = cv_pom.Y;
				cv_pom.desni.predakOffsetX = cv_pom.sledeciDesni * razmakX;
				red_pom.push(cv_pom.desni);
			}
			/*
			console.log(cv_pom.tekstSadrzaj +
				        " sL: "  + cv_pom.sirinaLevi  +
				        " sD: "  + cv_pom.sirinaDesni +
				        " cvH: " + cv_pom.visina);
			//*/
		}

		RED = [];
		RED = red_pom;
		visinaY++;
	}
}

function crtanjeStabla(svgObjekat) {
	let i;
	let visinaY = 1;
	RED = [];
	RED.push(STABLO);

	while(RED.length > 0) {
		let red_pom = [];

		for(i = 0; i < RED.length; i++) {
			crtanjeCvora(svgObjekat, RED[i]);
			
			if(RED[i].levi != null) {
				red_pom.push(RED[i].levi);
			}

			if(RED[i].desni != null) {
				red_pom.push(RED[i].desni);
			}
		}

		RED = [];
		RED = red_pom;
	}
}

function citanjeStabla() {
	let s = "";
	s += STABLO.tekstSadrzaj       + " ";
	s += STABLO.levi.tekstSadrzaj  + " ";
	s += STABLO.desni.tekstSadrzaj + " ";
	alert(s);
}

function citanjeReda() {
	let i;
	let d = RED.length;
	let s = "";

	for (i = 0; i < d; i++) {
		s += RED[i].tekstSadrzaj;
	}

	alert(s);
}

function rekurzijaPrefiks(cvor) {
	if(cvor == null) return;
	ISPIS += cvor.tekstSadrzaj;
	rekurzijaPrefiks(cvor.levi);
	rekurzijaPrefiks(cvor.desni);
}

function rekurzijaPostfiks(cvor) {
	if(cvor == null) return;
	rekurzijaPostfiks(cvor.levi);
	rekurzijaPostfiks(cvor.desni);
	ISPIS += cvor.tekstSadrzaj;
}

function rekurzijaInfiks(cvor) {
	if(cvor == null) return "";
	
	let cvString    = cvor.tekstSadrzaj;
	let cvPrioritet = cvor.prioritet;
	//console.log("cvString: " + cvString + " cvPrioritet: " + cvPrioritet);

	if(cvPrioritet == 0) return cvString + cvPrioritet;

	let cvLeTekst = rekurzijaInfiks(cvor.levi);
	let cvDeTekst = rekurzijaInfiks(cvor.desni); 
	
	let cvLePrioritet   = cvLeTekst.charAt(cvLeTekst.length - 1);
	cvLeTekst           = cvLeTekst.substring(0, cvLeTekst.length - 1);
	
	let cvDePrioritet   = cvDeTekst.charAt(cvDeTekst.length - 1);
	cvDeTekst           = cvDeTekst.substring(0, cvDeTekst.length - 1);

	if(cvLePrioritet == "1" && cvPrioritet == "2") {
		cvLeTekst = "(" + cvLeTekst + ")";
	}
	
	if(cvDePrioritet == "1" && cvPrioritet == "2"){
		cvDeTekst = "(" + cvDeTekst + ")";
	}

	return cvLeTekst + cvString + cvDeTekst + cvPrioritet;
}

function generisanjeNotacijePrefiks() {
	ISPIS = "";
	rekurzijaPrefiks(STABLO);
	return ISPIS;
}

function generisanjeNotacijePostfiks() {
	ISPIS = "";
	rekurzijaPostfiks(STABLO);
	return ISPIS;
}

function generisanjeNotacijeInfiks() {
	let s = rekurzijaInfiks(STABLO) 
	return s.substring(0, s.length-1);
}

function parseAST() {
	let svg_platno = document.getElementById("svg_platno");
	let sirina     = svg_platno.clientWidth;
	svg_platno.style.maxWidth = sirina + "px";

	var svg1   = document.createElementNS(SVG_NS, "svg");
	let izraz  = document.getElementById("forma_ast_svg_izraz").value;
	
	popunjavanjeReda(izraz);
	generisanjeStabla();
	azuriranjeStablaSirinaVisina(STABLO);
	azuriranjeStablaXY();
	ispisTekstaSVG(svg1);
	crtanjeStabla(svg1);
	
	//alert(generisanjeNotacijePostfiks());
	//alert(generisanjeNotacijePrefiks());
	//alert(generisanjeNotacijeInfiks());
	
	svgPlatnoSirina = ((STABLO.sirinaLevi + STABLO.sirinaDesni) * razmakX +
		              2 * stabloMarginaX+
		              2 * krugPoluprecnik2) + "px";
	svgPlatnoVisina = (STABLO.visina * razmakY + stabloOffsetY) + "px";
	
	svg1.setAttribute("width",  svgPlatnoSirina);
	svg1.setAttribute("height", svgPlatnoVisina);
    document.getElementById("svg_platno").innerHTML = "";
    document.getElementById("svg_platno").appendChild(svg1);
	
	//citanjeStabla();
	//citanjeReda();
}

function ispisTekstaSVG(svgObjekat) {
	var tekst;
	// INFIKS
	tekst = document.createElementNS(SVG_NS, "text");
    tekst.setAttribute("x",           fontOffsetXInfiks);
    tekst.setAttribute("y",           fontOffsetYInfiks);
    tekst.setAttribute("font-family", fontFamilijaInfiks);
    tekst.setAttribute("font-weight", fontDebljinaInfiks);
    tekst.setAttribute("font-size",   fontVelicinaInfiks);
    tekst.setAttribute("fill",        fontBojaInfiks);
    tekst.setAttribute("text-anchor",       "left");
    tekst.setAttribute("dominant-baseline", "central");
    tekst.textContent = generisanjeNotacijeInfiks();
    svgObjekat.appendChild(tekst);
    // PREFIKS
	tekst = document.createElementNS(SVG_NS, "text");
    tekst.setAttribute("x",           fontOffsetXPrefiks);
    tekst.setAttribute("y",           fontOffsetYPrefiks);
    tekst.setAttribute("font-family", fontFamilijaPrefiks);
    tekst.setAttribute("font-weight", fontDebljinaPrefiks);
    tekst.setAttribute("font-size",   fontVelicinaPrefiks);
    tekst.setAttribute("fill",        fontBojaPrefiks);
    tekst.setAttribute("text-anchor",       "left");
    tekst.setAttribute("dominant-baseline", "central");
    tekst.textContent = generisanjeNotacijePrefiks();
    svgObjekat.appendChild(tekst);
    // POSTFIKS
	tekst = document.createElementNS(SVG_NS, "text");
    tekst.setAttribute("x",           fontOffsetXPostfiks);
    tekst.setAttribute("y",           fontOffsetYPostfiks);
    tekst.setAttribute("font-family", fontFamilijaPostfiks);
    tekst.setAttribute("font-weight", fontDebljinaPostfiks);
    tekst.setAttribute("font-size",   fontVelicinaPostfiks);
    tekst.setAttribute("fill",        fontBojaPostfiks);
    tekst.setAttribute("text-anchor",       "left");
    tekst.setAttribute("dominant-baseline", "central");
    tekst.textContent = generisanjeNotacijePostfiks();
    svgObjekat.appendChild(tekst);
}

function crtanjeCvora(svgObjekat, cvor) {

    // LINIJA - LEVA

    var linijaLeva = document.createElementNS(SVG_NS, "line");

    linijaLeva.setAttribute("x1",           cvor.X);
    linijaLeva.setAttribute("y1",           cvor.Y);
    linijaLeva.setAttribute("x2",           cvor.X - cvor.sledeciLevi * razmakX);
    linijaLeva.setAttribute("y2",           cvor.Y + ((cvor.sledeciLevi > 0)? 1 : 0) * ((cvor.visina > 1)? razmakY : 0));
    linijaLeva.setAttribute("stroke",       ivicaBoja);
    linijaLeva.setAttribute("stroke-width", ivicaDebljina);

    // LINIJA - DESNA

    var linijaDesna = document.createElementNS(SVG_NS, "line");

    linijaDesna.setAttribute("x1",           cvor.X);
    linijaDesna.setAttribute("y1",           cvor.Y);
    linijaDesna.setAttribute("x2",           cvor.X + cvor.sledeciDesni * razmakX);
    linijaDesna.setAttribute("y2",           cvor.Y + ((cvor.sledeciDesni > 0)? 1 : 0) * ((cvor.visina > 1)? razmakY : 0));
    linijaDesna.setAttribute("stroke",       ivicaBoja);
    linijaDesna.setAttribute("stroke-width", ivicaDebljina);

    // KRUG

    var krug = document.createElementNS(SVG_NS, "circle");

    krug.setAttribute("cx",           cvor.X);
    krug.setAttribute("cy",           cvor.Y);
    krug.setAttribute("r",            ((cvor.tip == 1)? krugPoluprecnik1   : krugPoluprecnik2));
    krug.setAttribute("stroke",       ((cvor.tip == 1)? krugIvicaBoja1     : krugIvicaBoja2));
    krug.setAttribute("stroke-width", ((cvor.tip == 1)? krugIvicaDebljina1 : krugIvicaDebljina2));
    krug.setAttribute("fill",         ((cvor.tip == 1)? krugIspuna1        : krugIspuna2));

    // TEKST

    var tekst       = document.createElementNS(SVG_NS, "text");
    var koordinataY = cvor.Y + ((cvor.tip == 1)? fontOffsetY1  : fontOffsetY2);
    if(cvor.tekstSadrzaj == "g" || cvor.tekstSadrzaj == "p" ||
       cvor.tekstSadrzaj == "q" || cvor.tekstSadrzaj == "y" ||
       cvor.tekstSadrzaj == "c" || cvor.tekstSadrzaj == "e" ||
       cvor.tekstSadrzaj == "a") {
    	koordinataY += ((cvor.tip == 1)? fontOffsetYgpqy1  : fontOffsetYgpqy2);
    }
    tekst.setAttribute("x", cvor.X);
    tekst.setAttribute("y", koordinataY);
    tekst.setAttribute("font-family",       ((cvor.tip == 1)? fontFamilija1 : fontFamilija2));
    tekst.setAttribute("font-weight",       ((cvor.tip == 1)? fontDebljina1 : fontDebljina2));
    tekst.setAttribute("font-size",         ((cvor.tip == 1)? fontVelicina1 : fontVelicina2));
    tekst.setAttribute("fill",              ((cvor.tip == 1)? fontBoja1     : fontBoja2));
    tekst.setAttribute("text-anchor",       "middle");
    tekst.setAttribute("dominant-baseline", "central");
    tekst.textContent = cvor.tekstSadrzaj;
    
    svgObjekat.appendChild(linijaLeva);
    svgObjekat.appendChild(linijaDesna);
    svgObjekat.appendChild(krug);
    svgObjekat.appendChild(tekst);
}
