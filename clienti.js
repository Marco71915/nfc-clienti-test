const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4BtcuTCCI-CdMa_KZ-UA24JQRX7GNcufsNnrsQl9Pj5iN8ZwlbyacFl2gaEo20ftZOrkQ18wMoR_U/gviz/tq?tqx=out:json";

async function caricaDati(clienteID) {
    try {
        const res = await fetch(sheetURL);
        let text = await res.text();

        // Rimuovere il wrapper google.visualization.Query.setResponse(...)
        const jsonText = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
        const json = JSON.parse(jsonText);

        const data = json.table.rows;

        // Mappa i dati
        const clienti = data.map(riga => ({
            id: riga.c[0]?.v,
            nome: riga.c[1]?.v,
            appuntamenti: [
                riga.c[2]?.v,
                riga.c[3]?.v,
                riga.c[4]?.v,
                riga.c[5]?.v
            ].filter(a => a && a.length > 0)
        }));

        const cliente = clienti.find(c => c.id === clienteID);

        const nomeElemento = document.getElementById("nome-cliente");
        const listaElemento = document.getElementById("lista-appuntamenti");
        listaElemento.innerHTML = ""; // svuota eventuali vecchi appuntamenti

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
