setInterval(() => {
    fetch("http://localhost:5000/data")
        .then(response => response.json())
        .then(data => {
            document.getElementById("output").innerText =
                JSON.stringify(data, null, 2);
        });
}, 2000);
