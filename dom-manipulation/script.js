document.addEventListener('DOMContentLoaded', () => {
    let quotes = [];

    // Load quotes from localStorage
    function loadQuotesFromLocalStorage() {
        const storedQuotes = localStorage.getItem('quotes');
        if (storedQuotes) {
            quotes = JSON.parse(storedQuotes);
        } else {
            quotes = [
                { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
                { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" },
            ];
            saveQuotesToLocalStorage();
        }
    }

    // Save quotes to localStorage
    function saveQuotesToLocalStorage() {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    // Display random quote
    function showRandomQuote() {
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.textContent = "";  // Clear previous quote

        if (quotes.length === 0) {
            const noQuoteText = document.createTextNode("No quotes available!");
            quoteDisplay.appendChild(noQuoteText);
            return;
        }

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];

        const quoteText = document.createTextNode(`"${randomQuote.text}" - ${randomQuote.category}`);
        quoteDisplay.appendChild(quoteText);

        sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
    }

    // Load last viewed quote from sessionStorage
    function loadLastViewedQuote() {
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.textContent = "";  // Clear previous quote

        const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
        if (lastViewedQuote) {
            const quote = JSON.parse(lastViewedQuote);
            const quoteText = document.createTextNode(`"${quote.text}" - ${quote.category}`);
            quoteDisplay.appendChild(quoteText);
        } else {
            showRandomQuote();  // Show a random quote if no session data exists
        }
    }

    // Add new quote
    function addQuote() {
        const newQuoteText = document.getElementById('newQuoteText').value.trim();
        const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

        if (newQuoteText === "" || newQuoteCategory === "") {
            alert("Both fields are required!");
            return;
        }

        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        saveQuotesToLocalStorage();

        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';

        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.textContent = "";  // Clear previous quote
        const addedText = document.createTextNode(`Added: "${newQuote.text}" - ${newQuote.category}`);
        quoteDisplay.appendChild(addedText);
    }

    // Export quotes as JSON
    function exportQuotesToJson() {
        const dataStr = JSON.stringify(quotes, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'quotes.json';
        downloadLink.click();
        URL.revokeObjectURL(url);  // Clean up
    }

    // Import quotes from JSON
    function importQuotesFromJson(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                const importedQuotes = JSON.parse(e.target.result);
                if (Array.isArray(importedQuotes)) {
                    quotes = quotes.concat(importedQuotes);
                    saveQuotesToLocalStorage();
                    alert("Quotes successfully imported!");
                } else {
                    alert("Invalid JSON format!");
                }
            } catch (error) {
                alert("Error reading the file!");
            }
        };

        reader.readAsText(file);
    }

    // Select elements
    const newQuoteBtn = document.getElementById('newQuote');

    // Load quotes and last viewed quote on page load
    loadQuotesFromLocalStorage();
    loadLastViewedQuote();

    // Event listener for new quote button
    newQuoteBtn.addEventListener('click', showRandomQuote);

    // Event listener for import
    document.getElementById('importFile').addEventListener('change', importQuotesFromJson);

    // Expose functions to the global scope
    window.addQuote = addQuote;
    window.exportQuotesToJson = exportQuotesToJson;
});
