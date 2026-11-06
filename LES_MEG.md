# Kodeverkstedet – komplett nettsted med Lærerrommet

**Språk:** Norsk bokmål. **Innhold:** Analog programmering, Scratch og Python.

## Kom i gang – fem enkle steg

1. Pakk ut ZIP-filen `kodeverkstedet-med-laererrom.zip` på PC-en din.
2. Åpne **`index.html`** for å se nettsiden slik elevene ser den.
3. Åpne **`admin.html`** for å bruke **Lærerrommet**. Du kan også klikke på lenken «Lærerrommet» på elevsidens lærerseksjon.
4. Velg en oppgave eller klikk **+ Ny**. Fyll ut feltene. Du kan endre, kopiere, slette og flytte oppgaver, og se en forhåndsvisning.
5. Når du er fornøyd, bla ned til **Gjør oppgavene synlige for elevene** og klikk **Last ned oppgaver.js**.

**Viktig:** Å redigere en oppgave endrer **ikke** nettstedet elevene ser. Du må publisere den nedlastede filen, som forklart nedenfor.

## Publiser nettsiden for første gang (GitHub Pages)

1. Opprett en gratis GitHub-konto på https://github.com/signup.
2. Lag et **Public** repository, for eksempel med navnet `kodeverkstedet`.
3. Velg **Add file → Upload files**, og last opp **de utpakkede filene** fra mappen (ikke ZIP-filen). `index.html` må ligge i øverste mappe i repositoryet. Klikk **Commit changes**.
4. Velg **Settings → Pages → Build and deployment → Deploy from a branch**. Velg `main` og `/(root)`, og lagre.
5. Når siden er publisert, får elevsiden vanligvis adressen `https://DITTBRUKERNAVN.github.io/kodeverkstedet/`. Lærerrommet ligger på samme adresse med `admin.html` til slutt.

### Hvis du allerede har publisert en tidligere versjon

Du trenger **ikke** lage et nytt repository. Last opp/erstatt de nye filene fra denne pakken i samme repository og bekreft med **Commit changes**. Dette legger til `admin.html`, `admin.js` og `admin.css`, og oppdaterer lenken til Lærerrommet i `index.html`.

## Endre og publisere oppgaver senere

1. Åpne `admin.html` på nettstedet ditt (for eksempel `https://DITTBRUKERNAVN.github.io/kodeverkstedet/admin.html`).
2. Velg en oppgave til venstre, eller klikk **+ Ny**.
3. Rediger feltene: tittel, arbeidsmåte, nivå, tidsbruk, beskrivelse, læringsmål (ett per linje), utstyr, trinn, hint, ekstra utfordring og eventuelt et kodeeksempel/lenke.
4. Endringene lagres automatisk som et **utkast i nettleseren på enheten du bruker**.
5. Klikk **Last ned oppgaver.js** under publiseringsseksjonen.
6. Åpne GitHub-repositoryet. Velg **Add file → Upload files**, og velg den nye `oppgaver.js` fra nedlastingsmappen. GitHub vil da vise en endring i den eksisterende filen. Klikk **Commit changes**.
7. Oppdater elevsiden etter at GitHub Pages har fullført publiseringen. Nå vises de nye oppgavene.

**Hvis GitHub ikke lar deg laste opp en fil med samme navn:** Åpne `oppgaver.js` på GitHub, klikk blyantikonet, og erstatt hele innholdet med teksten fra knappen **Kopier hele filinnholdet** i Lærerrommet. Klikk **Commit changes**. Du trenger ikke skrive kode.

## Hvordan lagres endringene?

Det finnes **to ulike steder** der oppgaver lagres:

- **Lærerutkast:** Lagring i nettleserens `localStorage` på din enhet. Lagres automatisk ved redigering, men er **ikke synlig for elever**, og synkroniseres ikke mellom PC-er eller nettlesere. Hvis du tømmer nettleserdata, bruker privat/inkognitomodus eller bytter enhet, kan utkastet bli borte.
- **Publiserte oppgaver:** Den faktiske filen `oppgaver.js` i GitHub-repositoryet. Elevsiden viser denne filen, **ikke** ditt lokale utkast.

### Sikkerhetskopi (anbefalt)

Nederst i Lærerrommet finner du **Last ned sikkerhetskopi (.json)**. Gjør dette regelmessig, gjerne før du bytter PC eller tømmer nettleserdata. Bruk **Åpne sikkerhetskopi** for å hente inn utkastet på en ny enhet. Sikkerhetskopien kan inneholde en oppgave du ikke er ferdig med; publiseringsknappen kontrollerer at påkrevde felt er fylt ut.

**Start på nytt fra publiserte oppgaver** forkaster utkastet og leser oppgavene som var lastet fra `oppgaver.js` da du åpnet siden. Oppdater nettleseren først hvis GitHub-filen nylig er endret.

## Oversikt over filene

| Fil | Hva den gjør |
| --- | --- |
| `index.html` | Elevsiden, menyen og lenken til lærerrommet |
| `styles.css` | Utseendet på elevsiden |
| `oppgaver.js` | Alle **publiserte** oppgaver |
| `app.js` | Søk, filtrering, oppgavevisning og elevenes lokale fullført-status |
| `admin.html` | Lærerrommets brukergrensesnitt |
| `admin.css` | Utseendet på lærerrommet |
| `admin.js` | Redigering, utkast, sikkerhetskopi, forhåndsvisning og eksport |
| `LES_MEG.md` | Denne veiledningen |

## Personvern og sikkerhet

- Lærerrommet har **ikke innlogging**; den som kjenner adressen kan åpne redigeringsskjemaet, men kan **ikke** oppdatere den publiserte nettsiden uten tilgang til GitHub-repositoryet ditt.
- Oppgavene er offentlig tilgjengelige. Ikke skriv elevnavn, vurderinger eller annen sensitiv informasjon i oppgavene.
- Elevenes egne «Fullført»-markeringer er bare lagret i deres nettleser. Læreren mottar dem ikke.
- Nettsiden bruker ingen database, ingen egen server og ingen innlogging. For innlevering fra elever, lærerpålogging eller automatisk publisering fra et skjema trenger løsningen en sikker serverløsning/tilkobling og skolens personvernvurdering.

## Problemer?

- **Nye oppgaver vises ikke:** Du har trolig ikke lastet opp den nye `oppgaver.js` til GitHub, eller GitHub Pages er ennå ikke oppdatert. Prøv en hard oppdatering av elevsiden.
- **Lærerrommet sier «Kan ikke lagre»:** Nettleseren blokkerer lokal lagring. Last ned en JSON-sikkerhetskopi så du ikke mister endringene.
- **Nytt utkast vises på en annen PC?** Nei, utkast synkroniseres ikke. Bruk sikkerhetskopien for å overføre det.
- **Jeg åpner `admin.html`, men ser ikke oppgaver:** Kontroller at alle filer, særlig `oppgaver.js`, ligger i samme mappe.

## Rettigheter

Nettsiden kan endres og deles til undervisningsformål. Scratch tilhører Scratch Foundation og Scratch-teamet. Dette er ikke en offisiell Scratch-nettside.
