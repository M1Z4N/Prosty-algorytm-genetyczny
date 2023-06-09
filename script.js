let populacje = [];

function start(a, b, c, ile_wyn, lb_pop, ile_os, pr_krzyz, pr_mut) {
    event.preventDefault(); // Zapobiegnięcie odświeżenia strony po wysłaniu forma
    // document.getElementById('result').innerText = a + b + c + ile_wyn + lb_pop + ile_os + pr_krzyz + pr_mut;

    a = parseInt(a);
    b = parseInt(b);          // Współczynniki pobierane są jako string, konwertowanie na potrzebę późniejszych obliczeń
    c = parseInt(c);

    // Czyścimy textarea, żeby nie dopisywało do starych wyników
    document.getElementById('text').innerHTML = `f(best) best`;


    // Główna pętla
    for (let i = 0; i < ile_wyn; i++) {
        // Czyszczenie tablic żeby nie nadpisywać przy ponownym uruchomieniu
        populacje = [];
        populacjeBinarniePrzedMutacja = [];
        populacjeBinarniePoMutacji = [];

        populacjaPoczatkowa(ile_os);
        console.log(`Populacja początkowa: (Uruchomienie nr.${i})`);
        console.table(populacje);

        for (let i = 0; i < lb_pop; i++) {
            // Przed mutacją należy wyczyścić tablice binarne
            populacjeBinarniePrzedMutacja = [];
            populacjeBinarniePoMutacji = [];


            mutacje(pr_mut, i);

            console.log(`Populacja ${i} po mutacji:`);
            console.table(populacje);

            krzyzowanie(pr_krzyz);

            console.log(`Populacja ${i} po krzyżowaniu:`);
            console.table(populacje);

            selekcja(a, b, c);

            console.log(`Populacja ${i} po selekcji:`);
            console.table(populacje);
        }

        najlepszyOsobnikZOstatniejPopulacji(a, b, c, ile_os, lb_pop);
    }

    // Odkomentować linijkę poniżej jeśli chcesz zapisać plik od razu po wykonaniu algorytmu
    // document.getElementById("pobierz").click();

}

function funkcjaKwadratowa(a, b, c, x) {
    return a * Math.pow(x, 2) + b * x + c;
}

function populacjaPoczatkowa(ile_os) {
    for (let j = 0; j < ile_os; j++) {
        let osobnik = Math.floor(Math.random() * (256)); // Losowanie osobnika (x) od 0 do 255
        populacje.push(osobnik);
    }
}

function mutacje(pr_mut, i) {
    let tempArrayBefore = []; // Tabela pomocnicza dodająca osobniki (binarnie) danej populacji w każdej iteracji pętli przed mutacją
    let tempArrayAfter = [];  //Tabela pomocnicza dodająca osobniki (binarnie) danej populacji w każdej iteracji pętli po mutacji

    for (const osobnik of populacje.keys()) { // indexy poszczególnych kolejnych osobników z tablicy populacje

        let osobnikBinarnie = [...populacje[osobnik].toString(2)]; // tworzenie tablicy pomocniczej z binarnym zapisem konkretnego osobnika

        while (osobnikBinarnie.length < 8) {
            osobnikBinarnie.unshift("0");   // Wyrównywanie tablic do 8 bitów
        }

        tempArrayBefore[osobnik] = [...osobnikBinarnie]; // Dodaje do pomocniczej tablicy (na indexie osobnika), tablicę z binarnym zapisanem osobnika przed mutacją


        // Mutowanie
        for (const bit of osobnikBinarnie.keys()) {
            if (Math.random() * (100) < pr_mut) {
                osobnikBinarnie[bit] = osobnikBinarnie[bit] == 1 ? '0' : '1';
            } // Jeśli wylosuje wyżej (wartości większe niż podana przez użytkownika) to nie mutuje
        }

        tempArrayAfter[osobnik] = [...osobnikBinarnie]; // Dodaje do pomocniczej tablicy (na indexie osobnika), tablicę z binarnym zapisanem osobnika po mutacji

        populacje[osobnik] = parseInt(osobnikBinarnie.join(''), 2); // Nadpisywanie tablicy populacje zmutowanymi osobnikami

    }

    console.log(`Populacja ${i} binarnie przed mutacją:`);
    console.table(tempArrayBefore);
    console.log(`Populacja ${i} binarnie po mutacji:`);
    console.table(tempArrayAfter);


}


function krzyzowanie(pr_krzyz) {

    let populacjaPoKrzyzowaniu = [];
    // ======== Odkomentować linijki LOG żeby zobaczyć dokładny proces krzyżowania ======== //
    while (populacje.length > 1) {
        // console.log("populacje.length: " + populacje.length);                                                // ======================== LOG

        // Losowanie indexu rodziców z tabeli populacja
        let rodzic1 = Math.floor(Math.random() * populacje.length);
        let rodzic2 = Math.floor(Math.random() * populacje.length);

        while (rodzic2 == rodzic1) {
            rodzic2 = Math.floor(Math.random() * populacje.length); // Gdyby rodzic2 miał taki sam index co rodzic pierwszy losuj aż nie wylosuje innego.
        }

        // console.log("Indexy rodziców -> rodzic1: " + rodzic1 + " rodzic2: " + rodzic2);                     // ======================== LOG

        // Kopiujemy wartości rodziców do zmiennych tymczasowych
        const tempWartoscRodzic1 = populacje[rodzic1];
        const tempWartoscRodzic2 = populacje[rodzic2];


        // console.log("tempWartoscRodzic1: " + tempWartoscRodzic1);                                           // ======================== LOG
        // console.log("tempWartoscRodzic2: " + tempWartoscRodzic2);                                           // ======================== LOG

        // Jeśli rodzic2 jest większym indexem od rodzic1 to najpierw usuń osobnika o indexie większym czyli rodzic2
        // Bo jeśli usuniesz najpierw index mniejszy to wartość indexy większego przesunie się o -1

        if (rodzic2 > rodzic1) {
            // Usuwamy rodziców z tabeli populacja
            populacje.splice(rodzic2, 1); // splice(index,ile)  --> usuwa 'ile' elementów zaczynając od indexu 'index' czyli tutaj usuwamy 1 element o indexie rodzic2
            populacje.splice(rodzic1, 1);
        } else {
            // Usuwamy rodziców z tabeli populacja
            populacje.splice(rodzic1, 1);
            populacje.splice(rodzic2, 1);
        }

        // console.log("Tabela populacje: (po usunięciu rodziców)");                                           // ======================== LOG
        // console.table(populacje);                                                                          // ======================== LOG



        if (Math.random() * (100) < pr_krzyz) { // losowanie czy zajdzie krzyzowanie czy nie
            // Losujemy miejsce cięcia chromosomu 
            const miejsceCiecia = Math.floor(Math.random() * (7) + 1); // <1;7>

            // console.log("Będzie krzyżowanie!");                                                             // ======================== LOG
            // console.log("Miejsce ciecia: " + miejsceCiecia);                                                // ======================== LOG

            // Kodujemy osobniki (rodziców) do postaci binarnej
            const rodzic1Binarnie = [...tempWartoscRodzic1.toString(2)];
            const rodzic2Binarnie = [...tempWartoscRodzic2.toString(2)];

            while (rodzic1Binarnie.length < 8) {
                rodzic1Binarnie.unshift("0");   // Wyrównywanie tablicy rodzic1Binarnie do 8 bitów
            }

            while (rodzic2Binarnie.length < 8) {
                rodzic2Binarnie.unshift("0");   // Wyrównywanie tablicy rodzic2Binarnie do 8 bitów
            }

            // console.log("rodzic1Binarnie:");                                                                // ======================== LOG
            // console.table(rodzic1Binarnie);                                                                 // ======================== LOG
            // console.log("rodzic2Binarnie:");                                                                // ======================== LOG
            // console.table(rodzic2Binarnie);                                                                 // ======================== LOG


            // Tworzymy tablice binarne potomków z części rodziców
            let potomek1 = rodzic1Binarnie.slice(0, miejsceCiecia);
            potomek1.push(...rodzic2Binarnie.slice(miejsceCiecia)); // Spread syntax (...), bo slice zwraca tabelę,a chcemy pushnąć elementy
            let potomek2 = rodzic2Binarnie.slice(0, miejsceCiecia);
            potomek2.push(...rodzic1Binarnie.slice(miejsceCiecia));

            // console.log("potomek1:");                                                                       // ======================== LOG
            // console.table(potomek1);                                                                        // ======================== LOG
            // console.log("potomek2:");                                                                       // ======================== LOG
            // console.table(potomek2);                                                                        // ======================== LOG

            // Dekodujemy potomków do wartości dziesiętnych
            // Wpisujemy do tablicy tymczasowej populacjaPoKrzyzowaniu potomków ponieważ krzyżowanie zaszło
            populacjaPoKrzyzowaniu.push(parseInt(potomek1.join(''), 2));
            populacjaPoKrzyzowaniu.push(parseInt(potomek2.join(''), 2));

            // console.log("populacjaPoKrzyzowaniu:");                                                         // ======================== LOG
            // console.table(populacjaPoKrzyzowaniu);                                                          // ======================== LOG


        } else {
            // Wpisujemy do tablicy tymczasowej populacjaPoKrzyzowaniu rodziców ponieważ krzyżowanie nie zaszło
            populacjaPoKrzyzowaniu.push(tempWartoscRodzic1);
            populacjaPoKrzyzowaniu.push(tempWartoscRodzic2);

            // console.log("Krzyżowania nie było!!!!! (przepisujemy rodziców)");                                      // ======================== LOG
            // console.log("populacjaPoKrzyzowaniu:");                                                                // ======================== LOG
            // console.table(populacjaPoKrzyzowaniu);                                                                 // ======================== LOG

        }
    }
    // Jeśli liczba osobników była nieparzysta, ostatniego osobnika przepisujemy bez krzyżowania
    if (populacje.length == 1) {

        // console.log("populacja[0]" + populacja[0]);                                                              // ======================== LOG
        populacjaPoKrzyzowaniu.push(populacje[0]);
        // console.table(populacjaPoKrzyzowaniu);                                                                   // ======================== LOG
    }

    // Modyfikujemy globalną tablicę populacje nowymi osobnikami po krzyżowaniu
    populacje = [...populacjaPoKrzyzowaniu]; //  Spread syntax (...), żeby skopiować wartość tabeli, a nie referencję

}

function selekcja(a, b, c) {                                                                         // ======== Odkomentować linijki LOG żeby zobaczyć dokładny proces krzyżowania ======== //

    let najmniejszaWartosc = 0;
    let fsuma = 0;
    let prawdopodobienstwa = [];
    let wylosowaneWartosci = [];
    let populacjaPoSelekcji = [];

    // console.log(`Współczynniki funkcji celu: ${a}, ${b}, ${c}`);                                                                         // ======================== LOG

    // Wyznaczam najmniejszą wartość funckji celu dla pokolenia (0 - oznacza, że wszystkie wartości są większe lub równe 0)
    for (const osobnik of populacje) {
        if (najmniejszaWartosc > funkcjaKwadratowa(a, b, c, osobnik)) {
            najmniejszaWartosc = funkcjaKwadratowa(a, b, c, osobnik);
        }
    }

    // console.log(`Najmniejsza wartość populacji nr. ${numerPopulacji}: ${najmniejszaWartosc}`);                              // ======================== LOG

    // Sprawdzam czy najmniejsza wartość jest mniejsza od 0
    if (najmniejszaWartosc < 0) {
        // Pętla dla zliczenia wartości całkowitej funckji celu dla populacji
        for (const osobnik of populacje) {
            fsuma += funkcjaKwadratowa(a, b, c, osobnik) + Math.abs(najmniejszaWartosc) + 1;
        }

        // console.log(`fsuma: ${fsuma}`);                                                                                     // ======================== LOG

        // Pętla do wyznaczenia wartości bezwzględnych prowdopodobieństw na wylosowanie osobnika
        for (const osobnik of populacje) {
            prawdopodobienstwa.push((funkcjaKwadratowa(a, b, c, osobnik) + Math.abs(najmniejszaWartosc) + 1) / fsuma);
        }

        // console.log(`Tabela prawdopodobientwa:`);                                                                           // ======================== LOG
        // console.table(prawdopodobienstwa);                                                                                   // ======================== LOG


    } else {
        // Pętla dla zliczenia wartości całkowitej funckji celu dla populacji
        for (const osobnik of populacje) {
            fsuma += funkcjaKwadratowa(a, b, c, osobnik);
        }

        // console.log(`fsuma: ${fsuma}`);                                                                                     // ======================== LOG

        // Pętla do wyznaczenia prowdopodobieństw na wylosowanie osobnika
        for (const osobnik of populacje) {
            prawdopodobienstwa.push(funkcjaKwadratowa(a, b, c, osobnik) / fsuma);
        }

        // console.log(`Tabela prawdopodobientwa:`);                                                                           // ======================== LOG
        // console.table(prawdopodobienstwa);                                                                                   // ======================== LOG

    }

    // Petla do wylosowania losowych losów z przedziału [0,1)
    for (const osobnik of populacje) {
        wylosowaneWartosci.push(Math.random());
    }

    // console.log(`Tabela wylosowaneWartosci:`);                                                                           // ======================== LOG
    // console.table(wylosowaneWartosci);                                                                                   // ======================== LOG


    // Sprawdzamy każdą wylosowaną wartość w którym przedziale się znajduje
    for (const los of wylosowaneWartosci) {
        let temp = 0;

        // console.log(`Sprawdzanie w jakim przedziale znajduje się ${los}`);                                              // ======================== LOG

        for (let j = 0; j < populacje.length; j++) {
            if (los > temp && los < temp + prawdopodobienstwa[j]) {
                // console.log(`Przedział: [trafiony osobnik x${j}!]`);                                                                         // ======================== LOG
                // console.log(`[${temp};${temp+prawdopodobienstwa[j]})`);                                                                     // ======================== LOG
                populacjaPoSelekcji.push(populacje[j]);
                break;
            } else {
                // console.log(`Przedział: [nie trafiony]`);                                                            // ======================== LOG
                // console.log(`[${temp};${temp+prawdopodobienstwa[j]})`);                                              // ======================== LOG
                temp += prawdopodobienstwa[j];
            }
        }

    }

    // console.log(`Tabela populacjaPoSelekcji`);                                                                             // ======================== LOG
    // console.table(populacjaPoSelekcji);                                                                                    // ======================== LOG

    // Nadpisujemy tabele populacje wyselekcjowanymi osobnikami
    populacje = [...populacjaPoSelekcji];

}

function najlepszyOsobnikZOstatniejPopulacji(a, b, c, ile_os) {
    let textarea = document.getElementById("text");
    let najwiekszaWartosc = funkcjaKwadratowa(a, b, c, populacje[0]);
    let osobnik = populacje[0];

    for (let i = 1; i < (ile_os - 1); i++) {
        if (najwiekszaWartosc < funkcjaKwadratowa(a, b, c, populacje[i])) {
            najwiekszaWartosc = funkcjaKwadratowa(a, b, c, populacje[i]);
            osobnik = populacje[i];
        }
    }

    textarea.innerHTML += `&#10;${najwiekszaWartosc} ${osobnik}`
}























// ============================ Skrypty obsługi strony ============================



// Aktualna ilość osobników

function ratio() {
    const lb_pop = document.getElementById('lb_pop').value;
    const ile_os = document.getElementById('ile_os').value;
    let przyciskStart = document.getElementById('submit');

    const liczba_pojedynczych_osobnikow = lb_pop * ile_os;

    if (liczba_pojedynczych_osobnikow <= 150) {
        document.getElementById('ratio').innerHTML = liczba_pojedynczych_osobnikow;
        przyciskStart.removeAttribute("disabled");
        przyciskStart.classList.remove("disabled");
    } else {
        document.getElementById('ratio').innerHTML = liczba_pojedynczych_osobnikow + "<br><span id='alert'>Przekroczono dozwolony limit!!!</span>"
        przyciskStart.setAttribute("disabled", "");
        przyciskStart.classList.add("disabled");
    }
}


// Funckja generowania i pobierania pliku

function download(fileName, text) {
    event.preventDefault();
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', fileName);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
