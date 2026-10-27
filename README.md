# js-collab-game-2
Second collab

## Rozszerzenie: Kaszubownia (pokoj 5)

Za Wyjsciem (`gra.idz("prawo")` z pokoju 4) jest Kaszubownia, gdzie siedzi Filip Jażewicz.

- `gra.akcja("kaszubuj")` — Filip uczy Cie kaszubskiego. Dziala tylko w pokoju 5 i tylko raz, kosztuje 1 energie.
- Kaszubowanie nie jest wymagane do wygranej, ale zmienia komunikat zwyciestwa (alternatywne zakonczenie).
- Pelna trasa z kaszubowaniem zuzywa dokladnie 10 energii, wiec nie ma miejsca na pomylke.

### Format zapisu w wersji 2

Eksport zwraca `{ "wersja": 2, "stan": { ..., "kaszubowanie": false } }`.
Import przyjmuje wersje 2 oraz stare zapisy w wersji 1 (brakujace pole `kaszubowanie` jest uzupelniane jako `false`). Inne wersje sa odrzucane.
