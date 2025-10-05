// --- Inserisci qui il link JSON del tuo Google Sheet ---
const sheetURL = "https://spreadsheets.google.com/feeds/list/144RJ6KcZi9Ck8L19hwkG4CPVzQzxIbax7nfDbjXHSS4/od6/public/values?alt=json";

// Prendi l'ID dalla URL
const urlParams = new URLSearchParams(window.location.search);
const clienteID = urlParams.get('id');

async function caricaDati() {
    const res = await fetch(sheetURL);
    let text = await res.text();

    // Estrarre JSON puro dal formato Google Sheet
    const jsonText = text.substring(text.indexOf('{'), text.lastIndexOf('}')+1);
    const data = JSON.parse(jsonText).table.rows;

    // Trova il cliente con l'ID corretto
    const cliente = data.find(r => r.c[0].v === clienteID);
    if (!cliente) {
        document.getElementById("nome-cliente").textContent = "Cliente non trovato";
        return;
    }

    // Mostra Nome/Cognome
    document.getElementById("nome-cliente").textContent = cliente.c[1].v;

    // Mostra gli appuntamenti
    const lista = document.getElementById("lista-appuntamenti");
    for (let i = 2; i <= 5; i++) { // colonne Appuntamento 1–4
        if (cliente.c[i] && cliente.c[i].v) {
            const li = document.createElement("li");
            li.textContent = cliente.c[i].v;
            lista.appendChild(li);
        }
    }
}

caricaDati();
