// --- 1. VARIABELEN & DATA ---
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const dialogueText = document.getElementById('dialogue-text');

// Modals
const passwordModal = document.getElementById('password-modal');
const warningModal = document.getElementById('warning-modal');
const errorBox = document.getElementById('error-box');
const passInput1 = document.getElementById('pass1');
const passInput2 = document.getElementById('pass2');

// Status variabelen
let currentSlide = 0;
let currentLine = 0; // NIEUW: Houdt bij welke regel tekst we zijn
let isModalOpen = false; 
let level1Unlocked = false; 

// --- HET VERHAAL (DATA) ---
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
        "\"Mijn vorige was 'Karen123', maar mijn neefje zei dat dat niet veilig is.\"",
        "\"Kun jij me alsjeblieft helpen een écht sterk wachtwoord te maken?\""
    ],
    // Slide 4 (Minigame trigger)
    [
        "Geen probleem, Karen. Laten we meteen naar je laptop kijken.",
        "We gaan een wachtwoord maken dat hackers onmogelijk kunnen raden.",
        "Denk eraan: gebruik geen namen, maar wel tekens en cijfers.",
        "Klik op de rode cirkel op het scherm om de beveiliging te starten!"
    ],
    // Slide 5 (Succes & Afsluiting)
    [
        "\"Wauw, dat is een stuk veiliger! Bedankt, detective!\"",
        "Karen loopt opgelucht naar de deur. Haar data is weer veilig.",
        "\"Tot ziens, Karen! En onthoud: plak het niet op een geeltje onder je toetsenbord!\"",
        "Tijd voor weer een slok koffie... Wie is de volgende?"
    ]
];

// Initialiseer
updateDialogue();
updateUI(); 

// --- 2. NAVIGATIE LOGICA (NIEUW) ---

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

function updateDialogue() {
    // Haal de juiste tekst op uit de array
    // storyLines[huidigeSlide][huidigeRegel]
    const text = storyLines[currentSlide][currentLine];
    dialogueText.innerText = text;
}

// --- 3. SLIDER FUNCTIES ---

function changeSlide(direction) {
    // Check slotje voor Level 1 (Slide 4 -> 5)
    if (currentSlide === 3 && direction === 1 && !level1Unlocked) {
        alert("Los eerst de puzzel op door op de cirkel te klikken!");
        return; 
    }

    let newIndex = currentSlide + direction;
    if (newIndex < 0 || newIndex >= slides.length) return;

    // Slide wissel
    slides[currentSlide].classList.remove('active');
    currentSlide = newIndex;
    slides[currentSlide].classList.add('active');

    // NIEUW: Reset de tekst naar regel 0 bij een nieuwe slide
    // Tenzij we teruggaan? (Voor nu resetten we altijd naar begin van de slide)
    if (direction === 1) {
        currentLine = 0; 
    } else {
        // Als je teruggaat, wil je misschien de laatste regel zien?
        // Laten we voor simpelheid ook naar 0 gaan, of naar het einde:
        currentLine = storyLines[currentSlide].length - 1;
    }

    updateDialogue();
    updateUI();
}

function updateUI() {
    prevBtn.style.display = (currentSlide === 0 && currentLine === 0) ? 'none' : 'block';
    
    // Verberg 'volgende' knop alleen als we écht op het einde zijn
    if (currentSlide === slides.length - 1 && currentLine === storyLines[currentSlide].length - 1) {
        nextBtn.style.display = 'none';
    } else {
        nextBtn.style.display = 'block';
    }
}

// --- 4. MINIGAME LOGICA ---

function openModal() {
    passwordModal.style.display = 'flex';
    isModalOpen = true;
    passInput1.value = ""; passInput2.value = "";
    errorBox.style.display = 'none'; errorBox.innerHTML = "";
    passInput1.type = "password"; passInput2.type = "password";
}

function closeModal() {
    passwordModal.style.display = 'none';
    isModalOpen = false;
}

function closeWarning() {
    warningModal.style.display = 'none';
}

function togglePassword(inputId, iconElement) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
        iconElement.textContent = "🙈";
    } else {
        input.type = "password";
        iconElement.textContent = "👁️";
    }
}

function checkPassword() {
    const p1 = passInput1.value;
    const p2 = passInput2.value;
    let errors = [];

    const forbiddenSequences = ["01234567890", "09876543210", "abcdefghijklmnopqrstuvwxyz", "qwertyuiop", "asdfghjkl", "zxcvbnm"];

    if (p1.toLowerCase().includes("karen")) {
        warningModal.style.display = 'flex';
        return;
    }

    if (p1.length < 12) errors.push("Te kort (minimaal 12 tekens nodig).");
    if (!/[A-Z]/.test(p1)) errors.push("Voeg een Hoofdletter toe.");
    if (!/[0-9]/.test(p1)) errors.push("Voeg een cijfer toe.");
    if (!/[^a-zA-Z0-9]/.test(p1)) errors.push("Voeg een leesteken toe.");
    
    let foundPattern = false;
    const lowerP1 = p1.toLowerCase();
    for (let seq of forbiddenSequences) {
        for (let i = 0; i < seq.length - 3; i++) {
            if (lowerP1.includes(seq.substring(i, i + 4))) { foundPattern = true; break; }
        }
        if (foundPattern) break;
    }
    if (foundPattern) errors.push("Gebruik geen logische reeksen (1234, abcd).");

    if (p1 !== p2) errors.push("De wachtwoorden zijn niet gelijk.");
    else if (p1.length > 0 && p2.length === 0) errors.push("Vul het wachtwoord ook in bij bevestiging.");

    if (errors.length > 0) {
        errorBox.style.display = 'block';
        let html = "<strong>Let op:</strong><ul>";
        errors.forEach(err => html += "<li>" + err + "</li>");
        html += "</ul>";
        errorBox.innerHTML = html;
    } else {
        level1Unlocked = true;
        closeModal();
        // Ga naar volgende slide (en reset tekst)
        changeSlide(1);
    }
}

// --- 5. EVENTS ---
if(passInput1) passInput1.addEventListener('contextmenu', e => e.preventDefault());
if(passInput2) passInput2.addEventListener('contextmenu', e => e.preventDefault());

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        if (warningModal.style.display === 'flex') closeWarning();
        else if (isModalOpen) closeModal();
        return;
    }

    if (!isModalOpen) {
        // Let op: We roepen nu handleNext/Prev aan i.p.v. changeSlide
        if (event.key === 'ArrowRight') handleNext();
        if (event.key === 'ArrowLeft') handlePrev();
    }
});