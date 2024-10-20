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
