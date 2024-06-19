/* -------------------------------------------------------------------------- */
/* Generator Stabla izraza (sa opcijama za pretvaranje                        */
/* infiksne notacije u stablo izraza i prikaz čvorova)                        */
/* Copyright (C) 2020. codeblog.rs                                            */
/* -------------------------------------------------------------------------- */
import { CONFIG, SVG_PLATNO, STRUCT } from './ast_config.js'
/* -------------------------------------------------------------------------- */
class Cvor {
	constructor (tekstSadrzaj) {
		this.tekstSadrzaj  = tekstSadrzaj;
		
		// tip : 1 - operator
        //		 2 - operand

        // prioritet : 0 - operand  ('a'-'z')
        //		       1 - operator ("+" ili "-")
        //		       2 - operator ("*" ili "/")

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

function popunjavanjeRedaOperand(c, red) {
	let cvor = new Cvor(c);
    red.push(cvor);
}

function popunjavanjeRedaPlusMinus(c, red, stek) {
	if (stek.length == 0 || stek[stek.length - 1].tekstSadrzaj == "(") {
		let cvor = new Cvor(c);
	    stek.push(cvor);
	    return;
	}
	
	// while (STEK.length > 0 && (STEK[STEK.length - 1].tekstSadrzaj == "+" || STEK[STEK.length - 1].tekstSadrzaj == "-")) {
	while (stek.length > 0 && stek[stek.length - 1].tekstSadrzaj != "(") {
    	red.push(stek.pop());
    }

	let cvor = new Cvor(c);
	stek.push(cvor);
}

function popunjavanjeRedaPutaKroz(c, red, stek) {
    if (stek.length == 0 ||
       stek[stek.length - 1].tekstSadrzaj == "(" ||
       stek[stek.length - 1].tekstSadrzaj == '+' ||
       stek[stek.length - 1].tekstSadrzaj == "-") {
    	
    	let cvor = new Cvor(c);
        stek.push(cvor);
        return;
    }
    
    // while (STEK.length > 0 && STEK[STEK.length - 1].tekstSadrzaj != "(") {
    while (stek.length > 0 && (stek[stek.length - 1].tekstSadrzaj == "*" || stek[stek.length - 1].tekstSadrzaj == "/")) {
    	red.push(stek.pop());
    }
    
    let cvor = new Cvor(c);
    stek.push(cvor);
}

function popunjavanjeRedaOtvorenaZagrada(c, red, stek) {
	let cvor = new Cvor(c);
    stek.push(cvor);
}

function popunjavanjeRedaZatvorenaZagrada(c, red, stek) {
    let c2 = stek[stek.length - 1];

    while (c2.tekstSadrzaj != '(') {
        red.push(c2);
        stek.pop();
        c2 = stek[stek.length - 1];
    }

    stek.pop();
}

function popunjavanjeReda(s, obj) {
	let red  = obj.red  = [ ];
	let stek = obj.stek = [ ];

	let i;
	let d = s.length;
	let cvor;

	for (i = 0; i < d; i++) {
        let c = s[i];

        if ((c >= 'a' && c <= 'z') ||
           (c >= 'A' && c <= 'Z')) {
            popunjavanjeRedaOperand(c, obj.red);
            continue;
        }

        switch(c) {
        	case '+': popunjavanjeRedaPlusMinus(c, obj.red, obj.stek);        break;
        	case '-': popunjavanjeRedaPlusMinus(c, obj.red, obj.stek);        break;
        	case '*': popunjavanjeRedaPutaKroz(c, obj.red, obj.stek);         break;
        	case '/': popunjavanjeRedaPutaKroz(c, obj.red, obj.stek);         break;
        	case '(': popunjavanjeRedaOtvorenaZagrada(c, obj.red, obj.stek);  break;
        	case ')': popunjavanjeRedaZatvorenaZagrada(c, obj.red, obj.stek); break;
        	default: break;
        }
    }

    while (stek.length > 0) {
        red.push(stek.pop());
    }
}

function generisanjeStabla(obj) {
	let red  = obj.red;
	let stek = obj.stek;
	let d    = red.length;
	let i, op_1, op_2, novi_cvor;
	stek  = [ ];

	for (i = 0; i < d; i++) {
		let cv = red[i];
		if (cv.tip == 2) {
			stek.push(cv);
		}
		else {
			op_2 = stek[stek.length - 1];
			stek.pop();
			op_1 = stek[stek.length - 1];
			stek.pop();
			novi_cvor       = new Cvor(cv.tekstSadrzaj);
			novi_cvor.levi  = op_1;
			novi_cvor.desni = op_2;
			stek.push(novi_cvor);
		}
	}

	obj.stablo = stek[stek.length - 1];
}

function pronalazenjeMaxXRed(red, platno) {
	let i, m, cv;
	let max = -1000000000;

	for (i = 0; i < red.length; i++) {
		cv = red[i];
		if (cv.xPom > max){
			max = cv.xPom;
			if (cv.sledeciDesni > platno.kriticnaVisinaRazmak) {
				m = platno.dodatniRazmak;
			}
			else {
				m = 0;
			}
		}
	}

	return parseInt(m * platno.korekcija) + max;
}

function pronalazenjeMinXRed(red, platno) {
	let i, m, cv;
	let min = 1000000000;

	for (i = 0; i < red.length; i++) {
		cv = red[i];
		if (cv.xPom < min){
			min = cv.xPom;
			if (cv.sledeciLevi > platno.kriticnaVisinaRazmak) {
				m = platno.dodatniRazmak;
			}
			else {
				m = 0;
			}
		}
	}
	
	return parseInt(m * platno.korekcija) + (-min);
}

function ucitavanjeDonjegSprata(red, redPom) {
	let cvPom;

	if (red.length == 0) return;
		
	for (i = 0; i < red.length; i++) {
		cvPom = red[i];
				
		if (cvPom.levi != null) {
			cvPom.levi.xPom = cvPom.xPom - cvPom.sledeciLevi;
			redPom.push(cvPom.levi);
		}
		
		if (cvPom.desni != null) {
			cvPom.desni.xPom = cvPom.xPom + cvPom.sledeciDesni;
			redPom.push(cvPom.desni);
		}
	}
}

function azuriranjeSirineCvora(cvor, platno) {
	let imaDece  = true;
	let razmak   = 0;
	let dodatak  = 0;
	let redLe    = [ ];
	let redDe    = [ ];
	let redLePom = [ ];
	let redDePom = [ ];

	cvor.levi.xPom  = 0;
	cvor.desni.xPom = 0;
	
	redLe.push(cvor.levi);
	redDe.push(cvor.desni);

	do {
		let max_X_L  = pronalazenjeMaxXRed(redLe, platno);
		let dodatakL = parseInt(Math.floor(max_X_L / platno.korekcija));
		max_X_L      = max_X_L % platno.korekcija;
		// console.log("max_X_L: " + max_X_L);

		let max_X_D  = pronalazenjeMinXRed(redDe, platno);
		let dodatakD = parseInt(Math.floor(max_X_D / platno.korekcija));
		max_X_D      = max_X_D % platno.korekcija;

		if (max_X_L + max_X_D > razmak) {
			razmak  = max_X_L + max_X_D;
			dodatak = dodatakL + dodatakD;
		}

		ucitavanjeDonjegSprata(redLe, redLePom);
		ucitavanjeDonjegSprata(redDe, redDePom);

		redLe    = redLePom;
		redDe    = redDePom;
		redLePom = [ ];
		redDePom = [ ];
		
		imaDece = redLe. length > 0 && redDe.length > 0;
	}
	while (imaDece);

	razmak   += dodatak;
	let levi  = parseInt(Math.ceil(razmak / 2));
	let desni = razmak - levi;
	
	cvor.sledeciLevi  = levi  + 1;
	cvor.sledeciDesni = desni + 1;
}

function procenaSirine(cvor, platno) {
	if (cvor.levi.visina == 1 || cvor.desni.visina == 1) {
		cvor.sledeciLevi  =
		cvor.sledeciDesni = 1;
	}

	azuriranjeSirineCvora(cvor, platno);
}

function azuriranjeStablaSirinaVisina(cvor, platno) {
	if (cvor       == null ||
	   cvor.levi  == null ||
	   cvor.desni == null) return;

	azuriranjeStablaSirinaVisina(cvor.levi, platno);
	azuriranjeStablaSirinaVisina(cvor.desni, platno);

	// ŠIRINA:

	procenaSirine(cvor, platno);

	cvor.sirinaLevi  = cvor.sledeciLevi  + cvor.levi.sirinaLevi;
	cvor.sirinaDesni = cvor.sledeciDesni + cvor.desni.sirinaDesni;
	
	if (cvor.desni.sirinaLevi - 1 > cvor.sirinaLevi) {
		cvor.sirinaLevi = cvor.desni.sirinaLevi - 1;
	}
	
	if (cvor.levi.sirinaDesni - 1 > cvor.sirinaDesni) {
		cvor.sirinaDesni = cvor.levi.sirinaDesni - 1;
	}

	// VISINA:

	cvor.visina = (cvor.levi.visina > cvor.desni.visina)?
		cvor.levi.visina  + 1 : 
		cvor.desni.visina + 1;
	
	//console.log(cvor.tekstSadrzaj + " SlL: " + cvor.sledeciLevi + " SlD: " + cvor.sledeciDesni);
}

function azuriranjeStablaXY(red, stek, stablo, platno, config) {
	let visinaY = 1;
	let i;
	red = [ ];
	
	stablo.X = platno.marginaX + config.krugPoluprecnik2 + stablo.sirinaLevi * platno.razmakX;
	stablo.Y = platno.offsetY  +                           (visinaY - 1)     * platno.razmakY;
	/*
	console.log("KOREN: " + STABLO.tekstSadrzaj + " " +
		         STABLO.sirinaLevi + " " +
		         STABLO.sirinaDesni);
	//*/

	if (stablo.levi != null) {
		stablo.levi.predakX       =  stablo.X;
		stablo.levi.predakY       =  stablo.Y;
		stablo.levi.predakOffsetX = -stablo.sledeciLevi * platno.razmakX;
		red.push(stablo.levi);
	}
	
	if (stablo.desni != null) {
		stablo.desni.predakX       = stablo.X;
		stablo.desni.predakY       = stablo.Y;
		stablo.desni.predakOffsetX = stablo.sledeciDesni * platno.razmakX;
		red.push(stablo.desni);
	}
	
	visinaY++;

	while (red.length > 0) {
		let red_pom = [ ];

		for (i = 0; i < red.length; i++) {
			let cv_pom = red[i];
			cv_pom.X = cv_pom.predakX + cv_pom.predakOffsetX;
			cv_pom.Y = cv_pom.predakY + platno.razmakY;

			if (cv_pom.levi != null) {
				cv_pom.levi.predakX       = cv_pom.X;
				cv_pom.levi.predakY       = cv_pom.Y;
				cv_pom.levi.predakOffsetX = -cv_pom.sledeciLevi * platno.razmakX;
				red_pom.push(cv_pom.levi);
			}

			if (cv_pom.desni != null) {
				cv_pom.desni.predakX       = cv_pom.X;
				cv_pom.desni.predakY       = cv_pom.Y;
				cv_pom.desni.predakOffsetX = cv_pom.sledeciDesni * platno.razmakX;
				red_pom.push(cv_pom.desni);
			}
			/*
			console.log(cv_pom.tekstSadrzaj +
				        " sL: "  + cv_pom.sirinaLevi  +
				        " sD: "  + cv_pom.sirinaDesni +
				        " cvH: " + cv_pom.visina);
			//*/
		}

		red = [ ];
		red = red_pom;
		visinaY++;
	}
}

function crtanjeStabla(svgObjekat, obj, platno, config) {
	let i;
	let visinaY = 1;
	obj.red = [ ];
	obj.red.push(obj.stablo);

	while (obj.red.length > 0) {
		let red_pom = [ ];

		for (i = 0; i < obj.red.length; i++) {
			crtanjeCvora(svgObjekat, obj.red[i], platno, config);
			
			if (obj.red[i].levi != null) {
				red_pom.push(obj.red[i].levi);
			}

			if (obj.red[i].desni != null) {
				red_pom.push(obj.red[i].desni);
			}
		}

		obj.red = [ ];
		obj.red = red_pom;
	}
}

function citanjeStabla(obj) {
	let s = "";
	s += obj.stablo.tekstSadrzaj       + " ";
	s += obj.stablo.levi.tekstSadrzaj  + " ";
	s += obj.stablo.desni.tekstSadrzaj + " ";
	alert(s);
}

function citanjeReda(obj) {
	let i;
	let d = obj.red.length;
	let s = "";

	for (i = 0; i < d; i++) {
		s += obj.red[i].tekstSadrzaj;
	}

	alert(s);
}

function rekurzijaPrefiks(cvor, obj) {
	if (cvor == null) return;
	obj.ispis += cvor.tekstSadrzaj;
	rekurzijaPrefiks(cvor.levi, obj);
	rekurzijaPrefiks(cvor.desni, obj);
}

function rekurzijaPostfiks(cvor, obj) {
	if (cvor == null) return;
	rekurzijaPostfiks(cvor.levi, obj);
	rekurzijaPostfiks(cvor.desni, obj);
	obj.ispis += cvor.tekstSadrzaj;
}

function rekurzijaInfiks(cvor) {
	if (cvor == null) return "";
	
	let cvString    = cvor.tekstSadrzaj;
	let cvPrioritet = cvor.prioritet;
	//console.log("cvString: " + cvString + " cvPrioritet: " + cvPrioritet);

	if (cvPrioritet == 0) return cvString + cvPrioritet;

	let cvLeTekst = rekurzijaInfiks(cvor.levi);
	let cvDeTekst = rekurzijaInfiks(cvor.desni); 
	
	let cvLePrioritet   = cvLeTekst.charAt(cvLeTekst.length - 1);
	cvLeTekst           = cvLeTekst.substring(0, cvLeTekst.length - 1);
	
	let cvDePrioritet   = cvDeTekst.charAt(cvDeTekst.length - 1);
	cvDeTekst           = cvDeTekst.substring(0, cvDeTekst.length - 1);

	if (cvLePrioritet == "1" && cvPrioritet == "2") {
		cvLeTekst = "(" + cvLeTekst + ")";
	}
	
	if (cvDePrioritet == "1" && cvPrioritet == "2"){
		cvDeTekst = "(" + cvDeTekst + ")";
	}

	return cvLeTekst + cvString + cvDeTekst + cvPrioritet;
}

function generisanjeNotacijePrefiks(obj) {
	obj.ispis = "";
	rekurzijaPrefiks(obj.stablo, obj);
	return obj.ispis;
}

function generisanjeNotacijePostfiks(obj) {
	obj.ispis = "";
	rekurzijaPostfiks(obj.stablo, obj);
	return obj.ispis;
}

function generisanjeNotacijeInfiks(obj) {
	let s = rekurzijaInfiks(obj.stablo) 
	return s.substring(0, s.length-1);
}

function ispisTekstaSVG(svgObjekat, obj, platno, config) {
	let tekst;
	// INFIKS
	tekst = document.createElementNS(config.svgNs, "text");
    tekst.setAttribute("x",           config.fontOffsetXInfiks);
    tekst.setAttribute("y",           config.fontOffsetYInfiks);
    tekst.setAttribute("font-family", config.fontFamilijaInfiks);
    tekst.setAttribute("font-weight", config.fontDebljinaInfiks);
    tekst.setAttribute("font-size",   config.fontVelicinaInfiks);
    tekst.setAttribute("fill",        config.fontBojaInfiks);
    tekst.setAttribute("text-anchor",       "left");
    tekst.setAttribute("dominant-baseline", "central");
    tekst.textContent = generisanjeNotacijeInfiks(obj);
    svgObjekat.appendChild(tekst);
    // PREFIKS
	tekst = document.createElementNS(config.svgNs, "text");
    tekst.setAttribute("x",           config.fontOffsetXPrefiks);
    tekst.setAttribute("y",           config.fontOffsetYPrefiks);
    tekst.setAttribute("font-family", config.fontFamilijaPrefiks);
    tekst.setAttribute("font-weight", config.fontDebljinaPrefiks);
    tekst.setAttribute("font-size",   config.fontVelicinaPrefiks);
    tekst.setAttribute("fill",        config.fontBojaPrefiks);
    tekst.setAttribute("text-anchor",       "left");
    tekst.setAttribute("dominant-baseline", "central");
    tekst.textContent = generisanjeNotacijePrefiks(obj);
    svgObjekat.appendChild(tekst);
    // POSTFIKS
	tekst = document.createElementNS(config.svgNs, "text");
    tekst.setAttribute("x",           config.fontOffsetXPostfiks);
    tekst.setAttribute("y",           config.fontOffsetYPostfiks);
    tekst.setAttribute("font-family", config.fontFamilijaPostfiks);
    tekst.setAttribute("font-weight", config.fontDebljinaPostfiks);
    tekst.setAttribute("font-size",   config.fontVelicinaPostfiks);
    tekst.setAttribute("fill",        config.fontBojaPostfiks);
    tekst.setAttribute("text-anchor",       "left");
    tekst.setAttribute("dominant-baseline", "central");
    tekst.textContent = generisanjeNotacijePostfiks(obj);
    svgObjekat.appendChild(tekst);
}

function crtanjeCvora(svgObjekat, cvor, platno, config) {

    // LINIJA - LEVA

    let linijaLeva = document.createElementNS(config.svgNs, "line");

    linijaLeva.setAttribute("x1",           cvor.X);
    linijaLeva.setAttribute("y1",           cvor.Y);
    linijaLeva.setAttribute("x2",           cvor.X - cvor.sledeciLevi * platno.razmakX);
    linijaLeva.setAttribute("y2",           cvor.Y + ((cvor.sledeciLevi > 0)? 1 : 0) * ((cvor.visina > 1)? platno.razmakY : 0));
    linijaLeva.setAttribute("stroke",       config.ivicaBoja);
    linijaLeva.setAttribute("stroke-width", config.ivicaDebljina);

    // LINIJA - DESNA

    let linijaDesna = document.createElementNS(config.svgNs, "line");

    linijaDesna.setAttribute("x1",           cvor.X);
    linijaDesna.setAttribute("y1",           cvor.Y);
    linijaDesna.setAttribute("x2",           cvor.X + cvor.sledeciDesni * platno.razmakX);
    linijaDesna.setAttribute("y2",           cvor.Y + ((cvor.sledeciDesni > 0)? 1 : 0) * ((cvor.visina > 1)? platno.razmakY : 0));
    linijaDesna.setAttribute("stroke",       config.ivicaBoja);
    linijaDesna.setAttribute("stroke-width", config.ivicaDebljina);

    // KRUG

    let krug = document.createElementNS(config.svgNs, "circle");

    krug.setAttribute("cx",           cvor.X);
    krug.setAttribute("cy",           cvor.Y);
    krug.setAttribute("r",            ((cvor.tip == 1)? config.krugPoluprecnik1   : config.krugPoluprecnik2));
    krug.setAttribute("stroke",       ((cvor.tip == 1)? config.krugIvicaBoja1     : config.krugIvicaBoja2));
    krug.setAttribute("stroke-width", ((cvor.tip == 1)? config.krugIvicaDebljina1 : config.krugIvicaDebljina2));
    krug.setAttribute("fill",         ((cvor.tip == 1)? config.krugIspuna1        : config.krugIspuna2));

    // TEKST

    let tekst       = document.createElementNS(config.svgNs, "text");
    let koordinataY = cvor.Y + ((cvor.tip == 1)? config.fontOffsetY1  : config.fontOffsetY2);
    
    if (cvor.tekstSadrzaj == "g" || cvor.tekstSadrzaj == "p" ||
       cvor.tekstSadrzaj == "q" || cvor.tekstSadrzaj == "y" ||
       cvor.tekstSadrzaj == "c" || cvor.tekstSadrzaj == "e" ||
       cvor.tekstSadrzaj == "a") {
    	koordinataY += ((cvor.tip == 1)? config.fontOffsetYgpqy1  : config.fontOffsetYgpqy2);
    }
    
    tekst.setAttribute("x", cvor.X);
    tekst.setAttribute("y", koordinataY);
    tekst.setAttribute("font-family",       ((cvor.tip == 1)? config.fontFamilija1 : config.fontFamilija2));
    tekst.setAttribute("font-weight",       ((cvor.tip == 1)? config.fontDebljina1 : config.fontDebljina2));
    tekst.setAttribute("font-size",         ((cvor.tip == 1)? config.fontVelicina1 : config.fontVelicina2));
    tekst.setAttribute("fill",              ((cvor.tip == 1)? config.fontBoja1     : config.fontBoja2));
    tekst.setAttribute("text-anchor",       "middle");
    tekst.setAttribute("dominant-baseline", "central");
    tekst.textContent = cvor.tekstSadrzaj;
    
    svgObjekat.appendChild(linijaLeva);
    svgObjekat.appendChild(linijaDesna);
    svgObjekat.appendChild(linijaDesna);
    svgObjekat.appendChild(krug);
    svgObjekat.appendChild(tekst);
}

function initAstDemo() {
	let izraz  = document.getElementById("forma_ast_svg_izraz");
	izraz.value = "a*b+c";
	parseAST();
}

function parseAST(obj, platno, config) {
	let svg_platno = document.getElementById("svg_platno");
	let sirina     = svg_platno.clientWidth;
	svg_platno.style.maxWidth = sirina + "px";

	let svg1   = document.createElementNS(config.svgNs, "svg");
	let izraz  = document.getElementById("forma_ast_svg_izraz").value;
	
	popunjavanjeReda(izraz, obj);
	generisanjeStabla(obj);
	azuriranjeStablaSirinaVisina(obj.stablo, platno);
	azuriranjeStablaXY(obj.red, obj.stek, obj.stablo, platno, config);
	ispisTekstaSVG(svg1, obj, platno, config);
	crtanjeStabla(svg1, obj, platno, config);
	
	//alert(generisanjeNotacijePostfiks());
	//alert(generisanjeNotacijePrefiks());
	//alert(generisanjeNotacijeInfiks());
	
	platno.sirina = ((obj.stablo.sirinaLevi + obj.stablo.sirinaDesni) * platno.razmakX +
	                2 * platno.marginaX +
	                2 * config.krugPoluprecnik2) + "px";
	platno.visina = (obj.stablo.visina * platno.razmakY + platno.offsetY) + "px";
	// console.log("PROVERA")
	// console.log(obj)
	
	svg1.setAttribute("width",  platno.sirina);
	svg1.setAttribute("height", platno.visina);
    document.getElementById("svg_platno").innerHTML = "";
    document.getElementById("svg_platno").appendChild(svg1);
	
	//citanjeStabla();
	//citanjeReda();
}

document.getElementById("forma_ast_svg_izraz").addEventListener("focus", iskljucivanjePrecica)
document.getElementById("forma_ast_svg_izraz").addEventListener("blur",  ukljucivanjePrecica)
document.getElementById("dugme_ast_pokretanje").addEventListener("click", ( ) => { parseAST(STRUCT, SVG_PLATNO, CONFIG) } )

