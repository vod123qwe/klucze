import type { ApplianceSet } from './types'

// Dane zebrane z wyników wyszukiwania ofert w polskich sklepach — ceny orientacyjne.
export const PRICES_CHECKED_AT = '27 września 2026'

export const COMPARE_ROWS = [
  "Typ okapu",
  "Montaż płyty",
  "Płyta ↔ okap",
  "Czyszczenie piekarnika",
  "Para w piekarniku",
  "Lodówka",
  "Aplikacja / Wi‑Fi"
]

export const APPLIANCE_SETS: ApplianceSet[] = [
  {
    "slug": "budzet",
    "label": "Budżet · Amica",
    "tagline": "Czarny zestaw X-TYPE z łączeniem płyta–okap i piekarnikiem z parą",
    "priceRange": "Budżet",
    "accent": "#16a34a",
    "brandSummary": "Cały zestaw od polskiej Amiki w czarnym szkle (seria X-TYPE + płyta/okap z HoodConnect Pro) za ok. 7,7–8,5 tys. zł: płyta i okap łączą się przez Bluetooth, a lodówka ma Total NoFrost.",
    "bestFor": "Dla kogoś, kto urządza mieszkanie z rozsądnym budżetem i chce spójnego czarnego zestawu z łączeniem płyty z okapem i parowym piekarnikiem, ale może zrezygnować z pirolizy i zaakceptować słabszą klasę energetyczną lodówki.",
    "products": [
      {
        "category": "hood",
        "brand": "Amica",
        "model": "OKC6651BS HC",
        "name": "Okap kominowy skośny 60 cm, czarne szkło, HoodConnect",
        "price": 949,
        "oldPrice": 1629,
        "priceConfidence": "estimate",
        "store": "RTV Euro AGD",
        "storeUrl": "https://www.euro.com.pl/okapy/amica-okc6651bs-hc-60cm.bhtml",
        "otherStores": [
          {
            "store": "Media Expert",
            "price": 999
          },
          {
            "store": "Allegro",
            "price": 1050
          }
        ],
        "promo": "Cena ok. 950–1050 zł przy katalogowej 1629 zł. W promocjach Amiki typu Multirabaty okap bywa „piątym produktem za 1 zł” albo „drugim produktem -30%”.",
        "imageUrl": "",
        "finish": "black",
        "specs": {
          "Typ": "kominowy skośny (ścienny)",
          "Szerokość": "60 cm",
          "Wydajność max": "662 m³/h (booster), 422 m³/h nominalnie",
          "Głośność": "47–60 dB (do 68 dB na boosterze)",
          "Klasa energetyczna": "A",
          "Sterowanie": "sensorowe + HoodConnect (Bluetooth)",
          "Filtry": "2 aluminiowe, 5-warstwowe",
          "Tryb": "wyciąg / pochłaniacz"
        },
        "features": [
          "HoodConnect: okap sam startuje i dobiera moc do pracy płyty",
          "4 poziomy mocy, w tym booster",
          "Oświetlenie listwami LED",
          "Automatyczne wyłączanie",
          "Front z czarnego szkła pasuje do piekarnika X-TYPE"
        ],
        "style": "chimney",
        "notes": "To okap ścienny, a nie teleskopowy chowany w szafce, więc nad płytą trzeba zostawić miejsce bez szafki. Parametry (662 m³/h, 47–68 dB) pochodzą z opisów sklepów. Ceny sprawdzone tylko w wynikach wyszukiwania, bo strony sklepów były zablokowane. Jeśli chcesz okap chowany w zabudowie, Amica ma też modele teleskopowe (np. OTP6651BG), ale bez HoodConnect."
      },
      {
        "category": "hob",
        "brand": "Amica",
        "model": "PIT6542PHTSUN HC 3.0",
        "name": "Płyta indukcyjna 60 cm z AutoBridge i HoodConnect Pro",
        "price": 1549,
        "oldPrice": 1699,
        "priceConfidence": "estimate",
        "store": "Sklep Amica (amica.pl)",
        "storeUrl": "https://www.amica.pl/plyta-indukcyjna-pit6542phtsun-hc-3-0",
        "otherStores": [
          {
            "store": "Media Expert",
            "price": 1699
          },
          {
            "store": "Allegro (wersja BL MATT)",
            "price": 2199
          }
        ],
        "promo": "Media Expert: raty 0% (do 40 rat). W sklepie Amica cena 1549 zł.",
        "imageUrl": "",
        "finish": "black",
        "specs": {
          "Szerokość": "59,2 × 52,2 cm",
          "Strefy": "4, 2× AutoBridge (łączenie w 2 duże strefy)",
          "Booster": "PowerBoost na wszystkich polach (0,4 l wody w ok. 60 s)",
          "Sterowanie": "suwak numeryczny, 14 poziomów mocy",
          "Połączenie z okapem": "HoodConnect Pro (Bluetooth)",
          "Moc": "ok. 7,4 kW z ograniczeniem PowerChoice Pro",
          "Montaż": "nablatowy lub na równi z blatem (ten sam SKU)",
          "Wykończenie": "czarne szkło (jest też wersja matowa BL MATT)"
        },
        "features": [
          "AutoBridge: automatyczne łączenie pól pod brytfannę",
          "HoodConnect Pro: automatyczne sterowanie okapem",
          "PowerChoice Pro: ograniczenie mocy przy słabszym przyłączu",
          "Funkcja pauzy, podtrzymania ciepła i topienia",
          "Timer i blokada rodzicielska"
        ],
        "flushMount": true,
        "notes": "Amica deklaruje dla płyt indukcyjnych bez ramki montaż nablatowy albo na równi z blatem, bez osobnego wariantu SKU; jest do tego osobna instrukcja z wymiarami otworu i frezu. Dla bliźniaczego PIH6542PHTSUN HC 3.0 montaż zlicowany potwierdzono wprost, dla PIT nie znalazłem tego wprost, więc trzeba to sprawdzić w instrukcji. Płyta ma tylko Bridge, bez pełnego Flexa, i nie ma Wi-Fi."
      },
      {
        "category": "oven",
        "brand": "Amica",
        "model": "ED47639BA+ X-TYPE STEAM",
        "name": "Piekarnik parowy X-TYPE Steam 77 l, czarny",
        "price": 1799,
        "oldPrice": 1849,
        "priceConfidence": "estimate",
        "store": "Media Expert",
        "storeUrl": "https://www.mediaexpert.pl/agd-do-zabudowy/piekarniki-do-zabudowy/piekarnik-amica-ed47639ba-x-type-steam-56938",
        "otherStores": [
          {
            "store": "Sklep Amica",
            "price": 1849
          },
          {
            "store": "Allegro",
            "price": 1799
          },
          {
            "store": "OleOle",
            "price": 1799
          }
        ],
        "promo": "Allegro regularnie daje kupony 40 zł przy płatności Allegro Pay. W Media Expert bywa akcja Amica „drugi tańszy produkt -40%” z kodem w koszyku (ostatnio dla zestawów z kuchnią wolnostojącą, warunki się zmieniają).",
        "imageUrl": "",
        "finish": "black",
        "specs": {
          "Pojemność": "77 l",
          "Klasa energetyczna": "A+",
          "Termoobieg": "tak (BakingPro System)",
          "Para": "SoftSteam: pieczenie z dodatkiem pary",
          "Czyszczenie": "kataliza + emalia łatwoczyszcząca (bez pirolizy)",
          "Prowadnice": "teleskopowe z hamulcem",
          "Drzwi": "3 szyby, chłodny front",
          "Sterowanie": "dotykowe, wyświetlacz LED"
        },
        "features": [
          "SoftSteam: chrupiąca skórka pieczywa i soczyste mięso",
          "Pojemna komora 77 l",
          "Prowadnice teleskopowe z miękkim wysuwem",
          "Kataliza: tylna ściana sama się oczyszcza",
          "Czarne szkło X-TYPE pasujące do mikrofalówki"
        ],
        "notes": "Nie ma pirolizy, Wi-Fi ani sondy; sondy w tym modelu nie potwierdziłem, zakładaj, że jej nie ma. Para to tylko wspomaganie, a nie gotowanie na parze. Jeśli piroliza jest ważna, Amica ma modele X-TYPE Steam P (np. ED975396BA+), droższe o ok. 600–900 zł."
      },
      {
        "category": "microwave",
        "brand": "Amica",
        "model": "AMMB20E3SGB X-TYPE",
        "name": "Mikrofalówka do zabudowy X-TYPE 20 l z grillem, czarna",
        "price": 1099,
        "oldPrice": 1249,
        "priceConfidence": "estimate",
        "store": "Media Expert",
        "storeUrl": "https://www.mediaexpert.pl/agd-do-zabudowy/kuchnie-mikrofalowe-do-zabudowy/kuchenka-mikrofalowa-amica-ammb20e3sgb-x-type",
        "otherStores": [
          {
            "store": "RTV Euro AGD",
            "price": 1149
          },
          {
            "store": "Allegro",
            "price": 1149
          },
          {
            "store": "Sklep Amica",
            "price": 1199
          }
        ],
        "promo": "Sklep Amica: 1199 zł zamiast 1249 zł. RTV Euro AGD: 1149 zł bez kodu, z kodem ok. 999–1099 zł.",
        "imageUrl": "",
        "finish": "black",
        "specs": {
          "Pojemność": "20 l",
          "Moc mikrofal": "800 W",
          "Grill": "kwarcowy 1000 W, Combigrill",
          "Moc całkowita": "1270 W",
          "Talerz": "25,5 cm",
          "Sterowanie": "elektroniczne, sensorowe",
          "Programy": "8 automatycznych + rozmrażanie wg czasu i wagi",
          "Zabudowa": "wys. ok. 38 cm, do szafki 60 cm"
        },
        "features": [
          "Combigrill: mikrofale z grillem naraz",
          "MultiWave System: równomierne grzanie",
          "Gotowanie wieloetapowe (rozmrażanie, potem grzanie)",
          "QuickStart jednym przyciskiem",
          "Blokada rodzicielska"
        ],
        "notes": "20 l i talerz obrotowy to typowy poziom budżetowy; duży półmisek się nie zmieści. Zanim zamówisz fronty, sprawdź na karcie montażowej wymiar niszy i czy mikrofalówka ma ramkę."
      },
      {
        "category": "fridge",
        "brand": "Amica",
        "model": "BK3055.6 NFMAA",
        "name": "Chłodziarko-zamrażarka do zabudowy 177 cm, Total NoFrost",
        "price": 2299,
        "oldPrice": null,
        "priceConfidence": "estimate",
        "store": "Media Expert",
        "storeUrl": "https://www.mediaexpert.pl/agd-do-zabudowy/lodowki-i-zamrazarki-do-zabudowy/lodowki-do-zabudowy/lodowka-amica-bk3055-6-nfmaa",
        "otherStores": [
          {
            "store": "Allegro",
            "price": 2299
          },
          {
            "store": "Electro.pl",
            "price": 2299
          }
        ],
        "promo": null,
        "imageUrl": "",
        "finish": "black",
        "specs": {
          "Wymiary": "176,9 × 54 × 55 cm (nisza ok. 177–178 cm)",
          "Pojemność": "244 l netto (ok. 177 l chłodziarka + 67 l zamrażarka)",
          "System": "Total NoFrost (obie komory)",
          "Klasa energetyczna": "E (234 kWh/rok)",
          "Hałas": "klasa C (ok. 38–40 dB, szacunkowo)",
          "Zawiasy": "płozowe (przesuwne), drzwi odwracalne",
          "Strefa świeżości": "szuflada VitControl z regulacją wilgotności",
          "Waga": "58 kg"
        },
        "features": [
          "Total NoFrost: bez rozmrażania",
          "Szuflada VitControl z regulacją wilgotności na owoce i warzywa",
          "Cicha praca (Silent)",
          "Łatwy montaż frontu na płozach",
          "Drzwi można przełożyć na drugą stronę"
        ],
        "style": "sliding",
        "notes": "Klasa E zużywa sporo prądu (234 kWh/rok) i to największy kompromis tego zestawu. Zawiasy płozowe to słabszy standard niż zawiasy „drzwi na drzwi”, bo front minimalnie się przesuwa. Alternatywa w tym samym budżecie: Amica BK3235.4DFOMAA."
      }
    ],
    "setPromos": [
      "Amica cyklicznie prowadzi w swoim sklepie „Multirabaty”: drugi produkt -30% albo piąty produkt za 1 zł. Ostatnia edycja trwała 28.08–15.09.2026, więc warto czekać na kolejną, bo przy 5 sprzętach to realnie ok. 950 zł (okap za 1 zł).",
      "Akcja „125 zł rabatu za każde 1000 zł w koszyku” (kod Amica125, min. 2 produkty z różnych kategorii) wraca kilka razy w roku. Przy koszyku ok. 8 tys. zł daje ok. 875–1000 zł rabatu.",
      "Media Expert: akcje Amica „drugi tańszy produkt -40%” z kodem w koszyku i raty 0% (do 40 rat) na większość sprzętów.",
      "RTV Euro AGD / OleOle: kody rabatowe na AGD do zabudowy (zwykle -5 do -10% lub -100/-200 zł od progu), warto łączyć z ratami 0%.",
      "Allegro: kupony 40 zł przy płatności Allegro Pay na pojedyncze produkty."
    ],
    "pros": [
      "Bardzo niska cena całości: ok. 7,7 tys. zł po cenach regularnych, a w promocji zestawowej nawet poniżej 7 tys. zł.",
      "Spójny wygląd: piekarnik i mikrofalówka z tej samej serii X-TYPE (czarne szkło), okap i płyta w czerni.",
      "Płyta i okap łączą się przez Bluetooth (HoodConnect Pro) jak w droższych markach, czyli coś w stylu Hob2Hood.",
      "Płytę można zamontować na równi z blatem albo nablatowo, w tym samym modelu.",
      "Piekarnik z parą (SoftSteam), prowadnicami teleskopowymi i dużą komorą 77 l.",
      "Lodówka z pełnym NoFrost i szufladą z regulacją wilgotności.",
      "Polski producent: łatwy serwis i dostęp do części w całym kraju."
    ],
    "cons": [
      "Lodówka ma tylko klasę E i zawiasy płozowe: wyższe rachunki za prąd i gorsze prowadzenie frontu niż „drzwi na drzwi”.",
      "Piekarnik bez pirolizy, Wi-Fi i (najpewniej) bez sondy, tylko z katalizą.",
      "Płyta ma Bridge, ale nie ma pełnych stref Flex ani Wi-Fi.",
      "Okap kominowy wymaga wolnej ściany nad płytą, nie chowa się w zabudowie.",
      "Mała mikrofalówka (20 l) z talerzem obrotowym."
    ],
    "compare": {
      "Typ okapu": "kominowy skośny, na ścianie",
      "Montaż płyty": "na blat lub na równo — ten sam model",
      "Płyta ↔ okap": "tak, HoodConnect (Bluetooth)",
      "Czyszczenie piekarnika": "kataliza",
      "Para w piekarniku": "tak, SoftSteam",
      "Lodówka": "Total NoFrost, klasa E",
      "Aplikacja / Wi‑Fi": "brak"
    }
  },
  {
    "slug": "srodek",
    "label": "Rozsądny · Bosch",
    "tagline": "Jedna marka, płyta na równo z blatem i piekarnik z pirolizą",
    "priceRange": "Średnia półka",
    "accent": "#2563eb",
    "brandSummary": "Spójny zestaw all-Bosch w czarnym szkle (piekarnik i mikrofala z tej samej nowej linii z pierścieniem sterującym i TFT), z płytą indukcyjną do montażu na równi z blatem i cichą lodówką NoFrost – razem ok. 14,9 tys. zł.",
    "bestFor": "Dla osób, które chcą spójnej, nowoczesnej kuchni jednej marki z efektowną płytą zlicowaną z kamiennym blatem i pirolizą, ale bez przepłacania za topowe modele.",
    "products": [
      {
        "category": "hood",
        "brand": "Bosch",
        "model": "DFS067A51",
        "name": "Bosch Serie 4 okap teleskopowy 60 cm",
        "price": 1499,
        "oldPrice": 1715,
        "priceConfidence": "estimate",
        "store": "Media Expert / RTV Euro AGD",
        "storeUrl": "https://www.obi.pl/okapy-plaskie/bosch-okap-teleskopowy-dfs067a51-srebrny-60-cm/p/7216435",
        "otherStores": [
          {
            "store": "AGDSmart",
            "price": 1716
          },
          {
            "store": "OBI",
            "price": 1599
          }
        ],
        "promo": null,
        "imageUrl": "",
        "finish": "inox",
        "specs": {
          "Typ": "teleskopowy (do zabudowy w szafce 60 cm)",
          "Szerokość": "60 cm",
          "Wydajność max": "728 m³/h (intensywny), 399 m³/h normalny",
          "Głośność": "53 dB normalnie / 68 dB intensywny",
          "Biegi": "3 + intensywny",
          "Oświetlenie": "LED",
          "Sterowanie": "przyciski na listwie",
          "Tryb": "wyciąg lub pochłaniacz"
        },
        "features": [
          "Wysuwana listwa uruchamia okap automatycznie",
          "Wysoka wydajność w trybie intensywnym (728 m³/h)",
          "Oświetlenie LED blatu",
          "Metalowe filtry przeciwtłuszczowe do mycia w zmywarce",
          "Całkowicie schowany w szafce górnej – nie dominuje w kuchni"
        ],
        "style": "telescopic",
        "notes": "Listwa w kolorze srebrny metalik (nie czarne szkło) – przy frontach szafek widoczna tylko wąska krawędź. Brak Home Connect, więc nie współpracuje z automatycznym sterowaniem z płyty (Hob-based Hood Control); do tego potrzebny DFS067K51 (Serie 8, ok. 2600–3000 zł). Nie udało się potwierdzić bieżącej ceny w sklepie – to szacunek na podstawie ofert z 2026 r."
      },
      {
        "category": "hob",
        "brand": "Bosch",
        "model": "PXE601DC1E",
        "name": "Bosch Serie 8 płyta indukcyjna FlexInduction 60 cm, montaż na równi z blatem",
        "price": 3099,
        "oldPrice": 3599,
        "priceConfidence": "estimate",
        "store": "Electro.pl / Mega AGD",
        "storeUrl": "https://www.electro.pl/agd-do-zabudowy/plyty-do-zabudowy/plyta-ceramiczna-bosch-pxe601dc1e",
        "otherStores": [
          {
            "store": "Alsen",
            "price": 3399
          },
          {
            "store": "Mega AGD",
            "price": 3199
          },
          {
            "store": "joppdesign.store",
            "price": 3299
          }
        ],
        "promo": "U części sprzedawców (np. joppdesign.store) raty 0% i rabat przy zakupie w zestawie",
        "imageUrl": "",
        "finish": "black",
        "specs": {
          "Szerokość": "60 cm",
          "Montaż": "na równi z blatem (zlicowany) – wariant dedykowany",
          "Strefy": "4 pola, w tym 1 strefa FlexInduction (łączenie 2 pól)",
          "Booster": "PowerBoost na wszystkich polach",
          "Sterowanie": "DirectSelect Premium (dotykowy suwak)",
          "Łączność": "Home Connect (Wi‑Fi), Hob-based Hood Control",
          "Blat": "kamień, konglomerat, granit, lity drewniany (wg instrukcji)",
          "Moc": "ok. 7,4 kW"
        },
        "features": [
          "Strefa FlexInduction na duże i nietypowe naczynia",
          "PowerBoost na każdym polu",
          "Home Connect i automatyczne sterowanie kompatybilnym okapem",
          "Tafla idealnie zlicowana z blatem – bez ramki",
          "Funkcje timer, zabezpieczenie przed dziećmi, wskaźnik ciepła resztkowego"
        ],
        "style": "flush",
        "flushMount": true,
        "notes": "To jest wariant WYŁĄCZNIE do montażu na równi z blatem (litera D w kodzie). Wersja nablatowa to inny SKU (np. PXE651FC1E z listwami bocznymi). Montaż zlicowany wymaga frezowania wpustu w blacie (koszt stolarza/kamieniarza 300–800 zł) i blatu z kamienia/konglomeratu – przy blacie laminowanym zwykle niezalecany. Bosch nie ma w Serie 4/6 płyty 60 cm do montażu zlicowanego, stąd Serie 8. Alternatywa ‘jeden SKU, dwa montaże’: Electrolux SenseBoil 700 SLIM-FIT EIS62453 (~1900 zł)."
      },
      {
        "category": "oven",
        "brand": "Bosch",
        "model": "HBG7741B1",
        "name": "Bosch piekarnik z pirolizą, AirFry i Home Connect 71 l",
        "price": 4099,
        "oldPrice": 4799,
        "priceConfidence": "estimate",
        "store": "Mega AGD",
        "storeUrl": "https://mega-agd.pl/produkt/piekarnik-elektryczny-bosch-hbg7741b1-serie-8-czarny-pyroliza/",
        "otherStores": [
          {
            "store": "Ceneo (od)",
            "price": 4199
          },
          {
            "store": "vieffetrade",
            "price": 4158
          },
          {
            "store": "Leroy Merlin",
            "price": 4399
          }
        ],
        "promo": "Mega AGD oferuje zestaw piekarnik HBG7741B1 + mikrofala BFL7221B1 w obniżonej cenie",
        "imageUrl": "",
        "finish": "black",
        "specs": {
          "Pojemność": "71 l",
          "Klasa energetyczna": "A+",
          "Czyszczenie": "piroliza (3 poziomy)",
          "Termoobieg": "Termoobieg 3D + AirFry",
          "Tryby": "14, temp. 30–300°C",
          "Sterowanie": "pierścień + wyświetlacz TFT",
          "Łączność": "Home Connect (Wi‑Fi)",
          "Kolor": "czarne szkło"
        },
        "features": [
          "Piroliza – bez szorowania komory",
          "AirFry – frytki i nuggetsy bez tłuszczu",
          "Termoobieg 3D pieczenie na 3 poziomach",
          "Home Connect – sterowanie z telefonu",
          "Szybkie nagrzewanie i pizza do 300°C"
        ],
        "notes": "Bosch w 2025/26 przeniósł ten model z oznaczenia Serie 6 do Serie 8 – sklepy podają obie nazwy. Brak funkcji pary; prowadnice teleskopowe i termosonda zależą od wersji/wyposażenia – sprawdź przed zakupem (prowadnice można dokupić, np. HEZ638200). Wersje z parą: HRG7361B1/HRG7764B1 (drożej)."
      },
      {
        "category": "microwave",
        "brand": "Bosch",
        "model": "BEL7321B1",
        "name": "Bosch kuchenka mikrofalowa do zabudowy z grillem 21 l",
        "price": 2715,
        "oldPrice": 3129,
        "priceConfidence": "estimate",
        "store": "AGDSmart / Ceneo (od)",
        "storeUrl": "https://agdsmart.pl/kuchenka-mikrofalowa-bosch-bel7321b1,id118244.html",
        "otherStores": [
          {
            "store": "Allegro",
            "price": 2749
          },
          {
            "store": "Platforma AGD",
            "price": 2999
          }
        ],
        "promo": null,
        "imageUrl": "",
        "finish": "black",
        "specs": {
          "Wysokość": "38 cm (do szafki 60 cm)",
          "Pojemność": "21 l",
          "Moc mikrofal": "900 W, 5 poziomów, inwerter",
          "Grill": "1300 W, płaska grzałka",
          "Sterowanie": "pierścień + TFT dotykowy",
          "Programy": "10 AutoPilot",
          "Wnętrze": "stal nierdzewna",
          "Kolor": "czarne szkło"
        },
        "features": [
          "Ten sam design co piekarnik (pierścień, TFT)",
          "Grill do zapiekanek",
          "Inwerter – równomierne podgrzewanie",
          "10 programów automatycznych",
          "Łatwe do czyszczenia stalowe wnętrze"
        ],
        "notes": "Tańsza alternatywa bez nowego designu: BEL634GB1 (ok. 1800–2400 zł, OleOle 20 rat 0%), ale wizualnie odstaje od piekarnika HBG77. Wersja bez grilla: BFL7221B1."
      },
      {
        "category": "fridge",
        "brand": "Bosch",
        "model": "KIN86VFE0",
        "name": "Bosch Serie 4 chłodziarko-zamrażarka do zabudowy NoFrost 177 cm",
        "price": 3494,
        "oldPrice": 4249,
        "priceConfidence": "estimate",
        "store": "Neonet",
        "storeUrl": "https://www.neonet.pl/lodowki-do-zabudowy/bosch-kin86vfe0.html",
        "otherStores": [
          {
            "store": "AGDSmart",
            "price": 3529
          },
          {
            "store": "DekoracjaDomu.pl",
            "price": 3849
          },
          {
            "store": "RTV Euro AGD",
            "price": 3799
          }
        ],
        "promo": "Neonet: niższa cena z kodem rabatowym (ok. 3494 zł zamiast 4249 zł) – sprawdź aktualny kod w koszyku",
        "imageUrl": "",
        "finish": "black",
        "specs": {
          "Wnęka": "177,5 cm (urządzenie 177,2 cm)",
          "System": "NoFrost (zamrażarka)",
          "Pojemność": "260 l (184 l chłodziarka + 76 l zamrażarka)",
          "Klasa energetyczna": "E (234 kWh/rok)",
          "Głośność": "35 dB",
          "Zawiasy": "płozowe/ślizgowe (wg części sklepów), zamienne",
          "Strefa świeżości": "VitaFresh",
          "Sterowanie": "elektroniczne, LED"
        },
        "features": [
          "NoFrost – bez rozmrażania zamrażarki",
          "Szuflada VitaFresh na owoce i warzywa",
          "Cicha praca 35 dB",
          "Oświetlenie LED",
          "Zamienne kierunki otwierania drzwi"
        ],
        "notes": "Klasa E to przeciętna efektywność – wersje D/C (np. KIN86ADD0 Serie 6) kosztują ok. 1000–1500 zł więcej. Neonet opisuje zawiasy jako ‘nożycowe’, inne sklepy jako ślizgowe – zweryfikuj z projektantem mebli (od typu zawiasu zależy sposób montażu frontu)."
      }
    ],
    "setPromos": [
      "Wszystkie cztery urządzenia do gotowania i lodówka to jedna marka, więc wiele sklepów (Mega AGD, joppdesign, Neonet) daje dodatkowy rabat ‘kup w zestawie i zapłać mniej’ – warto negocjować cenę za komplet.",
      "Duże akcje cashback Bosch w 2026 r. już się skończyły: ‘do 3000 zł zwrotu za urządzenia do gotowania’ (17.03–15.06.2026) i ‘do 1200 zł za lodówkę’ (04.05–04.08.2026). Bosch zwykle wznawia promocję na piekarniki/płyty jesienią (listopad) – warto śledzić promocjebsh.pl przed zakupem.",
      "Obecnie (01.09–15.11.2026) trwa cashback Bosch do 700 zł za zmywarkę – jeśli planujesz zmywarkę do zabudowy, dokup Boscha.",
      "Raty 0% (np. 20 rat w OleOle/RTV Euro AGD) i kody rabatowe w koszyku Neonet/Media Expert pojawiają się regularnie – porównuj ceny na Ceneo tuż przed zamówieniem.",
      "Warunek cashbacków Bosch: rejestracja zakupu i opinia z hashtagiem #opiniamotywowanapromocją; urządzenia z różnych sklepów w odstępie do 30 dni."
    ],
    "pros": [
      "Jedna marka i spójny design – piekarnik i mikrofala z tej samej linii (pierścień + TFT, czarne szkło), jeden serwis i jedna aplikacja Home Connect.",
      "Płyta indukcyjna montowana na równi z blatem z FlexInduction i PowerBoost – efekt premium w cenie średniej półki.",
      "Piekarnik z pirolizą i AirFry – najwygodniejsze czyszczenie i nowoczesne funkcje.",
      "Mocny, a niewidoczny okap teleskopowy (728 m³/h w trybie intensywnym).",
      "Cicha lodówka NoFrost 35 dB z szufladą VitaFresh.",
      "Łączny koszt ok. 14,9 tys. zł – mieści się w budżecie z zapasem na montaż płyty zlicowanej."
    ],
    "cons": [
      "Płyta PXE601DC1E jest tylko do montażu zlicowanego – wymaga blatu z kamienia/konglomeratu i precyzyjnego frezowania; wersja nablatowa to inny model.",
      "Okap Serie 4 nie ma Wi‑Fi – brak automatycznego sterowania z płyty; listwa jest srebrna, nie czarna.",
      "Lodówka tylko w klasie E – wyższe zużycie prądu niż modele D/C.",
      "Piekarnik bez funkcji pary; prowadnice teleskopowe/sonda mogą wymagać dokupienia.",
      "Obecnie brak aktywnego cashbacku Bosch na urządzenia do gotowania i lodówki – ceny to szacunki, warto poczekać na promocję jesienną.",
      "Mikrofala z nowej linii jest dość droga (ok. 2,7 tys. zł) w stosunku do funkcji."
    ],
    "compare": {
      "Typ okapu": "teleskopowy, schowany w szafce",
      "Montaż płyty": "tylko na równo (nablatowa: PXE651FC1E)",
      "Płyta ↔ okap": "nie",
      "Czyszczenie piekarnika": "piroliza",
      "Para w piekarniku": "nie",
      "Lodówka": "NoFrost, klasa E, 35 dB",
      "Aplikacja / Wi‑Fi": "piekarnik i płyta (Home Connect)"
    }
  },
  {
    "slug": "smart",
    "label": "Smart · AEG",
    "tagline": "Okap sterowany przez płytę, piekarnik parowy z aplikacją",
    "priceRange": "Wyższa średnia",
    "accent": "#9333ea",
    "brandSummary": "Pełny zestaw AEG serii 7000/8000: płyta SLIM-FIT z Hob2Hood sterująca okapem, piekarnik parowy SteamCrisp z Wi-Fi i aplikacją My AEG Kitchen, mikrofala 38 cm i lodówka NoFrost 177 cm – czarne szkło + inox.",
    "bestFor": "Dla osób, które chcą inteligentnej kuchni z automatycznym okapem, piekarnikiem parowym z aplikacją i płytą zlicowaną z blatem, bez przepłacania za topowe serie premium.",
    "products": [
      {
        "category": "hood",
        "brand": "AEG",
        "model": "DGE5661HM",
        "name": "Okap zintegrowany 6000/7000 Hob2Hood 54 cm",
        "price": 1449,
        "oldPrice": 1599,
        "priceConfidence": "estimate",
        "store": "Ceneo",
        "storeUrl": "https://www.ceneo.pl/102305953",
        "otherStores": [
          {
            "store": "Ekspert-AGD",
            "price": 1489
          },
          {
            "store": "LUKE.pl",
            "price": 1449
          },
          {
            "store": "Media Expert",
            "price": 1599
          }
        ],
        "promo": "W wielu sklepach oznaczony jako PROMOCJA; część sklepów oferuje raty 0% i darmową dostawę",
        "imageUrl": "",
        "finish": "inox",
        "specs": {
          "Typ": "do zabudowy w szafce 60 cm (szer. 54 cm)",
          "Wydajność max": "700 m³/h (intensywny)",
          "Recyrkulacja": "do 430 m³/h",
          "Głośność": "54–67 dB(A)",
          "Oświetlenie": "LED",
          "Sterowanie": "elektroniczne + Hob2Hood",
          "Tryb": "wyciąg lub pochłaniacz (filtr węglowy opcja)",
          "Kolor": "stal szlachetna"
        },
        "features": [
          "Hob2Hood – automatyczna praca sterowana przez płytę",
          "Niewidoczny w zabudowie – tylko listwa z panelem",
          "Wydajność do 700 m³/h",
          "Oświetlenie LED blatu",
          "Tryb wyciągu lub recyrkulacji"
        ],
        "style": "telescopic",
        "notes": "Mieści się w standardowej szafce 60 cm. Hałas 67 dB na biegu intensywnym jest przeciętny. Filtr węglowy do recyrkulacji kupowany osobno. Cena szacunkowa."
      },
      {
        "category": "hob",
        "brand": "AEG",
        "model": "TH64IB30FB",
        "name": "Płyta indukcyjna 8000 Sense Boil+Fry SLIM-FIT 60 cm",
        "price": 3799,
        "oldPrice": null,
        "priceConfidence": "estimate",
        "store": "Media Expert",
        "storeUrl": "https://www.mediaexpert.pl/agd-do-zabudowy/plyty-do-zabudowy/plyta-indukcyjna-aeg-th64ib30fb-8000-sense-boil-fry-slim-fit-60-cm",
        "otherStores": [
          {
            "store": "Allegro",
            "price": 3899
          },
          {
            "store": "Morele.net",
            "price": 3849
          }
        ],
        "promo": null,
        "imageUrl": "",
        "finish": "black",
        "specs": {
          "Szerokość": "59 cm (60 cm)",
          "Strefy": "4, w tym Bridge (łączenie 2 stref)",
          "Booster": "tak, PowerBoost",
          "Sterowanie": "CookSmart – dotykowy wyświetlacz",
          "Czujniki": "SenseBoil + SenseFry",
          "Połączenie z okapem": "Hob2Hood (IR)",
          "Montaż": "nablatowy lub zlicowany (SLIM-FIT)",
          "Wykończenie": "czarne szkło, bezramkowa"
        },
        "features": [
          "SenseBoil – wykrywa wrzenie i sam zmniejsza moc",
          "SenseFry – utrzymuje stałą temperaturę smażenia",
          "Funkcja Bridge dla brytfanny / grillowej patelni",
          "Hob2Hood – automatycznie steruje okapem",
          "SLIM-FIT – do cienkich blatów od 12 mm i montażu na równo"
        ],
        "style": "flex",
        "flushMount": true,
        "notes": "Seria SLIM-FIT AEG pozwala na montaż nablatowy i zlicowany tym samym SKU (bez osobnego wariantu) – zlicowanie wymaga frezowania blatu wg instrukcji montażu; potwierdź w instrukcji przed zamówieniem blatu. Tańsza alternatywa z tą samą koncepcją: AEG TI64IG00FB 6000 Flex Bridge SLIM-FIT (~2 899–2 999 zł). Płyta nie ma Wi-Fi – łączność z okapem przez Hob2Hood."
      },
      {
        "category": "oven",
        "brand": "AEG",
        "model": "BSE778380B",
        "name": "Piekarnik parowy SteamCrisp 7000 z pirolizą i Wi-Fi",
        "price": 4790,
        "oldPrice": null,
        "priceConfidence": "estimate",
        "store": "PiekarnikiParowe.com",
        "storeUrl": "https://piekarnikiparowe.com/produkt/wysyla-24h-piekarnik-parowy-2w1-aeg-bse778380b-kamien-do-pizzy-blacha-piekarska-i-akcesoria-wi-fi/",
        "otherStores": [
          {
            "store": "Ceneo (od)",
            "price": 4790
          },
          {
            "store": "hiperAGD",
            "price": 4899
          },
          {
            "store": "Ekspert-AGD",
            "price": 4999
          }
        ],
        "promo": "PiekarnikiParowe.com: w zestawie kamień do pizzy z łopatą, dodatkowa blacha i akcesoria; możliwe 5 lat gwarancji w ramach akcji AEG",
        "imageUrl": "",
        "finish": "black",
        "specs": {
          "Pojemność": "70 l",
          "Klasa energetyczna": "A+",
          "Grzanie": "termoobieg + SteamCrisp (para)",
          "Czyszczenie": "piroliza",
          "Sonda": "tak, Food Sensor",
          "Prowadnice": "teleskopowe, 2 poziomy",
          "Sterowanie": "wyświetlacz dotykowy + Wi-Fi (My AEG Kitchen)",
          "Drzwi": "cicho zamykające się"
        },
        "features": [
          "SteamCrisp – para + termoobieg: soczyste wnętrze, chrupiąca skórka",
          "Piroliza – samoczyszczenie",
          "Sonda do mięsa z powiadomieniem",
          "Wi-Fi i aplikacja My AEG Kitchen – zdalny start i podgląd",
          "Asystent gotowania z programami automatycznymi"
        ],
        "notes": "Para wspomagająca (SteamCrisp), nie pełne gotowanie na parze 100% – do tego potrzebny SteamBoost BSE788380B (~5 400 zł, ale bez pirolizy) lub seria 9000 SteamPro. Prowadnice teleskopowe tylko na 2 poziomach."
      },
      {
        "category": "microwave",
        "brand": "AEG",
        "model": "MBE2658DEM",
        "name": "Kuchenka mikrofalowa do zabudowy 26 l z grillem",
        "price": 2089,
        "oldPrice": 2599,
        "priceConfidence": "estimate",
        "store": "Gigamarket",
        "storeUrl": "https://gigamarket.pl/kuchenka-mikrofalowa-aeg-mbe2658dem,id1450.html",
        "otherStores": [
          {
            "store": "Media Expert",
            "price": 2299
          },
          {
            "store": "RTV Euro AGD",
            "price": 2299
          },
          {
            "store": "tomdom",
            "price": 2599
          }
        ],
        "promo": null,
        "imageUrl": "",
        "finish": "inox",
        "specs": {
          "Wysokość": "38 cm (wnęka 60 cm szer.)",
          "Pojemność": "26 l",
          "Moc mikrofal": "900 W, 5 poziomów",
          "Grill": "tak (ok. 1000 W)",
          "Sterowanie": "elektroniczne, wyświetlacz LED",
          "Talerz": "obrotowy 32,5 cm",
          "Kolor": "czarne szkło + inox",
          "Blokada": "rodzicielska"
        },
        "features": [
          "Standardowa wysokość 38 cm – do szafki 60 cm lub słupka",
          "Grill do zapiekania",
          "Pojemność 26 l – mieści duże talerze",
          "Automatyczne programy rozmrażania",
          "Blokada przed dziećmi"
        ],
        "notes": "Wykończenie 'M' = inox z czarnym szkłem – lekko inna estetyka niż czarny piekarnik. W pełni czarna AEG MBB1756SEB (8000, ~1 595–1 850 zł) ma tylko 16,8 l, 800 W i brak grilla, więc nie jest rekomendowana. Mikrofala bez Wi-Fi."
      },
      {
        "category": "fridge",
        "brand": "AEG",
        "model": "TSC7G181ES",
        "name": "Lodówka do zabudowy GreenZone 7000 177,2 cm TwinTech NoFrost",
        "price": 4595,
        "oldPrice": null,
        "priceConfidence": "estimate",
        "store": "AGDHOME / Elektrohome",
        "storeUrl": "https://www.ceneo.pl/152021810",
        "otherStores": [
          {
            "store": "Ekspert-AGD",
            "price": 4699
          },
          {
            "store": "zabudowa-agd.pl",
            "price": 4649
          },
          {
            "store": "Allegro",
            "price": 4799
          }
        ],
        "promo": "AGDHOME/Elektrohome: kod rabatowy BON100 (-100 zł) na wybrane produkty AEG",
        "imageUrl": "",
        "finish": "black",
        "specs": {
          "Wysokość wnęki": "177–178 cm",
          "Pojemność": "194 l chłodziarka + 62 l zamrażarka",
          "System": "TwinTech NoFrost (2 obiegi)",
          "Klasa energetyczna": "E (216 kWh/rok)",
          "Głośność": "36 dB",
          "Strefa świeżości": "GreenZone z kontrolą wilgotności",
          "Montaż drzwi": "zawiasy płozowe (sliding)",
          "Zamrażanie": "7 kg/24h"
        },
        "features": [
          "TwinTech – dwa obiegi, żywność nie wysycha",
          "NoFrost w zamrażarce – bez rozmrażania",
          "Szuflada GreenZone na warzywa z regulacją wilgotności",
          "Cicha praca 36 dB",
          "Wskaźnik Ecometer"
        ],
        "notes": "Klasa E to średnia efektywność – lepsze modele AEG serii 8000 (klasa D/C) kosztują ok. 5 500–6 500 zł. Zawiasy płozowe – zweryfikuj w instrukcji montażu; są prostsze w montażu, ale drzwi meblowe pracują mniej sztywno niż na zawiasach stałych. Brak Wi-Fi."
      }
    ],
    "setPromos": [
      "AEG regularnie prowadzi akcję 'Kup sprzęt AEG i odbierz przedłużoną gwarancję' (ostatnio 12.01–30.06.2026) – sprawdź, czy jest nowa edycja jesienią 2026",
      "Sklepy specjalistyczne (PiekarnikiParowe.com, AGDHOME, Ekspert-AGD) często dają rabat na cały zestaw po zapytaniu mailowym – negocjuj cenę za 5 sztuk",
      "Kod BON100 w AGDHOME/Elektrohome oraz raty 0% w wielu sklepach",
      "Dla porównania: Samsung prowadził cashback AGD 2026 (do 3 800 zł za zestaw 5 urządzeń, 24.06–15.08.2026) – jeśli pojawi się nowa edycja, zestaw Samsung Bespoke może wyjść taniej"
    ],
    "pros": [
      "Hob2Hood – okap sam włącza się i reguluje moc zależnie od pracy płyty",
      "Płyta SLIM-FIT do montażu zlicowanego lub nablatowego w tym samym modelu",
      "Piekarnik z parą SteamCrisp, pirolizą, sondą i Wi-Fi w jednym",
      "Jedna marka i spójna stylistyka czarnego szkła AEG",
      "Czujniki SenseBoil/SenseFry realnie ułatwiają gotowanie",
      "Lodówka TwinTech NoFrost cicha (36 dB) z szufladą GreenZone",
      "Szeroka dostępność w sklepach i serwis AEG/Electrolux w całej Polsce"
    ],
    "cons": [
      "Ekosystem aplikacji ograniczony: Wi-Fi ma tylko piekarnik, reszta nie łączy się z aplikacją (słabiej niż Samsung SmartThings)",
      "Mikrofala w wykończeniu inox + czarne szkło – nie idealnie pasuje do czarnego piekarnika",
      "Lodówka tylko klasy E",
      "Okap 67 dB na najwyższym biegu",
      "Piekarnik ma parę wspomagającą, a nie pełne gotowanie na parze"
    ],
    "compare": {
      "Typ okapu": "do zabudowy w szafce 60 cm",
      "Montaż płyty": "na blat lub na równo — SLIM-FIT (potwierdź w instrukcji)",
      "Płyta ↔ okap": "tak, Hob2Hood (automatycznie)",
      "Czyszczenie piekarnika": "piroliza",
      "Para w piekarniku": "tak, SteamCrisp",
      "Lodówka": "TwinTech NoFrost, klasa E, 36 dB",
      "Aplikacja / Wi‑Fi": "piekarnik (My AEG Kitchen)"
    }
  },
  {
    "slug": "premium",
    "label": "Premium · Siemens iQ700",
    "tagline": "Płyta zlicowana z blatem, para + piroliza, lodówka hyperFresh 0°C",
    "priceRange": "Premium",
    "accent": "#b45309",
    "brandSummary": "Spójny zestaw Siemens iQ700 w czarnym szkle i stali: zlicowana płyta flexInduction, piekarnik z parą i pirolizą, bezobrotowa mikrofala 38 cm, cichy okap teleskopowy iQdrive i lodówka z hyperFresh Premium 0°C.",
    "bestFor": "Dla osób, które chcą dopracowanej, spójnej wizualnie kuchni premium z płytą na równo z blatem i piekarnikiem z parą, bez przepłacania za Miele.",
    "products": [
      {
        "category": "hood",
        "brand": "Siemens",
        "model": "LI67SA680",
        "name": "Okap teleskopowy Siemens iQ700 60 cm",
        "price": 4499,
        "oldPrice": null,
        "priceConfidence": "estimate",
        "store": "e-katalog.pl",
        "storeUrl": "https://e-katalog.pl/SIEMENS-LI-67SA680.htm",
        "otherStores": [
          {
            "store": "e-katalog.pl (najniższa zindeksowana oferta)",
            "price": 6056
          }
        ],
        "promo": null,
        "imageUrl": "",
        "finish": "black",
        "specs": {
          "Typ": "teleskopowy, do zabudowy w szafce 60 cm",
          "Szerokość": "59,8 cm",
          "Wydajność maks.": "700 m³/h (intensywna)",
          "Głośność": "ok. 40 dB (min.) – ok. 54 dB (maks. normalny)",
          "Silnik": "bezszczotkowy iQdrive",
          "Oświetlenie": "LED",
          "Tryby": "wyciąg lub pochłanianie (filtr węglowy)",
          "Klasa energetyczna": "A"
        },
        "features": [
          "Bardzo cichy silnik iQdrive",
          "Tryb intensywny z automatycznym powrotem",
          "Chowa się w szafce – widoczna tylko listwa",
          "Oświetlenie LED o regulowanej jasności",
          "Metalowe filtry do mycia w zmywarce"
        ],
        "style": "telescopic",
        "notes": "Nie udało się potwierdzić ceny na żywo w dużych sieciach (model rzadziej spotykany w PL; e-katalog pokazuje ok. 6 056 zł, realnie w studiach ok. 4–4,5 tys. zł). Brak Home Connect/cookConnect – sterowanie z płyty niemożliwe. Tańsza alternatywa dostępna od ręki: Siemens LI67RA560 (ok. 54 dB, 700 m³/h)."
      },
      {
        "category": "hob",
        "brand": "Siemens",
        "model": "EX675LYC1E",
        "name": "Płyta indukcyjna Siemens iQ700 flexInduction 60 cm, montaż zlicowany",
        "price": 4099,
        "oldPrice": 4399,
        "priceConfidence": "estimate",
        "store": "AGDsmart / Elektrohome",
        "storeUrl": "https://agdsmart.pl/plyta-indukcyjna-siemens-ex675lyc1e,id81580.html",
        "otherStores": [
          {
            "store": "Media Expert",
            "price": 4399
          },
          {
            "store": "Elektrohome",
            "price": 4099
          },
          {
            "store": "Neonet",
            "price": 4399
          }
        ],
        "promo": "Media Expert: raty 0% i darmowa dostawa; montaż płyty w zabudowie ok. 209 zł (Morele).",
        "imageUrl": "",
        "finish": "black",
        "specs": {
          "Szerokość": "60,2 cm",
          "Montaż": "zlicowany z blatem (na równo)",
          "Strefy": "4, w tym 2 strefy flexInduction",
          "Moc": "7,4 kW",
          "Poziomy mocy": "17",
          "Booster": "powerBoost (do +50%)",
          "Sterowanie": "dotykowe dualLightSlider",
          "Połączenie z okapem": "brak (bez Home Connect)"
        },
        "features": [
          "Dwie strefy flexInduction – duże naczynia i brytfanny",
          "powerMove Plus – 3 poziomy mocy przez przesuwanie garnka",
          "Czujnik smażenia fryingSensor Plus",
          "powerBoost na każdej strefie",
          "Timer i blokada rodzicielska"
        ],
        "style": "flush",
        "flushMount": true,
        "notes": "Wariant „LY” to wersja wyłącznie do montażu zlicowanego (wymaga frezowania blatu, najlepiej w konglomeracie/spieku/granicie). Wersja nablatowa to osobny SKU EX675LXC1E (fazowane krawędzie) – ten sam wybór funkcji. Model starszej generacji (bez Wi‑Fi/cookConnect); jeśli zależy Ci na połączeniu z okapem, trzeba wybrać płytę z Home Connect i okap z Home Connect."
      },
      {
        "category": "oven",
        "brand": "Siemens",
        "model": "HR776G1B1",
        "name": "Piekarnik parowy Siemens iQ700 z pirolizą i Air Fry",
        "price": 5299,
        "oldPrice": null,
        "priceConfidence": "estimate",
        "store": "Ceneo",
        "storeUrl": "https://www.ceneo.pl/169564184",
        "otherStores": [
          {
            "store": "AGDsmart",
            "price": 5299
          },
          {
            "store": "Mega AGD / Elektrohome",
            "price": 5679
          },
          {
            "store": "agdhome.pl (z kodem BON100)",
            "price": 5500
          }
        ],
        "promo": "agdhome.pl: kod BON100 (-100 zł); Media Expert: akcja „Nawet 400 zł na kolejne zakupy – Bosch/Siemens” dla wybranych modeli.",
        "imageUrl": "",
        "finish": "black",
        "specs": {
          "Pojemność": "71 l",
          "Klasa energetyczna": "A+",
          "Funkcje grzania": "19, w tym termoobieg 4D i Air Fry",
          "Para": "wspomaganie parą (dodawanie pary)",
          "Czyszczenie": "piroliza activeClean + hydroliza humidClean",
          "Wyświetlacz": "kolorowy TFT dotykowy",
          "Łączność": "Wi‑Fi Home Connect",
          "Temperatura": "30–300°C"
        },
        "features": [
          "Wspomaganie parą – chrupiące pieczywo i soczyste mięso",
          "Piroliza i łagodne czyszczenie parą w jednym",
          "Tryb Air Fry bez frytkownicy",
          "Termoobieg 4D – pieczenie na 4 poziomach",
          "Sterowanie z aplikacji Home Connect",
          "Made in Germany"
        ],
        "notes": "Prowadnice teleskopowe i termosonda zależą od wariantu (HR776G1B1 vs HR776G3B1) – sprawdź zawartość zestawu przed zakupem. To piekarnik z dodawaniem pary, nie pełny parowar; pełna para (fullSteam) to HS758G3B1 (ok. 6 700 zł), ale bez pirolizy."
      },
      {
        "category": "microwave",
        "brand": "Siemens",
        "model": "BF722L1B1",
        "name": "Mikrofalówka do zabudowy Siemens iQ700 38 cm",
        "price": 2521,
        "oldPrice": 3099,
        "priceConfidence": "estimate",
        "store": "Allegro",
        "storeUrl": "https://allegro.pl/produkt/kuchenka-mikrofalowa-do-zabudowy-siemens-bf722l1b1-czarny-04e0ac13-5ee1-41e1-a283-244b737846dc",
        "otherStores": [
          {
            "store": "Elektrohome",
            "price": 3099
          },
          {
            "store": "Kaufland (marketplace)",
            "price": 4030
          },
          {
            "store": "Media Expert",
            "price": 2999
          }
        ],
        "promo": "Media Expert: model objęty akcją „Nawet 400 zł na kolejne zakupy – Bosch/Siemens” (kod na kolejne zakupy po ok. 4 tygodniach).",
        "imageUrl": "",
        "finish": "black",
        "specs": {
          "Wysokość": "38,2 cm",
          "Szerokość": "59,4 cm (szafka 60 cm)",
          "Pojemność": "21 l",
          "Moc mikrofal": "900 W, 5 poziomów",
          "Grill": "brak (solo)",
          "Talerz": "brak – płaskie dno",
          "Sterowanie": "dotykowe TFT, 7 programów cookControl",
          "Drzwi": "otwierane w lewo"
        },
        "features": [
          "Płaskie dno bez talerza obrotowego – łatwe czyszczenie",
          "humidClean – szybkie czyszczenie parą",
          "7 programów automatycznych cookControl7",
          "Design identyczny z piekarnikiem iQ700",
          "Kompaktowa wysokość 38 cm – nad piekarnikiem w słupku"
        ],
        "notes": "Wersja bez grilla. Jeśli chcesz grill – BE732R1B1/BE732L1B1 (iQ700, 21 l, 900 W + grill 1200 W). Wariant z zawiasem po prawej: BF722R1B1."
      },
      {
        "category": "fridge",
        "brand": "Siemens",
        "model": "KI86FPDD0",
        "name": "Lodówka do zabudowy Siemens iQ700 hyperFresh Premium 0°C",
        "price": 7499,
        "oldPrice": null,
        "priceConfidence": "estimate",
        "store": "Alza.cz (oferta CZ)",
        "storeUrl": "https://www.alza.cz/siemens-ki86fpdd0-d6332497.htm",
        "otherStores": [
          {
            "store": "vstavanespotrebice.sk (1 734 €)",
            "price": 7400
          },
          {
            "store": "Alza.cz / housemode.cz (44 380 Kč)",
            "price": 7600
          }
        ],
        "promo": null,
        "imageUrl": "",
        "finish": "black",
        "specs": {
          "Wnęka": "177,5 cm",
          "Pojemność": "ok. 223 l (156 l chłodziarka + 67 l zamrażarka)",
          "Świeżość": "hyperFresh Premium 0°C (szuflady z kontrolą wilgotności)",
          "System": "lowFrost / NoFrost wg źródeł – do weryfikacji",
          "Klasa energetyczna": "D",
          "Zawias": "płaski (flat hinge) z softClose",
          "Funkcje": "superCooling, superFreezing",
          "Oświetlenie": "LED"
        },
        "features": [
          "hyperFresh Premium 0°C – mięso i ryby do 3× dłużej świeże",
          "Zawias płaski z softClose – drzwi na drzwi, stabilny montaż",
          "Szybkie schładzanie superCooling",
          "Równomierne oświetlenie LED",
          "bigBox w zamrażarce"
        ],
        "notes": "Najwyższy model iQ700 w tej wnęce, ale słabo dostępny w polskich sieciach (ceny z CZ/SK) – zamawiany zwykle przez studia kuchenne. Dostępna od ręki alternatywa: Siemens iQ500 KI86NADD0 (NoFrost, hyperFresh, 260 l, od ok. 3 789 zł). Mniejsza pojemność niż w lodówkach z zawiasem płozowym szerszym; głośność ok. 35–36 dB (szacunek)."
      }
    ],
    "setPromos": [
      "Media Expert: „Nawet 400 zł na kolejne zakupy – Bosch/Siemens” – kod na następne zakupy za wybrane urządzenia do zabudowy (nie łączy się z innymi kodami, bez OUTLET).",
      "Siemens: przy zakupie urządzeń razem z meblami kuchennymi w studiu (01.01–31.12.2026) dodatkowe 3 lata gwarancji.",
      "Siemens regularnie prowadzi cashback do 6 500 zł (ostatnia edycja: 17.03–15.06.2026) – warto sprawdzić siemens-home.bsh-group.com/pl/kampanie przed zakupem, jesienią często startuje kolejna edycja.",
      "Sklepy typu „kup w zestawie i zapłać mniej” (np. myagd.pl, joppdesign.store) negocjują rabat za komplet 5 urządzeń – realnie 5–10%.",
      "Raty 0% dostępne w Media Expert, RTV Euro AGD i Neonet na większość urządzeń Siemens."
    ],
    "pros": [
      "Jednolity design iQ700 – czarne szkło i stal, identyczne linie piekarnika i mikrofali w słupku",
      "Płyta montowana na równo z blatem – efekt premium i łatwe czyszczenie",
      "Piekarnik łączy wspomaganie parą, pirolizę, hydrolizę i Air Fry – bardzo uniwersalny",
      "Cichy okap teleskopowy iQdrive ukryty w szafce",
      "hyperFresh Premium 0°C w lodówce – realnie dłuższa świeżość mięsa i warzyw",
      "Mikrofala bez talerza obrotowego – więcej miejsca i łatwe mycie",
      "Szeroka sieć serwisowa BSH i dostępność części w Polsce"
    ],
    "cons": [
      "Płyta i okap bez Home Connect – brak automatycznego sterowania okapem z płyty",
      "Lodówka KI86FPDD0 trudno dostępna w PL i w klasie D; alternatywa iQ500 jest tańsza, ale mniej premium",
      "Montaż zlicowany wymaga precyzyjnego frezowania blatu (dodatkowy koszt 300–800 zł) i wyklucza zamianę na wersję nablatową bez nowego blatu",
      "Mikrofala solo 21 l – bez grilla, mała pojemność"
    ],
    "compare": {
      "Typ okapu": "teleskopowy, cichy iQdrive",
      "Montaż płyty": "tylko na równo (nablatowa: EX675LXC1E)",
      "Płyta ↔ okap": "nie",
      "Czyszczenie piekarnika": "piroliza + hydroliza",
      "Para w piekarniku": "tak, wspomaganie parą",
      "Lodówka": "hyperFresh Premium 0°C, klasa D",
      "Aplikacja / Wi‑Fi": "piekarnik (Home Connect)"
    }
  },
]
