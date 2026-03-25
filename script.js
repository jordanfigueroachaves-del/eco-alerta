// ==========================
// 🔥 FIREBASE
// ==========================

const firebaseConfig = {
  apiKey: "AIzaSyDZPAKB-nVQVSeY4Q0Pp31y2xclSmZQfc8",
  authDomain: "eco-alerta-b611f.firebaseapp.com",
  projectId: "eco-alerta-b611f",
  storageBucket: "eco-alerta-b611f.appspot.com",
  messagingSenderId: "1005199832613",
  appId: "1:1005199832613:web:ee22e311d5e6b11b6331cc"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


// ==========================
// 🗺️ MAPA
// ==========================

var map = L.map('map').setView([15.3,-92.5],8.9);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
maxZoom:18
}).addTo(map);


// funciones
function estadoAgua(cont){
if(cont < 0.3) return "🟢 Seguro";
if(cont < 0.6) return "🟡 Precaución";
return "🔴 Peligroso";
}

function derivada(actual){
var anterior = actual - (Math.random()*0.2);
return actual - anterior;
}

var playaSeleccionada = "";


// playas
var playas=[

{nombre:"Puerto Arista",coords:[15.9339,-93.8095],cont:0.9},
{nombre:"Boca del Cielo",coords:[15.8520,-93.6694],cont:0.6},
{nombre:"Playa Linda",coords:[14.67067,-92.37297],cont:0.8},
{nombre:"Playa San Benito",coords:[14.4300,-92.2445],cont:0.3},
{nombre:"El Madresal",coords:[15.8008,-93.6007],cont:0.5},
{nombre:"Barra de Zacapulco",coords:[15.195379,-92.88379],cont:0.7},
{nombre:"Chocohuital",coords:[15.60215,-93.33826],cont:0.85},
{nombre:"Barra de San Simón",coords:[14.8016,-92.5004],cont:0.75},
{nombre:"Barra San José",coords:[14.91944,-92.62333],cont:0.55},
{nombre:"Bahía Santa Brígida",coords:[15.5522,-93.2806],cont:0.65},
{nombre:"Playa Azul",coords:[15.30,-93.30],cont:0.50},
{nombre:"Las Escolleras",coords:[14.70833,-92.36667],cont:0.80},
{nombre:"El Ballenato",coords:[15.2333,-92.7667],cont:0.45},
{nombre:"La Palma",coords:[15.1731,-92.8369],cont:0.60}

];


// heatmap
var datosHeat = playas.map(function(p){
return [p.coords[0], p.coords[1], p.cont];
});

L.heatLayer(datosHeat,{
radius:40,
blur:30,
maxZoom:10
}).addTo(map);


// marcadores
playas.forEach(function(p){

var marcador = L.marker(p.coords).addTo(map);

marcador.on("click", function(){

playaSeleccionada = p.nombre;

var porcentaje = (p.cont*100).toFixed(0);
var estado = estadoAgua(p.cont);
var cambio = derivada(p.cont);

var alerta = "";

if(cambio > 0.1){
alerta = "⚠️ Empeorando rápido";
}else if(cambio > 0){
alerta = "⬆️ Aumentando";
}else{
alerta = "⬇️ Estable";
}

document.getElementById("nombrePlaya").innerText = p.nombre;
document.getElementById("porcentaje").innerText = porcentaje + "%";
document.getElementById("seguridad").innerText = estado;
document.getElementById("alerta").innerText = alerta;

});

});


// ==========================
// 📝 FORMULARIO
// ==========================

function abrirFormulario(){
var f = document.getElementById("formulario");
f.style.display = f.style.display === "none" ? "block" : "none";
}


// ==========================
// 🔥 GUARDAR EN FIREBASE
// ==========================

function guardarReporte(){

if(playaSeleccionada === ""){
alert("Selecciona una playa primero");
return;
}

var texto = document.getElementById("comentario").value;

if(texto === ""){
alert("Escribe un comentario");
return;
}

db.collection("reportes").add({
playa: playaSeleccionada,
mensaje: texto,
fecha: Date.now()
});

document.getElementById("comentario").value = "";

alert("Reporte enviado");
}


// ==========================
// 🔥 TIEMPO REAL
// ==========================

function escucharReportes(){

var cont = document.getElementById("reportes");

db.collection("reportes")
.orderBy("fecha","desc")
.onSnapshot(function(snapshot){

cont.innerHTML = "";

snapshot.forEach(function(doc){

var r = doc.data();

cont.innerHTML += "<p><b>"+r.playa+"</b>: "+r.mensaje+"</p>";

});

});

}


// mostrar/ocultar
function toggleReportes(){
var r = document.getElementById("reportes");
r.style.display = r.style.display === "none" ? "block" : "none";
}


// iniciar
escucharReportes();