# Podział zadań na 3 osoby — „Ucieczka 2”

## Kontekst
Repo zawiera starą grę (`src/app.js`, wszystko na zmiennych globalnych, `console.log` wymieszane z regułami) oraz wymagania w `01_BRIEF.md`, kontrakt w `02_TECH.md` i etapy w `03_PROWADZENIE.md`. Cel: rozbić pracę 3‑osobowego zespołu (A, B, C) na 6 × 45 min tak, by powstały `engine.js` (czyste reguły), `app.js` (stan + API `gra`), eksport/import JSON z walidacją, README, TESTY.md i DECYZJE.md. Podział trzyma się ról z `03_PROWADZENIE.md` (A = silnik, B = aplikacja, C = HTML/dane/testy/dokumentacja), z rotacją w etapie integracji.

Znane usterki starej gry (punkt odniesienia, do naprawy w silniku): w `idz()` nieznany kierunek nadal kosztuje energię (`src/app.js:121`), a `rozejrzyj()` przy ruchu w prawo wywoływane jest przed zmianą pokoju (`src/app.js:105`).

## Etap 0 — wszyscy (ok. 20 min)
- Uruchomić starą grę, wykonać jeden ruch i jedną odmowę, spisać pola stanu.
- Utworzyć branch roboczy; każda osoba pracuje na własnym branchu (`a-engine`, `b-app`, `c-html-docs`).
- Uzgodnić kontrakt (pola z 02_TECH, komendy `lewo/prawo/karta/bezpiecznik/napraw/wyjdz`, wynik `{stan, komunikat}`, pakiet `{wersja: 1, stan}`) i zapisać go w `DECYZJE.md` (użyć szablonu z `DECYZJA_TECHNICZNA.md`) z jedną alternatywą, np. „energia liczona w aplikacji vs. w silniku”.

## Osoba A — silnik (`src/engine.js`)
1. `MAKS_ENERGIA`, tablica `POKOJE` (`[{id:1,nazwa:"Recepcja"}, …]`), `stanPoczatkowy()` zwracające nowy literał przy każdym wywołaniu.
2. `przejscie(stanPrzed, komenda)` — bez `console.log`, bez mutacji wejścia:
   - zakończona gra → zwrot wejścia bez zmian,
   - ruch: kandydacki pokój, sprawdzenie ściany przed zmianą,
   - akcje karta / bezpiecznik / napraw / wyjdz (warunki przeniesione z `akcja()` w `src/app.js:139`),
   - jedna wspólna ścieżka sukcesu odejmuje 1 energii; wygrana ustalana przed sprawdzeniem zera,
   - nieznana komenda → odmowa bez kosztu.
3. `czyStan(wartosc)` — null/obiekt/tablica, typy, zakresy (pokój istnieje, energia 0–10 całkowita), zależności (bezpiecznik∧zasilanie zabronione, wygrana ⇒ pokój 4 + karta + zasilanie, koniec ⇔ wygrana ∨ energia 0).

## Osoba B — aplikacja (`src/app.js`)
1. Na start `console.log(stanPoczatkowy())` — sprawdzenie połączenia skryptów.
2. Zastąpić starą grę: `let stan = stanPoczatkowy()`, funkcja pomocnicza `wykonaj(komenda)` (wywołuje `przejscie`, przypisuje `wynik.stan`, wypisuje `wynik.komunikat`).
3. Funkcje informacyjne bez kosztu przeniesione ze starego kodu: `status`, `mapa` (na podstawie `POKOJE`), `pomoc`, `start` (reset przez fabrykę).
4. `eksportuj()` → `JSON.stringify({wersja: 1, stan})` (return, nie log).
5. `importuj(tekst)` — odrzucenie nie‑stringa/null/pustego, `JSON.parse` w try/catch, sprawdzenie opakowania, wersji i `czyStan`, przepisanie tylko znanych pól, podmiana stanu na końcu; zwraca `true/false`.
6. `window.gra = { idz, akcja, status, mapa, start, eksportuj, importuj }`.

## Osoba C — HTML, dane testowe, dokumentacja
1. `src/index.html`: dwa skrypty `./engine.js` i `./app.js` z `defer`, w tej kolejności; instrukcja na stronie odsyła do `gra.pomoc()`/`gra.status()`.
2. Przypadki testowe dla A (wejście → oczekiwany `{stan, komunikat}`): ściana z lewej, ponowna karta, naprawa, wygrana na ostatniej energii, komenda po końcu gry, niezmienność wejścia.
3. Próbki błędnego importu dla A i B: `{`, wersja 99, tekstowa energia, brak pola, pokój 99, sprzeczne booleany, `null`, `""`, anulowany prompt.
4. `README.md`: uruchomienie dwuklikiem, lista poleceń `gra.*`, pełna droga zapisu (`console.log(gra.eksportuj())` → edytor → `postep.json` na pendrive → odświeżenie → `gra.importuj(prompt(...))`).
5. `TESTY.md`: tabela z min. 6 próbami (wejście, czynność, oczekiwany, faktyczny wynik, kto sprawdził) — pokrywa wszystkie wiersze kryteriów odbioru z briefu.

## Integracja i rotacja (wszyscy)
- Połowa czasu: wspólny pokaz jednego przebiegu (ruch, akcja, eksport, import).
- Zamiana ról przeglądu: B czyta i testuje `czyStan` (A), A objaśnia eksport/import (B), C prowadzi próby z TESTY.md na scalonym kodzie i zapisuje jedną konkretną poprawioną usterkę.
- Merge pojedynczo: najpierw C (HTML), potem A (engine), na końcu B (app).

## Rozszerzenie (opcjonalnie, po minimum)
Jedno: np. historia komend lub nowy pokój. Właściciel: osoba, która dotąd najmniej pisała danej części (rotacja). Wymaga zmiany modelu, `czyStan`, wersji formatu (`wersja: 2`) i wpisu w DECYZJE.md.

## Przekazanie
Każdy objaśnia cudzy fragment (A → app.js, B → walidator, C → `przejscie`) i robi jedną małą własną zmianę (np. nowy komunikat odmowy).

## Weryfikacja
- Dwuklik `src/index.html`, konsola: brak ReferenceError; `stanPoczatkowy() !== stanPoczatkowy()`.
- Przejść wszystkie wiersze tabeli „Kryteria odbioru” z `01_BRIEF.md` i wpisać wyniki do `TESTY.md`.
- Cykl status → błędny import → status bez odświeżania strony: stan bez zmian.
- Eksport → zapis do pliku → odświeżenie → import: wszystkie pola odtworzone.
