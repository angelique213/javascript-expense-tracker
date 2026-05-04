// This array stores all expenses
let expenses = [];

// Get important HTML elements
const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const totalAmount = document.getElementById("totalAmount");

// This function runs when the form is submitted
expenseForm.addEventListener("submit", function(event) {

  // Prevents page refresh
  event.preventDefault();

  // Get values from the form
  const name = document.getElementById("expenseName").value;
  const amount = Number(document.getElementById("expenseAmount").value);
  const category = document.getElementById("expenseCategory").value;

  // Create one expense object
  const expense = {
    name: name,
    amount: amount,
    category: category
  };

  // Add the new expense to the array
  expenses.push(expense);

  // Show updated expense list
  displayExpenses();

  // Update running total
  updateTotal();

  // Clear the form after submission
  expenseForm.reset();
});

// This function displays all expenses on the page
function displayExpenses() {

  // Clear old list first
  expenseList.innerHTML = "";

  // Loop through each expense
  expenses.forEach(function(expense) {

    // Create a new list item
    const listItem = document.createElement("li");

    // Add text inside the list item
    listItem.textContent =
      expense.name + " - ₱" + expense.amount + " (" + expense.category + ")";

    // Add the item to the page
    expenseList.appendChild(listItem);
  });
}

// This function calculates the total
function updateTotal() {

  // Use reduce to add all expense amounts
  const total = expenses.reduce(function(sum, expense) {
    return sum + expense.amount;
  }, 0);

  // Display total on screen
  totalAmount.textContent = "₱" + total.toFixed(2);
}