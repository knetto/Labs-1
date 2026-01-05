// ==========================================
// 1. VARIABELEN & SELECTIES
// ==========================================

// Slider elementen
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const dialogueText = document.getElementById('dialogue-text');

// Modals (Popups)
const passwordModal = document.getElementById('password-modal');       // Level 1
const websiteModal = document.getElementById('website-modal');         // Level 2 (NIEUW)
const warningModal = document.getElementById('warning-modal');         // Karen waarschuwing
const pasteWarningModal = document.getElementById('paste-warning-modal'); // Plak waarschuwing

// Minigame 1 elementen (Password)
const errorBox = document.getElementById('error-box');
const passInput1 = document.getElementById('pass1');
const passInput2 = document.getElementById('pass2');

// Status variabelen
let currentSlide = 0;
let currentLine = 0;        
let isModalOpen = false;    

// Locks (Zet ze op false om de speler te dwingen de game te spelen)
let level1Unlocked = true; 
let level2Unlocked = false; 


// ==========================================
// 2. HET VERHAAL (DATA)
// ==========================================
const storyLines = [
    // Slide 1 (Introductie)
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
    // Slide 4 (Minigame trigger - Level 1: Password)
    [
        "Geen probleem, Karen. Laten we meteen naar je laptop kijken.",
        "We gaan een wachtwoord maken dat hackers onmogelijk kunnen raden.",
        "Denk eraan: gebruik geen namen, maar wel tekens en cijfers.",
        "Klik op de rode cirkel op het scherm om te starten!"
    ],
    // Slide 5 (Succes Karen)
    [
        "\"Wauw, dat is een stuk veiliger! Bedankt, detective!\"",
        "Karen loopt opgelucht naar de deur. Haar data is weer veilig.",
        "\"Tot ziens, Karen! En onthoud: plak het niet op een geeltje onder je toetsenbord!\"",
        "Tijd voor weer een slok koffie... Wie is de volgende?"
    ],
    // Slide 6 (Nieuwe klant - Oudere man)
    [
        "De deurklink was nog warm van Karen's vertrek toen de bel opnieuw ging.",
        "Een oudere man stapte binnen. Hij zag eruit alsof hij zojuist in een hele zure citroen had gebeten.",
        "Hij smeet bijna een stapel papieren op mijn bureau. \"Detective, ik ben bestolen!\""
    ],
    // Slide 7 (Probleem uitleg - Scam)
    [
        "\"Gaat u zitten, meneer...?\" \"Jansen. Meneer Jansen! En ik ben woest.\"",
        "Hij hijgde even en vervolgde: \"Ik zat op TikTok en zag een advertentie voor een 'revolutionaire' nieuwe smartwatch. Spotgoedkoop!\"",
        "\"Ik heb direct betaald via die website. Dat is nu drie weken geleden. Er is nooit iets geleverd.\"",
        "\"Mijn kleindochter zei al dat het er verdacht uitzag. Ze had gelijk. Ik ben opgelicht, nietwaar?\""
    ],
    // Slide 8 (Minigame trigger - Level 2: Fake Website)
    [
        "Laten we die 'revolutionaire' website eens nader bekijken op het scherm.",
        "Ik zie meteen al een paar rode vlaggen. Geen KvK-nummer, een vreemde URL, en taalfouten.",
        "Meneer Jansen, dit lijkt op een klassieke nep-webshop. We moeten de kenmerken identificeren.",
        "Klik op de rode cirkel op het scherm om het onderzoek naar deze site te starten."
    ],
    // Slide 9 (Afsluiting Scam zaak)
    [
        "\"Ongelofelijk dat ik daar ingetrapt ben,\" zuchtte meneer Jansen toen we de bewijzen zagen.",
        "We hebben de frauduleuze site gerapporteerd. Hij krijgt zijn geld misschien niet terug, maar hij is nu wel wijzer.",
        "\"Onthoud meneer Jansen: als een aanbieding op social media te mooi lijkt om waar te zijn... dan is het dat ook.\"",
        "Hij knikte schuldbewust en vertrok. Weer een digitaal mysterie opgelost."
    ]
];

// Start de pagina
updateDialogue();
updateUI(); 

// ==========================================
// 3. NAVIGATIE & DIALOOG LOGICA
// ==========================================

function handleNext() {
    if (isModalOpen) return;

    if (currentLine < storyLines[currentSlide].length - 1) {
        currentLine++;
        updateDialogue();
    } else {
        changeSlide(1);
    }
}

function handlePrev() {
    if (isModalOpen) return;

    if (currentLine > 0) {
        currentLine--;
        updateDialogue();
    } else {
        changeSlide(-1);
    }
}

function updateDialogue() {
    const text = storyLines[currentSlide][currentLine];
    dialogueText.innerText = text;
}

// ==========================================
// 4. SLIDER FUNCTIES (MET LOCKS)
// ==========================================

function changeSlide(direction) {
    // LOCK 1: Password Game (Slide 4 -> 5) (Index 3 naar 4)
    if (currentSlide === 3 && direction === 1 && !level1Unlocked) {
        // Blokkeer: Je moet eerst de game spelen
        return; 
    }

    // LOCK 2: Fake Website Game (Slide 8 -> 9) (Index 7 naar 8)
    if (currentSlide === 7 && direction === 1 && !level2Unlocked) {
        // Blokkeer: Je moet eerst de game spelen
        return;
    }

    let newIndex = currentSlide + direction;

    if (newIndex < 0 || newIndex >= slides.length) return;

    slides[currentSlide].classList.remove('active');
    currentSlide = newIndex;
    slides[currentSlide].classList.add('active');

    if (direction === 1) {
        currentLine = 0; 
    } else {
        currentLine = storyLines[currentSlide].length - 1;
    }

    updateDialogue();
    updateUI();
}

function updateUI() {
    prevBtn.style.display = (currentSlide === 0 && currentLine === 0) ? 'none' : 'block';
    
    if (currentSlide === slides.length - 1 && currentLine === storyLines[currentSlide].length - 1) {
        nextBtn.style.display = 'none';
    } else {
        nextBtn.style.display = 'block';
    }
}

// ==========================================
// 5. MINIGAME & POPUP LOGICA
// ==========================================

// UPDATED: Accepteert nu een 'gameType' om te weten welke modal open moet
function openModal(gameType) {
    // Je mag pas klikken als de tekst is uitgetypt (laatste regel)
    if (currentLine < storyLines[currentSlide].length - 1) {
        return;
    }

    isModalOpen = true;

    if (gameType === 'password') {
        // Open Password Game
        passwordModal.style.display = 'flex';
        // Reset velden
        passInput1.value = ""; 
        passInput2.value = "";
        errorBox.style.display = 'none'; 
        passInput1.type = "password"; 
        passInput2.type = "password";

    } else if (gameType === 'website') {
        // Open Fake Website Game
        websiteModal.style.display = 'flex';
    }
}

function closeModal() {
    passwordModal.style.display = 'none';
    websiteModal.style.display = 'none';
    isModalOpen = false;
}

function closeWarning() {
    warningModal.style.display = 'none';
}

function closePasteWarning() {
    pasteWarningModal.style.display = 'none';
}

// --- LEVEL 1 LOGICA (Password) ---
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
    const commonWeakWords = ["welkom", "wachtwoord", "password", "geheim", "admin", "login", "flappie", "hallo", "voetbal", "123456"];

    if (p1.toLowerCase().includes("karen")) {
        warningModal.style.display = 'flex';
        return; 
    }

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

    if (p1.length < 12) errors.push("Te kort (minimaal 12 tekens nodig).");
    if (!/[A-Z]/.test(p1)) errors.push("Voeg een Hoofdletter toe.");
    if (!/[0-9]/.test(p1)) errors.push("Voeg een cijfer toe.");
    if (!/[^a-zA-Z0-9]/.test(p1)) errors.push("Voeg een leesteken toe.");
    
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

    if (p1 !== p2) {
        errors.push("De wachtwoorden zijn niet gelijk.");
    } else if (p1.length > 0 && p2.length === 0) {
        errors.push("Vul het wachtwoord ook in bij bevestiging.");
    }

    if (errors.length > 0) {
        errorBox.style.display = 'block';
        let html = "<strong>Let op:</strong><ul>";
        errors.forEach(err => html += "<li>" + err + "</li>");
        html += "</ul>";
        errorBox.innerHTML = html;
    } else {
        // Level 1 Gewonnen
        level1Unlocked = true;
        closeModal();
        changeSlide(1); 
    }
}

// --- LEVEL 2 LOGICA (Fake Website) ---
// Deze functie wordt aangeroepen door de "Doorgaan" knop in de nieuwe modal
function finishWebsiteGame() {
    // Hier kun je later logica toevoegen om te checken of ze de fouten hebben gevonden.
    // Voor nu is het klikken op 'Doorgaan' genoeg.
    
    level2Unlocked = true;
    closeModal();
    changeSlide(1); // Ga naar slide 9
}

// ==========================================
// 6. EVENTS & LISTENERS
// ==========================================

if(passInput1) passInput1.addEventListener('contextmenu', e => e.preventDefault());
if(passInput2) passInput2.addEventListener('contextmenu', e => e.preventDefault());

if(passInput2) {
    passInput2.addEventListener('paste', function(event) {
        event.preventDefault(); 
        pasteWarningModal.style.display = 'flex'; 
    });
}

document.addEventListener('keydown', function(event) {
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

    if (!isModalOpen) {
        if (event.key === 'ArrowRight') handleNext();
        if (event.key === 'ArrowLeft') handlePrev();
    }
});












(function() {
    let score = 0;

    window.checkFake = function(element, type) {
        if (element.classList.contains('found')) return;

        element.classList.add('found');
        score++;
        document.getElementById('score').innerText = score;

        const feedbackBox = document.getElementById('feedback-box');
        feedbackBox.style.display = 'block';
        
        let message = "Scherp gezien! ";
        switch(type) {
            case 'protocol':
                message += "De verbinding is niet veilig ('http' in plaats van 'https') en de browser waarschuwt hiervoor. Vul nooit gegevens in op zo'n site!";
                break;
            case 'domain':
                message += "Kijk goed naar het webadres. '.xyz' is een goedkope extensie die vaak door oplichters wordt gebruikt. Ook is de naam erg lang en generiek.";
                break;
            case 'grammar':
                message += "Je hebt een taalfout gevonden (zoals d/t-fouten of kromme zinnen). Professionele winkels hebben dit zelden.";
                break;
            case 'price':
                message += "De korting is verdacht. Hoge kortingen (30%+) op gloednieuwe producten zijn vaak te mooi om waar te zijn.";
                break;
             case 'trust':
                message += "Bedrijfsgegevens onderaan de pagina (zoals KVK nummers) zijn op nepsites vaak verzonnen of gestolen van andere bedrijven.";
                break;
        }
        feedbackBox.innerText = message;

        // Na 3 gevonden items mag je door
        if (score >= 3) {
            const btn = document.getElementById('finish-btn');
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            btn.innerText = "Doorgaan (Level Gehaald)";
        }
    }

    window.resetGame = function() {
        score = 0;
        document.getElementById('score').innerText = '0';
        document.getElementById('feedback-box').style.display = 'none';
        document.getElementById('finish-btn').disabled = true;
        document.getElementById('finish-btn').style.opacity = '0.5';
        const foundElements = document.querySelectorAll('.fake-element.found');
        foundElements.forEach(el => el.classList.remove('found'));
    }

    resetGame();

})();