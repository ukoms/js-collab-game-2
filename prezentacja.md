# Plan prezentacji — „Ucieczka 2: Janek w to Kaszub”

Czas: ok. 5–7 minut. Pokaz na żywo w konsoli przeglądarki (`src/index.html` otwarty dwuklikiem).

## 1. Wstęp (30 s)
- Co to za projekt: tekstowa gra w konsoli przeglądarki — ucieczka z budynku przez 4 pokoje.
- Cel collabu: przebudować starą grę tak, by reguły były oddzielone od komunikatów, a postęp dało się zapisać jako JSON.
- Ograniczenia: bez Node, npm, serwera, modułów ES i localStorage.

## 2. Architektura (1 min)
- `engine.js` — czyste reguły: `POKOJE`, `stanPoczatkowy()`, `przejscie(stan, komenda)`, `czyStan()`.
  - `przejscie` nie mutuje wejścia i nie wypisuje nic — zwraca `{stan, komunikat}`.
  - Koszt energii naliczany tylko w jednej ścieżce sukcesu; wygrana ma pierwszeństwo przed porażką.
- `app.js` — trzyma bieżący stan, wypisuje komunikaty, udostępnia API `gra.*`.
- `index.html` — ładuje oba skrypty z `defer` w ustalonej kolejności.

## 3. Pokaz rozgrywki (1,5 min)
```js
gra.pomoc()
gra.idz("lewo")          // ściana — energia bez zmian
gra.akcja("karta")
gra.idz("prawo")         // magazyn
gra.akcja("bezpiecznik")
gra.idz("prawo")         // serwerownia
gra.akcja("napraw")
gra.status()
```

## 4. Zapis i odczyt postępu (1 min)
```js
console.log(gra.eksportuj())   // kopiujemy JSON do edytora -> postep.json
// odświeżenie strony
gra.importuj(prompt("Wklej zawartość postep.json"))
gra.status()                   // stan odtworzony
```
- Pokaz odrzucenia: `gra.importuj("{")` — błąd, stan bez zmian.
- Walidacja: składnia, wersja, typy, zakresy, zależności między polami; podmiana stanu dopiero po sprawdzeniu całości.

## 5. Rozszerzenie: Kaszubownia (1,5 min)
- Nowy pokój 5 za Wyjściem, a w nim Filip Jażewicz.
- `gra.akcja("kaszubuj")` — działa tylko w pokoju 5, raz, kosztuje 1 energię.
- Alternatywne zakończenie: inny komunikat zwycięstwa po kaszubowaniu.
- Pełna trasa z kaszubowaniem zużywa dokładnie 10 energii — zero miejsca na pomyłkę.
```js
gra.idz("prawo")         // Wyjście
gra.idz("prawo")         // Kaszubownia
gra.akcja("kaszubuj")
gra.idz("lewo")
gra.akcja("wyjdz")       // zakończenie kaszubskie
```

## 6. Decyzja techniczna (45 s)
- Problem: nowe pole `kaszubowanie` w stanie — stare zapisy (wersja 1) go nie mają.
- Wariant A (wybrany): import migruje v1, dopisując `kaszubowanie: false`.
- Wariant B: przyjmować tylko v2 — prostsze, ale gracze tracą postęp.
- Format zapisu podniesiony do `wersja: 2`, walidator sprawdza pełny stan v2.

## 7. Testy (30 s)
- 17 udokumentowanych prób w `Testy_jednostkowe.md` — pokrywają wszystkie kryteria odbioru z briefu (ściana, duplikat przedmiotu, wygrana na ostatniej energii, urwany JSON, zła wersja, zły typ, anulowanie importu, niezmienność wejścia).

## 8. Podsumowanie i pytania (30 s)
- Co się udało: rozdzielenie reguł od interfejsu, bezpieczny import, wsteczna zgodność zapisów.
- Czego się nauczyliśmy: czyste funkcje, walidacja danych z zewnątrz, wersjonowanie formatu.
- Pytania.
