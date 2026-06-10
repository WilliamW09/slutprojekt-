# AeroTrade – README

AeroTrade är en enkel webbplats för att köpa och sälja flygplan. Sidan är gjord som ett skolprojekt med HTML, CSS och JavaScript.

## Vad webbplatsen gör

- Visar utvalda flygplan på startsidan
- Gör det möjligt att söka bland flygplan med sökfält och autofullförslag
- Öppnar en popup när man klickar på "View Details"
- Låter användaren skapa konto eller logga in
- Ger möjlighet att lägga upp en annons för ett flygplan
- Innehåller en kontaktformulär för frågor och meddelanden

## Sidor på webbplatsen

- Home – startsida med featured aircraft och sökfunktion
- Marketplace – översikt över flygplan som kan visas och filtreras
- Sell Aircraft – formulär för att lägga upp ett flygplan till försäljning
- About – information om webbplatsen och varför den finns
- Contact – kontaktformulär för besökare
- Login – skapa konto eller logga in

## Hur det fungerar

1. Öppna filen Main/index.html i en webbläsare.
2. Använd sökfältet för att hitta flygplan.
3. Klicka på "View Details" för att se mer information om ett flygplan.
4. Gå till "Sell Aircraft" för att fylla i ett formulär om ett flygplan du vill sälja.
5. Gå till "Login" för att skapa konto eller logga in.
6. När du loggar in sparas användaren lokalt i webbläsaren med hjälp av localStorage.

## Teknik

- HTML för sidornas struktur
- CSS för utseende och responsiv design
- JavaScript för:
  - sökning
  - autocomplete
  - popup-fönster
  - formulärvalidering
  - inloggning och utloggning

## Hur du öppnar sidan

Det går att öppna sidan direkt genom att dubbelklicka på Main/index.html.

Om du vill köra den via en lokal server kan du också använda:

```bash
cd /workspaces/slutprojekt-
python3 -m http.server 8000
```

Sedan öppnar du:

```text
http://localhost:8000/Main/index.html
```

## Tips

- Sidan använder bara lokal lagring i webbläsaren, så användardata sparas endast på den dator du använder.
- Om du vill testa hela flödet, börja med att skapa ett konto på Login-sidan.

