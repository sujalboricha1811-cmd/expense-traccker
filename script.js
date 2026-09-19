// =========================
// SELECT ELEMENTS
// =========================

const addButton = document.querySelector(".add");
const modalOverlay = document.querySelector("#modalOverlay");
const closeButton = document.querySelector("#closeBtn");

const transactionForm = document.querySelector("#transactionForm");
const transactionNameInput = document.querySelector("#transactionName");
const amountInput = document.querySelector("#amount");
const categoryInput = document.querySelector("#category");

const transactionError = document.querySelector("#transactionError");
const amountError = document.querySelector("#amountError");
const categoryError = document.querySelector("#categoryError");

const transactionCards = document.querySelector(".tra-cards");
const allTransactionCards = document.querySelector(".all-transactions-list");

const filterSelect = document.querySelector("#nav-select");

// Dashboard cards
const totalBalance = document.querySelector(".balance");
const totalIncome = document.querySelector(".income");
const totalExpense = document.querySelector(".expense");

// Transaction type buttons
const incomeButton = document.querySelector("#incomeBtn");
const expenseButton = document.querySelector("#expenseBtn");

const typeSelection = document.querySelector(".type-selection");
const formSection = document.querySelector(".form-section");

// Sidebar buttons
const dashboardBtn = document.querySelector("#dashboardBtn");
const transactionBtn = document.querySelector("#side-transactionbtn");
const receivedBtn = document.querySelector("#side-receivedbtn");
const spentBtn = document.querySelector("#side-spentbtn");

// Pages
const dashboardView = document.querySelector(".dashboard-view");
const transactionPage = document.querySelector(".side-transaction");
const receivedPage = document.querySelector(".received-page");
const spentPage = document.querySelector(".spent-page");

// Received / Spent lists
const receivedList = document.querySelector(".received-page .money-list");
const spentList = document.querySelector(".spent-page .money-list");

// Received / Spent totals
const receivedTotal = document.querySelector(
    ".received-page .money-summary-card h3"
);

const spentTotal = document.querySelector(
    ".spent-page .money-summary-card h3"
);


// =========================
// DATA
// =========================

let transactions = [];
let selectedType = "";
let currentFilter = "All";


// =========================
// CATEGORY ICONS
// =========================

const categoryIcons = {
    Food: "🍔",
    Transport: "🚌",
    Shopping: "🛍️",
    Gaming: "🎮",
    Job: "💼",
    Freelancing: "💻",
    Salary: "💰",
    Business: "🏢"
};


// =========================
// OPEN MODAL
// =========================

addButton.addEventListener("click", () => {
    modalOverlay.classList.add("active");
});


// =========================
// ADD TRANSACTION
// =========================

transactionForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const transactionName = transactionNameInput.value.trim();
    const amount = Number(amountInput.value);
    const category = categoryInput.value;


    // Validation

    if (transactionName === "") {
        transactionError.textContent = "Transaction can't be empty";
        return;
    }

    if (amount <= 0) {
        amountError.textContent = "Amount must be greater than 0";
        return;
    }

    if (category === "") {
        categoryError.textContent = "Please select a category";
        return;
    }


    // Create transaction

    const transaction = {
        id: Date.now(),
        transactionName: transactionName,
        amount: amount,
        category: category,
        type: selectedType,
        date: new Date()
    };


    // Add to array

    transactions.push(transaction);


    // Save

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );


    // Update everything

    renderTransactions();
    renderAllTransactions();
    renderReceived();
    renderSpent();
    updateCards();


    // Reset form and modal

    transactionForm.reset();

    modalOverlay.classList.remove("active");

    resetModal();
});


// =========================
// CLOSE MODAL
// =========================

closeButton.addEventListener("click", () => {

    modalOverlay.classList.remove("active");

    resetModal();
});


// =========================
// CLEAR ERRORS
// =========================

transactionNameInput.addEventListener("input", () => {
    transactionError.textContent = "";
});

amountInput.addEventListener("input", () => {
    amountError.textContent = "";
});

categoryInput.addEventListener("input", () => {
    categoryError.textContent = "";
});


// =========================
// INCOME / EXPENSE TYPE
// =========================

incomeButton.addEventListener("click", () => {

    selectedType = "income";

    updateCategory();

    typeSelection.classList.add("hidden");
    formSection.classList.add("active");
});


expenseButton.addEventListener("click", () => {

    selectedType = "expense";

    updateCategory();

    typeSelection.classList.add("hidden");
    formSection.classList.add("active");
});


// =========================
// RESET MODAL
// =========================

function resetModal() {

    selectedType = "";

    typeSelection.classList.remove("hidden");
    formSection.classList.remove("active");
}


// =========================
// UPDATE CATEGORY OPTIONS
// =========================

function updateCategory() {

    if (selectedType === "income") {

        categoryInput.innerHTML = `
            <option value="">Select category</option>
            <option value="Job">Job</option>
            <option value="Freelancing">Freelancing</option>
            <option value="Salary">Salary</option>
            <option value="Business">Business</option>
        `;

    } else {

        categoryInput.innerHTML = `
            <option value="">Select category</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Gaming">Gaming</option>
            <option value="Food">Food</option>
        `;
    }
}


// =========================
// FORMAT DATE
// =========================

function formatDate(date) {

    const transactionDate = new Date(date);
    const today = new Date();

    if (
        transactionDate.getFullYear() === today.getFullYear() &&
        transactionDate.getMonth() === today.getMonth() &&
        transactionDate.getDate() === today.getDate()
    ) {
        return "Today";
    }


    const yesterday = new Date();

    yesterday.setDate(today.getDate() - 1);

    if (
        transactionDate.getFullYear() === yesterday.getFullYear() &&
        transactionDate.getMonth() === yesterday.getMonth() &&
        transactionDate.getDate() === yesterday.getDate()
    ) {
        return "Yesterday";
    }


    return transactionDate.toLocaleDateString();
}


// =========================
// DISPLAY TRANSACTIONS
// =========================

function displayTransactions(
    transactionList,
    limit = null,
    container = transactionCards,
    showDelete = true
) {

    container.innerHTML = "";


    // Empty state

    if (transactionList.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">📝</div>

                <h3>No transactions yet</h3>

                <p>Add your first transaction to get started.</p>

            </div>
        `;

        return;
    }


    // Apply limit if needed

    const transactionsToDisplay =
        limit !== null
            ? transactionList.slice(-limit)
            : transactionList;


    // Create cards

    transactionsToDisplay.forEach((transaction) => {

        const amountClass =
            transaction.type === "income"
                ? "amount-income"
                : "amount-expense";

        const sign =
            transaction.type === "income"
                ? "+"
                : "-";

        const icon =
            categoryIcons[transaction.category] || "💰";

        const formattedDate =
            formatDate(transaction.date);


        // Delete button only on dashboard

        const deleteButton = showDelete
            ? `
                <button
                    class="delete-btn"
                    data-id="${transaction.id}"
                >
                    🗑️
                </button>
            `
            : "";


        container.innerHTML += `

            <div class="t-cards">

                <div class="icon">
                    ${icon}
                </div>

                <div class="info">

                    <h3>
                        ${transaction.transactionName}
                    </h3>

                    <p>
                        ${transaction.category}
                        •
                        ${formattedDate}
                    </p>

                </div>

                <div class="${amountClass}">
                    ${sign}₹${transaction.amount}
                </div>

                ${deleteButton}

            </div>
        `;
    });
}


// =========================
// DASHBOARD TRANSACTIONS
// =========================

function renderTransactions() {

    if (currentFilter === "All") {

        displayTransactions(
            transactions,
            6,
            transactionCards,
            true
        );

    } else if (currentFilter === "Income") {

        const filteredTransactions =
            transactions.filter((transaction) => {
                return transaction.type === "income";
            });

        displayTransactions(
            filteredTransactions,
            6,
            transactionCards,
            true
        );

    } else if (currentFilter === "Expense") {

        const filteredTransactions =
            transactions.filter((transaction) => {
                return transaction.type === "expense";
            });

        displayTransactions(
            filteredTransactions,
            6,
            transactionCards,
            true
        );
    }
}


// =========================
// ALL TRANSACTIONS PAGE
// =========================

function renderAllTransactions() {

    displayTransactions(
        transactions,
        null,
        allTransactionCards,
        false
    );
}


// =========================
// DASHBOARD TOTALS
// =========================

function updateCards() {

    const income = transactions.reduce(
        (total, transaction) => {

            if (transaction.type === "income") {
                return total + transaction.amount;
            }

            return total;

        },
        0
    );


    const expense = transactions.reduce(
        (total, transaction) => {

            if (transaction.type === "expense") {
                return total + transaction.amount;
            }

            return total;

        },
        0
    );


    const balance = income - expense;


    totalBalance.textContent = `₹${balance}`;
    totalIncome.textContent = `₹${income}`;
    totalExpense.textContent = `₹${expense}`;
}


// =========================
// FILTER
// =========================

filterSelect.addEventListener("change", () => {

    currentFilter = filterSelect.value;

    renderTransactions();
});


// =========================
// DELETE
// =========================

function handleDelete(event) {

    if (!event.target.classList.contains("delete-btn")) {
        return;
    }


    const id = Number(event.target.dataset.id);


    transactions = transactions.filter(
        (transaction) => {
            return transaction.id !== id;
        }
    );


    // Save updated array

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );


    // Refresh every relevant view

    renderTransactions();
    renderAllTransactions();
    renderReceived();
    renderSpent();
    updateCards();
}


transactionCards.addEventListener(
    "click",
    handleDelete
);


// =========================
// RECEIVED PAGE
// =========================

function renderReceived() {

    const receivedTransactions =
        transactions.filter((transaction) => {
            return transaction.type === "income";
        });


    const totalReceived =
        receivedTransactions.reduce(
            (total, transaction) => {
                return total + transaction.amount;
            },
            0
        );


    receivedTotal.textContent =
        `₹${totalReceived}`;


    receivedList.innerHTML = "";


    if (receivedTransactions.length === 0) {

        receivedList.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">💰</div>

                <h3>No received transactions</h3>

                <p>Your income will appear here.</p>

            </div>
        `;

        return;
    }


    receivedTransactions.forEach((transaction) => {

        const icon =
            categoryIcons[transaction.category] || "💰";

        const formattedDate =
            formatDate(transaction.date);


        receivedList.innerHTML += `

            <div class="money-row">

                <div class="money-row-left">

                    <div class="money-row-icon">
                        ${icon}
                    </div>

                    <div>

                        <h4>
                            ${transaction.transactionName}
                        </h4>

                        <p>
                            ${transaction.category}
                            •
                            ${formattedDate}
                        </p>

                    </div>

                </div>

                <div class="received-amount">
                    +₹${transaction.amount}
                </div>

            </div>
        `;
    });
}


// =========================
// SPENT PAGE
// =========================

function renderSpent() {

    const spentTransactions =
        transactions.filter((transaction) => {
            return transaction.type === "expense";
        });


    const totalSpent =
        spentTransactions.reduce(
            (total, transaction) => {
                return total + transaction.amount;
            },
            0
        );


    spentTotal.textContent =
        `₹${totalSpent}`;


    spentList.innerHTML = "";


    if (spentTransactions.length === 0) {

        spentList.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">📉</div>

                <h3>No spent transactions</h3>

                <p>Your expenses will appear here.</p>

            </div>
        `;

        return;
    }


    spentTransactions.forEach((transaction) => {

        const icon =
            categoryIcons[transaction.category] || "💰";

        const formattedDate =
            formatDate(transaction.date);


        spentList.innerHTML += `

            <div class="money-row">

                <div class="money-row-left">

                    <div class="money-row-icon">
                        ${icon}
                    </div>

                    <div>

                        <h4>
                            ${transaction.transactionName}
                        </h4>

                        <p>
                            ${transaction.category}
                            •
                            ${formattedDate}
                        </p>

                    </div>

                </div>

                <div class="spent-amount">
                    -₹${transaction.amount}
                </div>

            </div>
        `;
    });
}


// =========================
// LOAD FROM LOCAL STORAGE
// =========================

function loadTransactions() {

    const savedTransactions =
        localStorage.getItem("transactions");


    if (savedTransactions) {

        transactions =
            JSON.parse(savedTransactions);
    }
}


// =========================
// PAGE NAVIGATION
// =========================

function showPage(page) {

    dashboardView.style.display = "none";
    transactionPage.style.display = "none";
    receivedPage.style.display = "none";
    spentPage.style.display = "none";

    if (page === transactionPage) {
        page.style.display = "flex";
    } else {
        page.style.display = "block";
    }
}


// =========================
// SIDEBAR NAVIGATION
// =========================

const dashboardMenu = dashboardBtn.parentElement;
const transactionMenu = transactionBtn.parentElement;
const receivedMenu = receivedBtn.parentElement;
const spentMenu = spentBtn.parentElement;


dashboardMenu.addEventListener("click", () => {

    showPage(dashboardView);

    renderTransactions();
});


transactionMenu.addEventListener("click", () => {

    showPage(transactionPage);

    renderAllTransactions();
});


receivedMenu.addEventListener("click", () => {

    showPage(receivedPage);

    renderReceived();
});


spentMenu.addEventListener("click", () => {

    showPage(spentPage);

    renderSpent();
});


// =========================
// INITIAL LOAD
// =========================

loadTransactions();

showPage(dashboardView);

renderTransactions();
renderAllTransactions();
renderReceived();
renderSpent();
updateCards();