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
        displayAllQuotes();
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

    // Add new quote and append it to the DOM
    function addQuote(text, category) {
        const newQuoteText = text.trim();
        const newQuoteCategory = category.trim();

        if (newQuoteText === "" || newQuoteCategory === "") {
            alert("Both fields are required!");
            return;
        }

        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        saveQuotesToLocalStorage();
        appendQuoteToDOM(newQuote);

        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = `Added: "${newQuote.text}" - ${newQuote.category}`;
    }

    // Append new quote to the DOM
    function appendQuoteToDOM(quote) {
        const listContainer = document.getElementById('quoteList');

        const listItem = document.createElement('li');
        listItem.textContent = `"${quote.text}" - ${quote.category}`;

        listContainer.appendChild(listItem);
    }

    // Create form for adding new quotes
    function createAddQuoteForm() {
        const formContainer = document.createElement('div');
        formContainer.id = 'quoteFormContainer';

        const inputQuote = document.createElement('input');
        inputQuote.id = 'newQuoteText';
        inputQuote.type = 'text';
        inputQuote.placeholder = 'Enter a new quote';

        const inputCategory = document.createElement('input');
        inputCategory.id = 'newQuoteCategory';
        inputCategory.type = 'text';
        inputCategory.placeholder = 'Enter quote category';

        const addButton = document.createElement('button');
        addButton.textContent = 'Add Quote';
        addButton.addEventListener('click', function () {
            const text = inputQuote.value;
            const category = inputCategory.value;
            addQuote(text, category);
            inputQuote.value = '';
            inputCategory.value = '';
        });

        formContainer.appendChild(inputQuote);
        formContainer.appendChild(inputCategory);
        formContainer.appendChild(addButton);

        const appContainer = document.getElementById('app');
        appContainer.appendChild(formContainer);
    }

    // Display all quotes on page load
    function displayAllQuotes() {
        const listContainer = document.createElement('ul');
        listContainer.id = 'quoteList';

        quotes.forEach(quote => {
            const listItem = document.createElement('li');
            listItem.textContent = `"${quote.text}" - ${quote.category}`;
            listContainer.appendChild(listItem);
        });

        const appContainer = document.getElementById('app');
        appContainer.appendChild(listContainer);
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
                    displayAllQuotes();
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

    // Create and append the form to add new quotes
    createAddQuoteForm();

    // Expose functions to the global scope
    window.addQuote = addQuote;
    window.exportQuotesToJson = exportQuotesToJson;
});
