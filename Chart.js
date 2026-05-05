// Stores all expense entries
let expenses = [];

// Controls whether total is shown in USD or PHP
let displayCurrency = "USD";

// Stores the chart so it can be updated
let expenseChart = null;

// Gets important elements from the page
const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const totalAmount = document.getElementById("totalAmount");

// Stores the conversion value
const USD_TO_PHP_RATE = 60;

// Loads saved expenses from localStorage if available
const savedExpenses = localStorage.getItem("expenses");

if (savedExpenses) {
  expenses = JSON.parse(savedExpenses);
}

// Runs when the form is submitted
expenseForm.addEventListener("submit", function(event) {
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

  // Saves updated expenses to localStorage
  localStorage.setItem("expenses", JSON.stringify(expenses));

  // Updates the screen
  displayExpenses();
  updateTotal();
  updateChart();

  // Clears the form
  expenseForm.reset();
  document.getElementById("expenseCurrency").value = "USD";
});

// Displays all expenses on the page
function displayExpenses() {
  expenseList.innerHTML = "";

  // Loops through each expense and its position number
  expenses.forEach(function(expense, index) {
    const listItem = document.createElement("li");

    // Adds expense details and a delete button
    listItem.innerHTML =
      "<span>" +
      expense.name + " - " + expense.currency + " " + expense.amount + " (" + expense.category + ")" +
      "</span>" +
      '<button class="delete-btn" onclick="deleteExpense(' + index + ')"><img src="delete.png" alt="Delete"></button>';

    expenseList.appendChild(listItem);
  });

  // Shows updated recursive count in console
  console.log("Total number of expenses:", countExpenses(0));
}

// Removes one expense after confirmation
function deleteExpense(index) {
  const confirmDelete = confirm("Are you sure you want to delete this expense?");

  if (confirmDelete) {
    expenses.splice(index, 1);

    // Updates localStorage after deletion
    localStorage.setItem("expenses", JSON.stringify(expenses));

    displayExpenses();
    updateTotal();
    updateChart();
  }
}

// Calculates and displays the total
function updateTotal() {
  const totalUSD = expenses.reduce(function(sum, expense) {
    if (expense.currency === "PHP") {
      return sum + (expense.amount / USD_TO_PHP_RATE);
    }

    return sum + expense.amount;
  }, 0);

  const totalPHP = totalUSD * USD_TO_PHP_RATE;

  if (displayCurrency === "USD") {
    totalAmount.textContent = "$" + totalUSD.toFixed(2);
  } else {
    totalAmount.textContent = "₱" + totalPHP.toFixed(2);
  }
}

// Changes the total display currency
function setDisplayCurrency(currency) {
  displayCurrency = currency;
  updateTotal();
}

// Counts total expenses using recursion
function countExpenses(index) {
  if (index >= expenses.length) {
    return 0;
  }

  return 1 + countExpenses(index + 1);
}

// Creates and updates the expense chart
function updateChart() {

  // Creates an object to store category totals
  const categoryTotals = {};

  // Adds each expense amount into its category
  expenses.forEach(function(expense) {

    let amountUSD = expense.amount;

    // Converts PHP to USD if needed
    if (expense.currency === "PHP") {
      amountUSD = expense.amount / USD_TO_PHP_RATE;
    }

    // Adds totals by category
    if (categoryTotals[expense.category]) {
      categoryTotals[expense.category] += amountUSD;
    } else {
      categoryTotals[expense.category] = amountUSD;
    }
  });

  // Gets category names
  const labels = Object.keys(categoryTotals);

  // Gets category totals
  const data = Object.values(categoryTotals);

  // Gets chart canvas
  const chartCanvas = document.getElementById("expenseChart");

  // Destroys old chart before creating new one
  if (expenseChart) {
    expenseChart.destroy();
  }

  // Creates new pie chart
  expenseChart = new Chart(chartCanvas, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{
        label: "Expenses by Category",
        data: data
      }]
    }
  });
}

// Displays saved expenses when page first loads
displayExpenses();
updateTotal();
updateChart();