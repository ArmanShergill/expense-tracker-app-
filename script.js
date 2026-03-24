const form = document.getElementById("expense-form");
const list = document.getElementById("expense-list");
const totalDisplay = document.getElementById("total");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// ADD EXPENSE
form.addEventListener("submit", function(e){
    e.preventDefault();

    const desc = document.getElementById("desc").value;
    const amount = Number(document.getElementById("amount").value);
    const category = document.getElementById("category").value;

    const expense = {
        id: Date.now(),
        desc,
        amount,
        category,
        date: new Date().toISOString()
    };

    expenses.push(expense);
    saveAndUpdate();
    form.reset();
});

// SAVE + UPDATE UI
function saveAndUpdate(){
    localStorage.setItem("expenses", JSON.stringify(expenses));
    displayExpenses();
    updateTotal();
    updateCategoryBreakdown();
    updateMonthlySummary();
}

// DISPLAY
function displayExpenses(){
    const filter = document.getElementById("filter-category").value;
    list.innerHTML = "";

    const filtered = filter === "All"
        ? expenses
        : expenses.filter(exp => exp.category === filter);

    filtered.forEach(exp => {
        const div = document.createElement("div");
        div.classList.add("expense-item");

        div.innerHTML = `
            <p>
                ${exp.desc} - $${exp.amount} (${exp.category})<br>
                <small>${new Date(exp.date).toLocaleDateString()}</small>
            </p>
            <button onclick="editExpense(${exp.id})">✏️</button>
            <button onclick="deleteExpense(${exp.id})">❌</button>
        `;

        list.appendChild(div);
    });
}

// DELETE
function deleteExpense(id){
    expenses = expenses.filter(exp => exp.id !== id);
    saveAndUpdate();
}

// EDIT
function editExpense(id){
    const exp = expenses.find(e => e.id === id);

    const newDesc = prompt("Edit description:", exp.desc);
    const newAmount = prompt("Edit amount:", exp.amount);

    if(newDesc && newAmount){
        exp.desc = newDesc;
        exp.amount = Number(newAmount);
        saveAndUpdate();
    }
}

// TOTAL
function updateTotal(){
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    totalDisplay.innerText = total;
}

// CATEGORY BREAKDOWN
function updateCategoryBreakdown(){
    const div = document.getElementById("category-breakdown");
    div.innerHTML = "";

    const totals = {};

    expenses.forEach(exp => {
        totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
    });

    for(let cat in totals){
        const el = document.createElement("div");
        el.classList.add("category-item");
        el.innerText = `${cat}: $${totals[cat]}`;
        div.appendChild(el);
    }
}

// MONTHLY SUMMARY
function updateMonthlySummary(){
    const div = document.getElementById("monthly-summary");
    div.innerHTML = "";

    const totals = {};

    expenses.forEach(exp => {
        const month = new Date(exp.date).toLocaleString("default", { month: "long" });
        totals[month] = (totals[month] || 0) + exp.amount;
    });

    for(let m in totals){
        const el = document.createElement("div");
        el.classList.add("category-item");
        el.innerText = `${m}: $${totals[m]}`;
        div.appendChild(el);
    }
}

// FILTER
document.getElementById("filter-category").addEventListener("change", displayExpenses);

// INITIAL LOAD
saveAndUpdate();