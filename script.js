// ==========================================
// 1. VARIABELEN & SELECTIES
// ==========================================

// Slider elementen
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const dialogueText = document.getElementById('dialogue-text');

// Modals (Popups)
const passwordModal = document.getElementById('password-modal');       // De minigame
const warningModal = document.getElementById('warning-modal');         // Karen waarschuwing (Rood)
const pasteWarningModal = document.getElementById('paste-warning-modal'); // Plak waarschuwing (Oranje)

// Minigame elementen
const errorBox = document.getElementById('error-box');
const passInput1 = document.getElementById('pass1');
const passInput2 = document.getElementById('pass2');

// Status variabelen
let currentSlide = 0;
let currentLine = 0;        // Houdt bij welke regel tekst we zijn
let isModalOpen = false;    // Is er een popup open?
let level1Unlocked = false; // Is de minigame gewonnen?

// ==========================================
// 2. HET VERHAAL (DATA)
// ==========================================
const storyLines = [
    // Slide 1 (Introductie & Lore)
    [
        "Cyber Detective Agency, maandagochtend. De koffie is nog warm.",
        "Mijn taak? Digitale mysteries oplossen en mensen online veilig houden.",
        "Mijn inbox is leeg... het lijkt er zowaar op dat het een rustige dag gaat worden."
    ],
    // Slide 2 (Klant komt binnen)
    [
        "*Klingeling*... De deur gaat open.",
        "Sprak ik te vroeg? Een vrouw stapt aarzelend mijn kantoor binnen.",
        "Ze ziet eruit alsof ze digitaal de weg volledig kwijt is."
    ],
    // Slide 3 (Het probleem uitleggen)
    [
        "\"Hoi, ik ben Karen,\" zegt ze zachtjes.",
        "\"Ik heb een probleem. Ik ben voor de zoveelste keer mijn wachtwoord vergeten!\"",
        "\"Mijn vorige was 'Flappie123', maar mijn neefje zei dat dat niet veilig is.\"",
        "\"Kun jij me alsjeblieft helpen een écht sterk wachtwoord te maken?\""
    ],
    // Slide 4 (Minigame trigger - Level 1)
    [
        "Geen probleem, Karen. Laten we meteen naar je laptop kijken.",
        "We gaan een wachtwoord maken dat hackers onmogelijk kunnen raden.",
        "Denk eraan: gebruik geen namen, maar wel tekens en cijfers.",
        "Klik op de rode cirkel op het scherm om te starten!"
    ],
    // Slide 5 (Succes & Afsluiting)
    [
        "\"Wauw, dat is een stuk veiliger! Bedankt, detective!\"",
        "Karen loopt opgelucht naar de deur. Haar data is weer veilig.",
        "\"Tot ziens, Karen! En onthoud: plak het niet op een geeltje onder je toetsenbord!\"",
        "Tijd voor weer een slok koffie... Wie is de volgende?"
    ]
];

// Start de pagina correct op
updateDialogue();
updateUI(); 

// ==========================================
// 3. NAVIGATIE & DIALOOG LOGICA
// ==========================================

// Wordt aangeroepen door Pijltje Rechts of knop Volgende
function handleNext() {
    if (isModalOpen) return;

    // Is er nog tekst over op deze slide?
    if (currentLine < storyLines[currentSlide].length - 1) {
        // Ja: Ga naar volgende regel tekst
        currentLine++;
        updateDialogue();
    } else {
        // Nee: Tekst is op, probeer naar volgende slide te gaan
        changeSlide(1);
    }
}

// Wordt aangeroepen door Pijltje Links of knop Vorige
function handlePrev() {
    if (isModalOpen) return;

    // Als we halverwege de tekst zijn, ga terug in de tekst
    if (currentLine > 0) {
        currentLine--;
        updateDialogue();
    } else {
        // Als we bij de eerste regel zijn, ga naar vorige slide
        changeSlide(-1);
    }
}

// Update de tekst in het zwarte balkje
function updateDialogue() {
    const text = storyLines[currentSlide][currentLine];
    dialogueText.innerText = text;
}

// ==========================================
// 4. SLIDER FUNCTIES
// ==========================================

function changeSlide(direction) {
    // Check slotje voor Level 1 (Slide 4 -> 5)
    // Slide 4 heeft index 3. Als we daar zijn, naar rechts willen (1), en level is NIET unlocked...
    if (currentSlide === 3 && direction === 1 && !level1Unlocked) {
        // ...Dan doen we NIETS. (Geen alert, gewoon blokkeren)
        return; 
    }

    let newIndex = currentSlide + direction;

    // Check of we niet buiten de reeks gaan (kleiner dan 0 of groter dan max)
    if (newIndex < 0 || newIndex >= slides.length) return;

    // Slide wissel
    slides[currentSlide].classList.remove('active');
    currentSlide = newIndex;
    slides[currentSlide].classList.add('active');

    // Reset de tekst naar regel 0 bij een nieuwe slide (vooruit)
    // Als we teruggaan, zetten we hem op de laatste regel
    if (direction === 1) {
        currentLine = 0; 
    } else {
        currentLine = storyLines[currentSlide].length - 1;
    }

    updateDialogue();
    updateUI();
}

// Knoppen verbergen/tonen op basis van positie
function updateUI() {
    // Vorige knop weg bij allereerste begin
    prevBtn.style.display = (currentSlide === 0 && currentLine === 0) ? 'none' : 'block';
    
    // Volgende knop weg bij allerlaatste einde
    if (currentSlide === slides.length - 1 && currentLine === storyLines[currentSlide].length - 1) {
        nextBtn.style.display = 'none';
    } else {
        nextBtn.style.display = 'block';
    }
}

// ==========================================
// 5. MINIGAME & POPUP LOGICA
// ==========================================

function openModal() {
    // Check of de speler de dialoog heeft afgelezen.
    // De minigame mag pas openen als we op de laatste regel van de slide zijn.
    if (currentLine < storyLines[currentSlide].length - 1) {
        return;
    }

    passwordModal.style.display = 'flex';
    isModalOpen = true;
    
    // Reset velden bij openen
    passInput1.value = ""; 
    passInput2.value = "";
    errorBox.style.display = 'none'; 
    errorBox.innerHTML = "";
    passInput1.type = "password"; 
    passInput2.type = "password";
}

function closeModal() {
    passwordModal.style.display = 'none';
    isModalOpen = false;
}

function closeWarning() {
    warningModal.style.display = 'none';
}

function closePasteWarning() {
    pasteWarningModal.style.display = 'none';
}

// Het oogje: Wissel tussen password (bolletjes) en text (leesbaar)
function togglePassword(inputId, iconElement) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
        iconElement.textContent = "🙈"; // Aapje kijkt niet (of open oog, wat je wil)
    } else {
        input.type = "password";
        iconElement.textContent = "👁️";
    }
}

// De Wachtwoord Check Functie
function checkPassword() {
    const p1 = passInput1.value;
    const p2 = passInput2.value;
    let errors = [];

    // Lijsten met verboden patronen
    const forbiddenSequences = ["01234567890", "09876543210", "abcdefghijklmnopqrstuvwxyz", "qwertyuiop", "asdfghjkl", "zxcvbnm"];
    const commonWeakWords = ["welkom", "wachtwoord", "password", "geheim", "admin", "login", "flappie", "hallo", "voetbal", "123456"];

    // --- DE VALIDATIES ---

    // 1. KAREN CHECK (Directe stop - Rood alarm)
    if (p1.toLowerCase().includes("karen")) {
        warningModal.style.display = 'flex';
        return; // Stop functie direct
    }

    // 2. ZWAKKE WOORDEN CHECK
    let foundWeakWord = false;
    const lowerP1 = p1.toLowerCase();
    for (let word of commonWeakWords) {
        if (lowerP1.includes(word)) {
            foundWeakWord = word;
            break;
        }
    }
    if (foundWeakWord) {
        errors.push("Gebruik geen veelvoorkomende woorden (zoals '" + foundWeakWord + "').");
    }

    // 3. Lengte Check
    if (p1.length < 12) errors.push("Te kort (minimaal 12 tekens nodig).");
    
    // 4. Karakter Checks
    if (!/[A-Z]/.test(p1)) errors.push("Voeg een Hoofdletter toe.");
    if (!/[0-9]/.test(p1)) errors.push("Voeg een cijfer toe.");
    if (!/[^a-zA-Z0-9]/.test(p1)) errors.push("Voeg een leesteken toe.");
    
    // 5. Reeksen Check (abcd, 1234)
    let foundPattern = false;
    for (let seq of forbiddenSequences) {
        for (let i = 0; i < seq.length - 3; i++) {
            if (lowerP1.includes(seq.substring(i, i + 4))) { 
                foundPattern = true; break; 
            }
        }
        if (foundPattern) break;
    }
    if (foundPattern) errors.push("Gebruik geen logische reeksen (1234, abcd).");

    // 6. Bevestiging Check
    if (p1 !== p2) {
        errors.push("De wachtwoorden zijn niet gelijk.");
    } else if (p1.length > 0 && p2.length === 0) {
        errors.push("Vul het wachtwoord ook in bij bevestiging.");
    }

    // --- RESULTAAT ---
    if (errors.length > 0) {
        // FOUT: Toon rode box met lijst
        errorBox.style.display = 'block';
        let html = "<strong>Let op:</strong><ul>";
        errors.forEach(err => html += "<li>" + err + "</li>");
        html += "</ul>";
        errorBox.innerHTML = html;
    } else {
        // GOED: Level gehaald!
        level1Unlocked = true;
        closeModal();
        changeSlide(1); // Ga direct door naar volgende slide
    }
}

// ==========================================
// 6. EVENTS & LISTENERS
// ==========================================

// Blokkeer rechtermuisknop op inputs (tegen spieken)
if(passInput1) passInput1.addEventListener('contextmenu', e => e.preventDefault());
if(passInput2) passInput2.addEventListener('contextmenu', e => e.preventDefault());

// NIEUW: Blokkeer PLAKKEN in het 2e veld -> Toon Oranje Modal
if(passInput2) {
    passInput2.addEventListener('paste', function(event) {
        event.preventDefault(); // Blokkeer de plak actie
        pasteWarningModal.style.display = 'flex'; // Toon waarschuwing
    });
}

// Toetsenbord bediening
document.addEventListener('keydown', function(event) {
    // Escape knop sluit de bovenste modal die open staat
    if (event.key === 'Escape') {
        if (pasteWarningModal.style.display === 'flex') {
            closePasteWarning();
        } else if (warningModal.style.display === 'flex') {
            closeWarning();
        } else if (isModalOpen) {
            closeModal();
        }
        return;
    }

    // Navigatie met pijltjes (alleen als er geen popup open is)
    if (!isModalOpen) {
        if (event.key === 'ArrowRight') handleNext();
        if (event.key === 'ArrowLeft') handlePrev();
    }
});