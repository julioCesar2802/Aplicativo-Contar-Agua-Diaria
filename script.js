// GLOBAL VARIABLES
const KEY_DB = 'hydroTrackDB';
const DAILY_GOAL = 2500;
let editingId = null;

// --- CRUD: READ (Read data) ---
function readData() {
    const data = localStorage.getItem(KEY_DB);
    return data ? JSON.parse(data) : [];
}

// --- CRUD: CREATE & SAVE (Save data) ---
function saveData(data) {
    localStorage.setItem(KEY_DB, JSON.stringify(data));
}

// MAIN FUNCTION: Add Water
function addWater(amount) {
    const data = readData();
    
    const newRecord = {
        id: Date.now(), // Unique ID based on timestamp
        ml: parseInt(amount),
        // Changed locale to 'en-US' for AM/PM time format
        date: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    data.unshift(newRecord); // Adds to the beginning of the list
    saveData(data);
    render();
}

// --- CRUD: UPDATE (Update record) ---
function saveCustom() {
    const amountInput = document.getElementById('inputAmount').value;
    
    if (!amountInput || amountInput <= 0) return alert("Please enter a valid amount!");

    let data = readData();

    if (editingId) {
        // Edit Mode: Finds the index and updates
        const index = data.findIndex(item => item.id === editingId);
        if (index !== -1) {
            data[index].ml = parseInt(amountInput);
        }
        editingId = null; // Resets edit mode
    } else {
        // Manual Creation Mode
        addWater(amountInput);
        closeModal();
        return; // addWater already renders and saves
    }

    saveData(data);
    render();
    closeModal();
}

// --- CRUD: DELETE (Remove record) ---
function deleteRecord(id) {
    if(confirm("Remove this record?")) {
        let data = readData();
        data = data.filter(item => item.id !== id);
        saveData(data);
        render();
    }
}

// PREPARE EDIT
function prepareEdit(id) {
    const data = readData();
    const item = data.find(d => d.id === id);
    
    if (item) {
        editingId = id;
        document.getElementById('modalTitle').innerText = "Edit Amount";
        document.getElementById('inputAmount').value = item.ml;
        document.getElementById('editorModal').classList.remove('hidden');
    }
}

// --- DYNAMIC HTML & VISUALS ---
function render() {
    const data = readData();
    const list = document.getElementById('historyList');
    const totalDisplay = document.getElementById('totalDisplay');
    const circle = document.querySelector('.progress-circle');

    list.innerHTML = '';
    let totalConsumed = 0;

    // Builds the list HTML
    data.forEach(item => {
        totalConsumed += item.ml;

        const div = document.createElement('div');
        div.classList.add('log-item');
        div.innerHTML = `
            <div class="log-info">
                <strong>${item.ml}ml</strong>
                <span>🕒 ${item.date}</span>
            </div>
            <div class="actions">
                <button onclick="prepareEdit(${item.id})">✏️</button>
                <button onclick="deleteRecord(${item.id})" style="color:red">🗑️</button>
            </div>
        `;
        list.appendChild(div);
    });

    // Updates Total Display
    totalDisplay.innerText = totalConsumed;

    // Updates the Circular Chart (CSS Conic Gradient)
    const percentage = Math.min((totalConsumed / DAILY_GOAL) * 100, 100);
    circle.style.background = `conic-gradient(#00bcd4 ${percentage}%, #ddd ${percentage}%)`;
}

// MODALS
function openCustomModal() {
    editingId = null;
    document.getElementById('modalTitle').innerText = "Add Manually";
    document.getElementById('inputAmount').value = '';
    document.getElementById('editorModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('editorModal').classList.add('hidden');
}

// Initialize
document.addEventListener('DOMContentLoaded', render);