(function() {
    // ==========================================
    // 1. VARIABELEN & SELECTIES
    // ==========================================

    // Slider elementen
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const dialogueText = document.getElementById('dialogue-text');

    // Modals (Popups)
    const passwordModal = document.getElementById('password-modal');        // Level 1: Input
    const passwordSuccessModal = document.getElementById('password-success-modal'); // Level 1: Succes
    const websiteModal = document.getElementById('website-modal');          // Level 2: Game
    const websiteSuccessModal = document.getElementById('website-success-modal');   // Level 2: Succes (NIEUW)
    const warningModal = document.getElementById('warning-modal');          // Karen waarschuwing
    const pasteWarningModal = document.getElementById('paste-warning-modal'); // Plak waarschuwing

    // Minigame 1 elementen (Password)
    const errorBox = document.getElementById('error-box');
    const passInput1 = document.getElementById('pass1');
    const passInput2 = document.getElementById('pass2');

    // Minigame 2 elementen (Website)
    let foundTypes = []; // Houdt bij welke types gevonden zijn
    let score = 0;       // Huidige score level 2

    // Status variabelen
    let currentSlide = 0;
    let currentLine = 0;        
    let isModalOpen = false;    

    // Locks (Zet ze op false om de speler te dwingen de game te spelen)
    let level1Unlocked = true; 
    let level2Unlocked = true; 


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
        ],
        // Slide 10 (Introductie Klant 3 - Nepnieuws)
        [
         "De rust keerde niet lang terug. Een man van middelbare leeftijd stond al in de deuropening.",
         "Hij hield zijn telefoon stevig vast en keek fronsend naar het schermpje.",
         "\"Bent u de detective?\" vroeg hij twijfelend. \"Ik heb het gevoel dat ik gek word van al die berichten.\"",
         "Hij stapte naar binnen, duidelijk op zoek naar duidelijkheid in de chaos."
        ],
        // Slide 11 (Het probleem: Nepnieuws vs Echt)
        [
            "De man, Mark, plofte neer in de stoel. \"Het gaat om het nieuws,\" begon hij.",
            "\"Op Facebook lees ik dat de aarde plat is, mijn buurman stuurt 'geheime onthullingen' over complotten...\"",
            "\"En gisteren deelde ik een artikel in de familie-app, waarna iedereen zei dat het 'fake' was. Maar het zag er zo professioneel uit!\"",
            "\"Hoe weet ik nou wat waar is? Kunt u me helpen het verschil te zien?\""
        ]
    ];

    // Start de pagina
    updateDialogue();
    updateUI(); 

    // ==========================================
    // 3. NAVIGATIE & DIALOOG LOGICA
    // ==========================================

    window.handleNext = function() {
        if (isModalOpen) return;

        if (currentLine < storyLines[currentSlide].length - 1) {
            currentLine++;
            updateDialogue();
        } else {
            changeSlide(1);
        }
    }

    window.handlePrev = function() {
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
        // LOCK 1: Password Game (Slide 4 -> 5)
        if (currentSlide === 3 && direction === 1 && !level1Unlocked) {
            return; 
        }

        // LOCK 2: Fake Website Game (Slide 8 -> 9)
        if (currentSlide === 7 && direction === 1 && !level2Unlocked) {
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
    // 5. MINIGAME & POPUP LOGICA (MODALS)
    // ==========================================

    window.openModal = function(gameType) {
        if (currentLine < storyLines[currentSlide].length - 1) {
            return;
        }

        isModalOpen = true;

        if (gameType === 'password') {
            passwordModal.style.display = 'flex';
            passInput1.value = ""; 
            passInput2.value = "";
            errorBox.style.display = 'none'; 
            passInput1.type = "password"; 
            passInput2.type = "password";

        } else if (gameType === 'website') {
            resetWebsiteGame(); 
            websiteModal.style.display = 'flex';
        }
    }

    window.closeModal = function() {
        passwordModal.style.display = 'none';
        websiteModal.style.display = 'none';
        passwordSuccessModal.style.display = 'none'; 
        websiteSuccessModal.style.display = 'none'; // Ook website succes sluiten
        isModalOpen = false;
    }

    window.closeWarning = function() {
        warningModal.style.display = 'none';
    }

    window.closePasteWarning = function() {
        pasteWarningModal.style.display = 'none';
    }

    // ==========================================
    // 6. LEVEL 1 LOGICA (PASSWORD)
    // ==========================================

    window.togglePassword = function(inputId, iconElement) {
        const input = document.getElementById(inputId);
        if (input.type === "password") {
            input.type = "text";
            iconElement.textContent = "🙈"; 
        } else {
            input.type = "password";
            iconElement.textContent = "👁️";
        }
    }

    window.checkPassword = function() {
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
            // GOED GEKEURD!
            passwordModal.style.display = 'none';
            passwordSuccessModal.style.display = 'flex';
        }
    }

    window.finishPasswordLevel = function() {
        passwordSuccessModal.style.display = 'none';
        isModalOpen = false;
        level1Unlocked = true;
        changeSlide(1); 
    }

    // ==========================================
    // 7. LEVEL 2 LOGICA (FAKE WEBSITE)
    // ==========================================

    window.checkFake = function(element, type) {
        
        // 1. Markeer het element ALTIJD als gevonden
        if (!element.classList.contains('found')) {
            element.classList.add('found');
        }

        // 2. Bepaal de uitleg tekst
        let explanation = "";
        switch(type) {
            case 'protocol':
                explanation = "De verbinding is niet veilig ('http' in plaats van 'https') en de browser waarschuwt hiervoor. Vul nooit gegevens in op zo'n site!";
                break;
            case 'domain':
                explanation = "Kijk goed naar het webadres. '.xyz' is een goedkope extensie die vaak door oplichters wordt gebruikt. Ook is de naam erg lang en generiek.";
                break;
            case 'urgency':
                explanation = "Dit heet 'nep-urgentie'. Oplichters gebruiken een aflopende klok om stress te creëren. Ze willen dat je stopt met kritisch nadenken en snel betaalt.";
                break;
            case 'grammar':
                explanation = "Je hebt een taalfout gevonden (zoals d/t-fouten of kromme zinnen). Professionele winkels hebben dit zelden.";
                break;
            case 'price':
                explanation = "De korting is verdacht. Hoge kortingen (30%+) op gloednieuwe producten zijn vaak te mooi om waar te zijn.";
                break;
             case 'trust':
                explanation = "Bedrijfsgegevens onderaan de pagina (zoals KVK nummers) zijn op nepsites vaak verzonnen of gestolen van andere bedrijven.";
                break;
        }

        const feedbackBox = document.getElementById('feedback-box');
        feedbackBox.style.display = 'block';

        // 3. Check of dit TYPE fout al eerder gevonden is
        if (foundTypes.includes(type)) {
            feedbackBox.innerText = "Dat klopt ook! Dit is dezelfde soort fout (" + type + ") als je al eerder vond. \n\n" + explanation;
        } else {
            foundTypes.push(type);
            score++;
            document.getElementById('score').innerText = score;
            feedbackBox.innerText = "Scherp gezien! " + explanation;
            
            // Win conditie: 6 unieke types
            if (score >= 6) {
                const btn = document.getElementById('finish-btn');
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
                btn.innerText = "Doorgaan (Level Gehaald)";
                
                feedbackBox.innerText += "\n\nFantastisch! Je hebt alle 6 de signalen gevonden en de fake website ontmaskerd.";
            }
        }
    }

    window.resetWebsiteGame = function() {
        score = 0;
        foundTypes = []; 
        document.getElementById('score').innerText = '0';
        document.getElementById('feedback-box').style.display = 'none';
        document.getElementById('finish-btn').disabled = true;
        document.getElementById('finish-btn').style.opacity = '0.5';
        document.getElementById('finish-btn').innerText = "Doorgaan (vind ze alle 6)";
        const foundElements = document.querySelectorAll('.fake-element.found');
        foundElements.forEach(el => el.classList.remove('found'));
    }

    // AANGEPAST: Sluit game, open success tips
    window.finishWebsiteGame = function() {
        websiteModal.style.display = 'none';
        websiteSuccessModal.style.display = 'flex';
    }

    // NIEUW: Echt afsluiten
    window.finishWebsiteLevel = function() {
        websiteSuccessModal.style.display = 'none';
        isModalOpen = false;
        level2Unlocked = true;
        changeSlide(1); // Ga naar slide 9
    }

    // ==========================================
    // 8. EVENTS & LISTENERS
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
            // Prioriteit voor overlays bovenop modals
            if (pasteWarningModal.style.display === 'flex') {
                closePasteWarning();
            } else if (warningModal.style.display === 'flex') {
                closeWarning();
            } else if (passwordSuccessModal.style.display === 'flex') {
                finishPasswordLevel();
            } else if (websiteSuccessModal.style.display === 'flex') {
                finishWebsiteLevel();
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

})();