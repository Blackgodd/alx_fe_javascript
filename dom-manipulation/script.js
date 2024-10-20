// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Array to store quotes, each quote is an object with 'text' and 'category'
    let quotes = [
        { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
        { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" },
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
        { text: "It does not matter how slowly you go as long as you do not stop.", category: "Perseverance" },
    ];

    // Select the container elements in the HTML
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteBtn = document.getElementById('newQuote');

    // Function to display a random quote
    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.textContent = "No quotes available!";
            return;
        }
        // Generate a random index
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];

        // Display the random quote with its category
        quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
    }

    // Initial display of a random quote
    showRandomQuote();

    // Add event listener to the button to show a random quote
    newQuoteBtn.addEventListener('click', showRandomQuote);

    // Function to add a new quote
    function addQuote() {
        // Get the values from the input fields
        const newQuoteText = document.getElementById('newQuoteText').value.trim();
        const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

        // Validate inputs
        if (newQuoteText === "" || newQuoteCategory === "") {
            alert("Both fields are required!");
            return;
        }

        // Create a new quote object and add it to the quotes array
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);

        // Clear the input fields
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';

        // Update the displayed quote to confirm addition
        quoteDisplay.textContent = `Added: "${newQuote.text}" - ${newQuote.category}`;
    }

    // Expose the addQuote function to the global scope so it can be called by the button's onclick event
    window.addQuote = addQuote;
});


// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    let quotes = [];

    // Function to load quotes from localStorage
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

    // Function to save quotes to localStorage
    function saveQuotesToLocalStorage() {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    // Function to display a random quote
    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.textContent = "No quotes available!";
            return;
        }
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];

        // Display the random quote and save it to sessionStorage
        quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
        sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
    }

    // Function to display the last viewed quote from sessionStorage
    function loadLastViewedQuote() {
        const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
        if (lastViewedQuote) {
            const quote = JSON.parse(lastViewedQuote);
            quoteDisplay.textContent = `"${quote.text}" - ${quote.category}`;
        } else {
            showRandomQuote();  // Show a random quote if no session data exists
        }
    }

    // Function to add a new quote
    function addQuote() {
        const newQuoteText = document.getElementById('newQuoteText').value.trim();
        const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

        if (newQuoteText === "" || newQuoteCategory === "") {
            alert("Both fields are required!");
            return;
        }

        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);

        // Save to local storage and clear fields
        saveQuotesToLocalStorage();
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';

        quoteDisplay.textContent = `Added: "${newQuote.text}" - ${newQuote.category}`;
    }

    // Function to export quotes as a JSON file
    function exportQuotesToJson() {
        const dataStr = JSON.stringify(quotes, null, 2);  // Pretty print JSON
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'quotes.json';
        downloadLink.click();
        URL.revokeObjectURL(url);  // Clean up
    }

    // Function to import quotes from a JSON file
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

    // Event listener for JSON import
    document.getElementById('importFile').addEventListener('change', importQuotesFromJson);

    // Select DOM elements
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteBtn = document.getElementById('newQuote');

    // Load quotes from localStorage when initializing
    loadQuotesFromLocalStorage();
    loadLastViewedQuote();  // Load the last viewed quote from sessionStorage

    // Add event listener for the "Show New Quote" button
    newQuoteBtn.addEventListener('click', showRandomQuote);

    // Expose addQuote and exportQuotesToJson to global scope for button click
    window.addQuote = addQuote;
    window.exportQuotesToJson = exportQuotesToJson;
});
