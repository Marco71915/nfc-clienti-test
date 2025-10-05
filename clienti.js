// Inserisci qui la tua chiave API
const API_KEY = "AIzaSyB_B0LYZbg9lJZ-SiPOs-D6BUdLbda8IgE";

// Inserisci qui l'ID del tuo Google Sheet (lo trovi nell'URL tra /d/ e /edit)
const SPREADSHEET_ID = "144RJ6KcZi9Ck8L19hwkG4CPVzQzxIbax7nfDbjXHSS4";

const sheetURL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Sheet1?key=${API_KEY}`;

async function caricaDati(clienteID) {
    try {
        const res = await fetch(sheetURL);
        const json = await res.json();

        // json.values[0] contiene le intestazioni
        const righe = json.values.slice(1); // Saltiamo le intestazioni

        const clienti = righe.map(riga => ({
            id: riga[0],
            nome: riga[1],
            appuntamenti: riga.slice(2).filter(a => a)
        }));

        const cliente = clienti.find(c => c.id === clienteID);

        const nomeElemento = document.getElementById("nome-cliente");
        const listaElemento = document.getElementById("lista-appuntamenti");
        listaElemento.innerHTML = ""; // pulisce lista precedente

        if (!cliente) {
            nomeElemento.textContent = "Cliente non trovato";
            return;
        }

        nomeElemento.textContent = cliente.nome;

        cliente.appuntamenti.forEach(app => {
            const li = document.createElement("li");
            li.textContent = app;
            listaElemento.appendChild(li);
        });

    } catch (err) {
        console.error("Errore nel caricamento:", err);
        document.getElementById("nome-cliente").textContent = "Errore nel caricamento dati";
    }
}

// Evento click sul pulsante
document.getElementById("cerca").addEventListener("click", () => {
    const idInserito = document.getElementById("inputID").value.trim();
    if (idInserito) {
        caricaDati(idInserito);
    } else {
        alert("Per favore inserisci un ID valido.");
    }
});
