// --- Link JSON del Google Sheet ---
const sheetURL = "https://spreadsheets.google.com/feeds/list/144RJ6KcZi9Ck8L19hwkG4CPVzQzxIbax7nfDbjXHSS4/od6/public/values?alt=json";

// Prendi l'ID dalla URL
const urlParams = new URLSearchParams(window.location.search);
const clienteID = urlParams.get('id');

async function caricaDati() {
    try {
        const res = await fetch(sheetURL);
        const json = await res.json();

        const clienti = json.feed.entry.map(riga => ({
            id: riga['gsx$id']?.$t.trim(),
            nome: riga['gsx$cliente']?.$t.trim(),
            appuntamenti: [
                riga['gsx$appuntamento1']?.$t,
                riga['gsx$appuntamento2']?.$t,
                riga['gsx$appuntamento3']?.$t,
                riga['gsx$appuntamento4']?.$t
            ].filter(a => a && a.length > 0)
        }));

        const cliente = clienti.find(c => c.id === clienteID);

        if (!cliente) {
            document.getElementById("nome-cliente").textContent = "Cliente non trovato";
            return;
        }

        document.getElementById("nome-cliente").textContent = cliente.nome;

        const lista = document.getElementById("lista-appuntamenti");
        cliente.appuntamenti.forEach(app => {
            const li = document.createElement("li");
            li.textContent = app;
            lista.appendChild(li);
        });

    } catch (err) {
        console.error("Errore nel caricamento:", err);
        document.getElementById("nome-cliente").textContent = "Errore nel caricamento dati";
    }
}

caricaDati();
