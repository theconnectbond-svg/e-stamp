// ----- CONFIG -----
const ADMIN_PASSWORD = "1234";

let customers = JSON.parse(localStorage.getItem("customers")) || [];

// ----- LOGIN -----
function login() {
    const pass = document.getElementById("passwordInput").value.trim();
    if (pass === ADMIN_PASSWORD) {
        document.getElementById("loginPage").style.display = "none";
        document.getElementById("adminPage").style.display = "block";
        renderCustomers();
    } else {
        alert("รหัสผ่านผิด");
    }
}

function saveData() {
    localStorage.setItem("customers", JSON.stringify(customers));
}

// ----- ADD CUSTOMER -----
function addCustomer() {
    const name = document.getElementById("customerName").value.trim();
    if (!name) return alert("กรอกชื่อก่อน");

    customers.push({ 
        name: name, 
        stamp: 0,
        reward: 0
    });

    saveData();
    renderCustomers();
    document.getElementById("customerName").value = "";
}

// ----- AUTO REWARD (แก้ logic ตามที่ขอ) -----
function processReward(i) {
    const s = customers[i].stamp;

    // Reward จะเกิดเมื่อแต้มถึงเกณฑ์เท่านั้น:
    // 0-4 => reward 0
    // 5-9 => reward 1
    // 10+ => reward 2 (สูงสุดที่ 2)
    if (s >= 10) {
        customers[i].reward = 2;
    } else if (s >= 5) {
        customers[i].reward = 1;
    } else {
        customers[i].reward = 0;
    }
}

// ----- ADD STAMP -----
function addStamp(i) {
    customers[i].stamp++;
    processReward(i);
    saveData();
    renderCustomers();
}

// ----- RESET STAMP -----
function resetStamp(i) {
    if (!confirm("รีเซ็ต stamp ของคนนี้?")) return;
    customers[i].stamp = 0;
    // ถ้าต้องการให้รีเซ็ต reward ด้วยเมื่อรีเซ็ตstamp ให้ uncomment ข้างล่าง
    // customers[i].reward = 0;
    processReward(i);
    saveData();
    renderCustomers();
}

// ----- RESET REWARD (ปุ่มแยก) -----
function resetReward(i) {
    if (!confirm("รีเซ็ต reward ของคนนี้?")) return;
    customers[i].reward = 0;
    saveData();
    renderCustomers();
}

// ----- DELETE CUSTOMER -----
function deleteCustomer(i) {
    if (!confirm("ลบลูกค้าคนนี้?")) return;
    customers.splice(i, 1);
    saveData();
    renderCustomers();
}

// ----- GO TO PROFILE -----
function openProfile(i) {
    window.location.href = `customer.html?id=${i}`;
}

// ----- EXPORT CSV -----
function exportExcel() {
    let csv = "Name,Stamp,Reward\n";

    customers.forEach(c => {
        csv += `${c.name},${c.stamp},${c.reward}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.csv";
    a.click();
}

// ----- RENDER LIST -----
function renderCustomers() {
    const list = document.getElementById("customerList");
    list.innerHTML = "";

    customers.forEach((c, i) => {
        const box = document.createElement("div");
        box.className = "customer-item";

        box.innerHTML = `
            <span onclick="openProfile(${i})" style="cursor:pointer;">
                ${c.name}
            </span>
            <span>Stamp: ${c.stamp} | Reward: ${c.reward}</span>

            <div class="btn-group">
                <button onclick="addStamp(${i})">+Stamp</button>
                <button onclick="resetStamp(${i})">Reset Stamp</button>
                <button onclick="resetReward(${i})">Reset Reward</button>
                <button onclick="deleteCustomer(${i})" style="background:#e44;">ลบ</button>
            </div>
        `;

        list.appendChild(box);
    });
}