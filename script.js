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

    // Nieuwe modals voor AI game (kun je later koppelen)
    // const aiModal = document.getElementById('ai-modal'); 
    
    const warningModal = document.getElementById('warning-modal');
    const pasteWarningModal = document.getElementById('paste-warning-modal');

    // Elements
    const errorBox = document.getElementById('error-box');
    const passInput1 = document.getElementById('pass1');
    const passInput2 = document.getElementById('pass2');

    // Scores
    let foundTypes = []; 
    let newsScore = 0;

    // Status
    let currentSlide = 0;
    let currentLine = 0;        
    let isModalOpen = false;    

    // Locks
    let level1Unlocked = false; 
    let level2Unlocked = false; 
    let level3Unlocked = false; 
    let level4Unlocked = false;
    let level5Unlocked = false;

    // Minigame 5 variabelen
    let phishingScore = 0;
    let foundPhishing = [];


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
        // Slide 12 (11)
        [
            "Mark haalde opgelucht adem. \"Bedankt! Nu snap ik waar ik op moet letten.\"",
            "\"Geen clickbait meer voor mij. Ik ga bronnen checken voor ik iets deel.\"",
            "Drie klanten, drie mysteries opgelost. De stad is weer een stukje digitaal veiliger."
        ],
        // Slide 13 (12) - NIEUWE KLANT
        [
            "Mark was nog maar net de deur uit of er klopte alweer iemand aan.",
            "Een jonge gozer, petje diep over zijn ogen getrokken, slenterde naar binnen.",
            "Hij plofte neer en zag eruit alsof zijn hart zojuist digitaal gebroken was.",
            "\"Ben jij de detective? Ik heb een... nogal gênant probleem.\""
        ],
        // Slide 14 (13) - PROBLEEM UITLEGGEN
        [
            "\"Ik dacht dat ik de liefde van mijn leven had gevonden,\" begon hij zachtjes.",
            "\"Sophie. Ze was prachtig, grappig... perfect. We appten wekenlang via die dating app.\"",
            "\"Maar elke keer als ik wilde videobellen, was haar camera 'stuk'. Gisteren kwam ik erachter...\"",
            "\"Sophie bestaat niet. Haar foto's waren nep. Het was een AI-gegenereerd profiel. Ik ben gecatfished.\""
        ],
        // Slide 15 (14) - GAME 4 TRIGGER
        [
            "\"Dat is balen, jongen. Maar je bent niet de enige. AI-afbeeldingen worden steeds realistischer.\"",
            "\"Toch maken ze foutjes. Handen met zes vingers, vreemde wazige achtergronden of perfecte symmetrie.\"",
            "\"Laten we kijken of we samen de AI-fouten kunnen spotten, zodat je dit in de toekomst herkent.\"",
            "Klik op de rode cirkel op het scherm om de AI-training te starten."
        ],
        // Slide 16 (15)
        [
            "\"Ik voel me nog steeds stom, maar nu weet ik tenminste waar ik op moet letten,\" zei hij bij het weggaan.",
            "\"Geen nep-profielen meer voor mij. Ik ga weer echte mensen ontmoeten in de echte wereld.\"",
            "Vier zaken opgelost. Mijn koffie is koud, maar de stad is veilig."
        ],
        // Slide 17 (16) - EINDE VERHAAL (NIEUWE KLANT)
        [
            "Ik wilde net het bordje 'gesloten' omdraaien, toen de deur met een zwaai openvloog.",
            "Een jonge vrouw stormde in paniek binnen, haar telefoon stevig in haar hand geklemd.",
            "Ze trilde over haar hele lijf. \"Alsjeblieft, zeg dat je me kunt helpen! Mijn hele leven staat op dat account!\""
        ],
        // Slide 18 (17) - EINDE VERHAAL (PROBLEEM)
        [
            "\"Ga rustig zitten,\" zei ik kalmerend. \"Vertel me wat er is gebeurd.\"",
            "\"Ik kreeg een DM van mijn beste vriendin via Instagram,\" snikte ze. \"Ze deed mee aan een modeshow-wedstrijd.\"",
            "\"Ze vroeg of ik via een linkje op haar wilde stemmen. Ik logde in om te helpen... en toen werd ik eruit gegooid. Alles weg!\""
        ],
        // Slide 19 (18) - EINDE VERHAAL (GAME TRIGGER)
        [
            "Ik nam haar telefoon aan. \"Dit is een klassieke truc. Je bent 'gephisht'. Dat bericht kwam niet van je vriendin.\"",
            "\"Hackers nemen accounts over en sturen dit soort nep-links naar alle contacten. We moeten leren de signalen te herkennen.\"",
            "\"Kijk goed naar de URL en de taal. Laten we kijken of we de nepperts eruit kunnen vissen.\"",
            "Klik op de rode cirkel op het scherm om de phishing-test te starten."
        ],
        // Slide 20 (19) - EINDE VERHAAL (AFSLUITING)
        [
            "\"Je hebt gelijk, de link zag er eigenlijk heel raar uit,\" gaf ze toe na de uitleg.",
            "Ze heeft direct contact opgenomen met support en 2FA aangezet. \"Bedankt detective, ik trap er nooit meer in!\"",
            "Ze zwaaide en liep de deur uit. Vijf zaken, vijf lessen. De stad is weer een stukje veiliger."
        ],
        // Slide 21 (20) - EINDE VERHAAL (RELAXEN)
        [
            "Met een diepe, hoorbare zucht zak ik onderuit. Mijn voeten vinden de rand van het bureau. \"Zo, dat was 'm dan...\"",
            "De laatste zaak is gesloten, de inbox is leeg. De digitale wereld is voor even weer een stukje veiliger.",
            "Ik sluit mijn ogen even. De vermoeidheid slaat toe. Tijd om af te sluiten."
        ],
        // Slide 22 (21) - EINDE VERHAAL (NAAR HUIS)
        [
            "Ik pak mijn laptop, mijn trouwe partner in crime, en loop naar de uitgang. Nog één blik over mijn schouder naar mijn kantoor.",
            "Het was een lange, intensieve dag vol digitale gevaren. Maar we hebben ze verslagen.",
            "Ik trek de deur achter me dicht. Morgen weer een nieuwe dag. Slaap lekker, Cyber Detective Agency."
        ],
        // Slide 22 (21) - EINDE VERHAAL (NAAR HUIS)
        [
            "EINDE"
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
    // 4. LOCKS (AANGEPAST)
    // ==========================================

    function changeSlide(direction) {
        // Lock 1: Wachtwoord (Slide 4 is index 3)
        if (currentSlide === 3 && direction === 1 && !level1Unlocked) return;
        
        // Lock 2: Website (Slide 8 is index 7)
        if (currentSlide === 7 && direction === 1 && !level2Unlocked) return;
        
        // Lock 3: Nieuws (Slide 11 is index 10)
        if (currentSlide === 10 && direction === 1 && !level3Unlocked) return;

        // Lock 4: AI Game (Slide 15 is index 14)
        if (currentSlide === 14 && direction === 1 && !level4Unlocked) return; 

        // Lock 5: Phishing Game (Slide 19 is index 18) <--- NIEUW
        if (currentSlide === 18 && direction === 1 && !level5Unlocked) return;

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
            if (gameType === 'ai') {
                resetAIGame();
                document.getElementById('ai-modal').style.display = 'flex';
                isModalOpen = true;
            } else {
                // Roep de oude logica aan voor password/website/news
                // (Als je de code hierboven plakt in je script, moet je dit even netjes samenvoegen met je switch statement)
                // Hieronder hoe het eruit ziet als je het integreert in je BESTAANDE switch:
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
                } else if (gameType === 'phishing') { 
                    resetPhishingGame();
                    document.getElementById('phishing-modal').style.display = 'flex';
                 }
                isModalOpen = true;
            }
        }

    window.closeModal = function() {
        passwordModal.style.display = 'none';
        passwordSuccessModal.style.display = 'none';
        
        websiteModal.style.display = 'none';
        websiteSuccessModal.style.display = 'none';
        
        newsModal.style.display = 'none';
        newsSuccessModal.style.display = 'none';

        document.getElementById('phishing-modal').style.display = 'none';
        document.getElementById('phishing-success-modal').style.display = 'none';
        
        isModalOpen = false;
    }

    window.closeWarning = function() { warningModal.style.display = 'none'; }
    window.closePasteWarning = function() { pasteWarningModal.style.display = 'none'; }

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

    const handlePasteWarning = function(e) {
        e.preventDefault(); // Zorgt dat de tekst NIET geplakt wordt
        document.getElementById('paste-warning-modal').style.display = 'flex'; // Toont de popup
    }

    // 2. Koppel dit ALLEEN aan het tweede veld (bevestigen)
    if (passInput2) {
        passInput2.addEventListener('paste', handlePasteWarning);
    }

    window.checkPassword = function() {
        const p1 = passInput1.value;
        const p2 = passInput2.value;
        let errors = [];

        const forbiddenSequences = ["01234567890", "09876543210", "abcdefghijklmnopqrstuvwxyz", "qwertyuiop", "asdfghjkl", "zxcvbnm"];
        const commonWeakWords = ["welkom", "wachtwoord", "password", "geheim", "admin", "login", "flappie", "hallo", "voetbal", "123456"];

        // Karen check
        if (p1.toLowerCase().includes("karen")) {
            warningModal.style.display = 'flex';
            return; 
        }

        // Zwakke woorden check
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

        // Eisen check
        if (p1.length < 12) errors.push("Te kort (minimaal 12 tekens nodig).");
        if (!/[A-Z]/.test(p1)) errors.push("Voeg een Hoofdletter toe.");
        if (!/[0-9]/.test(p1)) errors.push("Voeg een cijfer toe.");
        if (!/[^a-zA-Z0-9]/.test(p1)) errors.push("Voeg een leesteken toe.");
        
        // Patronen check
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

        // Gelijkheid check
        if (p1 !== p2) {
            errors.push("De wachtwoorden zijn niet gelijk.");
        } else if (p1.length > 0 && p2.length === 0) {
            errors.push("Vul het wachtwoord ook in bij bevestiging.");
        }

        // Resultaat verwerking
        if (errors.length > 0) {
            errorBox.style.display = 'block';
            let html = "<strong>Let op:</strong><ul>";
            errors.forEach(err => html += "<li>" + err + "</li>");
            html += "</ul>";
            errorBox.innerHTML = html;
        } else {
            // GOED GEKEURD! 
            // 1. Verberg invoer modal
            passwordModal.style.display = 'none';
            // 2. Toon succes modal met tips
            passwordSuccessModal.style.display = 'flex';
            
            // We gaan nog NIET naar de volgende slide, dat doet de knop in de succes modal.
        }
    }

    // Aangeroepen door de knop in de succes-modal
    window.finishPasswordLevel = function() {
        passwordSuccessModal.style.display = 'none';
        isModalOpen = false;
        level1Unlocked = true;
        changeSlide(1); // Ga naar slide 5
    }

    // ==========================================
    // 7. LEVEL 2 LOGICA (FAKE WEBSITE)
    // ==========================================

    window.checkFake = function(element, type) {
        // --- ANTI SPAM CHECK ---
        if (checkSpamProtection()) return; 
        
        // 1. Markeer het element ALTIJD als gevonden (visueel rood)
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
            // TYPE AL GEVONDEN: Geen punten erbij, wel uitleg tonen
            feedbackBox.innerText = "Dat klopt ook! Dit is dezelfde soort fout (" + type + ") als je al eerder vond. \n\n" + explanation;
        } else {
            // NIEUW TYPE: Punten erbij!
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

    // Reset functie voor level 2
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

    window.finishWebsiteGame = function() {
        websiteModal.style.display = 'none';
        isModalOpen = false;
        level2Unlocked = true;
        changeSlide(1); // Ga naar slide 9
    }


    // ==========================================
    // 8. LEVEL 3 LOGICA: FAKE NEWS
    // ==========================================

    window.checkNews = function(element, type, reason) {
        // --- ANTI SPAM CHECK ---
        if (checkSpamProtection()) return;

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

        const cards = document.querySelectorAll('.news-tile');
        cards.forEach(c => {
            c.classList.remove('found-fake');
            c.classList.remove('checked-real');
        });
    }
    
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
            else if (document.getElementById('anti-cheat-modal').style.display === 'flex') closeAntiCheat();
            else if (isModalOpen) closeModal();
            return;
        }
        if (!isModalOpen) {
            if (event.key === 'ArrowRight') handleNext();
            if (event.key === 'ArrowLeft') handlePrev();
        }
    });

    // ==========================================
    // 10. ANTI-SPAM BEVEILIGING
    // ==========================================

    let spamClickCount = 0;
    let lastClickTimestamp = 0;
    const SPAM_THRESHOLD_MS = 600; // Als je sneller klikt dan 0.6 seconde
    const MAX_SPAM_CLICKS = 3;     // Na 3 snelle klikken grijpen we in

    window.closeAntiCheat = function() {
        document.getElementById('anti-cheat-modal').style.display = 'none';
        spamClickCount = 0; // Reset de teller
    }

    // Deze functie wordt aangeroepen bij elke klik in de games
    window.checkSpamProtection = function() {
        const now = Date.now();
        
        // Als het verschil tussen nu en de vorige klik heel klein is
        if (now - lastClickTimestamp < SPAM_THRESHOLD_MS) {
            spamClickCount++;
        } else {
            // Als de leerling even wacht, resetten we de teller (braaf gedrag)
            spamClickCount = 0; 
        }

        lastClickTimestamp = now;

        // Als ze te vaak snel achter elkaar klikken
        if (spamClickCount >= MAX_SPAM_CLICKS) {
            document.getElementById('anti-cheat-modal').style.display = 'flex';
            spamClickCount = 0; // Reset om te voorkomen dat hij blijft hangen
            return true; // We geven 'true' terug: JA, er is gespamad
        }

        return false; // Nee, veilig
    }

    // Voor Game 2 (Website) - Vangt klikken op de achtergrond op
    window.trackGlobalSpam = function() {
        // We voeren alleen de check uit, we doen verder niets met de klik
        checkSpamProtection();
    }
    
    // ==========================================
    // 11. DEBUG / CHEAT FUNCTIE (Backtick `)
    // ==========================================
    
    let cheatStep = 0;

    document.addEventListener('keydown', function(event) {
        // Controleer op de backtick toets (`), soms ook 'Backquote' genoemd
        if (event.key === '`' || event.code === 'Backquote') {
            
            cheatStep++;
            console.log("Cheat activated: Step " + cheatStep);

            // Sluit eerst alle modals als die open staan
            if (isModalOpen) closeModal();
            if (document.getElementById('anti-cheat-modal').style.display === 'flex') closeAntiCheat();

            // Verwijder huidige actieve slide class
            slides[currentSlide].classList.remove('active');

            if (cheatStep === 1) {
                // LEVEL 1 COMPLETED
                level1Unlocked = true;
                currentSlide = 5; // Spring naar slide na password game
                alert("👨‍💻 Cheat: Level 1 (Wachtwoord) voltooid!");
            } 
            else if (cheatStep === 2) {
                // LEVEL 2 COMPLETED
                level2Unlocked = true;
                currentSlide = 9; // Spring naar slide na website game
                alert("👨‍💻 Cheat: Level 2 (Website) voltooid!");
            } 
            else if (cheatStep === 3) {
                // LEVEL 3 COMPLETED
                level3Unlocked = true;
                currentSlide = 12; // Spring naar het einde
                alert("👨‍💻 Cheat: Level 3 (Nieuws) voltooid!");
            }
            else if (cheatStep === 4) {
                // LEVEL 4 COMPLETED
                level4Unlocked = true;
                currentSlide = 15; // Spring naar het einde
                alert("👨‍💻 Cheat: Level 4 (Nieuws) voltooid!");
            }
            else if (cheatStep === 5) {
                // LEVEL 5 COMPLETED
                level4Unlocked = true;
                currentSlide = 19; // Spring naar het einde
                alert("👨‍💻 Cheat: Level 5 (Nieuws) voltooid!");
            }

            // Update de UI naar de nieuwe slide
            slides[currentSlide].classList.add('active');
            currentLine = 0;
            updateDialogue();
            updateUI();
        }
    });

// ==========================================
    // 12. GAME 4 LOGICA: AI DETECTIE
    // ==========================================

    // Deel 1: Makkelijk (Links vs Rechts)
    const aiPart1 = [
        { 
            real: "img/ai/1-real.jpeg", ai: "img/ai/1-fake.jpeg", aiSide: 'left', 
            feedback: "Focus op de details: de tanden lijken één massief blok." 
        },
        { 
            real: "img/ai/2-real.jpeg", ai: "img/ai/2-fake.jpeg", aiSide: 'right', 
            feedback: "Kijk goed naar de haarlijn. De overgang is te abrupt." 
        },
        { 
            real: "img/ai/3-real.jpeg", ai: "img/ai/3-fake.jpeg", aiSide: 'right', 
            feedback: "De achtergrond is een onlogische wazige vlek." 
        },
        { 
            real: "img/ai/4-real.jpeg", ai: "img/ai/4-fake.jpeg", aiSide: 'left', 
            feedback: "Zoom in op het haar rechtsonder; de haarpunten vervagen vreemd." 
        },
        { 
            real: "img/ai/5-real.jpeg", ai: "img/ai/5-fake.jpeg", aiSide: 'left', 
            feedback: "De stof bij de kraag loopt niet logisch door." 
        },
        { 
            real: "img/ai/6-real.jpeg", ai: "img/ai/6-fake.jpeg", aiSide: 'right', 
            feedback: "De textuur bovenop het hoofd lijkt op plastic." 
        },
        { 
            real: "img/ai/7-real.jpeg", ai: "img/ai/7-fake.jpeg", aiSide: 'left', 
            feedback: "De brilmontuur verdwijnt in het niets achter het oor." 
        },
        { 
            real: "img/ai/8-real.jpeg", ai: "img/ai/8-fake.jpeg", aiSide: 'right', 
            feedback: "De oorbellen zijn ongelijk (niet symmetrisch)." 
        },
        { 
            real: "img/ai/9-real.jpeg", ai: "img/ai/9-fake.jpeg", aiSide: 'left', 
            feedback: "De anatomie van het oor klopt niet (vreemde vouwen)." 
        },
        { 
            real: "img/ai/10-real.jpeg", ai: "img/ai/10-fake.jpeg", aiSide: 'right', 
            feedback: "Klassieke fout: de hand heeft een vreemde vorm/vingers." 
        },
        { 
            real: "img/ai/11-real.jpeg", ai: "img/ai/11-fake.jpeg", aiSide: 'left', 
            feedback: "Het brilpootje gaat dwars door de huid heen." 
        },
        { 
            real: "img/ai/12-real.jpeg", ai: "img/ai/12-fake.jpeg", aiSide: 'right', 
            feedback: "Het oor ziet er vervormd en 'gesmolten' uit." 
        }
    ];

    // Deel 2: Expert (Met antwoord plaatje)
    const aiPart2 = [
        { 
            real: "img/ai2/real1.png", ai: "img/ai2/fake1.png", 
            answer: "img/ai2/1antwoord.jpg", aiSide: 'left',
            feedback: "Kijk naar de cirkels: Hier is de AI de mist in gegaan." 
        },
        { 
            real: "img/ai2/real2.png", ai: "img/ai2/fake2.png", 
            answer: "img/ai2/2antwoord.jpg", aiSide: 'right',
            feedback: "Kijk naar de cirkels: Hier is de AI de mist in gegaan." 
        },
        { 
            real: "img/ai2/real3.png", ai: "img/ai2/fake3.png", 
            answer: "img/ai2/3antwoord.jpg", aiSide: 'left',
            feedback: "Kijk naar de cirkels: Hier is de AI de mist in gegaan." 
        },
        { 
            real: "img/ai2/real4.jpeg", ai: "img/ai2/fake4.jpeg", 
            answer: "img/ai2/4antwoord.jpg", aiSide: 'right',
            feedback: "Kijk naar de cirkels: Hier is de AI de mist in gegaan." 
        },
        { 
            real: "img/ai2/real5.jpeg", ai: "img/ai2/fake5.jpeg", 
            answer: "img/ai2/5antwoord.jpg", aiSide: 'left',
            feedback: "Kijk naar de cirkels: Hier is de AI de mist in gegaan." 
        }
    ];

    // Status Variabelen
    let currentPart = 1;      
    let currentAIRound = 0;   
    let aiProcessing = false; 

    // --- 2. START / RESET ---
    window.resetAIGame = function() {
        currentPart = 1;
        currentAIRound = 0;
        aiProcessing = false;
        
        // Reset UI
        document.getElementById('ai-title').innerText = "AI of Echt?";
        document.getElementById('ai-title').style.color = "#fff";
        document.getElementById('ai-level-indicator').style.display = "none";
        
        document.getElementById('ai-feedback-box').style.display = 'none';
        document.getElementById('ai-finish-btn').style.display = 'none';
        document.getElementById('ai-next-btn').style.display = 'none';
        
        // Zorg dat de view goed staat (Game zichtbaar, Expert view verborgen)
        document.getElementById('ai-game-view').style.display = 'flex';
        document.getElementById('ai-expert-view').style.display = 'none';
        
        loadAIRound();
    }

    // --- 3. LOAD ROUND ---
    function loadAIRound() {
        const data = (currentPart === 1) ? aiPart1[currentAIRound] : aiPart2[currentAIRound];
        
        // Update ronde teller
        const total = (currentPart === 1) ? aiPart1.length : aiPart2.length;
        document.getElementById('ai-round').innerText = (currentAIRound + 1) + "/" + total;
        
        // Elementen
        const leftImg = document.getElementById('img-left');
        const rightImg = document.getElementById('img-right');
        const leftBox = document.getElementById('ai-option-left');
        const rightBox = document.getElementById('ai-option-right');

        // Reset
        leftBox.className = 'ai-option';
        rightBox.className = 'ai-option';
        document.getElementById('ai-feedback-box').style.display = 'none';
        document.getElementById('ai-next-btn').style.display = 'none'; // Verberg knop bij start ronde

        // Zet afbeeldingen
        if (data.aiSide === 'left') {
            leftImg.src = data.ai;
            rightImg.src = data.real;
        } else {
            leftImg.src = data.real;
            rightImg.src = data.ai;
        }
    }

// --- 4. CHECK ANSWER ---
window.checkAI = function(side) {
    if (aiProcessing) return;
    
    const currentList = (currentPart === 1) ? aiPart1 : aiPart2;
    if (currentAIRound >= currentList.length) return;

    aiProcessing = true;
    const data = currentList[currentAIRound];
    
    const feedbackBox = document.getElementById('ai-feedback-box');
    const chosenBox = document.getElementById('ai-option-' + side);
    const aiBox = document.getElementById('ai-option-' + data.aiSide);

    // Feedback tonen (Goed/Fout)
    if (side === data.aiSide) {
        chosenBox.classList.add('correct-choice');
        feedbackBox.style.display = 'block';
        feedbackBox.style.background = '#d4edda';
        feedbackBox.style.color = '#155724';
        feedbackBox.innerHTML = "<strong>Goed gezien!</strong> " + data.feedback;
    } else {
        chosenBox.classList.add('wrong-choice');
        aiBox.classList.add('correct-choice'); 
        feedbackBox.style.display = 'block';
        feedbackBox.style.background = '#f8d7da';
        feedbackBox.style.color = '#721c24';
        feedbackBox.innerHTML = "<strong>Helaas.</strong> De andere was AI.<br>" + data.feedback;
    }

    // --- AANGEPASTE LOGICA: ALTIJD WACHTEN OP KNOP ---

    // Toon ALTIJD de volgende knop (zowel bij Part 1 als Part 2)
    // We gebruiken een kleine vertraging zodat de gebruiker eerst ziet wat hij klikt
    setTimeout(function() {
        document.getElementById('ai-next-btn').style.display = 'inline-block';
    }, 500);

    
    if (currentPart === 1) {
        // PART 1: We doen NIETS speciaals. 
        // We laten de plaatjes staan (zodat ze de rode/groene randen zien).
        // De gebruiker moet nu zelf op "Volgende" klikken.
    } 
    else {
        // PART 2 (EXPERT): Hier wisselen we wel van weergave naar het bewijsplaatje
        setTimeout(function() {
            // 1. Verberg de Link/Rechts game
            document.getElementById('ai-game-view').style.display = 'none';
            
            // 2. Toon de Expert View met de antwoordfoto
            const expertView = document.getElementById('ai-expert-view');
            const expertImg = document.getElementById('ai-expert-img');
            
            expertImg.src = data.answer; 
            expertView.style.display = 'flex';
            
        }, 1000); // Korte wacht voor effect
    }
}

// --- 5. NEXT ROUND LOGICA ---

// NIEUWE FUNCTIE: Werkt voor zowel Part 1 als Part 2
window.nextAIRoundHandler = function() {
    const currentList = (currentPart === 1) ? aiPart1 : aiPart2;
    nextLogic(currentList);
}

// Deze functie wordt aangeroepen door de handler hierboven
function nextLogic(currentList) {
    currentAIRound++;
    
    // Reset Views voor de volgende ronde
    // Dit is belangrijk: we moeten zeker weten dat de game-view weer zichtbaar is
    // en de expert-view weg is, ongeacht welk level we spelen.
    document.getElementById('ai-game-view').style.display = 'flex';
    document.getElementById('ai-expert-view').style.display = 'none';
    document.getElementById('ai-next-btn').style.display = 'none';

    if (currentAIRound < currentList.length) {
        loadAIRound();
        aiProcessing = false;
    } else {
        // Lijst is klaar
        if (currentPart === 1) {
            startPart2();
        } else {
            gameFinished();
        }
    }
}

    // Functie voor de knop in HTML:
    window.nextExpertRound = function() {
        nextLogic(aiPart2);
    }

    // --- OVERGANG & EINDE ---

    function startPart2() {
        currentPart = 2;
        currentAIRound = 0;
        
        const title = document.getElementById('ai-title');
        title.innerText = "LEVEL 2: HARD MODE";
        title.style.color = "#ff4444"; 
        
        document.getElementById('ai-level-indicator').style.display = "inline-block";
        
        const fb = document.getElementById('ai-feedback-box');
        fb.style.display = 'block';
        fb.style.background = '#333';
        fb.style.color = '#fff';
        fb.innerHTML = "<strong>Gefeliciteerd!</strong> Je hebt de basis gehad.<br>Nu wordt het moeilijk. Na elk antwoord zie je het bewijs.";
        
        setTimeout(function() {
            loadAIRound();
            aiProcessing = false;
        }, 3500);
    }

    function gameFinished() {
        document.getElementById('ai-round').innerText = "VOLTOOID";
        
        // Verberg alles behalve feedback en finish knop
        document.getElementById('ai-game-view').style.display = 'none';
        document.getElementById('ai-expert-view').style.display = 'none';
        
        const fb = document.getElementById('ai-feedback-box');
        fb.style.display = 'block';
        fb.innerHTML = "<strong>Training Voltooid!</strong> Je bent nu een echte AI-expert.";
        fb.style.background = '#cce5ff';
        fb.style.color = '#004085';
        
        const btn = document.getElementById('ai-finish-btn');
        btn.style.display = 'inline-block';
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
    }
    
            
        // 6. Afronden en Level 4 Unlocken
        window.finishAIGame = function() {
            // Sluit game modal
            document.getElementById('ai-modal').style.display = 'none';
            // Open succes modal
            document.getElementById('ai-success-modal').style.display = 'flex';
        }
    
        window.finishAILevel = function() {
            // Sluit succes modal
            document.getElementById('ai-success-modal').style.display = 'none';
            isModalOpen = false;
    
            // *** DE BELANGRIJKE LOCK LOGICA ***
            level4Unlocked = true; // Zet lock open
            changeSlide(1);        // Ga nu pas naar slide 16
        }




// ==========================================
    // 13. GAME 5 LOGICA: PHISHING (FULL INBOX)
    // ==========================================

    // ==========================================
    // NIEUWE DATABASE MET REALISTISCHE CHATS
    // ==========================================
    const chatDatabase = [
        // --- SCAM 1: De "Stem op mij" truc (Sophie) ---
        {
            id: 'scam1',
            type: 'scam',
            name: 'Sophie_x_Dance',
            avatar: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)', 
            preview: 'De stemming sluit bijna! 😱',
            solved: false,
            messages: [
                { text: "Dinsdag 14:23", type: 'timestamp' },
                { text: "Heeii! Lang niet gesproken! Hoe is het? ❤️", sender: 'them', type: 'safe', feedback: "Beetje slijmen vooraf..." },
                { text: "Hey Soph! Ja goed hoor, met jou?", sender: 'me' }, 
                
                { text: "Ja super! Ik zit in de finale van een modellenwedstrijd! 📸", sender: 'them', type: 'safe', feedback: "Klinkt leuk, maar blijf scherp." },
                { text: "Oh vet! Gefeliciteerd!", sender: 'me' },

                { text: "Thnx! Maar ik heb echt een mega gunst nodig... Wil je op me stemmen?", sender: 'them', type: 'safe', feedback: "Nu komt de vraag." },
                { text: "Tuurlijk, stuur maar.", sender: 'me' }, 

                { text: "Vandaag 10:41", type: 'timestamp' },
                { text: "Je bent een held! Ik heb nog 5 stemmen nodig voor een contract!", sender: 'them', type: 'scam', reason: "grammar", feedback: "Verdacht: Ze zetten druk op je ('nog maar 5 nodig') om je medelijden te wekken." },
                { text: "Het sluit over 10 minuutjes dus doe snel!! 🙏", sender: 'them', type: 'scam', reason: "urgency", feedback: "Urgentie: 'Doe snel' is bedoeld om je te laten klikken zonder na te denken." },
                { text: "De link is: http://instagram-model-vote.xyz/sophie", sender: 'them', type: 'scam', reason: "link", feedback: "Kijk naar de link! '.xyz' is geen Instagram. Als je hier inlogt, stelen ze je wachtwoord." }
            ]
        },

        // --- REAL 1: De ECHTE Roblox speler (Jens) ---
        {
            id: 'real1',
            type: 'real',
            name: 'Jens_Gamer',
            avatar: 'green', 
            preview: 'Nieuwe update is live!',
            messages: [
                { text: "Gisteren 20:00", type: 'timestamp' },
                { text: "Yo, ben je online?", sender: 'them', type: 'safe', feedback: "Jens speelt dit spel altijd met je." },
                { text: "Yes, ik start nu op.", sender: 'me' },
                { text: "Die nieuwe obby is eindelijk uit.", sender: 'them', type: 'safe', feedback: "Normaal game-praatje." },
                { text: "Ik zit al in de server, kom je?", sender: 'them', type: 'safe', feedback: "Geen dwang, gewoon een vraag." },
                { text: "Is goed, stuur link.", sender: 'me' },
                { text: "Hier: https://www.roblox.com/games/99242", sender: 'them', type: 'tricky', feedback: "Scherp! Dit is de échte site (roblox.com) met https:// en een slotje. Dit is veilig." }
            ]
        },

        // --- REAL 2: Vriendin over kleding ---
        {
            id: 'real3',
            type: 'real',
            name: 'Lisa.K',
            avatar: 'pink',
            preview: 'Heb jij die hoodie al?',
            messages: [
                { text: "Vandaag 12:30", type: 'timestamp' },
                { text: "Hee, is jouw bestelling van Zalando al binnen?", sender: 'them', type: 'safe', feedback: "Gewoon een vriendin die iets vraagt." },
                { text: "Nog niet, komt morgen denk ik.", sender: 'me' },
                { text: "De mijne kwam net, maar hij is echt veel te groot :(", sender: 'them', type: 'safe', feedback: "Balen voor haar, maar geen scam." },
                { text: "Ah dat is kut. Welke had je?", sender: 'me' },
                { text: "Kijk deze bedoelde ik:", sender: 'them', type: 'safe', feedback: "Ze stuurt een voorbeeld." },
                { text: "https://www.zalando.nl/hoodie-black-123", sender: 'them', type: 'tricky', feedback: "Dit is een link naar een echte webshop (zalando.nl). Niets mis mee." }
            ]
        },

        // --- REAL 3: Moeder ---
        {
            id: 'real2',
            type: 'real',
            name: 'Mama',
            avatar: 'purple',
            preview: 'Vergeet je fietssleutel niet!',
            messages: [
                { text: "Vandaag 08:15", type: 'timestamp' },
                { text: "Hoi lieverd, hoe laat ben je thuis?", sender: 'them', type: 'safe', feedback: "Gewoon je moeder." },
                { text: "Rond 4 uur, heb nog training.", sender: 'me' },
                { text: "Oké is goed. Opa en oma komen ook eten vanavond.", sender: 'them', type: 'safe', feedback: "Gezellig." },
                { text: "Vergeet je niet je fietssleutel mee te nemen als je weggaat?", sender: 'them', type: 'safe', feedback: "Bezorgde moeders zijn geen hackers 😉" }
            ]
        },

        // --- REAL 4: Groepsapp Klas ---
        {
            id: 'real4',
            type: 'real',
            name: 'Groep 8B - De Besten 🎓',
            avatar: 'orange',
            preview: 'Heeft iemand wiskunde af?',
            messages: [
                { text: "Gisteren 15:45", type: 'timestamp' },
                { text: "Jongens, wat moesten we doen voor Engels?", sender: 'them', type: 'safe', feedback: "Huiswerkvragen." },
                { text: "Woordjes blz 24 leren.", sender: 'them', type: 'safe', feedback: "Helaas, huiswerk is echt. Geen scam." },
                { text: "Pff geen zin innn", sender: 'me' }
            ]
        },

        // --- REAL 5: Voetbalteam ---
        {
            id: 'real5',
            type: 'real',
            name: 'Coach Mark',
            avatar: 'gray',
            preview: 'Zaterdag verzamelen om 08:30',
            messages: [
                { text: "Donderdag 19:00", type: 'timestamp' },
                { text: "Mannen, zaterdag spelen we uit tegen FC Lisse.", sender: 'them', type: 'safe', feedback: "Sport info." },
                { text: "We verzamelen om 08:30 bij de kantine.", sender: 'them', type: 'safe', feedback: "Duidelijke afspraak." },
                { text: "Is goed coach!", sender: 'me' },
                { text: "Niet vergeten je uit-tenue mee te nemen!", sender: 'them', type: 'safe', feedback: "Geen rare linkjes, gewoon info." }
            ]
        },
        
                // --- REAL 6: Tikkie (Betaling) ---
                {
                    id: 'real6',
                    type: 'real',
                    name: 'Fleur <3',
                    avatar: 'linear-gradient(to right, #ff9966, #ff5e62)',
                    preview: 'Hier is geld voor de bios 🍿',
                    messages: [
                        { text: "Vandaag 14:00", type: 'timestamp' },
                        { text: "Was echt gezellig gisteren!", sender: 'them', type: 'safe', feedback: "Gewoon een vriendin." },
                        { text: "Ja vond ik ook!", sender: 'me' },
                        { text: "Ik kreeg nog geld van je voor het kaartje toch?", sender: 'me' },
                        { text: "Ohja sorry helemaal vergeten!", sender: 'them', type: 'safe', feedback: "Normaal gesprek." },
                        { text: "Hier is een Tikkie, is dat goed?", sender: 'them', type: 'safe', feedback: "Ze stuurt een betaalverzoek." },
                        { text: "https://tikkie.me/pay/Fleur/29dj29", sender: 'them', type: 'tricky', feedback: "Goed gezien! 'tikkie.me' is de officiële en veilige link van Tikkie." }
                    ]
                },// --- SCAM 2: De Roblox Hater (Milan) die "gehackt" is ---
        {
            id: 'scam2',
            type: 'scam',
            name: 'Milan_010',
            avatar: 'darkblue',
            preview: 'Yo check dit ff',
            solved: false,
            messages: [
                // --- DAG 1: Het bewijs dat hij het haat ---
                { text: "Maandag 19:30", type: 'timestamp' },
                { text: "Bro, kom je vanavond FIFA?", sender: 'them', type: 'safe', feedback: "Gewoon een oude chat." },
                { text: "Nah man, ben ff Roblox aan t doen. Join je?", sender: 'me' }, 

                { text: "Ik ga echt geen Roblox doen man, dat is voor kleuters 😂", sender: 'them', type: 'safe', feedback: "BELANGRIJKE HINT: Milan haat Roblox. Onthoud dit!" },
                { text: "Nooit meer vragen gap, ik speel dat niet.", sender: 'them', type: 'safe', feedback: "Hij is heel duidelijk: hij speelt dit niet." },
                { text: "Haha is goed rustig maar.", sender: 'me' },

                // --- DAG 2: Tussendoor normaal gesprek ---
                { text: "Gisteren 16:15", type: 'timestamp' },
                { text: "Gaan we nog trainen morgen?", sender: 'them', type: 'safe', feedback: "Normaal gesprek, niks aan de hand." },
                { text: "Ja sws, ben er om 19u.", sender: 'me' }, 

                // --- DAG 3: De Hack (Met de lastige link) ---
                { text: "Zojuist", type: 'timestamp' },
                { text: "Yo bro! Kijk dit event, ik heb net 10.000 Robux gekregen!", sender: 'them', type: 'scam', reason: "grammar", feedback: "Alarmbellen! 🚩 Gisteren haatte hij het nog en vond het voor kleuters. Dit is Milan niet, hij is gehackt!" },
                { text: "Huh? Jij haatte dat toch?", sender: 'me' }, 

                { text: "Ja maar dit is gratis geld bro. Klik snel hier:", sender: 'them', type: 'scam', reason: "link", 
                  feedback: "⚠️ <strong>HEEL TRICKY!</strong><br>Deze link lijkt veilig (slotje + .com), maar de naam klopt niet.<br>De echte site is roblox.com, niet <em>roblox-app</em>.<br><strong>DE GOUDEN TIP:</strong><br>Moet je na het klikken opnieuw inloggen? <strong>STOP!</strong> 🛑<br>Ga zelf naar de echte site. Ben je daar wel nog ingelogd? Dan is deze link nep." }
            ]
        },
        
                // --- REAL 7: Oma (Beetje onhandig, maar veilig) ---
                {
                    id: 'real7',
                    type: 'real',
                    name: 'Oma Jannie',
                    avatar: '#8e44ad', // Paars
                    preview: 'Hoe werkt die Ipad nou?',
                    messages: [
                        { text: "Gisteren 10:15", type: 'timestamp' },
                        { text: "Hoi lieverd met oma.", sender: 'them', type: 'safe', feedback: "Het is je oma maar." },
                        { text: "Kom je zaterdag op de koffie?", sender: 'them', type: 'safe', feedback: "Gezellige vraag." },
                        { text: "Ja leuk oma! Rond 11 uur?", sender: 'me' },
                        { text: "Dat is goed. Ik heb ook een appeltaart gebakken.", sender: 'them', type: 'safe', feedback: "Oma's hacken je niet met taart." },
                        { text: "Kijk ik heb een foto gemaakt:", sender: 'them', type: 'safe', feedback: "Ze probeert een foto te sturen." },
                        { text: "IMG_2024_TAART.JPG", sender: 'them', type: 'safe', feedback: "Gewoon een bestandsnaam, geen link." }
                    ]
                },
        
                // --- REAL 8: Schoolproject (Google Docs) ---
                {
                    id: 'real8',
                    type: 'real',
                    name: 'Mees (Klas)',
                    avatar: '#2ecc71', // Groen
                    preview: 'De presentatie is af',
                    messages: [
                        { text: "Vandaag 16:45", type: 'timestamp' },
                        { text: "Yo, ik heb mijn deel van de dia's af.", sender: 'them', type: 'safe', feedback: "Samenwerking voor school." },
                        { text: "Lekker man. Ziet het er goed uit?", sender: 'me' },
                        { text: "Ja best wel. Wil je even checken?", sender: 'them', type: 'safe', feedback: "Vraagt om feedback." },
                        { text: "Linkje staat in de beschrijving, maar hier nog een keer:", sender: 'them', type: 'safe', feedback: "Logisch dat hij de link stuurt." },
                        { text: "https://docs.google.com/presentation/d/e/291", sender: 'them', type: 'tricky', feedback: "Veilig! 'docs.google.com' is de echte site van Google." }
                    ]
                },
        
                // --- REAL 9: YouTube video van vriend (Bas) ---
        {
            id: 'real9',
            type: 'real',
            name: 'Bas_03',
            avatar: '#c0392b', // Rood (YouTube kleur)
            preview: 'Deze gast is niet goed 😂',
            messages: [
                { text: "Vandaag 20:12", type: 'timestamp' },
                { text: "Bro heb je de nieuwe video van MrBeast al gezien?", sender: 'them', type: 'safe', feedback: "Gewoon een vriend die over YouTube praat." },
                { text: "Nee nog niet, is ie online?", sender: 'me' },
                { text: "Ja net, ze hebben een eiland gekocht ofzo.", sender: 'them', type: 'safe', feedback: "Klinkt als een normale conversatie." },
                { text: "Check ff:", sender: 'them', type: 'safe', feedback: "Hij stuurt de link." },
                { text: "https://youtu.be/x9-jKs20a", sender: 'them', type: 'tricky', feedback: "Veilig! 'youtu.be' is de officiële, veilige korte link van YouTube. Niets aan de hand." }
            ]
        },
        
                // --- SCAM 3: De "Ben jij dit?" vriendentruc (EXTRA LASTIG) ---
                {
                    id: 'scam3',
                    type: 'scam',
                    name: 'Sem_V_2009',
                    avatar: '#3498db', // Blauw
                    preview: 'OMG ben jij dit?? 💀',
                    solved: false,
                    messages: [
                        { text: "Vandaag 19:12", type: 'timestamp' },
                        { text: "Ewa, alles goed?", sender: 'them', type: 'safe', feedback: "Lijkt veilig: Sem begint het gesprek normaal om vertrouwen te winnen." },
                        { text: "Ja rustig, met jou?", sender: 'me' },
                        
                        { text: "Mwah, gaat wel. Maar bro...", sender: 'them', type: 'safe', feedback: "Hij bouwt de spanning op." },
                        { text: "Ik zag net echt iets heel raars op TikTok voorbij komen.", sender: 'them', type: 'safe', feedback: "Nog steeds geen link, hij maakt je nieuwsgierig." },
                        { text: "Hoezo? Wat dan?", sender: 'me' },
        
                        { text: "Iemand heeft een video van jou geplaatst waar je echt raar doet 😂", sender: 'them', type: 'scam', reason: "curiosity", feedback: "Manipulatie: Dit is bedoeld om je te laten schrikken en uit nieuwsgierigheid te laten klikken." },
                        { text: "Ik dacht eerst dat het nep was, maar het lijkt echt op jou.", sender: 'them', type: 'scam', reason: "social_engineering", feedback: "Druk opvoeren: Hij bevestigt dat jij het bent om je onzeker te maken." },
                        
                        { text: "Kijk snel voordat ie offline gehaald wordt:", sender: 'them', type: 'scam', reason: "urgency", feedback: "Urgentie: 'Voordat ie offline gaat' zorgt dat je niet nadenkt." },
                        { text: "http://tiktok-secure-login.net/video/99221", sender: 'them', type: 'scam', reason: "link", feedback: "Kijk goed! Er staat 'tiktok-secure-login.net'. De echte site is gewoon tiktok.com. Dit is een nepsite om je wachtwoord te stelen." }
                    ]
                }
    ];

    let currentOpenChatId = null;
    let scamsSolvedCount = 0;

    // --- 1. START / RESET ---
    window.resetPhishingGame = function() {
        scamsSolvedCount = 0;
        currentOpenChatId = null;
        
        // Reset opgelost status in data
        chatDatabase.forEach(chat => {
            if(chat.type === 'scam') chat.solved = false;
        });

        // UI Reset
        document.getElementById('scams-found-counter').innerText = '0';
        document.getElementById('phishing-finish-btn').disabled = true;
        document.getElementById('phishing-finish-btn').innerText = "Klaar (Vind ze alle 3)";
        document.getElementById('phishing-finish-btn').style.opacity = "0.5";

        // Toon Inbox, Verberg Chat
        document.getElementById('insta-inbox-view').style.display = 'flex';
        document.getElementById('insta-chat-view').style.display = 'none';

        renderChatList();
    }

    // --- 2. RENDER DE LIJST (INBOX) ---
    function renderChatList() {
        const container = document.getElementById('chat-list-container');
        container.innerHTML = ""; // Leegmaken

        chatDatabase.forEach(chat => {
            const div = document.createElement('div');
            div.className = 'chat-item';
            if (chat.solved) div.classList.add('solved');

            // Maak avatar (kleur of verloop)
            let avatarStyle = chat.avatar.includes('gradient') ? `background: ${chat.avatar}` : `background-color: ${chat.avatar}`;
            
            div.innerHTML = `
                <div class="chat-avatar" style="${avatarStyle}"></div>
                <div class="chat-info">
                    <div class="chat-name">${chat.name} ${chat.type === 'real' && chat.name === 'Zalando' ? '☑️' : ''}</div>
                    <div class="chat-preview">${chat.solved ? '✅ Opgelost: Oplichter gerapporteerd' : chat.preview}</div>
                </div>
                ${chat.solved ? '<div class="chat-status-icon">✅</div>' : ''}
            `;

            div.onclick = () => openChat(chat.id);
            container.appendChild(div);
        });
    }

    // --- 3. OPEN EEN CHAT ---
    window.openChat = function(id) {
        currentOpenChatId = id;
        const chat = chatDatabase.find(c => c.id === id);
        
        // UI Wisselen
        document.getElementById('insta-inbox-view').style.display = 'none';
        document.getElementById('insta-chat-view').style.display = 'flex';

        // Header vullen
        document.getElementById('current-chat-name').innerText = chat.name;
        let avatarStyle = chat.avatar.includes('gradient') ? `background: ${chat.avatar}` : `background-color: ${chat.avatar}`;
        document.getElementById('current-chat-avatar').style = avatarStyle;

        // Berichten renderen
        const msgContainer = document.getElementById('messages-container');
        msgContainer.innerHTML = ""; // Leegmaken

        chat.messages.forEach((msg) => {
            
            // TYPE 1: TIJDSTEMPEL
            if (msg.type === 'timestamp') {
                const timeDiv = document.createElement('div');
                timeDiv.className = 'msg-timestamp';
                timeDiv.innerText = msg.text;
                msgContainer.appendChild(timeDiv);
                return;
            }

            const bubble = document.createElement('div');

            // TYPE 2: MIJN EIGEN BERICHT
            if (msg.sender === 'me') {
                bubble.className = 'msg-bubble msg-sent';
                bubble.innerText = msg.text;
            } 
            // TYPE 3: BERICHT VAN ANDER
            else {
                bubble.className = 'msg-bubble msg-received';
                bubble.innerText = msg.text;
                
                // BELANGRIJK: Als we dit bericht al eerder hadden gevonden, maak het direct rood!
                if (msg.found === true) {
                    bubble.classList.add('found-scam');
                }
                
                // Klik event
                bubble.onclick = function() {
                    handleMessageClick(chat, msg, bubble);
                };
            }

            msgContainer.appendChild(bubble);
        });

        // Scroll naar beneden
        setTimeout(() => {
            msgContainer.scrollTop = msgContainer.scrollHeight;
        }, 50);
    }

    // --- 4. KLIK LOGICA (HET SPEL - AANGEPAST) ---
    function handleMessageClick(chat, msg, bubbleElement) {
        // Als de chat al helemaal opgelost is, hoeven we niks meer te doen
        if (chat.solved) return;

        // Als dit specifieke bericht al gevonden was (maar de chat nog niet 'solved' - zou niet moeten voorkomen met nieuwe logica, maar voor de zekerheid)
        if (msg.found) return;

        const feedbackOverlay = document.getElementById('phishing-feedback-overlay');
        const feedbackText = document.getElementById('phishing-feedback-text');
        
        // CASE 1: ECHTE CHAT of VEILIG BERICHT (Foute keuze)
        if (chat.type === 'real' || msg.type === 'safe' || msg.type === 'tricky') {
            feedbackOverlay.style.display = 'flex';
            feedbackText.style.color = '#333';
            feedbackText.innerHTML = `<strong>Niets aan de hand.</strong><br>${msg.feedback}`;
            
            // Visuele feedback (groen knipperen)
            bubbleElement.style.border = "2px solid #27ae60";
            setTimeout(() => {
                bubbleElement.style.border = "2px solid transparent";
            }, 1000);
        } 
        
        // CASE 2: SCAM ELEMENT GEVONDEN (Goede keuze!)
        // NIEUWE LOGICA: Eén klik is genoeg om de hele chat op te lossen.
        else if (msg.type === 'scam') {
           // Roep direct de functie aan die alles afhandelt
           catchScamImmediately(chat);
        }
    }

    // --- NIEUWE FUNCTIE: HANDELT DE SCAM DIRECT AF NA 1 KLIK ---
    function catchScamImmediately(chat) {
        // 1. Markeer de chat als opgelost
        chat.solved = true;

        let reasonsHtml = "";

        // 2. Loop door ALLE berichten in deze chat
        chat.messages.forEach(m => {
            // Als het een scam bericht is (ook degene die je NIET hebt aangeklikt)
            if (m.type === 'scam') {
                // Markeer als gevonden in de data
                m.found = true; 
                // Voeg de feedback toe aan de lijst voor de modal
                reasonsHtml += `<li>${m.feedback}</li>`;
            }
        });

        // 3. Visuele Update: Herlaad de huidige chat view. 
        // Omdat we in stap 2 de data (m.found = true) hebben aangepast, 
        // zullen nu automatisch alle scam-bubbels rood worden.
        openChat(chat.id); 

        // 4. Vul de nieuwe modal met de verzamelde redenen
        document.getElementById('scam-reasons-list').innerHTML = reasonsHtml;

        // 5. Toon de nieuwe succes modal (in plaats van de alert)
        // Even wachten zodat je de rode bubbels ziet verschijnen voordat de modal eroverheen komt
        setTimeout(() => {
             document.getElementById('scam-caught-modal').style.display = 'flex';
        }, 300);
    }

    // --- NIEUWE FUNCTIE: SLUIT MODAL EN GA TERUG ---
    window.closeScamModalAndReturn = function() {
        document.getElementById('scam-caught-modal').style.display = 'none';
        returnToInbox();
    }

    // --- DEZE OUDE FUNCTIE MAG WEG ---
    /*
    function checkIfChatSolved(chat) {
       // ... deze hele functie is niet meer nodig ...
    }
    */

    // --- NIEUWE FUNCTIE: Update de Inbox Teller & Knop (Ongewijzigd, ter referentie) ---
    function updateInboxState() {
        // Tel opnieuw in de database hoeveel chats op 'solved' staan
        const solvedCount = chatDatabase.filter(c => c.solved).length;
        
        // Update de tekst (bv. "1/2")
        const counterElement = document.getElementById('scams-found-counter');
        if (counterElement) {
            counterElement.innerText = solvedCount;
        }

        // Update de knop als we er 3 (of meer) hebben
        const btn = document.getElementById('phishing-finish-btn');
        if (btn) {
            if (solvedCount >= 3) {
                btn.disabled = false;
                btn.style.opacity = "1";
                btn.style.cursor = "pointer";
                btn.style.backgroundColor = "#27ae60"; // Groen
                btn.innerText = "Missie Voltooid! (Klik hier)";
            } else {
                // Nog niet klaar
                btn.disabled = true;
                btn.style.opacity = "0.5";
                btn.style.cursor = "not-allowed";
                btn.style.backgroundColor = ""; // Reset
                btn.innerText = "Klaar (Vind ze allemaal)";
            }
        }
    }

    // --- 5. CHECK STATUS & UPDATE UI ---
    function updateInboxState() {
        // Tel hoeveel er zijn opgelost
        const solvedCount = chatDatabase.filter(c => c.solved).length;
        // Tel hoeveel scams er in totaal in de database zitten (Sophie, Milan, Sem = 3)
        const totalScams = chatDatabase.filter(c => c.type === 'scam').length;
        
        // Update de tekst (bv. "1/3")
        const counterElement = document.getElementById('scams-found-counter');
        if (counterElement) {
            counterElement.innerText = `${solvedCount} / ${totalScams}`;
        }

        // Update de 'Klaar' knop
        const btn = document.getElementById('phishing-finish-btn');
        if (btn) {
            if (solvedCount >= totalScams) {
                // ALLES GEVONDEN!
                btn.disabled = false;
                btn.style.opacity = "1";
                btn.style.cursor = "pointer";
                btn.style.backgroundColor = "#27ae60"; // Groen
                btn.innerText = "Missie Voltooid! (Klik hier)";
                // Zorg dat de klik de finish functie start
                btn.onclick = finishPhishingGame;
            } else {
                // NOG NIET KLAAR
                const nogTeVinden = totalScams - solvedCount;
                btn.disabled = true;
                btn.style.opacity = "0.5";
                btn.style.cursor = "not-allowed";
                btn.style.backgroundColor = ""; // Reset
                btn.innerText = `Vind nog ${nogTeVinden} scam${nogTeVinden > 1 ? 's' : ''}`;
            }
        }
    }

    // --- 6. NAVIGATIE TERUG NAAR INBOX ---
    window.returnToInbox = function() {
        document.getElementById('insta-chat-view').style.display = 'none';
        document.getElementById('insta-inbox-view').style.display = 'flex';
        
        renderChatList();   // Ververs de lijst (zodat vinkjes zichtbaar worden)
        updateInboxState(); // Check of we klaar zijn
    }

    // --- 7. GAME AFRONDEN (Klaar knop ingedrukt) ---
    window.finishPhishingGame = function() {
        // 1. Sluit de Game Modal
        document.getElementById('phishing-modal').style.display = 'none';

        // 3. Open de Succes Modal
        document.getElementById('phishing-success-modal').style.display = 'flex';
    }

    // --- 8. LEVEL VOLTOOID (Knop in Succes Modal) ---
    // BELANGRIJK: Zorg dat je knop in de HTML deze functie aanroept: onclick="finishPhishingLevel()"
    window.finishPhishingLevel = function() {
        // 1. Sluit succes modal
        document.getElementById('phishing-success-modal').style.display = 'none';
        isModalOpen = false;

        // 2. Zet de game op 'Gehaald' (Unlock)
        level5Unlocked = true;

        // 3. Ga naar de volgende slide (Slide 20)
        // Huidige slide index is 18. +1 = 19 (Dat is Slide 20 in de array)
        changeSlide(1);
    }

})();

