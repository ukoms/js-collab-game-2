# Decyzja techniczna zespołu — Kaszubownia i wersja zapisu

- Problem użytkownika lub implementacji: nowy pokój dodaje pole `kaszubowanie` do stanu, więc zapisy z wersji 1 go nie mają.
- Ograniczenie, którego nie możemy zmienić: gracze mają już pliki `postep.json` w wersji 1 na pendrive'ach.
- Wariant A i jego koszt: import migruje wersję 1, dopisując `kaszubowanie: false` przed walidacją. Kilka linii w `importuj()`.
- Wariant B i jego koszt: import przyjmuje tylko wersję 2. Prostszy kod, ale stare zapisy przestają działać.
- Krótka próba porównawcza i wynik: zapis v1 z pokojem 3 i zasilaniem — w wariancie A wczytuje się poprawnie, w B jest odrzucany.
- Wybór oraz uzasadnienie: A — gracz nie traci postępu, a walidator `czyStan` nadal sprawdza pełny stan v2.
- Kiedy wrócimy do decyzji: przy wersji 3 lub gdy migracji będzie więcej niż jedna.
- Które kontrakty lub pliki trzeba zaktualizować: `src/engine.js` (`POKOJE`, `stanPoczatkowy`, `przejscie`, `czyStan`), `src/app.js` (`eksportuj`, `importuj`, `status`, `rozejrzyj`, `pomoc`), README.md.
