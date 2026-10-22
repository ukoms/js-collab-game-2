// SILNIK: stale, dane pokojow i czyste reguly. Bez console.log i bez stanu globalnego.
const MAKS_ENERGIA = 10;

const POKOJE = [
  { id: 1, nazwa: "Recepcja" },
  { id: 2, nazwa: "Magazyn" },
  { id: 3, nazwa: "Serwerownia" },
  { id: 4, nazwa: "Wyjscie" }
];

function stanPoczatkowy() {
  return {
    pokoj: 1,
    energia: MAKS_ENERGIA,
    karta: false,
    bezpiecznik: false,
    zasilanie: false,
    koniec: false,
    wygrana: false
  };
}

function znajdzPokoj(id) {
  return POKOJE.find(function (p) { return p.id === id; });
}

// Odmowa oddaje wejsciowy obiekt bez zmian i bez kosztu.
function wynikOdmowy(stan, komunikat) {
  return { stan: stan, komunikat: komunikat };
}

// Jedyna sciezka sukcesu: tu naliczany jest koszt i rozstrzygany koniec gry.
function wynikSukcesu(stan, zmiany, komunikat) {
  const nowy = { ...stan, ...zmiany, energia: stan.energia - 1 };
  if (nowy.wygrana) {
    nowy.koniec = true;
    return { stan: nowy, komunikat: komunikat + " WYGRANA! Drzwi otwarte." };
  }
  if (nowy.energia === 0) {
    nowy.koniec = true;
    return { stan: nowy, komunikat: komunikat + " PRZEGRANA. Zasilanie awaryjne padlo." };
  }
  return { stan: nowy, komunikat: komunikat + " Pozostala energia: " + nowy.energia + "." };
}

function przejscie(stanPrzed, komenda) {
  if (stanPrzed.koniec) {
    return wynikOdmowy(stanPrzed, "Gra jest zakonczona. Uzyj resetu.");
  }

  switch (komenda) {
    case "lewo":
    case "prawo": {
      const cel = stanPrzed.pokoj + (komenda === "prawo" ? 1 : -1);
      const pokojCel = znajdzPokoj(cel);
      if (!pokojCel) {
        return wynikOdmowy(stanPrzed, "Sciana. Ruch niewykonany, energia bez zmian.");
      }
      return wynikSukcesu(stanPrzed, { pokoj: cel }, "Wchodzisz: " + pokojCel.nazwa + ".");
    }

    case "karta":
      if (stanPrzed.pokoj !== 1 || stanPrzed.karta) {
        return wynikOdmowy(stanPrzed, "Tutaj nie ma karty do zabrania.");
      }
      return wynikSukcesu(stanPrzed, { karta: true }, "Zabierasz karte.");

    case "bezpiecznik":
      if (stanPrzed.pokoj !== 2 || stanPrzed.bezpiecznik || stanPrzed.zasilanie) {
        return wynikOdmowy(stanPrzed, "Tutaj nie ma bezpiecznika do zabrania.");
      }
      return wynikSukcesu(stanPrzed, { bezpiecznik: true }, "Zabierasz bezpiecznik.");

    case "napraw":
      if (stanPrzed.pokoj !== 3 || !stanPrzed.bezpiecznik || stanPrzed.zasilanie) {
        return wynikOdmowy(stanPrzed, "Nie mozesz teraz naprawic zasilania.");
      }
      return wynikSukcesu(stanPrzed, { bezpiecznik: false, zasilanie: true },
        "Montujesz bezpiecznik. Zasilanie zostalo przywrocone.");

    case "wyjdz":
      if (stanPrzed.pokoj !== 4 || !stanPrzed.karta || !stanPrzed.zasilanie) {
        return wynikOdmowy(stanPrzed, "Nie mozesz jeszcze otworzyc wyjscia.");
      }
      return wynikSukcesu(stanPrzed, { wygrana: true }, "Otwierasz drzwi i uciekasz z serwerowni!");

    default:
      return wynikOdmowy(stanPrzed,
        "Nieznana komenda. Uzyj: lewo, prawo, karta, bezpiecznik, napraw, wyjdz.");
  }
}

// Walidator stanu z importu: typy, zakresy i zaleznosci z 02_TECH.
function czyStan(wartosc) {
  if (wartosc === null || typeof wartosc !== "object" || Array.isArray(wartosc)) {
    return false;
  }
  if (!Number.isInteger(wartosc.pokoj) || !znajdzPokoj(wartosc.pokoj)) {
    return false;
  }
  if (!Number.isInteger(wartosc.energia) || wartosc.energia < 0 || wartosc.energia > MAKS_ENERGIA) {
    return false;
  }
  const flagi = ["karta", "bezpiecznik", "zasilanie", "koniec", "wygrana"];
  for (const pole of flagi) {
    if (typeof wartosc[pole] !== "boolean") {
      return false;
    }
  }
  if (wartosc.bezpiecznik && wartosc.zasilanie) {
    return false;
  }
  if (wartosc.wygrana && !(wartosc.pokoj === 4 && wartosc.karta && wartosc.zasilanie)) {
    return false;
  }
  if (wartosc.koniec !== (wartosc.wygrana || wartosc.energia === 0)) {
    return false;
  }
  return true;
}
