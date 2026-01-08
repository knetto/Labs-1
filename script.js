(function() {
    // ==========================================
    // 1. VARIABELEN & SELECTIES
    // ==========================================

    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const dialogueText = document.getElementById('dialogue-text');

    // Modals
    const passwordModal = document.getElementById('password-modal');
    const passwordSuccessModal = document.getElementById('password-success-modal');
    const websiteModal = document.getElementById('website-modal');
    const websiteSuccessModal = document.getElementById('website-success-modal');
    const newsModal = document.getElementById('news-modal');
    const newsSuccessModal = document.getElementById('news-success-modal');

    const warningModal = document.getElementById('warning-modal');
    const pasteWarningModal = document.getElementById('paste-warning-modal');

    // Elements
    const errorBox = document.getElementById('error-box');
    const passInput1 = document.getElementById('pass1');
    const passInput2 = document.getElementById('pass2');

    // Scores
    let foundTypes = []; 
    let websiteScore = 0; 
    let newsScore = 0;
     // AANGEPAST: Variabele bovenin het script
     const totalFakeNews = 5; // Er zijn nu 5 fakes om te vinden

    // Status
    let currentSlide = 0;
    let currentLine = 0;        
    let isModalOpen = false;    

    // Locks
    let level1Unlocked = false; 
    let level2Unlocked = false; 
    let level3Unlocked = false; 


    // ==========================================
    // 2. HET VERHAAL
    // ==========================================
    const storyLines = [
        // Slide 1 (0)
        [
            "Cyber Detective Agency, maandagochtend. De koffie is nog warm.",
            "Mijn taak? Digitale mysteries oplossen en mensen online veilig houden.",
            "Mijn inbox is leeg... het lijkt er zowaar op dat het een rustige dag gaat worden."
        ],
        // Slide 2 (1)
        [
            "*Klingeling*... De deur gaat open.",
            "Sprak ik te vroeg? Een vrouw stapt aarzelend mijn kantoor binnen.",
            "Ze ziet eruit alsof ze digitaal de weg volledig kwijt is."
        ],
        // Slide 3 (2)
        [
            "\"Hoi, ik ben Karen,\" zegt ze zachtjes.",
            "\"Ik heb een probleem. Ik ben voor de zoveelste keer mijn wachtwoord vergeten!\"",
            "\"Mijn vorige was 'Flappie123', maar mijn neefje zei dat dat niet veilig is.\"",
            "\"Kun jij me alsjeblieft helpen een écht sterk wachtwoord te maken?\""
        ],
        // Slide 4 (3) - GAME 1
        [
            "Geen probleem, Karen. Laten we meteen naar je laptop kijken.",
            "We gaan een wachtwoord maken dat hackers onmogelijk kunnen raden.",
            "Denk eraan: gebruik geen namen, maar wel tekens en cijfers.",
            "Klik op de rode cirkel op het scherm om te starten!"
        ],
        // Slide 5 (4)
        [
            "\"Wauw, dat is een stuk veiliger! Bedankt, detective!\"",
            "Karen loopt opgelucht naar de deur. Haar data is weer veilig.",
            "\"Tot ziens, Karen! En onthoud: plak het niet op een geeltje onder je toetsenbord!\"",
            "Tijd voor weer een slok koffie... Wie is de volgende?"
        ],
        // Slide 6 (5)
        [
            "De deurklink was nog warm van Karen's vertrek toen de bel opnieuw ging.",
            "Een oudere man stapte binnen. Hij zag eruit alsof hij zojuist in een hele zure citroen had gebeten.",
            "Hij smeet bijna een stapel papieren op mijn bureau. \"Detective, ik ben bestolen!\""
        ],
        // Slide 7 (6)
        [
            "\"Gaat u zitten, meneer...?\" \"Jansen. Meneer Jansen! En ik ben woest.\"",
            "Hij hijgde even en vervolgde: \"Ik zat op TikTok en zag een advertentie voor een 'revolutionaire' nieuwe smartwatch. Spotgoedkoop!\"",
            "\"Ik heb direct betaald via die website. Dat is nu drie weken geleden. Er is nooit iets geleverd.\"",
            "\"Mijn kleindochter zei al dat het er verdacht uitzag. Ze had gelijk. Ik ben opgelicht, nietwaar?\""
        ],
        // Slide 8 (7) - GAME 2
        [
            "Laten we die 'revolutionaire' website eens nader bekijken op het scherm.",
            "Ik zie meteen al een paar rode vlaggen. Geen KvK-nummer, een vreemde URL, en taalfouten.",
            "Meneer Jansen, dit lijkt op een klassieke nep-webshop. We moeten de kenmerken identificeren.",
            "Klik op de rode cirkel op het scherm om het onderzoek naar deze site te starten."
        ],
        // Slide 9 (8)
        [
            "\"Ongelofelijk dat ik daar ingetrapt ben,\" zuchtte meneer Jansen toen we de bewijzen zagen.",
            "We hebben de frauduleuze site gerapporteerd. Hij krijgt zijn geld misschien niet terug, maar hij is nu wel wijzer.",
            "\"Onthoud meneer Jansen: als een aanbieding op social media te mooi lijkt om waar te zijn... dan is het dat ook.\"",
            "Hij knikte schuldbewust en vertrok. Weer een digitaal mysterie opgelost."
        ],
        // Slide 10 (9)
        [
            "De rust keerde niet lang terug. Een man van middelbare leeftijd stond al in de deuropening.",
            "Hij hield zijn telefoon stevig vast en keek fronsend naar het schermpje.",
            "\"Bent u de detective?\" vroeg hij twijfelend. \"Ik heb het gevoel dat ik gek word van al die berichten.\"",
            "Hij stapte naar binnen, duidelijk op zoek naar duidelijkheid in de chaos."
        ],
        // Slide 11 (10) - GAME 3
        [
            "De man, Mark, plofte neer in de stoel. \"Het gaat om het nieuws,\" begon hij.",
            "\"Op Facebook lees ik dat de aarde plat is... Ik deel per ongeluk nepnieuws in de familie-app en schaam me kapot.\"",
            "\"Kunt u me helpen mijn feed op te schonen?\"",
            "Klik op de rode cirkel op het scherm om de nepberichten te filteren."
        ],
        // Slide 12 (11) - EINDE
        [
            "Mark haalde opgelucht adem. \"Bedankt! Nu snap ik waar ik op moet letten.\"",
            "\"Geen clickbait meer voor mij. Ik ga bronnen checken voor ik iets deel.\"",
            "Drie klanten, drie mysteries opgelost. De stad is weer een stukje digitaal veiliger.",
            "EINDE VERHAAL."
        ]
    ];

    // Start
    updateDialogue();
    updateUI(); 

    // ==========================================
    // 3. NAVIGATIE
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
    // 4. LOCKS
    // ==========================================

    function changeSlide(direction) {
        if (currentSlide === 3 && direction === 1 && !level1Unlocked) return;
        if (currentSlide === 7 && direction === 1 && !level2Unlocked) return;
        if (currentSlide === 10 && direction === 1 && !level3Unlocked) return; // LOCK Level 3

        let newIndex = currentSlide + direction;
        if (newIndex < 0 || newIndex >= slides.length) return;

        slides[currentSlide].classList.remove('active');
        currentSlide = newIndex;
        slides[currentSlide].classList.add('active');

        if (direction === 1) currentLine = 0; 
        else currentLine = storyLines[currentSlide].length - 1;

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
    // 5. MODAL MANAGER
    // ==========================================

    window.openModal = function(gameType) {
        if (currentLine < storyLines[currentSlide].length - 1) return;

        isModalOpen = true;

        if (gameType === 'password') {
            passwordModal.style.display = 'flex';
            passInput1.value = ""; passInput2.value = ""; errorBox.style.display = 'none';
            passInput1.type = "password"; passInput2.type = "password";
        } else if (gameType === 'website') {
            resetWebsiteGame();
            websiteModal.style.display = 'flex';
        } else if (gameType === 'news') {
            resetNewsGame();
            newsModal.style.display = 'flex';
        }
    }

    window.closeModal = function() {
        passwordModal.style.display = 'none';
        passwordSuccessModal.style.display = 'none';
        
        websiteModal.style.display = 'none';
        websiteSuccessModal.style.display = 'none';
        
        newsModal.style.display = 'none';
        newsSuccessModal.style.display = 'none';
        
        isModalOpen = false;
    }

    window.closeWarning = function() { warningModal.style.display = 'none'; }
    window.closePasteWarning = function() { pasteWarningModal.style.display = 'none'; }

    // ==========================================
    // 6. GAME 1: PASSWORD
    // ==========================================
    // ... bestaande functies (togglePassword, checkPassword, finishPasswordLevel) ...
    window.togglePassword = function(id, icon) {
        const input = document.getElementById(id);
        if (input.type === "password") { input.type = "text"; icon.textContent = "🙈"; }
        else { input.type = "password"; icon.textContent = "👁️"; }
    }

    window.checkPassword = function() {
        const p1 = passInput1.value;
        const p2 = passInput2.value;
        let errors = [];
        
        // Simpele checks voor voorbeeld
        if (p1.toLowerCase().includes("karen")) { warningModal.style.display = 'flex'; return; }
        if (p1.length < 12) errors.push("Te kort (minimaal 12 tekens).");
        if (p1 !== p2) errors.push("Wachtwoorden niet gelijk.");

        if (errors.length > 0) {
            errorBox.style.display = 'block';
            errorBox.innerHTML = errors.join("<br>");
        } else {
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
    // 7. GAME 2: WEBSITE
    // ==========================================
    // ... bestaande functies (checkFake, resetWebsiteGame, finishWebsiteLevel) ...
    window.checkFake = function(element, type) {
        if (!element.classList.contains('found')) {
            element.classList.add('found');
        }
        const fb = document.getElementById('feedback-box');
        fb.style.display = 'block';
        
        if (foundTypes.includes(type)) {
            fb.innerText = "Die had je al! (Type: " + type + ")";
        } else {
            foundTypes.push(type);
            websiteScore++;
            document.getElementById('score').innerText = websiteScore;
            fb.innerText = "Goed gevonden! Dit is verdacht.";
            
            if (websiteScore >= 6) {
                const btn = document.getElementById('finish-btn');
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
                btn.innerText = "Doorgaan (Level Gehaald)";
            }
        }
    }

    window.resetWebsiteGame = function() {
        websiteScore = 0; foundTypes = [];
        document.getElementById('score').innerText = '0';
        document.getElementById('feedback-box').style.display = 'none';
        const btn = document.getElementById('finish-btn');
        btn.disabled = true; btn.style.opacity = '0.5';
        document.querySelectorAll('.fake-element.found').forEach(el => el.classList.remove('found'));
    }

    window.finishWebsiteGame = function() {
        websiteModal.style.display = 'none';
        websiteSuccessModal.style.display = 'flex';
    }

    window.finishWebsiteLevel = function() {
        websiteSuccessModal.style.display = 'none';
        isModalOpen = false;
        level2Unlocked = true;
        changeSlide(1);
    }






// ==========================================
    // 8. LEVEL 3 LOGICA: FAKE NEWS
    // ==========================================

    // AANGEPAST: checkNews functie
    window.checkNews = function(element, type, reason) {
        const feedbackBox = document.getElementById('news-feedback-box');
        
        // Als al gevonden of geklikt, stop
        if (element.classList.contains('found-fake') || element.classList.contains('checked-real')) return;
    
        if (type === 'fake') {
            // GOED: Het is nep
            element.classList.add('found-fake');
            newsScore++;
            document.getElementById('news-score').innerText = newsScore;
            
            feedbackBox.style.display = 'block';
            feedbackBox.style.background = '#e3f2fd'; // Lichtblauw
            feedbackBox.style.color = '#0d47a1'; // Donkerblauw
            feedbackBox.style.border = '1px solid #2196f3';
            
            // Specifieke uitleg per type nepnieuws
            let message = "<strong>Goed gezien! Dit is nep.</strong><br>";
            
            if (reason === 'roblox') {
                message += "Kijk goed naar de URL: er staat <b>http</b> in plaats van <b>https</b>. Dat betekent dat de verbinding niet veilig is. Officiële sites gebruiken altijd https (met een slotje).";
            } else if (reason === 'ai_fire') {
                message += "Dit is een <b>AI-gegenereerde</b> afbeelding. De Eiffeltoren is van smeedijzer en kan helemaal niet op deze manier branden! Check altijd betrouwbare bronnen (NOS, NU.nl); als dit echt was, stond het overal.";
            } else if (reason === 'xyz_crisis') {
                message += "Kijk naar het webadres: het eindigt op <b>.xyz</b>. Officiële banken gebruiken nooit dit soort goedkope domeinnamen. Dit is een poging tot paniekzaaierij.";
            } else if (reason === 'medical_hair') {
                message += "Als iets te mooi klinkt om waar te zijn ('haar groeit terug in 3 dagen'), is het dat ook. Medische wondermiddelen bestaan niet op het internet.";
            } else if (reason === 'iphone_scam') {
                message += "Je wint nooit zomaar een dure iPhone door een webpagina te bezoeken. Dit is een klassieke truc om je gegevens te stelen.";
            }
            
            feedbackBox.innerHTML = message;
    
            // Check Win Conditie (5 items)
            if (newsScore >= 5) { // Aangepast naar 5
                const btn = document.getElementById('news-finish-btn');
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
                btn.innerText = "Doorgaan (Level Gehaald)";
                feedbackBox.innerHTML += "<br><br><strong>🎉 Geweldig! Je hebt alle 5 de nepberichten en scams eruit gevist.</strong>";
                feedbackBox.style.background = '#d1f2eb'; // Feestelijk groen
                feedbackBox.style.color = '#117a65';
                feedbackBox.style.border = '1px solid #2ecc71';
            }
    
        } else {
            // FOUT: Het is echt nieuws
            element.classList.add('checked-real'); // Maak groen
            feedbackBox.style.display = 'block';
            feedbackBox.style.background = '#ffebee'; // Rood achtig
            feedbackBox.style.color = '#c62828';
            feedbackBox.style.border = '1px solid #ef5350';
            
            feedbackBox.innerHTML = "<strong>Dit bericht is waarschijnlijk echt.</strong><br>Het komt van een normale bron en bevat geen vreemde URL's, spelfouten of 'te mooie' beloftes. Het kan 'saai' nieuws zijn, maar dat maakt het nog niet nep!";
            
            // Haal de groene kleur na 1.5 seconde weer weg
            setTimeout(() => {
                element.classList.remove('checked-real');
            }, 1500);
        }
    }

    window.resetNewsGame = function() {
        newsScore = 0;
        document.getElementById('news-score').innerText = '0';
        document.getElementById('news-feedback-box').style.display = 'none';
        
        const btn = document.getElementById('news-finish-btn');
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.innerText = "Doorgaan (Vind er 5)";

        const cards = document.querySelectorAll('.news-card');
        cards.forEach(c => {
            c.classList.remove('found-fake');
            c.classList.remove('checked-real');
        });
    }
    // ... rest van de finish functies blijven hetzelfde ...

    window.finishNewsGame = function() {
        newsModal.style.display = 'none';
        newsSuccessModal.style.display = 'flex';
    }

    window.finishNewsLevel = function() {
        newsSuccessModal.style.display = 'none';
        isModalOpen = false;
        level3Unlocked = true; // UNLOCK
        changeSlide(1); 
    }









    

    // ==========================================
    // 9. EVENTS
    // ==========================================
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (pasteWarningModal.style.display === 'flex') closePasteWarning();
            else if (warningModal.style.display === 'flex') closeWarning();
            else if (passwordSuccessModal.style.display === 'flex') finishPasswordLevel();
            else if (websiteSuccessModal.style.display === 'flex') finishWebsiteLevel();
            else if (newsSuccessModal.style.display === 'flex') finishNewsLevel();
            else if (isModalOpen) closeModal();
            return;
        }
        if (!isModalOpen) {
            if (event.key === 'ArrowRight') handleNext();
            if (event.key === 'ArrowLeft') handlePrev();
        }
    });

})();