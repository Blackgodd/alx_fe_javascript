document.addEventListener('DOMContentLoaded', () => {
    let quotes = [];
    let categories = [];

    // Load quotes and categories from localStorage
    function loadQuotesFromLocalStorage() {
        const storedQuotes = localStorage.getItem('quotes');
        const storedCategories = localStorage.getItem('categories');
        const lastSelectedCategory = localStorage.getItem('selectedCategory');

        if (storedQuotes) {
            quotes = JSON.parse(storedQuotes);
        } else {
            quotes = [
                { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
                { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" },
            ];
            saveQuotesToLocalStorage();
        }

        if (storedCategories) {
            categories = JSON.parse(storedCategories);
        } else {
            categories = [...new Set(quotes.map(quote => quote.category))];
            saveCategoriesToLocalStorage();
        }

        populateCategories();

        if (lastSelectedCategory) {
            filterQuotes(lastSelectedCategory);
        } else {
            displayAllQuotes();
        }
    }

    // Save quotes to localStorage
    function saveQuotesToLocalStorage() {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    // Save categories to localStorage
    function saveCategoriesToLocalStorage() {
        localStorage.setItem('categories', JSON.stringify(categories));
    }

    // Populate categories in the dropdown menu
    function populateCategories() {
        const categorySelect = document.getElementById('categorySelect');
        categorySelect.innerHTML = '<option value="All">All</option>';  // Default "All" option

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    // Filter quotes based on the selected category
    function filterQuotes(selectedCategory) {
        const filteredQuotes = selectedCategory === 'All'
            ? quotes
            : quotes.filter(quote => quote.category === selectedCategory);

        displayQuotes(filteredQuotes);
        localStorage.setItem('selectedCategory', selectedCategory);  // Save the last selected category
    }

    // Display all or filtered quotes
    function displayQuotes(quotesToDisplay) {
        const listContainer = document.getElementById('quoteList');
        listContainer.innerHTML = '';  // Clear existing quotes

        quotesToDisplay.forEach(quote => {
            const listItem = document.createElement('li');
            listItem.textContent = `"${quote.text}" - ${quote.category}`;
            listContainer.appendChild(listItem);
        });
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

        // Update categories if the new quote introduces a new category
        if (!categories.includes(newQuoteCategory)) {
            categories.push(newQuoteCategory);
            saveCategoriesToLocalStorage();
            populateCategories();  // Update the category dropdown in real-time
        }

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
        displayQuotes(quotes);
    }

    // Event listener for category change
    document.getElementById('categorySelect').addEventListener('change', function () {
        const selectedCategory = this.value;
        filterQuotes(selectedCategory);
    });

    // Load quotes and categories on page load
    loadQuotesFromLocalStorage();

    // Create and append the form to add new quotes
    createAddQuoteForm();

    // Expose functions to the global scope
    window.addQuote = addQuote;
});
