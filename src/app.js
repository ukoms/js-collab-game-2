 //Osoba B-APLIKACJA

let stan = stanPoczatkowy();

function wykonaj(komenda) {
  const wynik = przejscie(stan, komenda);

  // Silnik zwraca stan i komunikat

  // Aplikacja przyjmuje wynik i wyswietla tekst
  stan = wynik.stan;
  console.log(wynik.komunikat);

  return wynik;
}

// Nieznane komendy odrzuca silnik, wiec aplikacja ich tu nie sprawdza.
function idz(kierunek) {
  const pokojPrzed = stan.pokoj;
  const wynik = wykonaj(kierunek);

  // Po udanym ruchu pokazujemy opis nowego pomieszczenia
  if (stan.pokoj !== pokojPrzed) {
    rozejrzyj();
  }

  return wynik;
}

function akcja(co) {
  return wykonaj(co);
}

function nazwaPokoju(numer) {
  const pokoj = POKOJE.find(function (p) {
    return p.id === numer;
  });

  return pokoj ? pokoj.nazwa : "Nieznane pomieszczenie";
}

function status() {
  console.log("Pokoj: " + stan.pokoj + " (" + nazwaPokoju(stan.pokoj) + ")");
  console.log("Energia: " + stan.energia + "/" + MAKS_ENERGIA);
  console.log("Karta: " + (stan.karta ? "tak" : "nie"));
  console.log("Bezpiecznik: " + (stan.bezpiecznik ? "tak" : "nie"));
  console.log("Zasilanie: " + (stan.zasilanie ? "wlaczone" : "wylaczone"));
  console.log("Kaszubowanie: " + (stan.kaszubowanie ? "tak" : "nie"));
  console.log("Stan gry: " + (stan.wygrana ? "wygrana" : stan.koniec ? "przegrana" : "trwa"));

  return { ...stan };
}

function mapa() {
  for (const pokojMapy of POKOJE) {
    let linia = pokojMapy.id + ". " + pokojMapy.nazwa;

    if (pokojMapy.id === stan.pokoj) {
      linia += " <-- jestes tutaj";
    }

    console.log(linia);
  }
}

function rozejrzyj() {
  switch (stan.pokoj) {
    case 1:
      console.log("Recepcja. " + (stan.karta ? "Biurko jest puste." : "Na biurku lezy karta dostepu."));
      break;

    case 2:
      console.log("Magazyn. " + (!stan.bezpiecznik && !stan.zasilanie ? "Na polce lezy bezpiecznik." : "Polka jest pusta."));
      break;

    case 3:
      console.log("Serwerownia. Zasilanie " + (stan.zasilanie ? "dziala." : 'nie dziala. Potrzebny bezpiecznik: gra.akcja("napraw").'));
      break;

    case 4:
      console.log('Wyjscie. Aby uciec, wpisz gra.akcja("wyjdz"). Zza drzwi po prawej slychac kaszubskie spiewy.');
      break;

    case 5:
      console.log("Kaszubownia. " + (stan.kaszubowanie
        ? "Filip nuci \"Kaszebsczé note\" i macha Ci na pozegnanie."
        : 'Przy stole z tabaka siedzi Filip Jazewicz i macha do Ciebie. Wpisz gra.akcja("kaszubuj").'));
      break;
  }
}

function pomoc() {
  console.log("=== UCIECZKA Z SERWEROWNI ===");
  console.log("Informacje: gra.pomoc(), gra.status(), gra.mapa(), gra.rozejrzyj()");
  console.log('Ruch: gra.idz("lewo"), gra.idz("prawo")');
  console.log('Przedmioty: gra.akcja("karta"), gra.akcja("bezpiecznik")');
  console.log('Naprawa: gra.akcja("napraw")');
  console.log('Ucieczka: gra.akcja("wyjdz")');
  console.log('Kaszubowanie: gra.akcja("kaszubuj")');
  console.log("Reset: gra.start()");
  console.log("Eksport: gra.eksportuj()");
  console.log('Import: gra.importuj(prompt("Wklej JSON"))');
}

function start() {
  stan = stanPoczatkowy();

  console.log("UCIECZKA Z SERWEROWNI. Zasilanie awaryjne wystarczy na 10 tur.");
  pomoc();
  rozejrzyj();

  return status();
}

// Eksport zwraca tekst JSON. Nie tworzy automatycznie pliku.
function eksportuj() {
  return JSON.stringify(
    {
      wersja: 2,
      stan: {
        pokoj: stan.pokoj,
        energia: stan.energia,
        karta: stan.karta,
        bezpiecznik: stan.bezpiecznik,
        zasilanie: stan.zasilanie,
        koniec: stan.koniec,
        wygrana: stan.wygrana,
        kaszubowanie: stan.kaszubowanie
      }
    },
    null,
    2
  );
}

// Import zapisu z tekstu JSON.
function importuj(tekst) {
  if (typeof tekst !== "string" || tekst.trim() === "") {
    console.log("Import anulowany: nie podano tekstu JSON.");
    return false;
  }

  let pakiet;

  try {
    pakiet = JSON.parse(tekst);
  } catch (blad) {
    console.log("Blad importu: niepoprawna skladnia JSON.");
    return false;
  }

  if (pakiet === null || typeof pakiet !== "object" || Array.isArray(pakiet)) {
    console.log("Blad importu: pakiet musi byc obiektem JSON.");
    return false;
  }

  if (pakiet.wersja !== 1 && pakiet.wersja !== 2) {
    console.log("Blad importu: nieobslugiwana wersja zapisu.");
    return false;
  }

  let s = pakiet.stan;

  // Zapis w wersji 1 nie zna Kaszubowni, wiec uzupelniamy brakujace pole.
  if (pakiet.wersja === 1 && s !== null && typeof s === "object" && !Array.isArray(s)) {
    s = { ...s, kaszubowanie: false };
  }

  if (!czyStan(s)) {
    console.log("Blad importu: stan gry jest niepoprawny.");
    return false;
  }

  // Tworzymy nowy obiekt tylko ze znanych pol.

  const nowyStan = {
    pokoj: s.pokoj,
    energia: s.energia,
    karta: s.karta,
    bezpiecznik: s.bezpiecznik,
    zasilanie: s.zasilanie,
    koniec: s.koniec,
    wygrana: s.wygrana,
    kaszubowanie: s.kaszubowanie
  };

  // Podmieniamy stan dopiero po poprawnej walidacji.
  stan = nowyStan;

  console.log("Wczytano zapis gry.");
  return true;
}

// Polecenia dostepne w konsoli przegladarki.
window.gra = {
  idz: idz,
  akcja: akcja,
  status: status,
  mapa: mapa,
  rozejrzyj: rozejrzyj,
  pomoc: pomoc,
  start: start,
  eksportuj: eksportuj,
  importuj: importuj
};

console.log('Gra gotowa. Wpisz gra.pomoc().');
