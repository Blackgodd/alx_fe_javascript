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
        if (quotes.length === 0) {
            quoteDisplay.innerHTML = "No quotes available!";
            return;
        }

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;

        sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
    }

    // Load last viewed quote from sessionStorage
    function loadLastViewedQuote() {
        const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
        const quoteDisplay = document.getElementById('quoteDisplay');
        if (lastViewedQuote) {
            const quote = JSON.parse(lastViewedQuote);
            quoteDisplay.innerHTML = `"${quote.text}" - ${quote.category}`;
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
        quoteDisplay.innerHTML = `Added: "${newQuote.text}" - ${newQuote.category}`;
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

    // Load quotes and last viewed quote on page load
    loadQuotesFromLocalStorage();
    loadLastViewedQuote();

    // Event listener for new quote button
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);

    // Event listener for import
    document.getElementById('importFile').addEventListener('change', importQuotesFromJson);

    // Expose functions to the global scope
    window.addQuote = addQuote;
    window.exportQuotesToJson = exportQuotesToJson;
});
