// criando o mapa
const map = L.map('map').setView([-19.14, -47.67], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// localização do usuário
let usuarioLng, usuarioLat;

navigator.geolocation.getCurrentPosition((pos)=>{
    usuarioLng = pos.coords.longitude;
    usuarioLat = pos.coords.latitude;

    map.setView([usuarioLat, usuarioLng], 14);
});

// enviando alerta
async function enviarAlerta() {
    const descricao = document.getElementById('descricao').value;
    const file = document.getElementById('foto').files[0];

    if(!descricao || !file){
       alert('Preencha todos os campos!');
       return;
    }
}

//evento botao
document.getElementById("btn-enviar")
    .addEventListener("click", enviarAlerta);