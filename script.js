// Stores all expense entries
let expenses = [];

// Controls whether total is shown in USD or PHP
let displayCurrency = "USD";

// Gets important elements from the page
const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const totalAmount = document.getElementById("totalAmount");

// Stores the conversion value
const USD_TO_PHP_RATE = 60;

// Runs when the form is submitted
expenseForm.addEventListener("submit", function(event) {

  // Prevents page refresh
  event.preventDefault();

  // Gets values from the form
  const name = document.getElementById("expenseName").value;
  const amount = Number(document.getElementById("expenseAmount").value);
  const category = document.getElementById("expenseCategory").value;
  const currency = document.getElementById("expenseCurrency").value;

  // Creates a new expense object
  const expense = {
    name: name,
    amount: amount,
    category: category,
    currency: currency
  };

  // Adds the expense to the array
  expenses.push(expense);

  // Updates the expense list
  displayExpenses();

  // Updates the total
  updateTotal();

  // Clears the form
  expenseForm.reset();

  // Sets USD as default after reset
  document.getElementById("expenseCurrency").value = "USD";
});

// Displays all expenses on the page
function displayExpenses() {

  // Clears old list items
  expenseList.innerHTML = "";

  // Loops through each expense
  expenses.forEach(function(expense) {

    // Creates a new list item
    const listItem = document.createElement("li");

    // Adds expense details to the list item
    listItem.textContent =
      expense.name + " - " + expense.currency + " " + expense.amount + " (" + expense.category + ")";

    // Adds the list item to the page
    expenseList.appendChild(listItem);
  });
}

// Calculates and displays the total
function updateTotal() {

  // Calculates total in USD first
  const totalUSD = expenses.reduce(function(sum, expense) {

    // Converts PHP to USD if needed
    if (expense.currency === "PHP") {
      return sum + (expense.amount / USD_TO_PHP_RATE);
    }

    // Adds USD directly
    return sum + expense.amount;

  }, 0);

  // Converts USD total to PHP
  const totalPHP = totalUSD * USD_TO_PHP_RATE;

  // Displays total based on selected currency
  if (displayCurrency === "USD") {
    totalAmount.textContent = "$" + totalUSD.toFixed(2);
  } else {
    totalAmount.textContent = "₱" + totalPHP.toFixed(2);
  }
}

// Changes the total display currency
function setDisplayCurrency(currency) {

  // Updates selected display currency
  displayCurrency = currency;

  // Recalculates total
  updateTotal();
}