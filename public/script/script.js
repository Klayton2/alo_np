// CONFIG FIREBASE (corrigido)
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "alo-np.firebaseapp.com",
  projectId: "alo-np",
  storageBucket: "alo-np.appspot.com",
};

// iniciar firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const storage = firebase.storage();

// 🗺️ MAPA
const map = L.map('map').setView([-19.14, -47.67], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// localização
let usuarioLat, usuarioLng;

navigator.geolocation.getCurrentPosition((pos)=>{
    usuarioLat = pos.coords.latitude;
    usuarioLng = pos.coords.longitude;

    map.setView([usuarioLat, usuarioLng], 14);
});

// ENVIAR ALERTA
async function enviarAlerta() {
    const descricao = document.getElementById('descricao').value;
    const file = document.getElementById('foto').files[0];

    if(!descricao || !file){
       alert('Preencha todos os campos!');
       return;
    }

    const storageRef = storage.ref("denuncias/" + file.name);
    await storageRef.put(file);

    const url = await storageRef.getDownloadURL();

    await db.collection("denuncias").add({
        descricao,
        foto: url,
        lat: usuarioLat,
        lng: usuarioLng,
        data: new Date()
    });

    alert("Denúncia enviada 🚀");
    carregarDenuncias();
}

// botão enviar
document.getElementById("btn-enviar")
    .addEventListener("click", enviarAlerta);

// 📍 CARREGAR NO MAPA
function carregarDenuncias() {
  db.collection("denuncias").get().then(snapshot => {
    snapshot.forEach(doc => {
      const d = doc.data();

      L.marker([d.lat, d.lng])
        .addTo(map)
        .bindPopup(`
          <b>${d.descricao}</b><br>
          <img src="${d.foto}" width="100">
        `);
    });
  });
}

carregarDenuncias();

// BUSCAR ENDEREÇO
async function buscarEndereco() {
    const endereco = document.getElementById("endereco").value;

    if (!endereco) {
        alert("Digite um endereço!");
        return;
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`;

    const resposta = await fetch(url);
    const dados = await resposta.json();

    if (dados.length === 0) {
        alert("Endereço não encontrado!");
        return;
    }

    const lugar = dados[0];

    const lat = lugar.lat;
    const lng = lugar.lon;

    map.setView([lat, lng], 16);

    L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`📍 ${endereco}`)
        .openPopup();
}

// botão buscar
document.getElementById("btn-buscar")
    .addEventListener("click", buscarEndereco);