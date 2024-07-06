// Function to retrieve stored transactions from local storage
function getTransactionsFromStorage() {
    let transactions = localStorage.getItem('budgetTransactions');
    return transactions ? JSON.parse(transactions) : { income: [], expenses: [] };
  }
  
  // Function to save transactions to local storage
  function saveTransactionsToStorage(transactions) {
    localStorage.setItem('budgetTransactions', JSON.stringify(transactions));
  }
  
  // Event listener for adding income
  document.getElementById('incomeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let income = parseFloat(document.getElementById('income').value);
    let incomeType = document.getElementById('incomeType').value;
    let totalIncome = parseFloat(document.getElementById('totalIncome').innerText);
    totalIncome += income;
    document.getElementById('totalIncome').innerText = totalIncome.toFixed(2);
  
    updateAmountLeft();
    updateDetailsTable(incomeType, income, 'income');
  
    // Save to local storage
    let transactions = getTransactionsFromStorage();
    transactions.income.push({ type: incomeType, amount: income });
    saveTransactionsToStorage(transactions);
  });
  
  // Event listener for adding expense
  document.getElementById('expenseForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let expense = parseFloat(document.getElementById('expense').value);
    let expenseType = document.getElementById('expenseType').value;
    let totalExpenses = parseFloat(document.getElementById('totalExpenses').innerText);
    totalExpenses += expense;
    document.getElementById('totalExpenses').innerText = totalExpenses.toFixed(2);
  
    updateAmountLeft();
    updateDetailsTable(expenseType, expense, 'expense');
  
    // Save to local storage
    let transactions = getTransactionsFromStorage();
    transactions.expenses.push({ type: expenseType, amount: expense });
    saveTransactionsToStorage(transactions);
  });
  
  // Function to update amount left
  function updateAmountLeft() {
    let totalIncome = parseFloat(document.getElementById('totalIncome').innerText);
    let totalExpenses = parseFloat(document.getElementById('totalExpenses').innerText);
    let amountLeft = totalIncome - totalExpenses;
    document.getElementById('amountLeft').innerText = amountLeft.toFixed(2);
  }
  
  // Function to update details table and handle deletion
  function updateDetailsTable(type, amount, transactionType) {
    let table = document.getElementById('detailsTable').getElementsByTagName('tbody')[0];
    let row = table.insertRow();
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    cell1.textContent = type;
    cell2.textContent = amount.toFixed(2);
  
    // Create delete button
    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
      let rowToDelete = this.parentNode.parentNode;
      let amountToDelete = parseFloat(rowToDelete.cells[1].textContent);
      if (transactionType === 'income') {
        let currentIncome = parseFloat(document.getElementById('totalIncome').innerText);
        document.getElementById('totalIncome').innerText = (currentIncome - amountToDelete).toFixed(2);
      } else if (transactionType === 'expense') {
        let currentExpenses = parseFloat(document.getElementById('totalExpenses').innerText);
        document.getElementById('totalExpenses').innerText = (currentExpenses - amountToDelete).toFixed(2);
      }
      updateAmountLeft();
      rowToDelete.remove();
  
      // Update local storage after deletion
      let transactions = getTransactionsFromStorage();
      if (transactionType === 'income') {
        transactions.income = transactions.income.filter(item => item.amount !== amountToDelete);
      } else if (transactionType === 'expense') {
        transactions.expenses = transactions.expenses.filter(item => item.amount !== amountToDelete);
      }
      saveTransactionsToStorage(transactions);
    });
    cell3.appendChild(deleteButton);
  
    // Optional: Color code rows based on transaction type
    if (transactionType === 'income') {
      row.classList.add('income-row');
    } else if (transactionType === 'expense') {
      row.classList.add('expense-row');
    }
  }
  
  // Function to initialize the budget tracker with stored data from local storage
  function initializeBudgetTracker() {
    let transactions = getTransactionsFromStorage();
    transactions.income.forEach(item => {
      updateDetailsTable(item.type, item.amount, 'income');
    });
    transactions.expenses.forEach(item => {
      updateDetailsTable(item.type, item.amount, 'expense');
    });
  
    // Update total income, expenses, and amount left after initializing
    let totalIncome = transactions.income.reduce((acc, curr) => acc + curr.amount, 0);
    let totalExpenses = transactions.expenses.reduce((acc, curr) => acc + curr.amount, 0);
    document.getElementById('totalIncome').innerText = totalIncome.toFixed(2);
    document.getElementById('totalExpenses').innerText = totalExpenses.toFixed(2);
    updateAmountLeft();
  }
  
  // Initialize the budget tracker when the page loads
  document.addEventListener('DOMContentLoaded', initializeBudgetTracker);


  