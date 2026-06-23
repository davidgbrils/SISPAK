// WiFi Expert - Dynamic Fuzzy Mamdani SaaS Engine & App Controller
// Developed by Kelompok 12

// ==========================================
// 1. DATABASE & INITIALIZATION (localStorage Mock)
// ==========================================
const DEFAULT_VARIABLES = [
    { id: "v-sinyal", code: "G01", name: "Kekuatan Sinyal", type: "input", min_value: 0, max_value: 100, unit: "%" },
    { id: "v-kecepatan", code: "G02", name: "Kecepatan Internet", type: "input", min_value: 0, max_value: 100, unit: "Mbps" },
    { id: "v-terputus", code: "G03", name: "Frekuensi Terputus", type: "input", min_value: 0, max_value: 10, unit: "kali/hari" },
    { id: "v-pengguna", code: "G04", name: "Jumlah Pengguna", type: "input", min_value: 0, max_value: 50, unit: "perangkat" },
    { id: "v-jarak", code: "G05", name: "Jarak Perangkat", type: "input", min_value: 0, max_value: 30, unit: "meter" },
    { id: "v-akses", code: "G06", name: "Akses Internet", type: "input", min_value: 0, max_value: 100, unit: "%" },
    { id: "v-output", code: "OUTPUT", name: "Tingkat Gangguan", type: "output", min_value: 0, max_value: 100, unit: "" }
];

const DEFAULT_TERMS = [
    // Sinyal
    { id: "t-sin-lem", variable_id: "v-sinyal", name: "Lemah", shape_type: "trap", params: [0, 0, 30, 40], color: "#ef4444" },
    { id: "t-sin-sed", variable_id: "v-sinyal", name: "Sedang", shape_type: "tri", params: [30, 50, 70], color: "#f59e0b" },
    { id: "t-sin-kua", variable_id: "v-sinyal", name: "Kuat", shape_type: "trap", params: [60, 70, 100, 100], color: "#10b981" },
    // Kecepatan
    { id: "t-kec-lam", variable_id: "v-kecepatan", name: "Lambat", shape_type: "trap", params: [0, 0, 30, 40], color: "#ef4444" },
    { id: "t-kec-sed", variable_id: "v-kecepatan", name: "Sedang", shape_type: "tri", params: [30, 50, 70], color: "#f59e0b" },
    { id: "t-kec-cep", variable_id: "v-kecepatan", name: "Cepat", shape_type: "trap", params: [60, 70, 100, 100], color: "#10b981" },
    // Terputus
    { id: "t-ter-jar", variable_id: "v-terputus", name: "Jarang", shape_type: "trap", params: [0, 0, 2, 3], color: "#10b981" },
    { id: "t-ter-kad", variable_id: "v-terputus", name: "Kadang", shape_type: "tri", params: [2, 4, 6], color: "#f59e0b" },
    { id: "t-ter-ser", variable_id: "v-terputus", name: "Sering", shape_type: "trap", params: [5, 6, 10, 10], color: "#ef4444" },
    // Pengguna
    { id: "t-pen-sed", variable_id: "v-pengguna", name: "Sedikit", shape_type: "trap", params: [0, 0, 8, 10], color: "#10b981" },
    { id: "t-pen-mid", variable_id: "v-pengguna", name: "Sedang", shape_type: "tri", params: [8, 16.5, 25], color: "#f59e0b" },
    { id: "t-pen-ban", variable_id: "v-pengguna", name: "Banyak", shape_type: "trap", params: [20, 25, 50, 50], color: "#ef4444" },
    // Jarak
    { id: "t-jar-dek", variable_id: "v-jarak", name: "Dekat", shape_type: "trap", params: [0, 0, 5, 8], color: "#10b981" },
    { id: "t-jar-sed", variable_id: "v-jarak", name: "Sedang", shape_type: "tri", params: [5, 11.5, 18], color: "#f59e0b" },
    { id: "t-jar-jau", variable_id: "v-jarak", name: "Jauh", shape_type: "trap", params: [15, 18, 30, 30], color: "#ef4444" },
    // Akses
    { id: "t-aks-tdk", variable_id: "v-akses", name: "TidakTersedia", shape_type: "trap", params: [0, 0, 20, 30], color: "#ef4444" },
    { id: "t-aks-ter", variable_id: "v-akses", name: "Terbatas", shape_type: "tri", params: [20, 45, 70], color: "#f59e0b" },
    { id: "t-aks-ada", variable_id: "v-akses", name: "Tersedia", shape_type: "trap", params: [60, 70, 100, 100], color: "#10b981" },
    // Output
    { id: "t-out-rin", variable_id: "v-output", name: "Ringan", shape_type: "trap", params: [0, 0, 30, 40], color: "#10b981" },
    { id: "t-out-sed", variable_id: "v-output", name: "Sedang", shape_type: "tri", params: [30, 50, 70], color: "#f59e0b" },
    { id: "t-out-ber", variable_id: "v-output", name: "Berat", shape_type: "trap", params: [60, 70, 100, 100], color: "#ef4444" }
];

const DEFAULT_RULES = [
    { id: "r-1", code: "R1", description: "IF Sinyal Lemah AND Jarak Jauh THEN Gangguan Berat", output_term_id: "t-out-ber", antecedents: ["t-sin-lem", "t-jar-jau"] },
    { id: "r-2", code: "R2", description: "IF Kecepatan Lambat AND Pengguna Banyak THEN Gangguan Sedang", output_term_id: "t-out-sed", antecedents: ["t-kec-lam", "t-pen-ban"] },
    { id: "r-3", code: "R3", description: "IF Kecepatan Lambat AND Akses Tidak Tersedia THEN Gangguan Berat", output_term_id: "t-out-ber", antecedents: ["t-kec-lam", "t-aks-tdk"] },
    { id: "r-4", code: "R4", description: "IF Sinyal Lemah AND Frekuensi Sering THEN Gangguan Berat", output_term_id: "t-out-ber", antecedents: ["t-sin-lem", "t-ter-ser"] },
    { id: "r-5", code: "R5", description: "IF Sinyal Sedang AND Frekuensi Kadang-kadang THEN Gangguan Sedang", output_term_id: "t-out-sed", antecedents: ["t-sin-sed", "t-ter-kad"] },
    { id: "r-6", code: "R6", description: "IF Sinyal Kuat AND Kecepatan Cepat AND Frekuensi Jarang AND Pengguna Sedikit AND Jarak Dekat AND Akses Tersedia THEN Gangguan Ringan", output_term_id: "t-out-rin", antecedents: ["t-sin-kua", "t-kec-cep", "t-ter-jar", "t-pen-sed", "t-jar-dek", "t-aks-ada"] },
    { id: "r-7", code: "R7", description: "IF Kecepatan Sedang AND Pengguna Sedang AND Akses Terbatas THEN Gangguan Sedang", output_term_id: "t-out-sed", antecedents: ["t-kec-sed", "t-pen-mid", "t-aks-ter"] },
    { id: "r-8", code: "R8", description: "IF Sinyal Lemah AND Kecepatan Lambat AND Pengguna Banyak AND Akses Terbatas THEN Gangguan Berat", output_term_id: "t-out-ber", antecedents: ["t-sin-lem", "t-kec-lam", "t-pen-ban", "t-aks-ter"] },
    { id: "r-9", code: "R9", description: "IF Frekuensi Sering AND Pengguna Banyak THEN Gangguan Berat", output_term_id: "t-out-ber", antecedents: ["t-ter-ser", "t-pen-ban"] },
    { id: "r-10", code: "R10", description: "IF Sinyal Kuat AND Kecepatan Sedang AND Frekuensi Jarang AND Pengguna Sedikit AND Jarak Dekat AND Akses Tersedia THEN Gangguan Ringan", output_term_id: "t-out-rin", antecedents: ["t-sin-kua", "t-kec-sed", "t-ter-jar", "t-pen-sed", "t-jar-dek", "t-aks-ada"] },
    
    // Fallback/Coverage rules to ensure completeness
    { id: "r-11", code: "R11", description: "IF Sinyal Lemah THEN Gangguan Berat", output_term_id: "t-out-ber", antecedents: ["t-sin-lem"] },
    { id: "r-12", code: "R12", description: "IF Kecepatan Lambat THEN Gangguan Sedang", output_term_id: "t-out-sed", antecedents: ["t-kec-lam"] },
    { id: "r-13", code: "R13", description: "IF Frekuensi Sering THEN Gangguan Berat", output_term_id: "t-out-ber", antecedents: ["t-ter-ser"] },
    { id: "r-14", code: "R14", description: "IF Akses Tidak Tersedia THEN Gangguan Berat", output_term_id: "t-out-ber", antecedents: ["t-aks-tdk"] },
    { id: "r-15", code: "R15", description: "IF Jarak Jauh THEN Gangguan Sedang", output_term_id: "t-out-sed", antecedents: ["t-jar-jau"] },
    { id: "r-16", code: "R16", description: "IF Pengguna Banyak THEN Gangguan Sedang", output_term_id: "t-out-sed", antecedents: ["t-pen-ban"] },
    { id: "r-17", code: "R17", description: "IF Sinyal Sedang THEN Gangguan Sedang", output_term_id: "t-out-sed", antecedents: ["t-sin-sed"] },
    { id: "r-18", code: "R18", description: "IF Kecepatan Sedang THEN Gangguan Sedang", output_term_id: "t-out-sed", antecedents: ["t-kec-sed"] },
    { id: "r-19", code: "R19", description: "IF Frekuensi Kadang-kadang THEN Gangguan Sedang", output_term_id: "t-out-sed", antecedents: ["t-ter-kad"] },
    { id: "r-20", code: "R20", description: "IF Akses Terbatas THEN Gangguan Sedang", output_term_id: "t-out-sed", antecedents: ["t-aks-ter"] }
];

const DEFAULT_ARTICLES = [
    {
        id: "art-1",
        title: "Panduan Relokasi Fisik Router & Akses Poin",
        category: "Posisi Router Buruk",
        content: "Redaman sinyal nirkabel sangat dipengaruhi oleh dinding semen, sekat kaca, dan cermin. Untuk optimalisasi: 1) Letakkan router di ruang tengah terbuka, minimal 1.5 meter di atas permukaan lantai. 2) Jangan menaruh router di bawah meja, di dalam laci lemari, atau tepat di sudut ruangan. 3) Jaga jarak minimal 2 meter dari peralatan pemancar lain seperti microwave atau pemancar nirkabel bluetooth.",
        urgency: "Rendah"
    },
    {
        id: "art-2",
        title: "Manajemen Bandwidth Jaringan WiFi Padat",
        category: "Overload User",
        content: "Bila pengguna terlampau banyak: 1) Terapkan pembatasan bandwidth (Quality of Service / QoS) di pengaturan router admin untuk mendahulukan prioritas data. 2) Pisahkan jaringan nirkabel tamu (Guest SSID) dengan bandwidth terbatas. 3) Ubah sandi router WiFi secara berkala untuk memutus perangkat liar tak dikenal.",
        urgency: "Sedang"
    },
    {
        id: "art-3",
        title: "Pemecahan Masalah Koneksi ISP & LOS Merah",
        category: "Gangguan ISP",
        content: "Lampu LOS berkedip merah menandakan hilangnya sambungan fisik ke operator penyedia layanan internet. Langkah: 1) Periksa sambungan kabel serat optik kuning di bagian belakang modem, bersihkan konektor dari debu secara perlahan. 2) Cabut kabel power modem selama 30 detik untuk reboot koneksi. 3) Hubungi call center operator Anda jika gangguan area masif sedang terjadi.",
        urgency: "Tinggi"
    }
];

// Database version to trigger automatic updates for client local storage
const DB_VERSION = "2.2";

// Initialize database in localStorage
function initLocalDatabase() {
    const storedVersion = localStorage.getItem('db_version');
    const storedRules = localStorage.getItem('rules');
    
    // Force refresh if version is mismatched, stored rules is empty, or doesn't contain fallback rules
    const needsRefresh = (storedVersion !== DB_VERSION) || 
                         !storedRules || 
                         JSON.parse(storedRules).length < DEFAULT_RULES.length ||
                         !storedRules.includes("R11") ||
                         !storedRules.includes("R20");
                         
    if (needsRefresh) {
        localStorage.setItem('rules', JSON.stringify(DEFAULT_RULES));
        localStorage.setItem('variables', JSON.stringify(DEFAULT_VARIABLES));
        localStorage.setItem('terms', JSON.stringify(DEFAULT_TERMS));
        localStorage.setItem('articles', JSON.stringify(DEFAULT_ARTICLES));
        localStorage.setItem('db_version', DB_VERSION);
    }
    if (!localStorage.getItem('logs')) {
        localStorage.setItem('logs', JSON.stringify([]));
    }
}

initLocalDatabase();

// Database Query Utility
const db = {
    getVariables: () => JSON.parse(localStorage.getItem('variables')),
    getTerms: () => JSON.parse(localStorage.getItem('terms')),
    getRules: () => JSON.parse(localStorage.getItem('rules')),
    getArticles: () => JSON.parse(localStorage.getItem('articles')),
    getLogs: () => JSON.parse(localStorage.getItem('logs')),
    
    saveVariables: (data) => localStorage.setItem('variables', JSON.stringify(data)),
    saveTerms: (data) => localStorage.setItem('terms', JSON.stringify(data)),
    saveRules: (data) => localStorage.setItem('rules', JSON.stringify(data)),
    saveArticles: (data) => localStorage.setItem('articles', JSON.stringify(data)),
    saveLogs: (data) => localStorage.setItem('logs', JSON.stringify(data))
};

// ==========================================
// 2. DYNAMIC FUZZY MAMDANI ENGINE
// ==========================================
class DynamicFuzzyEngine {
    constructor() {
        this.variables = db.getVariables();
        this.terms = db.getTerms();
        this.rules = db.getRules();
    }

    reloadConfig() {
        this.variables = db.getVariables();
        this.terms = db.getTerms();
        this.rules = db.getRules();
    }

    fuzzify(inputVector) {
        const fuzzMap = {};
        this.variables.forEach(v => {
            if (v.type === 'input') {
                fuzzMap[v.code] = {};
                const vTerms = this.terms.filter(t => t.variable_id === v.id);
                vTerms.forEach(t => {
                    const inputVal = inputVector[v.code];
                    fuzzMap[v.code][t.name] = this.evaluateMembership(inputVal, t.shape_type, t.params);
                });
            }
        });
        return fuzzMap;
    }

    evaluateMembership(x, shape, params) {
        const p = params.map(Number);
        if (shape === 'tri') {
            const [a, b, c] = p;
            if (x < a || x > c) return 0;
            if (x >= a && x <= b) {
                return (a === b) ? 1 : (x - a) / (b - a);
            }
            if (x > b && x <= c) {
                return (b === c) ? 1 : (c - x) / (c - b);
            }
        } else if (shape === 'trap') {
            const [a, b, c, d] = p;
            if (x < a || x > d) return 0;
            if (x >= b && x <= c) return 1;
            if (x >= a && x < b) {
                return (a === b) ? 1 : (x - a) / (b - a);
            }
            if (x > c && x <= d) {
                return (c === d) ? 1 : (d - x) / (d - c);
            }
        }
        return 0;
    }

    evaluateRules(fuzzifiedInputs) {
        return this.rules.map(rule => {
            const values = rule.antecedents.map(antId => {
                const term = this.terms.find(t => t.id === antId);
                const variable = this.variables.find(v => v.id === term.variable_id);
                return fuzzifiedInputs[variable.code][term.name] || 0;
            });
            // Conjunction AND = minimum
            const alpha = values.length > 0 ? Math.min(...values) : 0;
            return {
                id: rule.id,
                code: rule.code,
                desc: rule.description,
                alpha: alpha,
                outputTermId: rule.output_term_id
            };
        });
    }

    aggregateAndDefuzzify(ruleActivations) {
        let sumNum = 0;
        let sumDen = 0;
        const step = 0.1;
        
        const outVar = this.variables.find(v => v.type === 'output');
        const outTerms = this.terms.filter(t => t.variable_id === outVar.id);
        
        const aggregatedHeights = [];
        
        for (let y = outVar.min_value; y <= outVar.max_value; y += step) {
            let maxValAtY = 0;
            outTerms.forEach(t => {
                const termActivations = ruleActivations.filter(ra => ra.outputTermId === t.id);
                const maxAlpha = termActivations.length > 0 ? Math.max(...termActivations.map(ra => ra.alpha)) : 0;
                
                const muTermAtY = this.evaluateMembership(y, t.shape_type, t.params);
                const height = Math.min(maxAlpha, muTermAtY);
                if (height > maxValAtY) {
                    maxValAtY = height;
                }
            });
            sumNum += y * maxValAtY;
            sumDen += maxValAtY;
            
            // Collect points for aggregates curve
            if (Math.round(y * 10) % 10 === 0) { // integer step display
                aggregatedHeights.push({ x: Math.round(y), y: maxValAtY });
            }
        }
        
        const centroid = sumDen > 0 ? (sumNum / sumDen) : 0;
        return {
            centroid: centroid,
            aggregatedHeights: aggregatedHeights,
            sumNum: sumNum,
            sumDen: sumDen
        };
    }
}

const engine = new DynamicFuzzyEngine();

// ==========================================
// 3. NAVIGATION & WIZARD CONTROLLER
// ==========================================
let currentWizardStep = 1;
const totalWizardSteps = 4;

function getMembershipVal(x, term) {
    return engine.evaluateMembership(x, term.shape_type, term.params);
}

function updateSinyalLabel(val) {
    let desc = "Sedang";
    const v = parseFloat(val);
    if (v <= 20) desc = "Sangat Lemah";
    else if (v <= 40) desc = "Lemah";
    else if (v <= 60) desc = "Sedang";
    else if (v <= 80) desc = "Kuat";
    else desc = "Sangat Kuat";
    
    document.getElementById('badge-sinyal').innerText = `${v}% (${desc})`;
}

function selectKecepatanOption(val) {
    let optionId = 'kec-sedang';
    let exactVal = 55;
    const v = parseFloat(val);
    if (v <= 20) { optionId = 'kec-sangat-lambat'; exactVal = 10; }
    else if (v <= 40) { optionId = 'kec-lambat'; exactVal = 30; }
    else if (v <= 70) { optionId = 'kec-sedang'; exactVal = 55; }
    else { optionId = 'kec-cepat'; exactVal = 90; }
    
    document.querySelectorAll('.btn-kec-option').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(optionId);
    if (activeBtn) activeBtn.classList.add('active');
    
    document.getElementById('wiz-kecepatan').value = exactVal;
    document.getElementById('badge-kecepatan').innerText = `${exactVal} Mbps`;
}

function selectTerputusOption(val) {
    let optionId = 'ter-kadang';
    let exactVal = 4;
    const v = parseFloat(val);
    if (v === 0) { optionId = 'ter-tidak-pernah'; exactVal = 0; }
    else if (v <= 3) { optionId = 'ter-jarang'; exactVal = 2; }
    else if (v <= 6) { optionId = 'ter-kadang'; exactVal = 4; }
    else if (v <= 8) { optionId = 'ter-sering'; exactVal = 7; }
    else { optionId = 'ter-sangat-sering'; exactVal = 10; }
    
    document.querySelectorAll('.btn-ter-option').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(optionId);
    if (activeBtn) activeBtn.classList.add('active');
    
    document.getElementById('wiz-terputus').value = exactVal;
    document.getElementById('badge-terputus').innerText = `${exactVal} kali/hari`;
}

function startDiagnosis() {
    currentWizardStep = 1;
    resetWizardInputs();
    showWizardStep(1);
    navigateTo('wizard');
}

function resetWizardInputs() {
    document.getElementById('wiz-jarak').value = 5;
    document.getElementById('wiz-pengguna').value = 8;
    document.getElementById('wiz-sinyal').value = 60;
    document.getElementById('wiz-akses').value = 80;
    
    updateWizardValue('jarak', 5, 'meter');
    updateWizardValue('pengguna', 8, 'perangkat');
    updateSinyalLabel(60);
    selectKecepatanOption(55);
    updateWizardValue('akses', 80, '%');
    selectTerputusOption(2);
    
    // Clear checkboxes
    document.getElementById('sym-no-ssid').checked = false;
    document.getElementById('sym-no-internet').checked = false;
    document.getElementById('sym-hot-router').checked = false;
    document.getElementById('sym-red-los').checked = false;
    document.getElementById('sym-wrong-pw').checked = false;
}

function updateWizardValue(id, val, unit) {
    document.getElementById(`badge-${id}`).innerText = `${val} ${unit}`;
}

function showWizardStep(step) {
    // Hide all step panels
    for (let i = 1; i <= totalWizardSteps; i++) {
        document.getElementById(`step-panel-${i}`).classList.remove('active');
        document.getElementById(`dot-${i}`).classList.remove('active');
        if (i < totalWizardSteps) document.getElementById(`line-${i}`).classList.remove('active');
    }
    
    // Show current panel
    document.getElementById(`step-panel-${step}`).classList.add('active');
    
    // Highlight step indicators
    for (let i = 1; i <= step; i++) {
        document.getElementById(`dot-${i}`).classList.add('active');
        if (i < step) document.getElementById(`line-${i}`).classList.add('active');
    }
    
    // Update button states
    document.getElementById('btn-wiz-prev').disabled = (step === 1);
    const nextBtn = document.getElementById('btn-wiz-next');
    if (step === totalWizardSteps) {
        nextBtn.innerHTML = `<i class="fa-solid fa-calculator"></i> Run Diagnosa`;
    } else {
        nextBtn.innerHTML = `Lanjut <i class="fa-solid fa-arrow-right"></i>`;
    }
}

function moveWizardStep(dir) {
    if (dir === 1 && currentWizardStep === totalWizardSteps) {
        runWizardInference();
        return;
    }
    
    currentWizardStep += dir;
    if (currentWizardStep < 1) currentWizardStep = 1;
    if (currentWizardStep > totalWizardSteps) currentWizardStep = totalWizardSteps;
    
    showWizardStep(currentWizardStep);
}

// Navigates views
function navigateTo(viewId) {
    document.querySelectorAll('.view-section').forEach(view => view.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    
    document.getElementById(`view-${viewId}`).classList.add('active');
    const linkEl = document.getElementById(`nav-${viewId}`);
    if (linkEl) linkEl.classList.add('active');
    
    // Specific tab activations
    if (viewId === 'history') {
        renderHistoryList();
    } else if (viewId === 'kb') {
        renderKnowledgeBaseGrid();
    } else if (viewId === 'admin') {
        switchAdminSubView('rules');
    }
}

// Apply presets
function applyPreset(key) {
    const data = presets[key];
    if (!data) return;
    
    startDiagnosis();
    
    document.getElementById('wiz-jarak').value = data.jarak;
    document.getElementById('wiz-pengguna').value = data.pengguna;
    document.getElementById('wiz-sinyal').value = data.sinyal;
    document.getElementById('wiz-akses').value = data.akses;
    
    updateWizardValue('jarak', data.jarak, 'meter');
    updateWizardValue('pengguna', data.pengguna, 'perangkat');
    updateSinyalLabel(data.sinyal);
    selectKecepatanOption(data.kecepatan);
    updateWizardValue('akses', data.akses, '%');
    selectTerputusOption(data.terputus);
}

const presets = {
    cafe: { sinyal: 45, kecepatan: 15, terputus: 4, pengguna: 40, jarak: 12, akses: 50 },
    basement: { sinyal: 20, kecepatan: 5, terputus: 6, pengguna: 2, jarak: 28, akses: 30 },
    office: { sinyal: 85, kecepatan: 70, terputus: 1, pengguna: 18, jarak: 3, akses: 95 },
    normal: { sinyal: 95, kecepatan: 90, terputus: 0, pengguna: 3, jarak: 2, akses: 100 },
    testcase: { sinyal: 35, kecepatan: 30, terputus: 7, pengguna: 25, jarak: 20, akses: 40 }
};

// ==========================================
// 4. MAIN INFERENCE EXECUTION
// ==========================================
let outputPlotChart = null;
let gaugeChart = null;

function runWizardInference() {
    engine.reloadConfig();
    
    // Read symptoms inputs
    const Sinyal = parseFloat(document.getElementById('wiz-sinyal').value);
    const Kecepatan = parseFloat(document.getElementById('wiz-kecepatan').value);
    const Terputus = parseFloat(document.getElementById('wiz-terputus').value);
    const Pengguna = parseFloat(document.getElementById('wiz-pengguna').value);
    const Jarak = parseFloat(document.getElementById('wiz-jarak').value);
    const Akses = parseFloat(document.getElementById('wiz-akses').value);
    
    const symNoSSID = document.getElementById('sym-no-ssid').checked;
    const symNoInternet = document.getElementById('sym-no-internet').checked;
    const symHotRouter = document.getElementById('sym-hot-router').checked;
    const symRedLOS = document.getElementById('sym-red-los').checked;
    const symWrongPW = document.getElementById('sym-wrong-pw').checked;
    
    // Perform Fuzzy Calculations
    const inputVector = { G01: Sinyal, G02: Kecepatan, G03: Terputus, G04: Pengguna, G05: Jarak, G06: Akses };
    const fuzzified = engine.fuzzify(inputVector);
    const ruleActivations = engine.evaluateRules(fuzzified);
    const { centroid, aggregatedHeights, sumNum, sumDen } = engine.aggregateAndDefuzzify(ruleActivations);
    
    // Calculate Confidence scores for multiple causes
    // Based on logical fuzzy intersections + checkboxes
    const cPosisiRouter = Math.min(
        fuzzified.G01.Lemah * 80 + (symNoSSID ? 20 : 0) + (Jarak > 15 ? 100 : Jarak * 5), 100
    );
    const cOverloadUser = Math.min(
        Math.max(fuzzified.G04.Banyak, fuzzified.G02.Lambat) * 70 + (Pengguna > 20 ? 30 : 0) + (symNoInternet ? 15 : 0), 100
    );
    const cGangguanISP = Math.min(
        Math.max(fuzzified.G06.TidakTersedia, fuzzified.G06.Terbatas) * 60 + (symRedLOS ? 40 : 0) + (symNoInternet ? 10 : 0), 100
    );
    const cKerusakanPerangkat = Math.min(
        fuzzified.G03.Sering * 50 + (symHotRouter ? 30 : 0) + (symRedLOS ? 20 : 0), 100
    );
    const cKesalahanConfig = Math.min(
        (symWrongPW ? 60 : 0) + (symNoInternet ? 25 : 0) + (fuzzified.G06.TidakTersedia ? 15 : 0), 100
    );
    
    // List causes
    const causes = [
        { name: "Posisi Router Buruk", confidence: Math.round(cPosisiRouter), desc: "Redaman tinggi akibat jarak berlebih atau terhalang dinding/sekat tebal." },
        { name: "Overload User", confidence: Math.round(cOverloadUser), desc: "Kemacetan jaringan akibat terlalu banyak perangkat memperebutkan bandwidth." },
        { name: "Gangguan ISP", confidence: Math.round(cGangguanISP), desc: "Kehilangan koneksi internet eksternal akibat pemeliharaan jaringan kabel fiber." },
        { name: "Kerusakan Perangkat Keras", confidence: Math.round(cKerusakanPerangkat), desc: "Perangkat router terlalu panas (overheating) atau terjadi malfungsi komponen internal." },
        { name: "Kesalahan Konfigurasi", confidence: Math.round(cKesalahanConfig), desc: "Kesalahan setelan IP/DNS lokal atau kegagalan password autentikasi." }
    ];
    
    // Sort causes
    causes.sort((a, b) => b.confidence - a.confidence);
    const primaryCause = causes[0];
    const secondaryCause = causes[1];
    
    // Severity and urgency classification
    let category = "GANGGUAN RINGAN";
    let urgency = "RENDAH";
    let severityClass = "ringan";
    let categoryDesc = "Jaringan stabil dengan parameter normal. Gangguan yang dirasakan bersifat sementara.";
    
    if (centroid > 40 && centroid <= 70) {
        category = "GANGGUAN SEDANG";
        urgency = "SEDANG";
        severityClass = "sedang";
        categoryDesc = "Kestabilan koneksi terganggu sebagian. Diperlukan penyesuaian setelan atau tata letak untuk mencegah overload.";
    } else if (centroid > 70) {
        category = "GANGGUAN BERAT";
        urgency = "TINGGI";
        severityClass = "berat";
        categoryDesc = "Jaringan WiFi mengalami kelumpuhan total atau penurunan drastis. Penanganan teknis segera dibutuhkan.";
    }
    
    // Save to Log History
    const logs = db.getLogs();
    const newLog = {
        id: "log-" + Date.now(),
        timestamp: new Date().toLocaleString('id-ID'),
        inputs: inputVector,
        centroid: centroid,
        category: category,
        primary_cause: primaryCause.name,
        secondary_cause: secondaryCause.name
    };
    logs.unshift(newLog);
    db.saveLogs(logs);
    
    // Update Results UI
    document.getElementById('res-centroid').innerText = `${centroid.toFixed(2)}`;
    
    const plate = document.getElementById('res-severity-plate');
    plate.className = `status-plate ${severityClass}`;
    document.getElementById('res-category-name').innerText = category;
    document.getElementById('res-category-desc').innerText = categoryDesc;
    
    const urgBadge = document.getElementById('res-urgency-badge');
    urgBadge.className = `urgency-pill urg-${urgency.toLowerCase()}`;
    urgBadge.innerText = `Urgensi ${urgency}`;
    
    // Causes cards update
    document.getElementById('res-primary-cause-title').innerText = `${primaryCause.name} (${primaryCause.confidence}%)`;
    document.getElementById('res-primary-cause-desc').innerText = primaryCause.desc;
    
    document.getElementById('res-secondary-cause-title').innerText = `${secondaryCause.name} (${secondaryCause.confidence}%)`;
    document.getElementById('res-secondary-cause-desc').innerText = secondaryCause.desc;
    
    // Render Confidence breakdown list
    const confList = document.getElementById('res-confidence-list');
    confList.innerHTML = "";
    causes.forEach(c => {
        const item = document.createElement('div');
        item.className = "confidence-item";
        
        let colorClass = "var(--state-ok)";
        if (c.confidence > 40 && c.confidence <= 70) colorClass = "var(--state-warn)";
        if (c.confidence > 70) colorClass = "var(--state-error)";
        
        item.innerHTML = `
            <div class="confidence-info-row">
                <span class="confidence-name">${c.name}</span>
                <span class="confidence-value">${c.confidence}%</span>
            </div>
            <div class="confidence-bar-bg">
                <div class="confidence-bar-fill" style="width: ${c.confidence}%; background-color: ${colorClass};"></div>
            </div>
        `;
        confList.appendChild(item);
    });
    
    // Solution recommendations engine mapping
    let solutions = [];
    if (primaryCause.name === "Posisi Router Buruk") {
        solutions = [
            "Pindahkan perangkat Anda agar lebih dekat ke router nirkabel.",
            "Pindahkan router ke lokasi tengah ruangan, minimal setinggi dada.",
            "Singkirkan benda logam, sekat kaca tebal, atau cermin dari area pancaran router."
        ];
    } else if (primaryCause.name === "Overload User") {
        solutions = [
            "Batasi bandwidth (QoS) pada admin dashboard untuk membagi kecepatan secara adil.",
            "Matikan download latar belakang pada perangkat yang tidak sedang digunakan.",
            "Buat jaringan WiFi terpisah (Guest Network) dengan alokasi bandwidth maksimal 20%."
        ];
    } else if (primaryCause.name === "Gangguan ISP") {
        solutions = [
            "Restart modem serat optik ISP dengan mencabut kabel power selama 30 detik.",
            "Periksa lampu indikator LOS pada modem Anda. Jika berkedip merah, laporkan ke operator ISP.",
            "Gunakan koneksi data seluler darurat (Tethering) selama pemeliharaan ISP berlangsung."
        ];
    } else if (primaryCause.name === "Kerusakan Perangkat Keras") {
        solutions = [
            "Matikan router WiFi Anda selama 5 menit untuk mendinginkan komponen yang overheating.",
            "Perbarui firmware router ke versi terbaru untuk memperbaiki bug driver nirkabel.",
            "Pertimbangkan penambahan kipas pendingin eksternal atau mengganti modul adaptor router."
        ];
    } else { // Kesalahan Konfigurasi
        solutions = [
            "Pilih opsi 'Forget Network' pada setelan WiFi perangkat Anda, lalu masukkan password kembali.",
            "Atur setelan IP Address perangkat ke DHCP (Otomatis) dan hapus setelan DNS statis.",
            "Lakukan reboot router nirkabel untuk membersihkan alokasi IP DHCP klien yang konflik."
        ];
    }
    
    const solList = document.getElementById('res-solutions-list');
    solList.innerHTML = "";
    solutions.forEach(sol => {
        const li = document.createElement('li');
        li.innerText = sol;
        solList.appendChild(li);
    });
    
    // Trace mathematical equations output text
    renderResultTrace(fuzzified, ruleActivations, centroid, sumNum, sumDen);
    
    // Draw Gauge Doughnut Chart
    drawResultGauge(centroid);
    
    // Plot aggregated output curve
    drawFuzzyOutputPlot(aggregatedHeights, centroid);
    
    navigateTo('result');
}

// 4.1 Trace Mathematical Calculations
function renderResultTrace(fuzz, activations, Z, sumNum, sumDen) {
    const block = document.getElementById('res-trace-math-block');
    
    let rulesText = [];
    activations.forEach(r => {
        if (r.alpha > 0) {
            rulesText.push(`  * Rule [${r.code}] active -> alpha = ${r.alpha.toFixed(3)} (${r.desc})`);
        }
    });
    
    block.innerHTML = `
// 1. Fuzzification (μ):
  * G01 (Kekuatan Sinyal): Lemah=${fuzz.G01.Lemah.toFixed(2)}, Sedang=${fuzz.G01.Sedang.toFixed(2)}, Kuat=${fuzz.G01.Kuat.toFixed(2)}
  * G02 (Kecepatan Internet): Lambat=${fuzz.G02.Lambat.toFixed(2)}, Sedang=${fuzz.G02.Sedang.toFixed(2)}, Cepat=${fuzz.G02.Cepat.toFixed(2)}
  * G03 (Frekuensi Terputus): Jarang=${fuzz.G03.Jarang.toFixed(2)}, Kadang=${fuzz.G03.Kadang.toFixed(2)}, Sering=${fuzz.G03.Sering.toFixed(2)}
  * G04 (Jumlah Pengguna): Sedikit=${fuzz.G04.Sedikit.toFixed(2)}, Sedang=${fuzz.G04.Sedang.toFixed(2)}, Banyak=${fuzz.G04.Banyak.toFixed(2)}
  * G05 (Jarak Perangkat): Dekat=${fuzz.G05.Dekat.toFixed(2)}, Sedang=${fuzz.G05.Sedang.toFixed(2)}, Jauh=${fuzz.G05.Jauh.toFixed(2)}
  * G06 (Akses Internet): Tidak Tersedia=${fuzz.G06.TidakTersedia.toFixed(2)}, Terbatas=${fuzz.G06.Terbatas.toFixed(2)}, Tersedia=${fuzz.G06.Tersedia.toFixed(2)}

// 2. Active Fuzzy Rules (Conjunction AND = minimum):
${rulesText.length > 0 ? rulesText.join('\n') : '  * Tidak ada aturan fuzzy yang aktif.'}

// 3. Aggregation Height limits:
  * A_Ringan = ${Math.max(...activations.filter(r => r.outputTermId === "t-out-rin").map(r => r.alpha)).toFixed(2)}
  * A_Sedang = ${Math.max(...activations.filter(r => r.outputTermId === "t-out-sed").map(r => r.alpha)).toFixed(2)}
  * A_Berat  = ${Math.max(...activations.filter(r => r.outputTermId === "t-out-ber").map(r => r.alpha)).toFixed(2)}

// 4. Centroid Defuzzification (discrete sum, step=0.1):
  * Σ (y * A(y)) = ${sumNum.toFixed(4)}
  * Σ A(y) = ${sumDen.toFixed(4)}
  * Final Centroid (Z) = Σ (y * A(y)) / Σ A(y)
                       = ${sumNum.toFixed(4)} / ${sumDen.toFixed(4)}
                       = ${Z.toFixed(4)}
    `;
}

// 4.2 Radial Gauge drawing
function drawResultGauge(val) {
    const ctx = document.getElementById('resultGaugeCanvas').getContext('2d');
    
    let color = '#10b981'; // green
    if (val > 40 && val <= 70) color = '#f59e0b'; // orange
    if (val > 70) color = '#ef4444'; // red
    
    const data = {
        datasets: [{
            data: [val, 100 - val],
            backgroundColor: [color, 'rgba(255, 255, 255, 0.05)'],
            borderWidth: 0,
            borderRadius: 4
        }]
    };
    
    const config = {
        type: 'doughnut',
        data: data,
        options: {
            rotation: -90,
            circumference: 180,
            cutout: '88%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            }
        }
    };
    
    if (gaugeChart) {
        gaugeChart.destroy();
    }
    gaugeChart = new Chart(ctx, config);
}

// 4.3 Fuzzy output graph
function drawFuzzyOutputPlot(pts, centroid) {
    const ctx = document.getElementById('resFuzzyOutputChart').getContext('2d');
    
    const outVar = engine.variables.find(v => v.type === 'output');
    const outTerms = engine.terms.filter(t => t.variable_id === outVar.id);
    
    const datasets = [];
    
    // 1. Background Output Terms Curves (Ringan, Sedang, Berat)
    outTerms.forEach(t => {
        const points = [];
        const step = 2;
        for (let x = outVar.min_value; x <= outVar.max_value; x += step) {
            points.push({ x: x, y: engine.evaluateMembership(x, t.shape_type, t.params) });
        }
        datasets.push({
            label: t.name,
            data: points,
            borderColor: t.color,
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false,
            tension: 0.1,
            type: 'line'
        });
    });
    
    // 2. Filled Aggregation Area A(y)
    datasets.push({
        label: 'Area Agregasi A(y)',
        data: pts,
        borderColor: 'var(--accent-teal)',
        backgroundColor: 'rgba(0, 245, 212, 0.15)',
        fill: true,
        borderWidth: 2,
        pointRadius: 0,
        type: 'line'
    });
    
    // 3. Vertical Centroid indicator line
    datasets.push({
        label: `Centroid Z = ${centroid.toFixed(2)}`,
        data: [
            { x: centroid, y: 0 },
            { x: centroid, y: 1 }
        ],
        borderColor: '#ef4444',
        borderWidth: 3,
        pointRadius: 0,
        fill: false,
        type: 'line'
    });
    
    const config = {
        type: 'scatter',
        data: { datasets: datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    min: 0,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Tingkat Gangguan (y)',
                        color: '#8e9aa8',
                        font: { size: 10, weight: 'bold' }
                    },
                    grid: { color: 'rgba(255,255,255,0.03)' },
                    ticks: { color: '#8e9aa8' }
                },
                y: {
                    min: 0,
                    max: 1.05,
                    title: {
                        display: true,
                        text: 'Derajat Keanggotaan \u03bc(y)',
                        color: '#8e9aa8',
                        font: { size: 10, weight: 'bold' }
                    },
                    grid: { color: 'rgba(255,255,255,0.03)' },
                    ticks: { color: '#8e9aa8' }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#f3f4f6',
                        boxWidth: 10,
                        font: { size: 9 }
                    }
                }
            }
        }
    };
    
    if (outputPlotChart) {
        outputPlotChart.destroy();
    }
    outputPlotChart = new Chart(ctx, config);
}

function toggleTraceConsole() {
    const drawer = document.getElementById('result-trace-drawer');
    if (drawer.style.display === "none") {
        drawer.style.display = "block";
        drawer.scrollIntoView({ behavior: 'smooth' });
    } else {
        drawer.style.display = "none";
    }
}

// ==========================================
// 5. HISTORY & KNOWLEDGE BASE RENDERING
// ==========================================
function renderHistoryList() {
    const tbody = document.getElementById('history-table-body');
    tbody.innerHTML = "";
    
    const logs = db.getLogs();
    if (logs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Tidak ada riwayat diagnosa ditemukan.</td></tr>`;
        return;
    }
    
    logs.forEach(log => {
        const tr = document.createElement('tr');
        
        // Format inputs string
        const inpStr = `Sinyal:${log.inputs.G01}%, Kec:${log.inputs.G02}M, Jarak:${log.inputs.G05}m, User:${log.inputs.G04}`;
        
        tr.innerHTML = `
            <td><strong>${log.timestamp}</strong></td>
            <td class="history-inputs-col" title="${inpStr}">${inpStr}</td>
            <td><span style="font-weight: bold; color: ${log.category.includes('BERAT') ? 'var(--state-error)' : (log.category.includes('SEDANG') ? 'var(--state-warn)' : 'var(--state-ok)')};">${log.category}</span></td>
            <td><strong>${log.centroid.toFixed(2)}</strong></td>
            <td>${log.primary_cause}</td>
            <td>
                <button class="btn-danger" style="font-size: 0.72rem; padding: 0.25rem 0.5rem;" onclick="deleteLog('${log.id}')"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function deleteLog(id) {
    let logs = db.getLogs();
    logs = logs.filter(l => l.id !== id);
    db.saveLogs(logs);
    renderHistoryList();
}

function clearHistory() {
    if (confirm("Apakah Anda yakin ingin menghapus seluruh riwayat diagnosis?")) {
        db.saveLogs([]);
        renderHistoryList();
    }
}

function renderKnowledgeBaseGrid() {
    const grid = document.getElementById('kb-grid-container');
    grid.innerHTML = "";
    
    const articles = db.getArticles();
    articles.forEach(art => {
        const card = document.createElement('div');
        card.className = "kb-card";
        
        let urgClass = "urg-rendah";
        if (art.urgency === "Sedang") urgClass = "urg-sedang";
        if (art.urgency === "Tinggi") urgClass = "urg-tinggi";
        
        card.innerHTML = `
            <div>
                <div class="kb-card-header">
                    <span class="kb-badge">${art.category}</span>
                    <span class="urgency-pill ${urgClass}" style="margin: 0; padding: 0.15rem 0.5rem; font-size: 0.65rem;">${art.urgency}</span>
                </div>
                <h3>${art.title}</h3>
                <p>${art.content}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ==========================================
// 6. ADMIN PORTAL CONTROLLER
// ==========================================
function switchAdminSubView(viewId) {
    document.querySelectorAll('.admin-sub-view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.admin-nav-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`admin-sub-${viewId}`).classList.add('active');
    document.getElementById(`admin-btn-${viewId}`).classList.add('active');
    
    if (viewId === 'rules') {
        renderAdminRulesList();
    } else if (viewId === 'variables') {
        renderAdminVariablesList();
        // Update fuzzy plot visualization
        setTimeout(() => {
            const selector = document.getElementById('admin-chart-var-selector');
            if (selector) {
                updateFuzzyChart(selector.value);
            }
        }, 100);
    } else if (viewId === 'kb') {
        renderAdminKBList();
    }
}

function renderAdminRulesList() {
    const tbody = document.getElementById('admin-rules-table-body');
    tbody.innerHTML = "";
    
    const rules = db.getRules();
    const terms = db.getTerms();
    
    rules.forEach(r => {
        const tr = document.createElement('tr');
        
        const outputTerm = terms.find(t => t.id === r.output_term_id);
        const color = outputTerm ? outputTerm.color : '#fff';
        
        tr.innerHTML = `
            <td><strong>${r.code}</strong></td>
            <td>${r.description.split(" THEN ")[0].replace("IF ", "")}</td>
            <td><span style="color: ${color}; font-weight: bold;">${outputTerm ? outputTerm.name : 'Unknown'}</span></td>
            <td>
                <button class="btn-danger" style="font-size: 0.72rem; padding: 0.25rem 0.5rem;" onclick="deleteRule('${r.id}')"><i class="fa-solid fa-trash"></i> Hapus</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function deleteRule(id) {
    if (confirm("Apakah Anda yakin ingin menghapus aturan fuzzy ini?")) {
        let rules = db.getRules();
        rules = rules.filter(r => r.id !== id);
        db.saveRules(rules);
        renderAdminRulesList();
        engine.reloadConfig();
    }
}

function renderAdminVariablesList() {
    const container = document.getElementById('admin-variables-container');
    container.innerHTML = "";
    
    const variables = db.getVariables();
    const terms = db.getTerms();
    
    variables.forEach(v => {
        const card = document.createElement('div');
        card.className = "admin-var-card";
        
        // Find terms associated with this variable
        const vTerms = terms.filter(t => t.variable_id === v.id);
        
        let termsHtml = "";
        vTerms.forEach(t => {
            const paramInputs = t.params.map((val, idx) => `
                <input type="number" class="admin-param-input" value="${val}" step="0.1" 
                    onchange="updateTermParameter('${t.id}', ${idx}, this.value)">
            `).join('');
            
            termsHtml += `
                <div class="admin-term-item">
                    <div class="admin-term-name">
                        <span style="color: ${t.color};">${t.name}</span>
                    </div>
                    <span class="admin-term-shape">Kurva: ${t.shape_type.toUpperCase()}</span>
                    <div class="admin-term-params-row">
                        ${paramInputs}
                    </div>
                </div>
            `;
        });
        
        card.innerHTML = `
            <div class="admin-var-header">
                <span class="admin-var-title">${v.code}. ${v.name} (${v.min_value}-${v.max_value} ${v.unit})</span>
                <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">${v.type}</span>
            </div>
            <div class="admin-terms-grid">
                ${termsHtml}
            </div>
        `;
        container.appendChild(card);
    });
}

function updateTermParameter(termId, idx, value) {
    const terms = db.getTerms();
    const t = terms.find(t => t.id === termId);
    if (t) {
        t.params[idx] = parseFloat(value);
        db.saveTerms(terms);
        engine.reloadConfig();
        
        // Live update the variables membership chart
        const selector = document.getElementById('admin-chart-var-selector');
        if (selector) {
            updateFuzzyChart(selector.value);
        }
    }
}

function renderAdminKBList() {
    const tbody = document.getElementById('admin-kb-table-body');
    tbody.innerHTML = "";
    
    const articles = db.getArticles();
    articles.forEach(art => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${art.title}</strong></td>
            <td><span class="kb-badge">${art.category}</span></td>
            <td><strong>${art.urgency}</strong></td>
            <td>
                <button class="btn-danger" style="font-size: 0.72rem; padding: 0.25rem 0.5rem;" onclick="deleteArticle('${art.id}')"><i class="fa-solid fa-trash"></i> Hapus</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function deleteArticle(id) {
    if (confirm("Apakah Anda yakin ingin menghapus artikel troubleshooting ini?")) {
        let articles = db.getArticles();
        articles = articles.filter(a => a.id !== id);
        db.saveArticles(articles);
        renderAdminKBList();
    }
}

// MODALS CONTROL
function openNewRuleModal() {
    document.getElementById('modal-rule-id').value = "";
    document.getElementById('modal-rule-code').value = "R" + (db.getRules().length + 1);
    document.getElementById('modal-rule-desc').value = "";
    
    // Generate checkbox list of antecedents
    const container = document.getElementById('modal-antecedents-container');
    container.innerHTML = "";
    
    const variables = db.getVariables().filter(v => v.type === 'input');
    const terms = db.getTerms();
    
    variables.forEach(v => {
        const vTerms = terms.filter(t => t.variable_id === v.id);
        const group = document.createElement('div');
        group.style.marginBottom = "0.5rem";
        group.innerHTML = `<strong style="font-size: 0.72rem; color: #fff; display: block; margin-bottom: 0.2rem;">${v.name}:</strong>`;
        
        vTerms.forEach(t => {
            const row = document.createElement('label');
            row.className = "antecedent-checkbox-row";
            row.innerHTML = `
                <input type="checkbox" name="modal-antecedent-item" value="${t.id}">
                <span>${t.name}</span>
            `;
            group.appendChild(row);
        });
        container.appendChild(group);
    });
    
    // Populate consequent dropdown
    const consequentSelect = document.getElementById('modal-rule-consequent');
    consequentSelect.innerHTML = "";
    const outTerms = terms.filter(t => t.variable_id === "v-output");
    outTerms.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.innerText = t.name;
        consequentSelect.appendChild(opt);
    });
    
    document.getElementById('rule-modal').classList.add('active');
}

function saveRuleFromModal() {
    const code = document.getElementById('modal-rule-code').value;
    const desc = document.getElementById('modal-rule-desc').value;
    const consequentId = document.getElementById('modal-rule-consequent').value;
    
    // Collect checked antecedents
    const checked = Array.from(document.querySelectorAll('input[name="modal-antecedent-item"]:checked')).map(el => el.value);
    
    if (!code || !desc || checked.length === 0) {
        alert("Mohon isi semua data aturan dan pilih minimal 1 parameter kondisi.");
        return;
    }
    
    const rules = db.getRules();
    const newRule = {
        id: "rule-" + Date.now(),
        code: code,
        description: desc,
        output_term_id: consequentId,
        antecedents: checked
    };
    rules.push(newRule);
    db.saveRules(rules);
    
    closeModal('rule-modal');
    renderAdminRulesList();
    engine.reloadConfig();
}

function openNewArticleModal() {
    document.getElementById('modal-article-id').value = "";
    document.getElementById('modal-art-title').value = "";
    document.getElementById('modal-art-content').value = "";
    document.getElementById('article-modal').classList.add('active');
}

function saveArticleFromModal() {
    const title = document.getElementById('modal-art-title').value;
    const category = document.getElementById('modal-art-category').value;
    const urgency = document.getElementById('modal-art-urgency').value;
    const content = document.getElementById('modal-art-content').value;
    
    if (!title || !content) {
        alert("Mohon isi judul dan isi konten artikel.");
        return;
    }
    
    const articles = db.getArticles();
    const newArt = {
        id: "art-" + Date.now(),
        title: title,
        category: category,
        urgency: urgency,
        content: content
    };
    
    articles.push(newArt);
    db.saveArticles(articles);
    
    closeModal('article-modal');
    renderAdminKBList();
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// ==========================================
// 7. DYNAMIC PLOTS (EXPLAINERS ON ADMIN)
// ==========================================
function updateFuzzyChart(varKey) {
    const ctx = document.getElementById('fuzzyPlotChart').getContext('2d');
    const variables = db.getVariables();
    const terms = db.getTerms();
    
    const v = variables.find(variable => variable.code === (varKey === 'output' ? 'OUTPUT' : (varKey === 'sinyal' ? 'G01' : (varKey === 'kecepatan' ? 'G02' : (varKey === 'terputus' ? 'G03' : (varKey === 'pengguna' ? 'G04' : (varKey === 'jarak' ? 'G05' : 'G06')))))));
    const vTerms = terms.filter(t => t.variable_id === v.id);
    
    const datasets = [];
    
    vTerms.forEach(t => {
        const points = [];
        const step = (v.max_value - v.min_value) / 50;
        for (let x = v.min_value; x <= v.max_value; x += step) {
            points.push({ x: x, y: getMembershipVal(x, t) });
        }
        datasets.push({
            label: t.name,
            data: points,
            borderColor: t.color,
            backgroundColor: t.color + "14",
            fill: true,
            borderWidth: 2,
            tension: 0.1,
            pointRadius: 0
        });
    });
    
    const config = {
        type: 'scatter',
        data: { datasets: datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    min: v.min_value,
                    max: v.max_value,
                    title: { display: true, text: `${v.name} (${v.unit})`, color: '#8e9aa8' },
                    grid: { color: 'rgba(255,255,255,0.03)' },
                    ticks: { color: '#8e9aa8' }
                },
                y: {
                    min: 0,
                    max: 1.05,
                    title: { display: true, text: 'Keanggotaan \u03BC', color: '#8e9aa8' },
                    grid: { color: 'rgba(255,255,255,0.03)' },
                    ticks: { color: '#8e9aa8' }
                }
            },
            plugins: {
                legend: { labels: { color: '#f3f4f6', boxWidth: 10, font: { size: 9 } } }
            }
        }
    };
    
    if (plotChart) {
        plotChart.destroy();
    }
    plotChart = new Chart(ctx, config);
}

let plotChart = null;

// Initial navigation setup
navigateTo('landing');
