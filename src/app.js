//Osoba B-APLIKACJA

let stan=stanPoczatkowy();

function wykonaj(komenda){
  const wynik=przejscie(stan,komenda);
  //Silnik zwraca stan i komunikat

  //Aplikacja przyjmuje wynik i wyswietla tekst
  stan=wynik.stan;
  console.log(wynik.komunikat);

  return wynik;

}

function idz(kierunek){
  if(kierunek!=="lewo" && kierunek!=="prawo"){
    console.log("Nieznany kierunek. Mozesz isc w lewo lub prawo.");
    return false;
  }
  return wykonaj(kierunek);
}

function akcja(co){
  const dozwolone = [
    "karta",
    "bezpiecznik",
    "napraw",
    "wyjdz"
  ];

  if(!dozwolone.includes(co)){
    console.log("Nieznana akcja. Uzyj: karta, bezpiecznik, napraw, wyjdz");
    return false;
  }
  return wykonaj(co);
}

function nazwaPokoju(numer){
  const pokoje=POKOJE.find(function (p) {return p.id === numer;});

  return pokoj ? pokoj.nazwa : "Nieznane pomieszczenie";
}

function status(){
   console.log("Pokoj: " + stan.pokoj + " (" + nazwaPokoju(stan.pokoj) + ")");
  console.log("Energia: " + stan.energia + "/" + MAKS_ENERGIA);
  console.log("Karta: " + (stan.karta ? "tak" : "nie"));
  console.log("Bezpiecznik: " + (stan.bezpiecznik ? "tak" : "nie"));
  console.log("Zasilanie: " + (stan.zasilanie ? "wlaczone" : "wylaczone"));
  console.log("Stan gry: " + (stan.wygrana ? "wygrana" : stan.koniec ? "przegrana" : "trwa"));

  return {...stan };
}

function mapa(){
  for(const pokojMapy of POKOJE){
    let linia=pokojMapy.id + ". " + pokojMapy.nazwa;
    if(pokojMapy.id===stan.pokoj){
      linia+="<-- jestes tutaj";
    }
    console.log(linia);
  }
}

function rozejrzyj(){
  switch(stan.pokoj){
    case 1:
      console.log("Recepcja " + (stan.karta ? "Biurko jest puste. " : "Na biurku lezy karta dostepu."));
      break;
    case 2:
      console.log("Magazyn " + (!stan.bezpiecznik && !stan.zasilanie ? "Na polce lezy bezpiecznik." : "Polka jest pusta."));
      break;
    case 3:
      console.log("Serwerownia Zasilanie  " + (stan.zasilanie ? "Dziala " : "Nie dziala. Potrzebny bezpiecznik: akcja("napraw")."));
      break;
    case 4:
      console.log("Wyjscie. Aby uciec, wpisz akcja("wyjdz")");
      break;
  }
}

function pomoc(){
  console.log("=== UCIECZKA Z SERWEROWNI ===");
  console.log("Informacje: gra.pomoc(), gra.status(), gra.mapa(), gra.rozejrzyj()");
  console.log('Ruch: gra.idz("lewo"), gra.idz("prawo")');
  console.log('Przedmioty: gra.akcja("karta"), gra.akcja("bezpiecznik")');
  console.log('Naprawa: gra.akcja("napraw")');
  console.log('Ucieczka: gra.akcja("wyjdz")');
  console.log("Reset: gra.start()");
  console.log("Eksport: gra.eksportuj()");
  console.log('Import: gra.importuj(prompt("Wklej JSON"))');
}

function start(){
  stan=stanPoczatkowy();

  console.log("UCIECZKA Z SERWEROWNI. Zasilanie awaryjne wystarczy na 10 tur");
  pomoc();
  rozejrzyj();

  return status();
}

// Eksport zwraca tekst JSON. Nie tworzy automatycznie pliku
function eksportuj() {
  return JSON.stringify(
    {
      wersja: 1,
      stan: {
        pokoj: stan.pokoj,
        energia: stan.energia,
        karta: stan.karta,
        bezpiecznik: stan.bezpiecznik,
        zasilanie: stan.zasilanie,
        koniec: stan.koniec,
        wygrana: stan.wygrana
      }
    },
    null,
    2
  );
}
function importuj(tekst){
  if(typeof tekst !== "string" || tekst.trim()=== ""){
    console.log("Import anulowany: nie podano tekstu JSON.")
    return false;
  }
  let pakiet;
  try{
    pakiet=JSON.parse(tekst);
  }cath(blad){
    console.log("Blad importu: niepoprawna skladnia JSON");
    return false;
  }
  if(pakiet===null || typeof pakie!=="object" || Array.isArray(pakiet)){
    console.log("Blad importu: pakiet musi byc obiektem JSON");
  }
}

// WSPOLNY KONTRAKT: nazwy zmiennych i funkcji uzgadnia caly zespol.
const MAKS_ENERGIA = 10;
let pokoj = 1;
let energia = MAKS_ENERGIA;
let karta = false;
let bezpiecznik = false;
let zasilanie = false;
let koniec = false;
let wygrana = false;

// SEKCJA 0 — GOTOWY SILNIK NAUCZYCIELA
function start() {
  pokoj = 1;
  energia = MAKS_ENERGIA;
  karta = false;
  bezpiecznik = false;
  zasilanie = false;
  koniec = false;
  wygrana = false;
  console.log("UCIECZKA Z SERWEROWNI. Zasilanie awaryjne wystarczy na 10 tur.");
  pomoc();
  rozejrzyj();
}

function zakonczTure() {
  energia = energia - 1;
  console.log("Pozostala energia: " + energia);
  if (wygrana) {
    console.log("WYGRANA! Drzwi otwarte. Mozesz wrocic do domu.");
  } else if (energia === 0) {
    koniec = true;
    console.log("PRZEGRANA. Zasilanie awaryjne padlo. Wpisz start().");
  }
}

// SEKCJA A — INFORMACJE I MAPA
function nazwaPokoju(numer) {
  switch (numer) {
    case 1:
      return "Recepcja";
    case 2:
      return "Magazyn";
    case 3:
      return "Serwerownia";
    case 4:
      return "Wyjscie";
    default:
      return "Nieznane pomieszczenie";
  }
}
function pomoc() {
  console.log("Informacje (bez kosztu): start(), pomoc(), status(), mapa(), rozejrzyj()");
  console.log('Ruch: idz("prawo") lub idz("lewo")');
  console.log('Akcje: akcja("karta"), akcja("bezpiecznik"), akcja("napraw"), akcja("wyjdz")');
  console.log("Koszt: kazdy poprawny ruch i kazda udana akcja zuzywa 1 energii. Informacje i bledne komendy sa darmowe.");
}
function status() {
  console.log("Pokoj: " + pokoj + " (" + nazwaPokoju(pokoj) + ")");
  console.log("Energia: " + energia + "/" + MAKS_ENERGIA);
  console.log("Karta: " + (karta ? "tak" : "nie"));
  console.log("Bezpiecznik: " + (bezpiecznik ? "tak" : "nie"));
  console.log("Zasilanie: " + (zasilanie ? "wlaczone" : "wylaczone"));
  console.log("Stan gry: " + (wygrana ? "wygrana" : koniec ? "przegrana" : "trwa"));
}
function mapa() {
  for (let numer = 1; numer <= 4; numer = numer + 1) {
    let linia = numer + ". " + nazwaPokoju(numer);
    if (numer === pokoj) {
      linia = linia + " <-- jestes tutaj";
    }
    console.log(linia);
  }
}
function rozejrzyj() {
  switch (pokoj) {
    case 1:
      console.log("Recepcja. " + (!karta ? "Na biurku lezy karta dostepu." : "Biurko jest puste."));
      break;
    case 2:
      if (!bezpiecznik && !zasilanie) {
        console.log("Magazyn. Na polce lezy bezpiecznik.");
      } else {
        console.log("Magazyn. Polka jest pusta.");
      }
      break;
    case 3:
      console.log("Serwerownia. Zasilanie " + (zasilanie ? "dziala." : "nie dziala; potrzebna karta i bezpiecznik, potem akcja(\"napraw\")."));
      break;
    case 4:
      console.log("Wyjscie. Drzwi otworzysz akcja(\"wyjdz\"), gdy zasilanie dziala.");
      break;
    default:
      console.log("Nieznane pomieszczenie.");
  }
}

// SEKCJA B — RUCH
function idz(kierunek) {
  // TODO B1: zablokuj ruch po koncu gry.
  if(koniec)
  {
    console.log("Gra sie zakonczyła");
    return 0;
  }
  // TODO B2: switch kierunku; oblicz kandydat na nowy pokoj.
  let nastepnyPokoj=pokoj;
  switch(kierunek){
    // TODO B3: odrzuc pokoj poza 1..4 i nieznany kierunek bez kosztu.
    case "prawo":
      {
        if(nastepnyPokoj+1>4){
        console.log("ruch nie wykonany, natrafiono na sciane, nie tracisz energii");
        return 0;
        }
        else{
          rozejrzyj();
        nastepnyPokoj++;
        }
        break;
      }
    case "lewo":
      {
        if(nastepnyPokoj-1<1){
        console.log("ruch nie wykonany, natrafiono na sciane, nie tracisz energii");
        return 0;
        }
        else{
        nastepnyPokoj--;
        }
        break;
      }
    default:
      console.log("nie ma takiego kierunku, wybierz poprawny");
      break;
}
  // TODO B4: zapisz poprawny pokoj, rozejrzyj(), zakonczTure().
  pokoj=nastepnyPokoj;
  zakonczTure();
  rozejrzyj();
  return pokoj;
}

// SEKCJA C — PRZEDMIOTY I WYGRANA
function akcja(co) {
  // TODO C1: zablokuj akcje po koncu gry.
  if (koniec) {
    console.log("Gra jest juz zakonczona.");
    return;
  }
  // TODO C2: switch: karta / bezpiecznik / napraw / wyjdz.
  switch (co) {
    case "karta":
      // TODO C2: przed zmiana sprawdz pokoj i wymagany stan.
      if (pokoj !== 1 || karta) {
        console.log("Tutaj nie ma karty do zabrania.");
        // TODO C3: przy odrzuceniu return; przy sukcesie break.
        return;
      }

      karta = true;
      console.log("Zabierasz karte.");
      // TODO C3: przy odrzuceniu return; przy sukcesie break.
      break;

    case "bezpiecznik":
      // TODO C2: przed zmiana sprawdz pokoj i wymagany stan.
      if (pokoj !== 2 || bezpiecznik || zasilanie) {
        console.log("Tutaj nie ma bezpiecznika do zabrania.");
        // TODO C3: przy odrzuceniu return; przy sukcesie break.
        return;
      }

      bezpiecznik = true;
      console.log("Zabierasz bezpiecznik.");
      // TODO C3: przy odrzuceniu return; przy sukcesie break.
      break;

    case "napraw":
      // TODO C2: przed zmiana sprawdz pokoj i wymagany stan.
      if (pokoj !== 3 || !bezpiecznik || zasilanie) {
        console.log("Nie mozesz teraz naprawic zasilania.");
        // TODO C3: przy odrzuceniu return; przy sukcesie break.
        return;
      }

      bezpiecznik = false;
      zasilanie = true;
      console.log("Montujesz bezpiecznik. Zasilanie zostalo przywrocone.");
      // TODO C3: przy odrzuceniu return; przy sukcesie break.
      break;

    case "wyjdz":
      // TODO C2: przed zmiana sprawdz pokoj i wymagany stan.
      if (pokoj !== 4 || !karta || !zasilanie) {
        console.log("Nie mozesz jeszcze otworzyc wyjscia.");
        // TODO C3: przy odrzuceniu return; przy sukcesie break.
        return;
      }
       // TODO C4: wygrana i koniec ustawione przed rozliczeniem tury!
      wygrana = true;
      koniec = true;
      console.log("Otwierasz drzwi i uciekasz z serwerowni! WYGRANA!");
      // TODO C3: przy odrzuceniu return; przy sukcesie break.
      break;

    default:
      console.log("Nieznana akcja. Uzyj: karta, bezpiecznik, napraw lub wyjdz.");
      // TODO C3: przy odrzuceniu return; przy sukcesie break.
      return;
  }
  // TODO C3: po switch jedno zakonczTure().
  zakonczTure()
}

start();
