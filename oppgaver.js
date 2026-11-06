/*
 * KODEVERKSTEDET – OPPGAVER
 * Rediger tekstene under for å tilpasse innholdet til dine elever.
 * Hver oppgave trenger en unik id, form, niva, tid, tittel, beskrivelse,
 * mal, utstyr, steg, tips og ekstra. Feltet kode er valgfritt.
 * Se LES_MEG.md for en enkel forklaring.
 */
window.KODEOPPGAVER = [
  {
    id: "analog-robot", form: "analog", niva: "nybegynner", tid: 15,
    tittel: "Vær en robot!", beskrivelse: "Kan du styre en medelev over gulvet med helt presise instruksjoner?",
    mal: ["Forstå hva en algoritme er", "Gi instruksjoner i riktig rekkefølge"],
    utstyr: "Papir, tape eller kritt – og en medelev.",
    steg: ["Lag et enkelt rutenett på gulvet eller tegn det på et stort ark.", "Velg en start og et mål. Én elev er robot, den andre er programmerer.", "Programmereren kan bare si «gå ett felt», «snu til venstre» eller «snu til høyre».", "Prøv instruksjonene. Kom roboten frem? Rett feilene og prøv igjen."],
    tips: "En robot gjør akkurat det du sier, ikke det du mente. Vær helt konkret!",
    ekstra: "Legg inn hindringer. Klarer du å skrive instruksjonene før roboten begynner?"
  },
  {
    id: "analog-oppskrift", form: "analog", niva: "nybegynner", tid: 20,
    tittel: "En oppskrift for en robot", beskrivelse: "Skriv en oppskrift som er så tydelig at en robot kan følge den.",
    mal: ["Dele en stor oppgave opp i mindre steg", "Teste og forbedre en algoritme"],
    utstyr: "Ark, blyant og ting fra klasserommet.",
    steg: ["Velg en enkel oppgave, for eksempel å lage en papirfly eller stable tre bøker.", "Skriv ned alle handlingene i riktig rekkefølge.", "La en medelev følge oppskriften helt bokstavelig, uten å stille spørsmål.", "Oppdag hvilke steg som var uklare, og skriv oppskriften på nytt."],
    tips: "Ord som «ordentlig» og «forsiktig» kan bety ulike ting for ulike personer.",
    ekstra: "Prøv å bruke færrest mulig instruksjoner uten at oppskriften blir uklar."
  },
  {
    id: "analog-feil", form: "analog", niva: "videre", tid: 20,
    tittel: "Finn feilen", beskrivelse: "En algoritme gir feil resultat. Klarer du å finne og rette feilen?",
    mal: ["Forstå hva feilsøking betyr", "Teste endringer én om gangen"],
    utstyr: "Ruteark og to blyanter i ulike farger.",
    steg: ["Tegn et rutenett på 5 × 5 ruter. Marker start nederst til venstre og mål øverst til høyre.", "Skriv en algoritme med framover, venstre og høyre som skal nå målet.", "Bytt om to av instruksjonene uten å vise en medelev hva du endret.", "La medeleven teste, finne feilen og forklare hvordan den kan rettes."],
    tips: "Gå gjennom ett steg om gangen, og noter hvor veien begynner å bli feil.",
    ekstra: "Lag en algoritme med to ulike feil. Kan medeleven finne begge?"
  },
  {
    id: "analog-sortering", form: "analog", niva: "utfordring", tid: 30,
    tittel: "Menneskelig sorteringsmaskin", beskrivelse: "Lag en sorteringsalgoritme med mennesker som tall.",
    mal: ["Sammenligne verdier systematisk", "Forstå hvorfor rekkefølgen på trinnene betyr noe"],
    utstyr: "Tallkort fra 1 til 10 og minst fire elever.",
    steg: ["Gi hver elev ett tallkort og still elevene på en rekke i tilfeldig rekkefølge.", "Sammenlign to naboer om gangen. Hvis tallet til venstre er større, bytter de plass.", "Fortsett bortover rekken. Begynn deretter på nytt fra venstre.", "Gjenta helt til du kan gå gjennom rekken uten ett eneste bytte."],
    tips: "Dette er en variant av boblesortering. Det største tallet flytter seg mot høyre for hver runde.",
    ekstra: "Tell hvor mange sammenligninger dere trenger. Blir det færre dersom tallene nesten er sortert fra før?"
  },
  {
    id: "scratch-bevegelse", form: "scratch", niva: "nybegynner", tid: 20,
    tittel: "Få figuren til å bevege seg", beskrivelse: "Start et Scratch-prosjekt og få figuren din til å gå og snu.",
    mal: ["Bruke hendelser og bevegelsesblokker", "Sette blokker i riktig rekkefølge"],
    utstyr: "PC eller nettbrett med Scratch.",
    steg: ["Åpne Scratch og lag et nytt prosjekt.", "Legg til blokken «når grønt flagg klikkes» fra Hendelser.", "Fest «gå 10 steg» under. Klikk på flagget og se hva som skjer.", "Legg til «snu 15 grader» og prøv med flere bevegelsesblokker."],
    tips: "Du finner bevegelsesblokkene under den blå kategorien «Bevegelse».",
    ekstra: "Kan du få figuren til å tegne et kvadrat ved å bruke Penn-utvidelsen?",
    lenke: "https://scratch.mit.edu/projects/editor/"
  },
  {
    id: "scratch-lokke", form: "scratch", niva: "nybegynner", tid: 25,
    tittel: "Dans med en løkke", beskrivelse: "Få en figur til å danse uten å skrive samme instruksjon mange ganger.",
    mal: ["Bruke «gjenta»-blokker", "Se hvordan løkker gjør programmer kortere"],
    utstyr: "PC eller nettbrett med Scratch.",
    steg: ["Velg en figur og en bakgrunn i Scratch.", "Start med «når grønt flagg klikkes».", "Fest en «gjenta 10 ganger»-blokk fra Kontroll.", "Inne i løkken legger du «snu 15 grader» og «neste drakt». Kjør programmet."],
    tips: "En løkke gjentar instruksjonene som ligger inni den.",
    ekstra: "Legg inn en lyd og prøv å lage to ulike dansetrinn.",
    lenke: "https://scratch.mit.edu/projects/editor/"
  },
  {
    id: "scratch-quiz", form: "scratch", niva: "videre", tid: 35,
    tittel: "Lag en kunnskapsquiz", beskrivelse: "Lag spørsmål og la Scratch svare ulikt på rett og galt svar.",
    mal: ["Bruke spørsmål og svar", "Bruke hvis/ellers for å ta valg"],
    utstyr: "PC eller nettbrett med Scratch.",
    steg: ["Start med «når grønt flagg klikkes».", "Bruk «spør [Hva er 2 + 3?] og vent» fra Sansing.", "Legg inn «hvis … ellers» fra Kontroll.", "Test om «svar = 5». Si «Riktig!» ved riktig svar og «Prøv igjen!» ellers."],
    tips: "«svar»-blokken ligger under Sansing, mens «=»-blokken ligger under Operatorer.",
    ekstra: "Legg til tre spørsmål og en variabel som teller poeng.",
    lenke: "https://scratch.mit.edu/projects/editor/"
  },
  {
    id: "scratch-spill", form: "scratch", niva: "utfordring", tid: 45,
    tittel: "Fang stjernen!", beskrivelse: "Bygg et lite spill der spilleren samler stjerner og får poeng.",
    mal: ["Bruke variabler og berøring", "Kombinere hendelser, løkker og valg"],
    utstyr: "PC eller nettbrett med Scratch.",
    steg: ["Velg to figurer: en spiller og en stjerne.", "La spilleren bevege seg med piltastene ved hjelp av «når tast trykkes».", "Lag en variabel som heter «poeng», og sett den til 0 når flagget klikkes.", "På stjernen: bruk «for alltid» og sjekk om den berører spilleren. Da øker du poeng med 1 og flytter stjernen til en tilfeldig posisjon.", "Legg til «vent 0.2 sekunder» etter treffet slik at ett treff ikke gir mange poeng med én gang."],
    tips: "Blokken «berører [figur]?» ligger under Sansing, og «tilfeldig tall» ligger under Operatorer.",
    ekstra: "Legg til en tidtaker på 30 sekunder. Hva skjer når tiden er ute?",
    lenke: "https://scratch.mit.edu/projects/editor/"
  },
  {
    id: "python-hei", form: "python", niva: "nybegynner", tid: 15,
    tittel: "Hei, Python!", beskrivelse: "Skriv ditt første program og la datamaskinen hilse på deg.",
    mal: ["Bruke print() og input()", "Lagre tekst i en variabel"],
    utstyr: "PC med Python, for eksempel i Thonny.",
    steg: ["Åpne et program der du kan skrive og kjøre Python.", "Skriv koden under akkurat slik den står.", "Kjør programmet og skriv inn navnet ditt når du blir spurt.", "Endre teksten i print() og kjør programmet på nytt."],
    kode: 'navn = input("Hva heter du? ")\nprint("Hei, " + navn + "!")',
    tips: "Python skiller mellom store og små bokstaver. Husk anførselstegn og parenteser.",
    ekstra: "Spør også etter elevens favorittfarge, og skriv en melding med begge svarene."
  },
  {
    id: "python-regning", form: "python", niva: "nybegynner", tid: 20,
    tittel: "En liten kalkulator", beskrivelse: "La Python regne ut svaret på to tall du velger.",
    mal: ["Bruke variabler og regneoperatorer", "Gjøre om tekst til heltall med int()"],
    utstyr: "PC med Python, for eksempel i Thonny.",
    steg: ["Skriv programmet under i Python.", "Kjør programmet og skriv inn to heltall.", "Se hva som skjer når du endrer + til * eller -.", "Forklar hvorfor vi bruker int() rundt input()."],
    kode: 'tall1 = int(input("Første tall: "))\ntall2 = int(input("Andre tall: "))\nsum = tall1 + tall2\nprint("Svaret er:", sum)',
    tips: "input() gir deg tekst. int() gjør teksten om til et heltall du kan regne med.",
    ekstra: "Utvid kalkulatoren slik at den viser både summen og produktet av tallene."
  },
  {
    id: "python-gjett", form: "python", niva: "videre", tid: 30,
    tittel: "Gjett det hemmelige tallet", beskrivelse: "Lag et spill der Python velger et hemmelig tall og du må gjette.",
    mal: ["Bruke while-løkker og if/elif/else", "Sammenligne tall og gi tilbakemeldinger"],
    utstyr: "PC med Python, for eksempel i Thonny.",
    steg: ["Skriv inn koden under og kjør programmet.", "Gjett tall fra 1 til 10. Les ledetrådene du får.", "Finn løkken som sørger for at du kan gjette flere ganger.", "Bytt intervallet slik at Python velger tall fra 1 til 20."],
    kode: 'import random\n\nhemmelig = random.randint(1, 10)\ngjett = 0\n\nwhile gjett != hemmelig:\n    gjett = int(input("Gjett et tall fra 1 til 10: "))\n    if gjett < hemmelig:\n        print("For lavt!")\n    elif gjett > hemmelig:\n        print("For høyt!")\n    else:\n        print("Du gjettet riktig!")',
    tips: "Alt som er rykket inn under while, gjentas så lenge betingelsen er sann.",
    ekstra: "Lag en teller som viser hvor mange forsøk spilleren brukte."
  },
  {
    id: "python-tegn", form: "python", niva: "utfordring", tid: 35,
    tittel: "Tegn mønstre med kode", beskrivelse: "Bruk en skilpadde, en løkke og litt matematikk til å tegne fine figurer.",
    mal: ["Gjenta handlinger med for-løkker", "Oppdage sammenhengen mellom vinkler og figurer"],
    utstyr: "PC med Python og turtle-støtte (for eksempel Thonny).",
    steg: ["Åpne Python og skriv koden under.", "Kjør programmet og se hvilken figur du får.", "Endre range(4) til range(3) og vinkelen fra 90 til 120. Hva skjer?", "Test andre tall og lag ditt eget mønster."],
    kode: 'import turtle\n\npenn = turtle.Turtle()\npenn.speed(3)\n\nfor side in range(4):\n    penn.forward(100)\n    penn.right(90)\n\nturtle.done()',
    tips: "Et kvadrat har fire hjørner. For å komme rundt hele figuren snur vi 360 / 4 = 90 grader hver gang.",
    ekstra: "Tegn en sekskant! Hvor stor må snuvinkelen være? Prøv også ulike farger."
  }
];
