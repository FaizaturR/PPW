function parseCSV(text) {

    const rows = [];

    let row = [];
    let field = "";
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {

        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {

            if (insideQuotes && nextChar === '"') {

                field += '"';
                i++;

            } else {

                insideQuotes = !insideQuotes;

            }

        } else if (char === ";" && !insideQuotes) {

            row.push(field);
            field = "";

        } else if (
            (char === "\n" || char === "\r")
            && !insideQuotes
        ) {

            if (char === "\r" && nextChar === "\n") {
                i++;
            }

            row.push(field);
            field = "";

            if (row.length > 0) {
                rows.push(row);
            }

            row = [];

        } else {

            field += char;

        }
    }


    if (field !== "" || row.length > 0) {

        row.push(field);

        rows.push(row);

    }

    return rows;
}


/* =========================
   LOAD DATASET
========================= */

const datasetBody = document.getElementById("dataset-body");


if (datasetBody) {

    fetch("dataset_detik.csv")

        .then(response => {

            if (!response.ok) {
                throw new Error("Dataset tidak ditemukan.");
            }

            return response.text();

        })

        .then(data => {

            const rows = parseCSV(data);

            datasetBody.innerHTML = "";


            /*
             * Baris pertama merupakan header:
             * id ; isi_berita ; label
             */

            for (let i = 1; i < rows.length; i++) {

                const row = rows[i];

                if (row.length < 3) {
                    continue;
                }


                const id = row[0];
                const isiBerita = row[1];
                const label = row[2].trim();


                const tr = document.createElement("tr");


                /* ID */

                const tdId = document.createElement("td");

                tdId.textContent = id;

                tr.appendChild(tdId);


                /* ISI BERITA */

                const tdIsi = document.createElement("td");

                tdIsi.textContent = isiBerita;

                tr.appendChild(tdIsi);


                /* LABEL */

                const tdLabel = document.createElement("td");

                const spanLabel = document.createElement("span");

                spanLabel.className = "label " + label;

                spanLabel.textContent = label;

                tdLabel.appendChild(spanLabel);

                tr.appendChild(tdLabel);


                datasetBody.appendChild(tr);

            }

        })

        .catch(error => {

            console.error(error);


            datasetBody.innerHTML = `
                <tr>
                    <td colspan="3">
                        Gagal memuat dataset.
                        Pastikan file
                        <strong>dataset_detik.csv</strong>
                        berada di folder yang sama dengan
                        hasil-crawling.html.
                    </td>
                </tr>
            `;

        });

}