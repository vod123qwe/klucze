import type { ApplianceSet } from './types'

// Dane zebrane z wyników wyszukiwania ofert w polskich sklepach — ceny orientacyjne.
export const PRICES_CHECKED_AT = '27 września 2026'

export const COMPARE_ROWS = [
  "Typ okapu",
  "Płyta",
  "Płyta ↔ okap",
  "Czyszczenie piekarnika",
  "Para w piekarniku",
  "Lodówka",
  "Zmywarka",
  "Aplikacja / Wi‑Fi"
]

export const APPLIANCE_SETS: ApplianceSet[] = [
  {
    "slug": "budzet",
    "label": "Budżet · Amica",
    "tagline": "Czarny zestaw X-TYPE: matowa płyta z łączeniem z okapem, piekarnik z parą, zmywarka",
    "priceRange": "Budżet",
    "accent": "#16a34a",
    "brandSummary": "Cały zestaw od polskiej Amiki w czerni: matowa płyta BL MATT i okap łączą się przez Bluetooth (HoodConnect Pro), piekarnik i mikrofala z serii X-TYPE, lodówka Total NoFrost i zmywarka 14 kompletów.",
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
        "model": "PIT6542PHTSUNHC 3.0BL MATT",
        "name": "Płyta indukcyjna Amica 60 cm, czarny mat, HoodConnect Pro",
        "price": 2149,
        "oldPrice": null,
        "priceConfidence": "estimate",
        "store": "Media Expert",
        "storeUrl": "https://www.mediaexpert.pl/agd-do-zabudowy/plyty-do-zabudowy/plyta-indukcyjna-amica-pit6542phtsunhc-3-0bl-matt-hoodconnect-pro-bridge",
        "otherStores": [
          {
            "store": "Electro.pl",
            "price": 2199
          },
          {
            "store": "Allegro",
            "price": 2199
          }
        ],
        "promo": null,
        "imageUrl": "",
        "specs": {
          "Powierzchnia": "matowa czarna (Black Matt), 4× odporniejsza na zarysowania",
          "Montaż": "nablatowy lub równo z blatem (bez szlifowanych krawędzi)",
          "Wymiary": "59,2 × 52,2 cm",
          "Pola": "4 indukcyjne, 2× AutoBridge",
          "Sterowanie": "slider 14-stopniowy",
          "Programy": "HobControl Pro: 40/70/90/200 °C",
          "Łączność": "HoodConnect Pro (Bluetooth z okapem)",
          "Blat": "od 12 mm nad szufladą, 28 mm nad piekarnikiem Amica"
        },
        "features": [
          "Matowe szkło – mniej smug i odcisków",
          "Mostki łączące pola w 2 duże strefy",
          "Współpraca z okapem OKC6651BS HC",
          "Brak wymogu wentylacji z przodu szafki",
          "Ten sam układ co obecna PIT6542PHTSUN HC 3.0"
        ],
        "flushMount": true,
        "notes": "Zastępuje błyszczącą PIT6542PHTSUN HC 3.0 (+ok. 600 zł). Obie wersje montażu dla serii PIT potwierdzone w recenzji/opisie producenta; montaż równo z blatem wymaga frezu i silikonu.",
        "finish": "black",
        "style": "matte"
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
      },
      {
        "category": "dishwasher",
        "brand": "Amica",
        "model": "DIM62D7TBOqH",
        "name": "Zmywarka do zabudowy Amica 60 cm, w pełni zintegrowana",
        "price": 1599,
        "oldPrice": null,
        "priceConfidence": "estimate",
        "store": "Ceneo",
        "storeUrl": "https://www.ceneo.pl/106646359",
        "otherStores": [
          {
            "store": "Neonet",
            "price": 1649
          },
          {
            "store": "Morele",
            "price": 1680
          },
          {
            "store": "Allegro",
            "price": 1349
          }
        ],
        "promo": null,
        "imageUrl": "",
        "specs": {
          "Szerokość": "59,8 cm (wys. 81,5 cm)",
          "Liczba kompletów": "14",
          "Głośność": "44 dB (klasa B)",
          "Klasa energetyczna": "D (237 kWh/rok)",
          "Trzeci kosz/szuflada": "wysuwana taca na sztućce nad 2. koszem",
          "Programy": "7, w tym Auto, Higiena, Cichy; start opóźniony do 24 h",
          "Suszenie": "OpenDry – automatyczne uchylenie drzwi",
          "Wi-Fi / montaż": "brak Wi-Fi; typ zawiasu (przesuwny?) do potwierdzenia"
        },
        "features": [
          "Silnik bezszczotkowy SilentDrive 2.0",
          "SteamPower – para dla higieny",
          "BlueDot+ – dioda na podłodze",
          "OptiTime – skrócenie cyklu",
          "Zużycie wody 10 l/cykl"
        ],
        "notes": "Ceny z wyników wyszukiwania (1349–1680 zł), niepotwierdzone na dziś. Przy wysokim cokole sprawdź w instrukcji montażu typ zawiasu.",
        "finish": "black"
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
      "Matowa płyta BL MATT montowana na blat — w tym samym modelu da się też zrobić montaż na równo z blatem.",
      "Piekarnik z parą (SoftSteam), prowadnicami teleskopowymi i dużą komorą 77 l.",
      "Lodówka z pełnym NoFrost i szufladą z regulacją wilgotności.",
      "Polski producent: łatwy serwis i dostęp do części w całym kraju.",
      "Zmywarka Amica DIM62D7TBOqH (14 kompletów, OpenDry, 44 dB) domyka zestaw w jednej marce za ok. 1600 zł."
    ],
    "cons": [
      "Lodówka ma tylko klasę E i zawiasy płozowe: wyższe rachunki za prąd i gorsze prowadzenie frontu niż „drzwi na drzwi”.",
      "Piekarnik bez pirolizy, Wi-Fi i (najpewniej) bez sondy, tylko z katalizą.",
      "Płyta ma Bridge, ale nie ma pełnych stref Flex ani Wi‑Fi; wersja matowa jest ok. 600 zł droższa od błyszczącej.",
      "Okap kominowy wymaga wolnej ściany nad płytą, nie chowa się w zabudowie.",
      "Mała mikrofalówka (20 l) z talerzem obrotowym.",
      "Klasa energetyczna D – wyższe zużycie prądu niż w modelach klasy B/C."
    ],
    "compare": {
      "Typ okapu": "kominowy skośny, na ścianie",
      "Płyta": "matowa BL MATT, na blat (da się też zlicować)",
      "Płyta ↔ okap": "tak, HoodConnect (Bluetooth)",
      "Czyszczenie piekarnika": "kataliza",
      "Para w piekarniku": "tak, SoftSteam",
      "Lodówka": "Total NoFrost, klasa E",
      "Zmywarka": "Amica DIM62D7TBOqH, 44 dB, klasa D",
      "Aplikacja / Wi‑Fi": "brak"
    },
    "alternatives": {
      "hood": [
        {
          "category": "hood",
          "brand": "Amica",
          "model": "OKC624S",
          "name": "Okap kominowy Amica 60 cm, czarne szkło",
          "price": 649,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Allegro",
          "storeUrl": "https://allegro.pl/oferta/okap-kominowy-amica-60-cm-okc624s-czarne-szklo-10791036798",
          "otherStores": [
            {
              "store": "Max Elektro",
              "price": 669
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Typ": "kominowy, skośny",
            "Szerokość": "60 cm",
            "Wydajność maks.": "280 m³/h",
            "Klasa energetyczna": "C",
            "Sterowanie": "mechaniczne, 3 biegi",
            "Oświetlenie": "LED",
            "Filtry": "aluminiowe + węglowe"
          },
          "features": [
            "Czarne szkło jak w zestawie",
            "Tryb wyciąg/pochłaniacz",
            "Regulowana wys. komina 96–133 cm"
          ],
          "altKind": "tańsza",
          "altReason": "O ok. 300 zł taniej, ale znacznie słabszy (280 zamiast ~660 m³/h), bez HoodConnect i Boostera.",
          "finish": "black",
          "style": "chimney"
        },
        {
          "category": "hood",
          "brand": "Amica",
          "model": "OTP6651BG",
          "name": "Okap teleskopowy Amica 60 cm, czarny",
          "price": 679,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Amica",
          "storeUrl": "https://www.amica.pl/okap-teleskopowy-60-cm-otp6651bg",
          "otherStores": [
            {
              "store": "Ceneo",
              "price": 679
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Typ": "teleskopowy (w szafce)",
            "Szerokość": "60 cm",
            "Wydajność maks.": "508 m³/h",
            "Głośność": "57–63 dB",
            "Silnik": "BLDC",
            "Klasa energetyczna": "B",
            "Sterowanie": "sensorowe pod szkłem, timer"
          },
          "features": [
            "Chowa się w szafce wiszącej",
            "Tryb wyciąg/pochłaniacz (filtr FWP 18)",
            "Wyświetlacz LED z czasem wyłączenia"
          ],
          "altKind": "inna",
          "altReason": "Teleskop zabudowany w szafce zamiast okapu kominowego – zostaje ciąg szafek górnych, ale brak HoodConnect z płytą.",
          "finish": "black",
          "style": "telescopic"
        }
      ],
      "hob": [
        {
          "category": "hob",
          "brand": "Amica",
          "model": "PIE6541PHTSUN 3.0 BL MATT",
          "name": "Płyta indukcyjna Amica 60 cm, czarny mat",
          "price": 1799,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "RTV Euro AGD",
          "storeUrl": "https://www.euro.com.pl/plyty-do-zabudowy/amica-pie6541phtsun-3-0-59-2cm.bhtml",
          "otherStores": [
            {
              "store": "Allegro",
              "price": 1799
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Powierzchnia": "matowa czarna (Black Matt)",
            "Montaż": "nablatowy",
            "Wymiary": "59,2 × 52,2 cm",
            "Pola": "4 indukcyjne, 1 mostek",
            "Moc": "7,35 kW",
            "Sterowanie": "slider 14-stopniowy",
            "Łączność": "brak HoodConnect"
          },
          "features": [
            "Matowe szkło 4× odporniejsze na rysy",
            "PowerBooster",
            "Montaż w blacie od 12 mm"
          ],
          "flushMount": null,
          "altKind": "tańsza",
          "altReason": "Ok. 350 zł taniej od matowej PIT6542, ale jeden mostek zamiast dwóch i bez łączności z okapem.",
          "notes": "Seria PIE ma prawdopodobnie fazowane krawędzie – zakładaj montaż wyłącznie nablatowy; opinie wskazują sensory blisko pól.",
          "finish": "black",
          "style": "matte"
        },
        {
          "category": "hob",
          "brand": "Bosch",
          "model": "PVQ61CHB1E",
          "name": "Płyta indukcyjna Bosch Serie 6 Matt Design 60 cm",
          "price": 2899,
          "oldPrice": 3099,
          "priceConfidence": "estimate",
          "store": "Ceneo",
          "storeUrl": "https://www.ceneo.pl/188637241",
          "otherStores": [
            {
              "store": "Allegro",
              "price": 2749
            },
            {
              "store": "Antraks",
              "price": 3099
            },
            {
              "store": "RTV Euro AGD",
              "price": 3299
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Powierzchnia": "matowa czarna (Matt Design), 5× mniej widoczne rysy",
            "Montaż": "nablatowy, bez ramki",
            "Wymiary": "59,2 × 52,2 cm, wnęka 56 × 49 cm",
            "Pola": "4 × 21×19 cm, 2× CombiZone",
            "Moc pola": "2,5 kW / 3,7 kW booster",
            "Blat": "od 16 mm"
          },
          "features": [
            "Duże strefy CombiZone",
            "Mocniejszy booster",
            "Wyższa jakość szkła Bosch",
            "Kabel 110 cm w zestawie"
          ],
          "flushMount": null,
          "altKind": "lepsza",
          "altReason": "Droższa o ok. 750 zł od matowej Amiki, lepsze szkło i strefy, ale bez połączenia z okapem Amica.",
          "notes": "Możliwość montażu równo z blatem niepotwierdzona w wynikach.",
          "finish": "black",
          "style": "matte"
        }
      ],
      "oven": [
        {
          "category": "oven",
          "brand": "Amica",
          "model": "ED37210B X-TYPE",
          "name": "Piekarnik Amica X-TYPE 77 l, czarny",
          "price": 1059,
          "oldPrice": 1419,
          "priceConfidence": "estimate",
          "store": "Ceneo",
          "storeUrl": "https://www.ceneo.pl/79324771",
          "otherStores": [
            {
              "store": "Neonet",
              "price": 1329
            },
            {
              "store": "Amica",
              "price": 1419
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Pojemność": "77 l",
            "Funkcje": "11, z termoobiegiem",
            "Klasa energetyczna": "A",
            "Czyszczenie": "emalia EasyClean",
            "Szyba": "potrójna",
            "Sterowanie": "pokrętła + sensorowy zegar"
          },
          "features": [
            "Szybki rozgrzew – 150 °C w 3 min",
            "Rozmrażanie",
            "Czarny front X-TYPE"
          ],
          "altKind": "tańsza",
          "altReason": "O ok. 700 zł taniej, ale bez funkcji pary SoftSteam i z prostszym sterowaniem.",
          "finish": "black"
        },
        {
          "category": "oven",
          "brand": "Amica",
          "model": "ED57529B X-TYPE PYRO",
          "name": "Piekarnik Amica X-TYPE z pirolizą 77 l, czarny",
          "price": 1849,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Media Expert",
          "storeUrl": "https://www.mediaexpert.pl/agd-do-zabudowy/piekarniki-do-zabudowy/piekarnik-amica-ed57529b-x-type-pyro",
          "otherStores": [
            {
              "store": "RTV Euro AGD",
              "price": 1849
            },
            {
              "store": "OleOle!",
              "price": 1849
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Pojemność": "77 l",
            "Czyszczenie": "piroliza",
            "Funkcje": "12 + 19 programów automatycznych",
            "Prowadnice": "drabinkowe + teleskopowe",
            "Klasa energetyczna": "A+",
            "Moc": "3,6 kW, 230 V",
            "Sterowanie": "sensorowe, LED"
          },
          "features": [
            "Samoczyszczenie pirolityczne",
            "ThermoControl",
            "Funkcja Pizza",
            "Czarny front X-TYPE"
          ],
          "altKind": "inna",
          "altReason": "Za podobną cenę dodaje pirolizę (słaby punkt obecnego piekarnika), kosztem funkcji pary.",
          "finish": "black"
        }
      ],
      "microwave": [
        {
          "category": "microwave",
          "brand": "Amica",
          "model": "AMGB20E2GB",
          "name": "Mikrofalówka do zabudowy Amica 20 l z grillem, czarna",
          "price": 799,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "RTV Euro AGD",
          "storeUrl": "https://www.euro.com.pl/kuchenki-mikrofalowe-do-zabudowy/amica-amgb20e2gb.bhtml",
          "otherStores": [
            {
              "store": "Allegro",
              "price": 725
            },
            {
              "store": "MediaMarkt",
              "price": 899
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Pojemność": "20 l",
            "Moc mikrofal": "700 W",
            "Grill": "kwarcowy 900 W",
            "Programy": "9 Auto",
            "Sterowanie": "elektroniczne",
            "Wnętrze": "stal nierdzewna"
          },
          "features": [
            "Czarny szklany front",
            "Combigrill",
            "Quick Start"
          ],
          "altKind": "tańsza",
          "altReason": "O ok. 300 zł taniej, słabsze mikrofale (700 zamiast 800 W) i linia F-TYPE zamiast X-TYPE.",
          "finish": "black"
        },
        {
          "category": "microwave",
          "brand": "Amica",
          "model": "AMMB25E2SGB X-TYPE",
          "name": "Mikrofalówka do zabudowy Amica 25 l z grillem, czarna",
          "price": 1399,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "MediaMarkt",
          "storeUrl": "https://mediamarkt.pl/pl/product/_kuchenka-mikrofalowa-amica-ammb25e2sgb-x-type-1401388.html",
          "otherStores": [
            {
              "store": "Max Elektro",
              "price": 1399
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Pojemność": "25 l",
            "Moc mikrofal": "900 W",
            "Grill": "kwarcowy 1000 W",
            "Moc całkowita": "1450 W",
            "Programy": "8 Auto",
            "Front": "czarne szkło X-TYPE"
          },
          "features": [
            "Większa komora",
            "Mocniejsze mikrofale",
            "Blokada rodzicielska"
          ],
          "altKind": "lepsza",
          "altReason": "Większa komora (25 zamiast 20 l) i 900 W, ok. 300 zł drożej – wymaga większej wnęki.",
          "notes": "Sprawdź wymiary wnęki – 25 l ma inne wymiary zabudowy niż 20 l.",
          "finish": "black"
        }
      ],
      "fridge": [
        {
          "category": "fridge",
          "brand": "Amica",
          "model": "BK3165.4AA",
          "name": "Lodówka do zabudowy Amica 177,6 cm",
          "price": 1699,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Media Expert",
          "storeUrl": "https://www.mediaexpert.pl/agd-do-zabudowy/lodowki-i-zamrazarki-do-zabudowy/lodowki-do-zabudowy/lodowka-amica-bk3165-4aa",
          "otherStores": [
            {
              "store": "RTV Euro AGD",
              "price": 1775
            },
            {
              "store": "Ceneo",
              "price": 1699
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Wysokość": "177,6 cm",
            "Pojemność": "182 l + 60 l",
            "No Frost": "nie (statyczna)",
            "Głośność": "41 dB",
            "Klasa energetyczna": "E (wg MediaMarkt)",
            "Zawiasy": "przesuwne"
          },
          "features": [
            "Zamrażarka na dole",
            "Cicha praca wg opinii",
            "Niska cena"
          ],
          "altKind": "tańsza",
          "altReason": "O ok. 600 zł taniej, ale bez No Frost (trzeba rozmrażać zamrażarkę).",
          "finish": "black"
        },
        {
          "category": "fridge",
          "brand": "Bosch",
          "model": "KIN86VFE0",
          "name": "Lodówka do zabudowy Bosch Serie 4 No Frost, zawias płaski",
          "price": 3956,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Ceneo",
          "storeUrl": "https://www.ceneo.pl/112987084",
          "otherStores": [
            {
              "store": "Allegro",
              "price": 4598
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Wysokość": "177,2 cm",
            "Pojemność": "260 l netto",
            "No Frost": "tak",
            "Klasa energetyczna": "E",
            "Zawiasy": "płaskie stałe (drzwi na drzwi), zmiana strony",
            "Oświetlenie": "LED"
          },
          "features": [
            "Front meblowy na stałe z drzwiami",
            "Pełny No Frost",
            "Solidniejsze domykanie drzwi"
          ],
          "altKind": "inna",
          "altReason": "Zawias stały (drzwi na drzwi) zamiast przesuwnego – trwalszy montaż frontu, ale ok. 1650 zł drożej.",
          "finish": "black"
        }
      ],
      "dishwasher": [
        {
          "category": "dishwasher",
          "brand": "Electrolux",
          "model": "EEA27200L",
          "name": "Zmywarka do zabudowy Electrolux 300 AirDry 60 cm",
          "price": 1499,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "OleOle!",
          "storeUrl": "https://www.oleole.pl/zmywarki-do-zabudowy/electrolux-eea27200l.bhtml",
          "otherStores": [
            {
              "store": "Elektrohome",
              "price": 1609
            },
            {
              "store": "Goredo",
              "price": 1649
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Szerokość": "59,6 cm",
            "Liczba kompletów": "13",
            "Głośność": "46 dB",
            "Klasa energetyczna": "E (do weryfikacji)",
            "Trzeci kosz/szuflada": "brak",
            "Programy": "QuickSelect",
            "Suszenie": "AirDry – uchylanie drzwi",
            "Wi-Fi": "brak"
          },
          "features": [
            "Zużycie wody 9,9 l",
            "AirDry",
            "Proste sterowanie QuickSelect"
          ],
          "altKind": "tańsza",
          "altReason": "Ok. 100 zł taniej, ale 13 kompletów, głośniejsza (46 dB) i bez szuflady na sztućce.",
          "finish": "black"
        },
        {
          "category": "dishwasher",
          "brand": "Amica",
          "model": "DIM66B7EBONiH",
          "name": "Zmywarka do zabudowy Amica 60 cm, klasa B",
          "price": 2499,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Amica",
          "storeUrl": "https://www.amica.pl/zmywarka-do-zabudowy-dim66b7ebonih",
          "otherStores": [
            {
              "store": "Ceneo",
              "price": 2399
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Szerokość": "59,8 cm",
            "Liczba kompletów": "14",
            "Głośność": "40 dB",
            "Klasa energetyczna": "B (65 kWh/100 cykli)",
            "Trzeci kosz/szuflada": "tak, regulowana",
            "Programy": "7, start opóźniony 24 h",
            "Suszenie": "OpenDry",
            "Zabezpieczenie": "AquaStop"
          },
          "features": [
            "SilentDrive 3.0",
            "ZoneWash",
            "SteamPower",
            "WaterSpinner 2.0"
          ],
          "altKind": "lepsza",
          "altReason": "Ok. 900 zł drożej: klasa B zamiast D, 40 dB i pełna trzecia szuflada.",
          "finish": "black"
        }
      ]
    }
  },
  {
    "slug": "srodek",
    "label": "Rozsądny · Bosch",
    "tagline": "Jedna marka: matowa płyta na blat, piekarnik z pirolizą, zmywarka z zeolitem",
    "priceRange": "Średnia półka",
    "accent": "#2563eb",
    "brandSummary": "Spójny zestaw all-Bosch w czerni: matowa płyta Serie 6 Matt Design na blat, piekarnik i mikrofala z nowej linii z pierścieniem i TFT, cicha lodówka NoFrost i zmywarka Serie 6 z suszeniem zeolitowym.",
    "bestFor": "Dla osób, które chcą spójnej, nowoczesnej kuchni jednej marki z matową płytą na blat, pirolizą i jedną aplikacją Home Connect, bez przepłacania za topowe modele.",
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
        "model": "PVQ61CHB1E",
        "name": "Płyta indukcyjna Bosch Serie 6 60 cm, czarny mat, nablatowa",
        "price": 2749,
        "oldPrice": null,
        "priceConfidence": "estimate",
        "store": "Euro RTV AGD",
        "storeUrl": "https://www.euro.com.pl/plyty-do-zabudowy/bosch-serie-6-pvq61chb1e-59-2cm.bhtml",
        "otherStores": [
          {
            "store": "Elektrohome",
            "price": 2659
          },
          {
            "store": "Allegro",
            "price": 2888
          },
          {
            "store": "Media Expert",
            "price": 2899
          }
        ],
        "promo": null,
        "imageUrl": "",
        "specs": {
          "Powierzchnia": "matowa ceramika szklana, czarny mat (Matt Design)",
          "Montaż": "nablatowy, bez listew (bezramkowa)",
          "Wymiary": "59,2 x 52,2 cm",
          "Pola": "4 (2 x CombiZone)",
          "Moc": "7,4 kW",
          "Sterowanie": "DirectSelect, 17 poziomów",
          "Łączność": "Home Connect"
        },
        "features": [
          "Matowa powierzchnia – mniej widoczne rysy i odciski",
          "2 strefy CombiZone",
          "PowerBoost",
          "QuickStart i ReStart",
          "Home Connect"
        ],
        "flushMount": false,
        "notes": "Tańsza od obecnej PXE601DC1E, ale bez FlexInduction i PerfectFry; wersja wyłącznie nablatowa.",
        "finish": "black",
        "style": "matte"
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
      },
      {
        "category": "dishwasher",
        "brand": "Bosch",
        "model": "SMV6YCX02E",
        "name": "Zmywarka Bosch Serie 6 w pełni zintegrowana 60 cm",
        "price": 2899,
        "oldPrice": null,
        "priceConfidence": "estimate",
        "store": "Ceneo",
        "storeUrl": "https://www.ceneo.pl/157145611",
        "otherStores": [
          {
            "store": "TakeTronic",
            "price": 3199
          },
          {
            "store": "Allegro",
            "price": 2899
          }
        ],
        "promo": "Cashback Bosch na zmywarki do 700 zł (01.09–15.11.2026) – sprawdzić, czy model jest objęty",
        "imageUrl": "",
        "specs": {
          "Szerokość": "59,8 cm (wys. 81,5 cm)",
          "Liczba kompletów": "14",
          "Głośność": "44 dB",
          "Klasa energetyczna": "A (54 kWh/100 cykli)",
          "Trzeci poziom": "szuflada na sztućce",
          "Programy": "Auto, Eco, Intensywny i in.",
          "Suszenie": "PerfectDry (zeolit)",
          "Wi‑Fi / montaż": "Home Connect; zawias standardowy (bez VarioHinge)"
        },
        "features": [
          "Suszenie zeolitowe PerfectDry, dobre także dla plastików",
          "Klasa A",
          "Szuflada na sztućce",
          "Sterowanie aplikacją Home Connect",
          "Kosz Rackmatic z regulacją wysokości"
        ],
        "notes": "Przy wysokim cokole lub nietypowej wysokości frontu sprawdzić wersję SBV (VarioHinge, 86,5 cm).",
        "finish": "black"
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
      "Matowa płyta Matt Design na blat z PowerBoost i Home Connect — nie widać odcisków palców, a montaż nie wymaga frezowania blatu.",
      "Piekarnik z pirolizą i AirFry – najwygodniejsze czyszczenie i nowoczesne funkcje.",
      "Mocny, a niewidoczny okap teleskopowy (728 m³/h w trybie intensywnym).",
      "Cicha lodówka NoFrost 35 dB z szufladą VitaFresh.",
      "Piekarnik, płyta i zmywarka w jednej aplikacji Home Connect.",
      "Zmywarka Bosch Serie 6 z suszeniem zeolitowym, klasą A i Home Connect dopełnia zestaw w jednej marce."
    ],
    "cons": [
      "Matowa płyta PVQ61CHB1E ma strefy Combi zamiast pełnego FlexInduction i nie ma czujnika smażenia (ma go PVS61AHC1E, ok. +450 zł).",
      "Okap Serie 4 nie ma Wi‑Fi – brak automatycznego sterowania z płyty; listwa jest srebrna, nie czarna.",
      "Lodówka tylko w klasie E – wyższe zużycie prądu niż modele D/C.",
      "Piekarnik bez funkcji pary; prowadnice teleskopowe/sonda mogą wymagać dokupienia.",
      "Obecnie brak aktywnego cashbacku Bosch na urządzenia do gotowania i lodówki – ceny to szacunki, warto poczekać na promocję jesienną.",
      "Mikrofala z nowej linii jest dość droga (ok. 2,7 tys. zł) w stosunku do funkcji.",
      "Zmywarka ma 44 dB i standardowy zawias – przy wysokim cokole trzeba wybrać wersję SBV z VarioHinge."
    ],
    "compare": {
      "Typ okapu": "teleskopowy, schowany w szafce",
      "Płyta": "matowa Matt Design, na blat",
      "Płyta ↔ okap": "nie (okap bez Home Connect)",
      "Czyszczenie piekarnika": "piroliza",
      "Para w piekarniku": "nie",
      "Lodówka": "NoFrost, klasa E, 35 dB",
      "Zmywarka": "Bosch SMV6YCX02E, 44 dB, zeolit",
      "Aplikacja / Wi‑Fi": "piekarnik, płyta i zmywarka (Home Connect)"
    },
    "alternatives": {
      "hood": [
        {
          "category": "hood",
          "brand": "Bosch",
          "model": "DFM064W54",
          "name": "Okap teleskopowy Bosch Serie 2 60 cm",
          "price": 899,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Elektrohome",
          "storeUrl": "https://www.ceneo.pl/102743411",
          "otherStores": [
            {
              "store": "AGDDesign",
              "price": 907
            },
            {
              "store": "Interioro",
              "price": 999
            },
            {
              "store": "Allegro",
              "price": 1049
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Typ": "teleskopowy",
            "Szerokość": "59,8 cm",
            "Wydajność": "388 m³/h",
            "Głośność": "67 dB",
            "Klasa energetyczna": "B",
            "Sterowanie": "mechaniczne, 3 biegi"
          },
          "features": [
            "Oświetlenie LED 2 x 1,5 W",
            "3 prędkości",
            "Srebrna listwa"
          ],
          "altKind": "tańsza",
          "altReason": "Ok. 600 zł taniej, ale wyraźnie słabszy (388 m³/h) i głośniejszy, bez biegu intensywnego.",
          "finish": "black",
          "style": "telescopic"
        },
        {
          "category": "hood",
          "brand": "Bosch",
          "model": "DFS067K51",
          "name": "Okap teleskopowy Bosch Serie 8 60 cm, stal",
          "price": 2550,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Ceneo",
          "storeUrl": "https://agdsmart.pl/okap-szafkowy-bosch-dfs067k51,id123766.html",
          "otherStores": [],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Typ": "teleskopowy",
            "Szerokość": "59,8 cm",
            "Wydajność": "do 716 m³/h (intensywny)",
            "Głośność": "41–53 dB",
            "Klasa energetyczna": "A",
            "Sterowanie": "dotykowe, 3+2 biegi",
            "Czujnik": "PerfectAir"
          },
          "features": [
            "Czujnik jakości powietrza PerfectAir",
            "Tryb automatyczny",
            "SoftLight ze ściemnianiem",
            "Filtry ze stali nierdzewnej",
            "Listwa ze stali szlachetnej"
          ],
          "altKind": "lepsza",
          "altReason": "Ta sama zabudowa teleskopowa, ale ze stalową listwą, czujnikiem PerfectAir, sterowaniem dotykowym i klasą A.",
          "notes": "Cena Castoramy nieznana (0 = brak danych).",
          "finish": "inox",
          "style": "telescopic"
        }
      ],
      "hob": [
        {
          "category": "hob",
          "brand": "Bosch",
          "model": "PIE61ABB5E",
          "name": "Płyta indukcyjna Bosch Serie 4 60 cm, czarny mat",
          "price": 2187,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Ceneo",
          "storeUrl": "https://www.mediaexpert.pl/agd-do-zabudowy/plyty-do-zabudowy/plyta-indukcyjna-bosch-pie61abb5e",
          "otherStores": [
            {
              "store": "Ceneo (inna oferta)",
              "price": 2599
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Powierzchnia": "matowa, czarny mat (carbon black)",
            "Montaż": "nablatowy, bez ramki",
            "Szerokość": "60 cm",
            "Pola": "4",
            "Sterowanie": "TouchSelect, 17 poziomów"
          },
          "features": [
            "Matowa powierzchnia odporna na rysy",
            "4 pola indukcyjne",
            "Minimalistyczny wygląd bez ramki"
          ],
          "flushMount": false,
          "altKind": "tańsza",
          "altReason": "Najtańsza matowa płyta nablatowa Bosch – bez CombiZone i Home Connect, prostsze sterowanie.",
          "finish": "black",
          "style": "matte"
        },
        {
          "category": "hob",
          "brand": "Bosch",
          "model": "PVS61AHC1E",
          "name": "Płyta indukcyjna Bosch Serie 6 60 cm, czarny mat, PerfectFry",
          "price": 3100,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Ceneo",
          "storeUrl": "https://www.ceneo.pl/196094102",
          "otherStores": [],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Powierzchnia": "matowa ceramika szklana, czarny mat",
            "Montaż": "nablatowy, bez ramki",
            "Szerokość": "60 cm",
            "Pola": "4 (CombiZone)",
            "Sterowanie": "dotykowe, 17 poziomów",
            "Czujnik smażenia": "PerfectFry"
          },
          "features": [
            "Czujnik smażenia PerfectFry",
            "CombiZone",
            "PowerBoost",
            "Matowe wykończenie"
          ],
          "flushMount": false,
          "altKind": "lepsza",
          "altReason": "Matowa i nablatowa jak zamiennik, a dodatkowo z czujnikiem smażenia PerfectFry.",
          "notes": "Ceny w pozostałych sklepach nieznane (0 = brak danych).",
          "finish": "black",
          "style": "matte"
        }
      ],
      "oven": [
        {
          "category": "oven",
          "brand": "Bosch",
          "model": "HBA578BB0",
          "name": "Piekarnik Bosch Serie 6 z pyrolizą, czarny",
          "price": 2510,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Diahore",
          "storeUrl": "https://www.bosch-home.pl/pl/mkt-product/HBA578BB0",
          "otherStores": [
            {
              "store": "Allegro",
              "price": 2699
            },
            {
              "store": "Powidło i Mydło",
              "price": 2966
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Pojemność": "71 l",
            "Czyszczenie": "pyroliza + hydroliza",
            "Programy automatyczne": "30",
            "Sterowanie": "chowane pokrętła",
            "Wymiary": "59,5 x 59,4 x 54,8 cm"
          },
          "features": [
            "Pyroliza",
            "30 programów automatycznych",
            "Chowane pokrętła",
            "Asystent czyszczenia"
          ],
          "altKind": "tańsza",
          "altReason": "Ok. 1,5 tys. zł taniej przy zachowaniu pyrolizy, ale z prostszym sterowaniem pokrętłami zamiast ekranu TFT.",
          "finish": "black"
        },
        {
          "category": "oven",
          "brand": "Bosch",
          "model": "HRG7361B1",
          "name": "Piekarnik Bosch Serie 8 ze wspomaganiem parą",
          "price": 4599,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Ceneo",
          "storeUrl": "https://www.ceneo.pl/156500692",
          "otherStores": [
            {
              "store": "AGDDesign",
              "price": 4479
            },
            {
              "store": "Allegro",
              "price": 4540
            },
            {
              "store": "Elektrohome",
              "price": 4698
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Pojemność": "71 l",
            "Funkcje": "20, w tym 4 z parą",
            "Para": "Steam Boost, 3 poziomy",
            "Czyszczenie": "EcoClean + hydroliza (bez pyrolizy)",
            "Klasa energetyczna": "A+",
            "AirFry": "tak"
          },
          "features": [
            "Wspomaganie parą (pieczywo, mięsa, odgrzewanie)",
            "Steam Boost",
            "AirFry",
            "Klasa A+"
          ],
          "altKind": "inna",
          "altReason": "Dodaje parę (słaby punkt obecnego piekarnika) za podobne pieniądze, ale zamiast pyrolizy ma tylko EcoClean i hydrolizę.",
          "finish": "black"
        }
      ],
      "microwave": [
        {
          "category": "microwave",
          "brand": "Bosch",
          "model": "BEL554MB0",
          "name": "Kuchenka mikrofalowa do zabudowy Bosch Serie 6 z grillem",
          "price": 1689,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "AGDSmart",
          "storeUrl": "https://www.euro.com.pl/kuchenki-mikrofalowe-do-zabudowy/bosch-serie-6-bel554mb0-grill.bhtml",
          "otherStores": [
            {
              "store": "Allegro",
              "price": 1780
            },
            {
              "store": "Kaufland",
              "price": 1835
            },
            {
              "store": "AGDSławek",
              "price": 2190
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Pojemność": "25 l",
            "Moc mikrofal": "900 W, 5 poziomów",
            "Grill": "1200 W",
            "Talerz": "obrotowy 31,5 cm",
            "Sterowanie": "elektromechaniczne"
          },
          "features": [
            "Grill",
            "Większa komora 25 l",
            "Kolor czarny"
          ],
          "altKind": "tańsza",
          "altReason": "Ok. 1000 zł taniej, większa komora i grill, ale z prostszym sterowaniem i talerzem obrotowym; wygląd słabiej pasuje do Serie 8.",
          "finish": "black"
        },
        {
          "category": "microwave",
          "brand": "Bosch",
          "model": "CMG7241B1",
          "name": "Kompaktowy piekarnik Bosch Serie 8 z mikrofalą",
          "price": 4735,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Elektrohome",
          "storeUrl": "https://www.ceneo.pl/156645489",
          "otherStores": [
            {
              "store": "AGDSmart",
              "price": 4799
            },
            {
              "store": "Allegro",
              "price": 4839
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Pojemność": "45 l",
            "Wysokość": "45,5 cm (wnęka 45 cm)",
            "Funkcje": "9 (termoobieg, grill, mikrofale, AirFry)",
            "Moc": "3600 W",
            "Klasa energetyczna": "A",
            "Sterowanie": "TFT Touch, Home Connect"
          },
          "features": [
            "Drugi piekarnik z mikrofalą",
            "AirFry",
            "Szybkie nagrzewanie",
            "Home Connect"
          ],
          "altKind": "lepsza",
          "altReason": "Zamiast samej mikrofalówki dostajesz drugi piekarnik z mikrofalą i AirFry, ale wymaga wnęki 45 cm i kosztuje ok. 2 tys. zł więcej.",
          "finish": "black"
        }
      ],
      "fridge": [
        {
          "category": "fridge",
          "brand": "Bosch",
          "model": "KIV86NSE0",
          "name": "Lodówka do zabudowy Bosch Serie 2 177 cm",
          "price": 2293,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Ceneo",
          "storeUrl": "https://www.ceneo.pl/155279549",
          "otherStores": [],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Wysokość": "177,2 cm",
            "Zamrażarka": "LowFrost (bez NoFrost)",
            "Montaż": "zawias przesuwny",
            "Chłodzenie": "EcoAirflow"
          },
          "features": [
            "Tańsza o ok. 1,2 tys. zł",
            "EcoAirflow",
            "Zamrażarka LowFrost"
          ],
          "altKind": "tańsza",
          "altReason": "Ok. 1,2 tys. zł taniej, ale zamrażarkę trzeba co jakiś czas rozmrażać (LowFrost) i ma zawias przesuwny zamiast płaskiego.",
          "notes": "Cena z 28.05.2026; pozostałe ceny nieznane (0).",
          "finish": "black"
        },
        {
          "category": "fridge",
          "brand": "Bosch",
          "model": "KIN86ADD0",
          "name": "Lodówka do zabudowy Bosch Serie 6 NoFrost, klasa D",
          "price": 3989,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Media Expert",
          "storeUrl": "https://www.mediaexpert.pl/agd-do-zabudowy/lodowki-i-zamrazarki-do-zabudowy/lodowki-do-zabudowy/lodowka-bosch-kin86add0",
          "otherStores": [
            {
              "store": "Sklep z ratami 0%",
              "price": 3821
            },
            {
              "store": "Inny sklep",
              "price": 4290
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Wysokość": "177,2 cm",
            "Pojemność": "260 l",
            "Klasa energetyczna": "D",
            "Zamrażarka": "NoFrost, ****, do −24°C",
            "Szuflada": "VitaFresh XXL <0°C>",
            "Koszt energii": "ok. 190 zł/rok"
          },
          "features": [
            "Klasa D zamiast E",
            "VitaFresh XXL <0°C>",
            "NoFrost",
            "Stała temperatura"
          ],
          "altKind": "lepsza",
          "altReason": "O ok. 500 zł droższa, ale oszczędniejsza (klasa D) i z dużą szufladą VitaFresh <0°C> na świeże produkty.",
          "finish": "black"
        }
      ],
      "dishwasher": [
        {
          "category": "dishwasher",
          "brand": "Bosch",
          "model": "SMV4HVX00E",
          "name": "Zmywarka Bosch Serie 4 w pełni zintegrowana 60 cm",
          "price": 1999,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Ceneo",
          "storeUrl": "https://www.ceneo.pl/159231155",
          "otherStores": [],
          "promo": "Możliwy cashback Bosch na zmywarki (01.09–15.11.2026)",
          "imageUrl": "",
          "specs": {
            "Szerokość": "59,8 cm",
            "Liczba kompletów": "14",
            "Głośność": "46 dB",
            "Klasa energetyczna": "D",
            "Trzeci poziom": "szuflada VarioDrawer",
            "Suszenie": "ExtraDry",
            "Wi‑Fi": "Home Connect",
            "Montaż": "zawias standardowy"
          },
          "features": [
            "InfoLight – punkt świetlny na podłodze",
            "Kosze VarioFlex",
            "ExtraDry",
            "Home Connect"
          ],
          "altKind": "tańsza",
          "altReason": "Ok. 900 zł taniej, ale głośniejsza (46 dB), w klasie D i bez suszenia zeolitowego.",
          "finish": "black"
        },
        {
          "category": "dishwasher",
          "brand": "Bosch",
          "model": "SMV6ZCX10E",
          "name": "Zmywarka Bosch Serie 6 Silence Pro 60 cm",
          "price": 3349,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Ceneo",
          "storeUrl": "https://www.ceneo.pl/157743682",
          "otherStores": [
            {
              "store": "Allegro",
              "price": 3399
            }
          ],
          "promo": "Możliwy cashback Bosch na zmywarki (01.09–15.11.2026)",
          "imageUrl": "",
          "specs": {
            "Szerokość": "59,8 cm (wys. 81,5 cm)",
            "Liczba kompletów": "14",
            "Głośność": "40 dB",
            "Klasa energetyczna": "b.d. – sprawdzić",
            "Trzeci poziom": "szuflada na sztućce",
            "Suszenie": "PerfectDry (zeolit)",
            "Wi‑Fi": "Home Connect",
            "Zużycie wody": "9 l"
          },
          "features": [
            "Bardzo cicha – 40 dB",
            "PerfectDry z zeolitem",
            "Szuflada na sztućce",
            "Home Connect"
          ],
          "altKind": "lepsza",
          "altReason": "O ok. 450 zł droższa, ale wyraźnie cichsza (40 zamiast 44 dB) – ważne przy otwartej kuchni.",
          "finish": "black"
        }
      ]
    }
  },
  {
    "slug": "smart",
    "label": "Smart · AEG",
    "tagline": "Okap sterowany przez matową płytę, piekarnik parowy i zmywarka z aplikacją",
    "priceRange": "Wyższa średnia",
    "accent": "#9333ea",
    "brandSummary": "Pełny zestaw AEG serii 7000/8000: matowa płyta SaphirMatt z Hob2Hood sterująca okapem, piekarnik parowy SteamCrisp z Wi‑Fi, mikrofala 38 cm, lodówka TwinTech NoFrost i zmywarka ComfortLift z unoszonym koszem.",
    "bestFor": "Dla osób, które chcą inteligentnej kuchni z automatycznym okapem, matową płytą na blat, piekarnikiem parowym i zmywarką z aplikacją.",
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
        "model": "TI64IB10IZ",
        "name": "Płyta indukcyjna AEG SenseBoil 7000 SLIM-FIT SaphirMatt 60 cm",
        "price": 3000,
        "oldPrice": null,
        "priceConfidence": "live",
        "store": "Media Expert",
        "storeUrl": "https://www.mediaexpert.pl/agd-do-zabudowy/plyty-do-zabudowy/plyta-indukcyjna-aeg-ti64ib10iz-senseboil-7000-slim-fit",
        "otherStores": [
          {
            "store": "AGD Smart",
            "price": 2984
          },
          {
            "store": "Allegro",
            "price": 3299
          },
          {
            "store": "Gigamarket",
            "price": 3499
          }
        ],
        "promo": "Cena z kodem w Media Expert, ważna do 30.09.2026",
        "imageUrl": "",
        "specs": {
          "Powierzchnia": "matowa, czarna SaphirMatt (szkło ceramiczne mat)",
          "Szerokość": "60 cm (58 × 51 cm)",
          "Montaż": "nablatowy; SLIM-FIT pozwala też zlicować z blatem",
          "Strefy": "4, w tym Bridge (łączenie 2 stref)",
          "Hob2Hood": "tak",
          "Sensory": "SenseBoil (wykrywanie wrzenia)",
          "Moc": "PowerBoost, 9 poziomów",
          "Odporność": "ok. 10× bardziej odporna na zarysowania niż zwykłe szkło"
        },
        "features": [
          "matowa powierzchnia SaphirMatt, nie widać odcisków palców",
          "Hob2Hood – współpraca z okapem DGE5661HM",
          "SenseBoil – ochrona przed wykipieniem",
          "Bridge",
          "cienka konstrukcja SLIM-FIT, montaż w blatach od ok. 12 mm"
        ],
        "flushMount": true,
        "notes": "Tańsza od TH64IB30FB o ok. 800 zł; brak funkcji SenseFry (tylko SenseBoil). Możliwość montażu zlicowanego wg sklepów dla serii SLIM-FIT – potwierdzić w instrukcji montażu.",
        "finish": "black",
        "style": "matte"
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
      },
      {
        "category": "dishwasher",
        "brand": "AEG",
        "model": "FSE83838P",
        "name": "Zmywarka AEG ComfortLift 8000 60 cm, w pełni zintegrowana",
        "price": 3999,
        "oldPrice": null,
        "priceConfidence": "estimate",
        "store": "OleOle!",
        "storeUrl": "https://www.oleole.pl/zmywarki-do-zabudowy/aeg-electrolux-fse83838p.bhtml",
        "otherStores": [
          {
            "store": "Media Expert",
            "price": 4000
          },
          {
            "store": "Kawa itd.",
            "price": 4999
          }
        ],
        "promo": null,
        "imageUrl": "",
        "specs": {
          "Szerokość": "60 cm (wys. 81,8 cm)",
          "Komplety": "14 (wg sklepów; instrukcja podaje 13)",
          "Głośność": "42–43 dB",
          "Klasa energetyczna": "D",
          "Trzeci poziom": "szuflada na sztućce",
          "Programy": "7, w tym AUTO",
          "Suszenie": "AirDry (automatyczne uchylanie drzwi)",
          "Wi‑Fi": "tak, aplikacja My AEG Kitchen"
        },
        "features": [
          "ComfortLift – dolny kosz podnoszony do wygodnej wysokości",
          "Wi‑Fi i zdalny start",
          "AirDry",
          "szuflada na sztućce",
          "QuickSelect – wybór czasu suwakiem"
        ],
        "notes": "Typ zawiasu (przesuwny/stały) i max wysokość cokołu nie potwierdzone w wynikach – sprawdzić w instrukcji montażu przed zamówieniem frontu. Ceny z wyników wyszukiwania, mogą być nieaktualne.",
        "finish": "black"
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
      "Matowa płyta SaphirMatt na blat (SLIM-FIT — ten sam model można też zlicować) z Hob2Hood i SenseBoil.",
      "Piekarnik z parą SteamCrisp, pirolizą, sondą i Wi-Fi w jednym",
      "Jedna marka i spójna stylistyka czarnego szkła AEG",
      "Czujnik SenseBoil sam zmniejsza moc, gdy woda zaczyna wrzeć — nic nie kipi",
      "Lodówka TwinTech NoFrost cicha (36 dB) z szufladą GreenZone",
      "Szeroka dostępność w sklepach i serwis AEG/Electrolux w całej Polsce",
      "Zmywarka ComfortLift z podnoszonym dolnym koszem i Wi‑Fi dopełnia serię AEG 8000 i ułatwia rozładunek bez schylania."
    ],
    "cons": [
      "Ekosystem aplikacji ograniczony: Wi-Fi ma tylko piekarnik, reszta nie łączy się z aplikacją (słabiej niż Samsung SmartThings)",
      "Mikrofala w wykończeniu inox + czarne szkło – nie idealnie pasuje do czarnego piekarnika",
      "Lodówka tylko klasy E",
      "Okap 67 dB na najwyższym biegu",
      "Piekarnik ma parę wspomagającą, a nie pełne gotowanie na parze",
      "Zmywarka ma tylko klasę energetyczną D, a typ zawiasu (dopasowanie do wysokiego cokołu) trzeba sprawdzić w instrukcji montażu."
    ],
    "compare": {
      "Typ okapu": "do zabudowy w szafce 60 cm",
      "Płyta": "matowa SaphirMatt, na blat (SLIM-FIT, da się też zlicować)",
      "Płyta ↔ okap": "tak, Hob2Hood (automatycznie)",
      "Czyszczenie piekarnika": "piroliza",
      "Para w piekarniku": "tak, SteamCrisp",
      "Lodówka": "TwinTech NoFrost, klasa E, 36 dB",
      "Zmywarka": "AEG FSE83838P ComfortLift, 42 dB",
      "Aplikacja / Wi‑Fi": "piekarnik i zmywarka (My AEG Kitchen)"
    },
    "alternatives": {
      "hood": [
        {
          "category": "hood",
          "brand": "AEG",
          "model": "DPE5660M",
          "name": "Okap teleskopowy AEG 60 cm",
          "price": 1045,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Allegro",
          "storeUrl": "https://allegro.pl/listing?string=okap+aeg+60cm",
          "otherStores": [],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Typ": "teleskopowy (wysuwany panel)",
            "Szerokość": "60 cm"
          },
          "features": [
            "wysuwany panel włącza okap",
            "chowa się w szafce 60 cm"
          ],
          "notes": "Specyfikacja (wydajność, Hob2Hood) nie potwierdzona w wynikach; cena „od” z porównywarki. Prawdopodobnie bez Hob2Hood.",
          "altKind": "tańsza",
          "altReason": "Klasyczny okap teleskopowy o ok. 400 zł tańszy, ale najpewniej bez Hob2Hood i z prostszym sterowaniem.",
          "finish": "black",
          "style": "telescopic"
        },
        {
          "category": "hood",
          "brand": "AEG",
          "model": "DGE5861HM",
          "name": "Okap do zabudowy AEG 7000 Hob2Hood 80 cm",
          "price": 1676,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Ceneo",
          "storeUrl": "https://www.ceneo.pl/102194959",
          "otherStores": [
            {
              "store": "AGD Style / inne",
              "price": 1795
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Szerokość": "80 cm (do szafki 80/90 cm)",
            "Wydajność": "300/580, intensywna 700 m³/h",
            "Hałas": "54–67 dB (68 dB intensywna)",
            "Klasa energetyczna": "A",
            "Filtr tłuszczowy": "klasa D",
            "Biegi": "3 + intensywny",
            "Hob2Hood": "tak"
          },
          "features": [
            "Hob2Hood",
            "700 m³/h na biegu intensywnym",
            "szerszy okap lepiej pokrywa płytę",
            "inox, zabudowa w szafce"
          ],
          "altKind": "lepsza",
          "altReason": "Ta sama seria, ale 80 cm i do 700 m³/h – lepiej wyciąga opary; wymaga szafki 80 cm.",
          "finish": "black",
          "style": "telescopic"
        }
      ],
      "hob": [
        {
          "category": "hob",
          "brand": "Electrolux",
          "model": "MEXIV602T",
          "name": "Płyta indukcyjna Electrolux Bridge 600 SaphirMatt SE 60 cm",
          "price": 2400,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Media Expert",
          "storeUrl": "https://www.mediaexpert.pl/agd-do-zabudowy/plyty-do-zabudowy/plyta-indukcyjna-electrolux-mexiv602t-bridge-hob2hood",
          "otherStores": [
            {
              "store": "Ceneo (od)",
              "price": 2400
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Powierzchnia": "matowa, czarna SaphirMatt SE",
            "Szerokość": "60 cm",
            "Montaż": "nablatowy",
            "Strefy": "4, Bridge",
            "Hob2Hood": "tak",
            "Sterowanie": "Direct Touch – suwaki dla każdej strefy",
            "Moc": "PowerBoost",
            "Odporność": "3× bardziej odporna na zarysowania"
          },
          "features": [
            "matowa powierzchnia",
            "Hob2Hood (zgodny z okapem AEG)",
            "Bridge",
            "PowerBoost"
          ],
          "flushMount": null,
          "notes": "Możliwość montażu zlicowanego nie potwierdzona.",
          "altKind": "tańsza",
          "altReason": "Matowa i nablatowa jak TI64IB10IZ, o ok. 600 zł tańsza, ale bez SenseBoil i z mniej odporną powłoką SaphirMatt SE.",
          "finish": "black",
          "style": "matte"
        },
        {
          "category": "hob",
          "brand": "Electrolux",
          "model": "EIS87453IZ",
          "name": "Płyta indukcyjna Electrolux 800 Sense Boil+Fry SaphirMatt 80 cm",
          "price": 3779,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "AGD Smart",
          "storeUrl": "https://agdsmart.pl/plyta-indukcyjna-electrolux-eis87453iz-949-599-341,id123599.html",
          "otherStores": [
            {
              "store": "Electro.pl",
              "price": 3785
            },
            {
              "store": "Allegro",
              "price": 4098
            },
            {
              "store": "Media Expert",
              "price": 4600
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Powierzchnia": "matowa, czarna SaphirMatt",
            "Szerokość": "77–80 cm",
            "Montaż": "nablatowy, SLIM-FIT",
            "Strefy": "4, Bridge",
            "Sensory": "SenseBoil + SenseFry",
            "Hob2Hood": "tak (wg sklepów)"
          },
          "features": [
            "szersza płyta – 4 duże garnki naraz",
            "SenseFry – automatyczna kontrola smażenia",
            "SenseBoil",
            "matowa powierzchnia odporna na rysy"
          ],
          "flushMount": true,
          "notes": "Wymaga szerszego otworu w blacie niż płyta 60 cm. Montaż zlicowany wg oznaczenia SLIM-FIT – potwierdzić w instrukcji.",
          "altKind": "lepsza",
          "altReason": "Matowa płyta 80 cm z sensorem smażenia SenseFry (jak w TH64IB30FB), ale wymaga większego wycięcia w blacie.",
          "finish": "black",
          "style": "matte"
        }
      ],
      "oven": [
        {
          "category": "oven",
          "brand": "AEG",
          "model": "BPK556320M",
          "name": "Piekarnik AEG SteamBake 6000 z pirolizą",
          "price": 1399,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Ceneo",
          "storeUrl": "https://www.ceneo.pl/80864361",
          "otherStores": [],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Pojemność": "71 l",
            "Klasa energetyczna": "A+",
            "Para": "SteamBake (para na starcie pieczenia)",
            "Czyszczenie": "piroliza",
            "Kolor": "inox"
          },
          "features": [
            "SteamBake",
            "piroliza",
            "cicho domykane drzwi SoftClosing"
          ],
          "notes": "Cena „od” z Ceneo tylko w 2 sklepach – może być nieaktualna. Wykończenie inox, a nie czarne jak BSE778380B. Bez Wi‑Fi i SteamCrisp.",
          "altKind": "tańsza",
          "altReason": "Zachowuje pirolizę i parę na starcie pieczenia, ale traci SteamCrisp, Wi‑Fi i czarny front – duża oszczędność.",
          "finish": "inox"
        },
        {
          "category": "oven",
          "brand": "AEG",
          "model": "BSK999330T",
          "name": "Piekarnik parowy AEG SteamPro 9000 z kamerą, czarny mat",
          "price": 8499,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Allegro",
          "storeUrl": "https://allegro.pl/produkt/piekarnik-elektryczny-parowy-aeg-bsk999330t-steampro-9000-para-78bf5584-fbe0-451c-82f6-8805c26bd513",
          "otherStores": [
            {
              "store": "Ceneo (najniższa z 30 dni)",
              "price": 10499
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Para": "pełna para, Steamify, SousVide",
            "Kamera": "CookView",
            "Sonda": "Food Sensor",
            "Czujnik": "wilgotności",
            "Sterowanie": "kolorowy ekran + pokrętło",
            "Kolor": "czarny mat"
          },
          "features": [
            "gotowanie w 100% na parze i SousVide",
            "kamera CookView w aplikacji",
            "sonda do mięsa",
            "automatyczna dawka pary"
          ],
          "notes": "Czyszczenie parowe zamiast pirolizy – sprawdzić, jeśli piroliza jest wymagana.",
          "altKind": "lepsza",
          "altReason": "Pełny piekarnik parowy z kamerą i sondą zamiast pary wspomagającej, kosztem ok. 3700 zł więcej i prawdopodobnie bez pirolizy.",
          "finish": "black"
        }
      ],
      "microwave": [
        {
          "category": "microwave",
          "brand": "AEG",
          "model": "MBE2658SEM",
          "name": "Kuchenka mikrofalowa AEG do zabudowy z grillem 26 l",
          "price": 1630,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "RTV Euro AGD",
          "storeUrl": "https://www.euro.com.pl/kuchenki-mikrofalowe-do-zabudowy/aeg-mbe2658sem.bhtml",
          "otherStores": [],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Pojemność": "26 l",
            "Moc": "900 W, 5 poziomów",
            "Grill": "tak",
            "Wymiary": "45,9 × 59,5 × 41,8 cm",
            "Talerz": "32,5 cm",
            "Sterowanie": "dotykowe, wyświetlacz"
          },
          "features": [
            "grill do zapiekania",
            "auto rozmrażanie wg wagi",
            "funkcja ulubionych",
            "te same wymiary co MBE2658DEM"
          ],
          "altKind": "inna",
          "altReason": "Ta sama obudowa i wnęka co MBE2658DEM, ale z grillem i zwykle ok. 450 zł taniej.",
          "finish": "black"
        },
        {
          "category": "microwave",
          "brand": "AEG",
          "model": "KMK721880B",
          "name": "Kompaktowa mikrofala AEG 6000 do wnęki 45 cm, z grillem",
          "price": 2845,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "sklepy AGD (wyniki wyszukiwania)",
          "storeUrl": "https://gigamarket.pl/mikrofala-aeg-kmk721880b,id12368.html",
          "otherStores": [
            {
              "store": "inny sklep",
              "price": 2979
            },
            {
              "store": "Gigamarket",
              "price": 3299
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Pojemność": "42 l",
            "Moc": "1000 W mikrofale, 1200 W grill",
            "Wnęka": "45 cm (seria kompakt)",
            "Talerz": "XL",
            "Kolor": "czarny",
            "Sterowanie": "dotykowy wyświetlacz EXCite"
          },
          "features": [
            "duża komora 42 l",
            "grill",
            "pasuje wysokością do linii piekarników kompaktowych",
            "blokada rodzicielska"
          ],
          "notes": "Wymaga wnęki 45 cm zamiast 38/46 cm wnęki mikrofali standardowej – sprawdzić projekt szafek.",
          "altKind": "lepsza",
          "altReason": "Prawie dwa razy większa komora, mocniejsze mikrofale i grill, lepiej pasuje do linii piekarnika; wymaga wnęki 45 cm.",
          "finish": "black"
        }
      ],
      "fridge": [
        {
          "category": "fridge",
          "brand": "AEG",
          "model": "SCE818E6TS",
          "name": "Lodówka do zabudowy AEG 6000 TwinTech NoFrost 177 cm",
          "price": 2840,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Electro.pl",
          "storeUrl": "https://www.electro.pl/agd-do-zabudowy/lodowki-i-zamrazarki-do-zabudowy/lodowki-do-zabudowy/lodowka-aeg-sce818e6ts",
          "otherStores": [
            {
              "store": "Media Expert",
              "price": 2999
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Wysokość": "177,2 cm",
            "Pojemność": "193 l + 61 l zamrażarka",
            "NoFrost": "TwinTech No Frost",
            "Obieg": "DynamicAir",
            "Funkcje": "Coolmatic, Action Freeze",
            "Drzwi": "prawe, przekładane"
          },
          "features": [
            "TwinTech No Frost",
            "DynamicAir",
            "szybkie chłodzenie/mrożenie",
            "wyświetlacz LED"
          ],
          "notes": "Starszy model, w części sklepów wycofany. Typ zawiasu (stały/ślizgowy) nie potwierdzony w wynikach.",
          "altKind": "tańsza",
          "altReason": "Podobny układ TwinTech NoFrost i wymiary, ok. 1700 zł taniej, ale starsza seria 6000 bez nowszych szuflad.",
          "finish": "black"
        },
        {
          "category": "fridge",
          "brand": "AEG",
          "model": "TSC8M181DS",
          "name": "Lodówka do zabudowy AEG 8000 TwinTech NoFrost 360°, klasa D",
          "price": 4999,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "JoppDesign",
          "storeUrl": "https://joppdesign.store/lodowki-do-zabudowy/5761-aeg-lodowka-do-zabudowy-tsc8m181ds-kup-w-zestawie-i-zyskaj-5-lat-gwarancji-tel-12-357-73-51-.html",
          "otherStores": [
            {
              "store": "inne sklepy",
              "price": 6299
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Wysokość": "177,2 cm",
            "Pojemność": "249 l łącznie, zamrażarka 62 l",
            "Klasa energetyczna": "D (173 kWh/rok)",
            "Hałas": "35 dB",
            "NoFrost": "TwinTech, chłodzenie 360°",
            "Szuflada": "Extra Chill, GreenZone",
            "Drzwi": "na prowadnicach (ślizgowe), przekładane"
          },
          "features": [
            "klasa D zamiast E",
            "równomierne chłodzenie 360°",
            "szuflada Extra Chill",
            "cicha praca 35 dB"
          ],
          "notes": "Montaż ślizgowy, jak w TSC7G181ES.",
          "altKind": "lepsza",
          "altReason": "Seria 8000 w klasie D (niższe zużycie prądu niż klasa E) z chłodzeniem 360° i szufladą Extra Chill, za ok. 400 zł więcej.",
          "finish": "black"
        }
      ],
      "dishwasher": [
        {
          "category": "dishwasher",
          "brand": "AEG",
          "model": "FSE73727P",
          "name": "Zmywarka AEG 7000 GlassCare QuickSelect 60 cm, zintegrowana",
          "price": 2795,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Ceneo",
          "storeUrl": "https://www.ceneo.pl/107292533",
          "otherStores": [
            {
              "store": "sklepy (zakres)",
              "price": 2909
            },
            {
              "store": "sklepy (zakres)",
              "price": 3199
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Szerokość": "60 cm (wys. 81,8 cm)",
            "Komplety": "15",
            "Głośność": "44 dB",
            "Klasa energetyczna": "D",
            "Trzeci poziom": "szuflada MaxiFlex",
            "Programy": "7, sensor auto",
            "Suszenie": "AirDry",
            "Wi‑Fi": "brak"
          },
          "features": [
            "szuflada MaxiFlex",
            "SoftGrips/SoftSpikes do szkła",
            "Beam on floor",
            "SatelliteClean"
          ],
          "notes": "Wi‑Fi nie potwierdzone w wynikach (prawdopodobnie brak).",
          "altKind": "tańsza",
          "altReason": "Ok. 1200 zł taniej i o 1 komplet więcej, ale bez podnoszonego kosza ComfortLift i Wi‑Fi.",
          "finish": "black"
        },
        {
          "category": "dishwasher",
          "brand": "AEG",
          "model": "FSK75778P",
          "name": "Zmywarka AEG 7000 GlassCare 60 cm, klasa B, Wi‑Fi",
          "price": 3999,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Ceneo",
          "storeUrl": "https://www.ceneo.pl/Zmywarki_do_zabudowy/p:AEG.htm",
          "otherStores": [
            {
              "store": "Allegro",
              "price": 4499
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Szerokość": "60 cm (wys. 82 cm)",
            "Komplety": "14",
            "Głośność": "42 dB",
            "Klasa energetyczna": "B",
            "Trzeci poziom": "szuflada MaxiFlex",
            "Programy": "6 + 4 funkcje, AUTO Sense",
            "Suszenie": "AirDry",
            "Wi‑Fi": "tak"
          },
          "features": [
            "klasa B – ok. 9 l wody na cykl",
            "MaxiFlex",
            "SoftGrips/SoftSpikes",
            "Wi‑Fi, QuickSelect",
            "oświetlenie wnętrza"
          ],
          "notes": "storeUrl to lista Ceneo AEG – karta produktu na aeg.pl: https://www.aeg.pl/kitchen/dishwashing/dishwashers/built-in-dishwasher/fsk75778p/",
          "altKind": "inna",
          "altReason": "W tej samej cenie klasa energetyczna B zamiast D i Wi‑Fi, ale bez podnoszonego kosza ComfortLift.",
          "finish": "black"
        }
      ]
    }
  },
  {
    "slug": "premium",
    "label": "Premium · Siemens iQ700",
    "tagline": "Matowa płyta flexInduction na blat, para + piroliza, lodówka hyperFresh 0°C",
    "priceRange": "Premium",
    "accent": "#b45309",
    "brandSummary": "Spójny zestaw Siemens iQ700 w czerni: matowa płyta Matt Edition z flexInduction Plus i czujnikiem smażenia, piekarnik z parą i pirolizą, bezobrotowa mikrofala, cichy okap iQdrive, lodówka hyperFresh Premium 0°C i zmywarka iQ500 z zeolitem.",
    "bestFor": "Dla osób, które chcą dopracowanej, spójnej wizualnie kuchni premium z matową płytą na blat i piekarnikiem z parą, bez przepłacania za Miele.",
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
        "model": "EX61AHYC1E",
        "name": "Płyta indukcyjna iQ700 Matt Edition 60 cm, nablatowa",
        "price": 3771,
        "oldPrice": null,
        "priceConfidence": "estimate",
        "store": "Ceneo",
        "storeUrl": "https://www.ceneo.pl/195650378",
        "otherStores": [
          {
            "store": "Allegro",
            "price": 3772
          },
          {
            "store": "Platforma AGD",
            "price": 3699
          }
        ],
        "promo": null,
        "imageUrl": "",
        "specs": {
          "Powierzchnia": "matowa czarna ceramika szklana (Matt Edition)",
          "Montaż": "nablatowy, bezramkowa",
          "Szerokość": "60 cm",
          "Strefy": "4 pola / 2 strefy flexInduction Plus",
          "Sterowanie": "Multitouch+ / touchSlider, 17 stopni",
          "Moc przyłączeniowa": "7,4 kW (powerManagement)",
          "Łączność": "Home Connect, cookConnect (okap)"
        },
        "features": [
          "Matowe szkło – mniej widoczne rysy i odciski",
          "flexInduction Plus",
          "fryingSensor Pro",
          "powerBoost",
          "Home Connect",
          "Automatyczne sterowanie okapem"
        ],
        "flushMount": false,
        "notes": "Źródła sprzeczne co do montażu zlicowanego – większość wskazuje wyłącznie nablatowy; sprawdzić w instrukcji montażu przed zamówieniem. Ma Home Connect, którego brakowało w EX675LYC1E.",
        "finish": "black",
        "style": "matte"
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
      },
      {
        "category": "dishwasher",
        "brand": "Siemens",
        "model": "SN75ZX16CE",
        "name": "Zmywarka do zabudowy iQ500 60 cm, Zeolith, zawiasy przesuwne",
        "price": 4599,
        "oldPrice": null,
        "priceConfidence": "estimate",
        "store": "Elektrohome",
        "storeUrl": "https://elektrohome.pl/zmywarka-siemens-sn75zx16ce,id103042.html",
        "otherStores": [
          {
            "store": "Allegro",
            "price": 4598
          },
          {
            "store": "Ceneo (od)",
            "price": 4665
          },
          {
            "store": "Platforma AGD",
            "price": 4665
          }
        ],
        "promo": null,
        "imageUrl": "",
        "specs": {
          "Szerokość": "59,8 cm, w pełni zintegrowana",
          "Liczba kompletów": "14",
          "Głośność": "40 dB",
          "Klasa energetyczna": "B (65 kWh/100 cykli)",
          "Trzeci kosz": "szuflada na sztućce",
          "Programy": "6 (Eco 50, Auto 45-65, Intensywny 70, Express 60, Szybki 45, Ulubiony)",
          "Suszenie": "Zeolith",
          "Montaż": "zawiasy przesuwne varioHinge; Wi‑Fi Home Connect"
        },
        "features": [
          "Turbosuszenie Zeolith",
          "varioSpeed Plus",
          "Home Connect",
          "Zawiasy przesuwne (niskie cokoły / wyższa zabudowa)",
          "AquaStop",
          "Start opóźniony do 24 h"
        ],
        "notes": "iQ500 zamiast iQ700 – iQ700 z Zeolith/varioHinge kosztuje ok. 6–6,5 tys. zł; wysokość niszy 81,5 cm.",
        "finish": "black"
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
      "Matowa płyta iQ700 Matt Edition na blat z flexInduction Plus, fryingSensor Pro i Home Connect.",
      "Piekarnik łączy wspomaganie parą, pirolizę, hydrolizę i Air Fry – bardzo uniwersalny",
      "Cichy okap teleskopowy iQdrive ukryty w szafce",
      "hyperFresh Premium 0°C w lodówce – realnie dłuższa świeżość mięsa i warzyw",
      "Mikrofala bez talerza obrotowego – więcej miejsca i łatwe mycie",
      "Szeroka sieć serwisowa BSH i dostępność części w Polsce",
      "Zmywarka z suszeniem Zeolith, zawiasami przesuwnymi i Home Connect cicho (40 dB) domyka zestaw w tym samym ekosystemie Siemens."
    ],
    "cons": [
      "Okap LI67SA680 nie ma Home Connect, więc płyta (która ma cookConnect) nie steruje nim automatycznie — do tego trzeba okapu z Home Connect.",
      "Lodówka KI86FPDD0 trudno dostępna w PL i w klasie D; alternatywa iQ500 jest tańsza, ale mniej premium",
      "Płyta EX61AHYC1E jest nablatowa — według większości źródeł nie nadaje się do montażu na równo z blatem, więc sprawdź instrukcję, jeśli kiedyś zechcesz zlicowania.",
      "Mikrofala solo 21 l – bez grilla, mała pojemność",
      "Zmywarka jest z serii iQ500 – wersja iQ700 z tymi samymi funkcjami kosztuje ok. 6–6,5 tys. zł."
    ],
    "compare": {
      "Typ okapu": "teleskopowy, cichy iQdrive",
      "Płyta": "matowa Matt Edition, na blat",
      "Płyta ↔ okap": "nie (okap bez Home Connect)",
      "Czyszczenie piekarnika": "piroliza + hydroliza",
      "Para w piekarniku": "tak, wspomaganie parą",
      "Lodówka": "hyperFresh Premium 0°C, klasa D",
      "Zmywarka": "Siemens SN75ZX16CE, 40 dB, zeolit",
      "Aplikacja / Wi‑Fi": "piekarnik, płyta i zmywarka (Home Connect)"
    },
    "alternatives": {
      "hood": [
        {
          "category": "hood",
          "brand": "Siemens",
          "model": "LI67RA561",
          "name": "Okap teleskopowy iQ500 60 cm",
          "price": 1932,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Ceneo",
          "storeUrl": "https://www.ceneo.pl/Okapy/p:Siemens/Typ_okapu:Teleskopowy.htm",
          "otherStores": [
            {
              "store": "AGD Smart",
              "price": 2097
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Typ": "teleskopowy (szufladowy)",
            "Szerokość": "59,8 cm",
            "Wydajność": "207–392 m³/h, intensywnie 716 m³/h",
            "Głośność": "41 dB",
            "Klasa energetyczna": "A",
            "Tryb": "wyciąg lub pochłaniacz"
          },
          "features": [
            "Ukryty w szafce",
            "Oświetlenie LED",
            "3 biegi + 2 intensywne",
            "Sterowanie elektroniczne"
          ],
          "altKind": "tańsza",
          "altReason": "Ta sama konstrukcja teleskopowa i podobna wydajność za ok. połowę ceny, łatwiej dostępny w Polsce niż LI67SA680.",
          "notes": "Sprawdzić obecność Home Connect w konkretnej wersji.",
          "finish": "black",
          "style": "telescopic"
        },
        {
          "category": "hood",
          "brand": "Bosch",
          "model": "DFS067K51",
          "name": "Okap teleskopowy Serie 8 60 cm",
          "price": 2599,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Elektrohome",
          "storeUrl": "https://elektrohome.pl/okap-szafkowy-szufladkowy-bosch-dfs067k51,id93217.html",
          "otherStores": [
            {
              "store": "Ceneo",
              "price": 2589
            },
            {
              "store": "Castorama",
              "price": 2599
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Typ": "teleskopowy",
            "Szerokość": "59,8 cm",
            "Wydajność": "207–392 m³/h, intensywnie 716 m³/h",
            "Klasa energetyczna": "A",
            "Zużycie energii": "37,9 kWh/rok",
            "Biegi": "3 + 2 intensywne"
          },
          "features": [
            "Seria Serie 8 (odpowiednik iQ700)",
            "Oświetlenie LED",
            "Ukryty w szafce",
            "Szeroko dostępny w PL"
          ],
          "altKind": "inna",
          "altReason": "Dostępny od ręki odpowiednik z grupy BSH, rozwiązuje problem słabej dostępności LI67SA680 przy zachowaniu montażu teleskopowego.",
          "notes": "Inna marka (Bosch) – wzornictwo panelu różni się od Siemens.",
          "finish": "black",
          "style": "telescopic"
        }
      ],
      "hob": [
        {
          "category": "hob",
          "brand": "Siemens",
          "model": "ED61AHSC1E",
          "name": "Płyta indukcyjna iQ500 Matt Edition 60 cm, nablatowa",
          "price": 2589,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Allegro",
          "storeUrl": "https://www.ceneo.pl/189059357",
          "otherStores": [
            {
              "store": "Allegro",
              "price": 2599
            },
            {
              "store": "Media Expert",
              "price": 3149
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Powierzchnia": "matowa czarna ceramika szklana (Matt Edition)",
            "Montaż": "nablatowy",
            "Szerokość": "59,2 cm",
            "Strefy": "4 pola, combiZone",
            "Sterowanie": "touchSlider, 17 stopni",
            "Łączność": "Home Connect"
          },
          "features": [
            "Matowe szkło",
            "combiZone",
            "fryingSensor",
            "Booster / shortBoost",
            "Home Connect"
          ],
          "flushMount": false,
          "altKind": "tańsza",
          "altReason": "Ta sama matowa powierzchnia i montaż nablatowy o ok. 1,2 tys. zł taniej, ale combiZone zamiast flexInduction Plus i prostszy czujnik smażenia.",
          "finish": "black",
          "style": "matte"
        },
        {
          "category": "hob",
          "brand": "Siemens",
          "model": "EX81AHYC1E",
          "name": "Płyta indukcyjna iQ700 Matt Edition 80 cm, nablatowa",
          "price": 4402,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Elektrohome",
          "storeUrl": "https://elektrohome.pl/plyta-indukcyjna-siemens-ex81ahyc1e-iq700,id118151.html",
          "otherStores": [],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Powierzchnia": "matowa czarna ceramika szklana (Matt Edition)",
            "Montaż": "nablatowy, bezramkowa",
            "Szerokość": "80 cm",
            "Strefy": "flexInduction Plus",
            "Sterowanie": "touchSlider",
            "Funkcje": "fryingSensor Pro, powerBoost",
            "Łączność": "Home Connect, cookConnect"
          },
          "features": [
            "Matowe szkło",
            "Większa powierzchnia gotowania",
            "flexInduction Plus",
            "fryingSensor Pro",
            "Home Connect"
          ],
          "flushMount": false,
          "altKind": "lepsza",
          "altReason": "Ta sama matowa seria iQ700, ale 80 cm szerokości daje więcej miejsca na duże garnki; wymaga szerszego wycięcia w blacie.",
          "notes": "Ceny w innych sklepach niepotwierdzone. Sprawdzić wymiar wycięcia względem szafki i okapu 60 cm.",
          "finish": "black",
          "style": "matte"
        }
      ],
      "oven": [
        {
          "category": "oven",
          "brand": "Siemens",
          "model": "HB774G1B1",
          "name": "Piekarnik iQ700 z pirolizą, bez pary",
          "price": 3681,
          "oldPrice": 4499,
          "priceConfidence": "estimate",
          "store": "Ceneo",
          "storeUrl": "https://www.ceneo.pl/163486746",
          "otherStores": [
            {
              "store": "Allegro",
              "price": 3731
            },
            {
              "store": "Media Expert",
              "price": 3799
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Pojemność": "71 l",
            "Klasa energetyczna": "A+",
            "Funkcje grzania": "12, w tym 3D i Air Fry",
            "Czyszczenie": "piroliza + hydroliza",
            "Łączność": "Home Connect",
            "Wyświetlacz": "kolorowy dotykowy"
          },
          "features": [
            "Piroliza activeClean",
            "Air Fry",
            "Programy automatyczne",
            "coolStart",
            "Home Connect"
          ],
          "altKind": "tańsza",
          "altReason": "Ta sama seria iQ700 z pirolizą, ale bez wspomagania parą – ok. 1,6 tys. zł taniej.",
          "finish": "black"
        },
        {
          "category": "oven",
          "brand": "Siemens",
          "model": "HS758G3B1",
          "name": "Piekarnik parowy iQ700 fullSteam Plus",
          "price": 6699,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Ceneo",
          "storeUrl": "https://www.ceneo.pl/165618382",
          "otherStores": [
            {
              "store": "Etrona",
              "price": 5408
            },
            {
              "store": "Allegro",
              "price": 6259
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Pojemność": "71 l",
            "Klasa energetyczna": "A+",
            "Para": "pełne gotowanie na parze (fullSteam Plus)",
            "Grzanie": "termoobieg 4D",
            "Termosonda": "tak",
            "Sterowanie": "cookControl Pro"
          },
          "features": [
            "Pełny piekarnik parowy",
            "Termosonda",
            "Termoobieg 4D",
            "Programy automatyczne",
            "Home Connect"
          ],
          "altKind": "lepsza",
          "altReason": "Zamiast dodatku pary oferuje pełne gotowanie na parze i termosondę, ale prawdopodobnie bez pirolizy.",
          "notes": "Duży rozrzut cen (5,4–12 tys. zł); zweryfikować system czyszczenia.",
          "finish": "black"
        }
      ],
      "microwave": [
        {
          "category": "microwave",
          "brand": "Siemens",
          "model": "BF525LMB1",
          "name": "Kuchenka mikrofalowa iQ500 do zabudowy, czarna",
          "price": 1415,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Ceneo",
          "storeUrl": "https://www.ceneo.pl/173802979",
          "otherStores": [
            {
              "store": "AGD Smart",
              "price": 1469
            },
            {
              "store": "Elektrohome",
              "price": 1598
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Wymiary": "59 x 38 cm",
            "Zabudowa": "szafka 60 cm",
            "Kolor": "czarny",
            "Drzwi": "lewe",
            "Grill": "nie"
          },
          "features": [
            "Czarny front pasujący do iQ700",
            "Prosta obsługa",
            "Do zabudowy w szafce górnej lub słupku"
          ],
          "altKind": "tańsza",
          "altReason": "Ta sama funkcja mikrofali bez grilla za ok. 1,1 tys. zł mniej, ale prostszy panel i wzornictwo niższej serii.",
          "finish": "black"
        },
        {
          "category": "microwave",
          "brand": "Siemens",
          "model": "BE732R1B1",
          "name": "Kuchenka mikrofalowa iQ700 z grillem",
          "price": 2749,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Allegro",
          "storeUrl": "https://www.ceneo.pl/152021817",
          "otherStores": [
            {
              "store": "Max Kuchnie",
              "price": 4099
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Pojemność": "21 l",
            "Moc": "900 W",
            "Grill": "tak",
            "Programy": "10 automatycznych",
            "Kolor": "czarny",
            "Drzwi": "prawe (BE732L1B1 – lewe)"
          },
          "features": [
            "Grill",
            "Seria iQ700 – spójny wygląd",
            "Programy automatyczne",
            "Czarne szkło"
          ],
          "altKind": "inna",
          "altReason": "Dodaje grill, którego brakuje w BF722L1B1, przy podobnej cenie i tym samym wzornictwie iQ700.",
          "finish": "black"
        }
      ],
      "fridge": [
        {
          "category": "fridge",
          "brand": "Siemens",
          "model": "KI86NADD0",
          "name": "Lodówka do zabudowy iQ500 177 cm No Frost",
          "price": 3797,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Ceneo",
          "storeUrl": "https://www.ceneo.pl/150748742",
          "otherStores": [
            {
              "store": "AGD Smart",
              "price": 3789
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Wysokość": "177,2 cm",
            "Zamrażarka": "76 l, No Frost",
            "Głośność": "35 dB",
            "Zawiasy": "płaskie, softClose",
            "Szuflada": "z kontrolą wilgotności",
            "Wymiary": "177,2 x 55,8 x 54,8 cm"
          },
          "features": [
            "Pełny No Frost",
            "Zawiasy płaskie z softClose",
            "Zmiana kierunku otwierania",
            "Dostępna od ręki"
          ],
          "altKind": "tańsza",
          "altReason": "Dostępny zamiennik ok. 3,7 tys. zł taniej, bez strefy hyperFresh Premium 0°C z KI86FPDD0.",
          "finish": "black"
        },
        {
          "category": "fridge",
          "brand": "Liebherr",
          "model": "ICBNdi 5183 Peak",
          "name": "Lodówka do zabudowy Peak BioFresh Professional NoFrost",
          "price": 13189,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Ceneo",
          "storeUrl": "https://www.ceneo.pl/105870757",
          "otherStores": [
            {
              "store": "Gigamarket",
              "price": 13899
            },
            {
              "store": "inny sklep",
              "price": 12254
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Wysokość": "178 cm",
            "Pojemność": "246 l",
            "Strefa świeżości": "BioFresh Professional z HydroBreeze",
            "Zamrażarka": "NoFrost, kostkarka IceMaker",
            "Łączność": "moduł SmartDevice",
            "Przyłącze wody": "wymagane"
          },
          "features": [
            "BioFresh Professional",
            "HydroBreeze",
            "Kostkarka",
            "NoFrost",
            "SmartDevice"
          ],
          "altKind": "lepsza",
          "altReason": "Topowa lodówka z lepszą strefą świeżości i kostkarką, ale o ok. 5,5 tys. zł droższa i wymaga przyłącza wody.",
          "notes": "Inna marka; sprawdzić sposób montażu frontu.",
          "finish": "black"
        }
      ],
      "dishwasher": [
        {
          "category": "dishwasher",
          "brand": "Siemens",
          "model": "SN65ZX07CE",
          "name": "Zmywarka do zabudowy iQ500 60 cm Zeolith",
          "price": 3288,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Ceneo",
          "storeUrl": "https://www.ceneo.pl/157341406",
          "otherStores": [
            {
              "store": "Allegro",
              "price": 3088
            },
            {
              "store": "Elektrohome",
              "price": 3489
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Szerokość": "59,8 cm",
            "Liczba kompletów": "14",
            "Głośność": "40 dB",
            "Klasa energetyczna": "B (65 kWh/100 cykli)",
            "Trzeci kosz": "szuflada na sztućce",
            "Suszenie": "Zeolith",
            "Wi‑Fi": "Home Connect",
            "Zużycie wody": "9 l/cykl"
          },
          "features": [
            "Turbosuszenie Zeolith",
            "varioSpeed Plus",
            "Home Connect",
            "Szuflada na sztućce"
          ],
          "altKind": "tańsza",
          "altReason": "Te same 14 kompletów, 40 dB i suszenie Zeolith ok. 1,3 tys. zł taniej; sprawdzić, czy ma zawiasy przesuwne potrzebne przy niskim cokole.",
          "notes": "Informacje o zawiasach przesuwnych niejednoznaczne.",
          "finish": "black"
        },
        {
          "category": "dishwasher",
          "brand": "Siemens",
          "model": "SN67ZX06CE",
          "name": "Zmywarka do zabudowy iQ700 60 cm Zeolith",
          "price": 6245,
          "oldPrice": null,
          "priceConfidence": "estimate",
          "store": "Ceneo",
          "storeUrl": "https://www.ceneo.pl/156147458",
          "otherStores": [
            {
              "store": "Max Elektro",
              "price": 6245
            }
          ],
          "promo": null,
          "imageUrl": "",
          "specs": {
            "Szerokość": "59,8 cm",
            "Liczba kompletów": "14",
            "Głośność": "40 dB",
            "Klasa energetyczna": "B",
            "Trzeci kosz": "szuflada na sztućce",
            "Programy": "8, w tym Auto",
            "Suszenie": "Zeolith z Airflow, Extra Gloss",
            "Montaż": "zawiasy przesuwne, wysokość 81,5 cm; Wi‑Fi Home Connect"
          },
          "features": [
            "Seria iQ700 – spójna z zestawem",
            "Zeolith + Extra Gloss",
            "Kosze flexComfort Pro",
            "varioSpeed Plus",
            "Oświetlenie TimeLight",
            "Home Connect"
          ],
          "altKind": "lepsza",
          "altReason": "Wersja iQ700 z lepszymi koszami flexComfort Pro, więcej programów i TimeLight, ale ok. 1,6 tys. zł drożej.",
          "finish": "black"
        }
      ]
    }
  }
]
