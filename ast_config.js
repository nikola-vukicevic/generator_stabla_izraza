/* -------------------------------------------------------------------------- */
/* Copyright (C) 2020. codeblog.rs                                            */
/* -------------------------------------------------------------------------- */
export const CONFIG = {
	svgNs:      "http://www.w3.org/2000/svg",
	platnoId:   "svg_platno",
	poljeIzraz: "forma_ast_svg_izraz",

	// IVICE

	ivicaDebljina:     1.5,
	ivicaBoja:         "#000",

	// KRUGOVI

	krugPoluprecnik1:   16,
	krugIvicaDebljina1: 0.5,
	krugIvicaBoja1:     "#000",
	// krugIspuna1:        "#083880",
	krugIspuna1:        "#275190",

	krugPoluprecnik2:   24,
	krugIvicaDebljina2: 2.0,
	krugIvicaBoja2:     "#000",
	// krugIspuna2:        "#1070ff",
	krugIspuna2:        "#849bc0",

	// TEKST (U KRUGOVIMA)

	fontFamilija1:     "Montserrat, sans-serif",
	fontFamilija1:     "Inconsolata, Consolas, monospace",
	fontVelicina1:     "20px",
	fontDebljina1:     700,
	fontBoja1:         "#fff",
	fontOffsetY1:      -1,
	fontOffsetYgpqy1:  -1,

	fontFamilija2:     "Montserrat, sans-serif",
	fontFamilija2:     "Inconsolata, Consolas, monospace",
	fontVelicina2:     "24px",
	fontDebljina2:     400,
	fontBoja2:         "#fff",
	fontOffsetY2:      -1,
	fontOffsetYgpqy2:  -3,

	// TEKST NOTACIJE

	fontFamilijaInfiks:   "Montserrat-Medium, sans-serif",
	fontFamilijaInfiks:   "Inconsolata, Consolas, monospace",
	fontVelicinaInfiks:   "22px",
	fontDebljinaInfiks:   700,
	fontBojaInfiks:       "#1070ff",
	fontOffsetXInfiks:    20,
	fontOffsetYInfiks:    32,

	fontFamilijaPrefiks:  "Montserrat-Medium, sans-serif",
	fontFamilijaPrefiks:  "Inconsolata, Consolas, monospace",
	fontVelicinaPrefiks:  "22px",
	fontDebljinaPrefiks:  700,
	fontBojaPrefiks:      "#1070ff",
	fontOffsetXPrefiks:   20,
	fontOffsetYPrefiks:   64,

	fontFamilijaPostfiks: "Montserrat-Medium, sans-serif",
	fontFamilijaPostfiks: "Inconsolata, Consolas, monospace",
	fontVelicinaPostfiks: "22px",
	fontDebljinaPostfiks: 700,
	fontBojaPostfiks:     "#1070ff",
	fontOffsetXPostfiks:  20,
	fontOffsetYPostfiks:  96,
}

export let SVG_PLATNO = {
	sirina:               "100%",
	visina:               "800px",
	marginaX:             36,
	offsetY:              160,
	razmakX:              32,
	razmakY:              56,
	kriticnaVisinaRazmak: 4,
	dodatniRazmak:        2,
	korekcija:            1000
}

export let STRUCT = {
	red:    null,
	stek:   null,
	stablo: null,
	ispis:  null
}

