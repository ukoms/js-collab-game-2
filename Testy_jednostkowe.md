# Próby odbioru

Stan początkowy `S0` = `stanPoczatkowy()` = `{pokoj:1, energia:10, karta:false, bezpiecznik:false, zasilanie:false, koniec:false, wygrana:false}`.

| Wymaganie | Stan początkowy | Działanie | Wynik oczekiwany | Wynik faktyczny | Kto sprawdzał |

| Lewa granica mapy | `S0` (pokój 1) | `przejscie(S0, "lewo")` | ten sam obiekt stanu, energia 10, komunikat „Sciana…” | zgodnie z oczekiwanym | Janeks|
| Zabranie przedmiotu | `S0` | `przejscie(S0, "karta")` | `karta: true`, energia 9 | zgodnie z oczekiwanym | Janek|
| Przedmiot już zabrany | pokój 1, `karta: true`, energia 9 | `przejscie(s, "karta")` | ten sam obiekt, energia 9, brak duplikatu | zgodnie z oczekiwanym | Janek|
| Naprawa | pokój 3, `bezpiecznik: true`, energia 5 | `przejscie(s, "napraw")` | `zasilanie: true`, `bezpiecznik: false`, energia 4 | zgodnie z oczekiwanym | Janek|
| Wygrana na ostatniej energii | pokój 4, karta, zasilanie, energia 1 | `przejscie(s, "wyjdz")` | `wygrana: true`, `koniec: true`, energia 0, komunikat „WYGRANA”, bez „PRZEGRANA” | zgodnie z oczekiwanym | Janek|
| Zakończona gra | stan po wygranej | `przejscie(s, "lewo")` | ten sam obiekt, brak zmian | zgodnie z oczekiwanym | Janek|
| Eksport po końcu gry | `koniec: true`, energia 0 | `gra.eksportuj()` | zwraca string JSON | zgodnie z oczekiwanym | Janek|
| Nieznana komenda | `S0` | `przejscie(S0, "xyz")`, `gra.akcja("xyz")` | odmowa, ten sam stan, energia 10; `gra.akcja` zwraca obiekt `{stan, komunikat}` | zgodnie z oczekiwanym | Janek|
| Ruch z opisem pokoju | `S0` | `gra.idz("prawo")` | pokój 2, energia 9, wypisany opis magazynu | pokój 2, energia 9 (opis do potwierdzenia w przeglądarce) | Janek|
| Niezmienność wejścia | `S0` | `przejscie(S0, "karta")`, porównanie `JSON.stringify(S0)` przed i po | `S0` bez zmian | zgodnie z oczekiwanym | Janek|
| Eksport -> import | po `karta`, `prawo` (pokój 2, energia 8) | `e = gra.eksportuj()`, `gra.start()`, `gra.importuj(e)` | `true`, wszystkie 7 pól jak w `e` | zgodnie z oczekiwanym | Janek|
| Urwany JSON | pokój 2, energia 8 | `gra.importuj("{")` | `false`, błąd składni, stan bez zmian | zgodnie z oczekiwanym | Janek|
| Zła wersja | pokój 2, energia 8 | import pakietu z `wersja: 99` | `false`, stan bez zmian | zgodnie z oczekiwanym | Janek|
| Zły typ pola | pokój 2, energia 8 | import z `"energia": "8"` | `false`, stan bez zmian | zgodnie z oczekiwanym | Janek|
| Brak tekstu / anulowanie | pokój 2, energia 8 | `gra.importuj(null)`, `gra.importuj("")`, `gra.importuj("  ")` | `false`, czytelna odmowa, stan bez zmian | zgodnie z oczekiwanym | Janek|
| Opakowanie nie jest obiektem | pokój 2, energia 8 | `gra.importuj("[]")`, `gra.importuj("null")` | `false`, stan bez zmian | zgodnie z oczekiwanym | Janek|
| Obce pole | dowolny | import poprawnego pakietu z dodatkowym `"x": 1` w stanie | import przyjęty, `x` nie trafia do stanu | zgodnie z oczekiwanym | Janek|
