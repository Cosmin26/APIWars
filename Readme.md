# REST a bit and try GraphQL (Optimizarea Api-urilor pentru client cu GraphQL)
## Introducere

După ani întregi în care am avut de a face cu API-uri de tip REST, fie consumându-le ca și simplu client, fie construind propriul serviciu, am putut simți cum neajunsurile unui serviciu REST pot provoca frustrări. În momentul în care serviciile noastre de tip REST cresc în dimensiune și complexitate, intervin probleme precum organizarea endpoint-urilor într-un mod eficient, structurat și satisfacerea nevoii de date ale clienților API-ului construit. Acest tip de frustrări i-au împins pe cei de la Facebook să anunțe în 2012 și, apoi, să-l ofere gratuit în 2015, un nou concept de API, și anume GraphQL. La momentul introducerii sale, GraphQL a fost privit ca o alternativă excelentă în domeniul API-urilor, datorită flexibilității pe care o oferea.

Dar v-ați întreba totuși, de ce ați avea nevoie chiar voi de GraphQL?

## Pe scurt: De ce GraphQL?

Cele mai importante probleme pe care GraphQL încearcă să le rezolve sunt:

* Necesitatea de a face mai multe request-uri pentru datele de care avem nevoie: cu GraphQL, putem face un singur request pentru datele de care avem nevoie de la un server, deoarece clientul nostru știe cum să îi ceară unui GraphQL server datele, folosind un singur query. Pentru a face același lucru cu un REST API, trebuie să introducem condiții și parametrii în plus, aceștia fiind greu de îngrijit când aplicația crește;
* Clienții depind de servere: cu GraphQL, clientul poate comunica cu serverul într-un limbaj special, care ne permite să eliminăm necesitatea serveruiui să ofere forma sau dimensiunea datelor și îi oferă clientului independența față de server. Astfel, putem menține și imbunătăți un server și un client, separat.
* Experiența neplacută drept front-end developer: datorită GraphQL-ului, developerii pot exprima nevoile interfețelor proprii printr-un limbaj declarativ. Ei exprimă ce au nevoie, nu cum să îl obțină.

În acest articol vom explica în detaliu cum GraphQL ne va rezolva toate aceste probleme.

Înainte de a continua, pentru cei care nu sunt familiari deloc cu GraphQL, le voi oferi o definiție.

## Ce este GraphQL?

GraphQL se ocupă de comunicarea de date. Aveți un server și un client, iar amândoi trebuie să vorbească între ei. Clientul trebuie să îi spună serverului de ce date are nevoie, iar serverul trebuie să fie capabil să îi trimită datele cerute. În acest proces de comunicare intervine GraphQL.

Nu se poate ca această comunicare să fie direct între client și server, fără niciun alt intermediar? Este posibil, cum a fost și până acum, în serverele noastre REST.

Sunt câteva motive pentru care, totusi, am vrea să avem un intermediar. Unul dintre acele motive și, probabil, cel mai popular, este eficiența. 
Uitându-ne la o librărie online, am vrea să vedem mai multe detalii despre: cărți, autori și posibile review-uri. Un server clasic REST ne-ar oferi endpoint-uri diferite pentru toate cele 3 entități, iar clientul ar trebui să ceară pe rând ceea ce vrea să vadă.

<img src="https://jscomplete.com/images/reads/introduction-to-graphql/f104.png" width="554"/>
* Imagine preluată de pe https://jscomplete.com/learn/complete-intro-graphql/why-graphql


Când folosim GraphQL, în loc de a cere mai multe resurse de mai multe ori, cerem o singură dată toate resursele de care avem nevoie. Bineînțeles, acest lucru poate fi realizat și cu un REST API, însă am devia de la normele după care ne ghidăm, atunci când construim un astfel de serviciu, lucru care nu este foarte recomandat în API-uri publice, spre exemplu.

<img src="https://jscomplete.com/images/reads/introduction-to-graphql/f105.png" width="554"/>
* Imagine preluată de pe https://jscomplete.com/learn/complete-intro-graphql/why-graphql


Încă un beneficiu major pe care ni-l oferă GraphQL, este comunicarea cu mai multe API-uri. Când avem mai mulți clienți, care cer date din locuri diferite, un layer de GraphQL poate veni în ajutor, simplificând și standardizând comunicarea. Deși acesta nu este un factor major pentru a folosi GraphQL peste REST, un GraphQL layer poate oferi o structură comună între clienți și servicii.

Putem să privim layer-ul de GraphQL ca un traducător. Să presupunem că avem trei oameni de la care vrem să obținem un răspuns pentru întrebarea noastră. Totuși, oamenii vorbesc limbi diferite și dețin bucăți de informații de care avem nevoie pentru a ajunge la adevăratul răspuns. Dacă am avea un traducător care să vorbească limbile vorbite de oameni și să știe cum să îi întrebe pe fiecare în parte pentru a combina răspunsurile, atunci problema este ca și rezolvată. Exact asta face și layer-ul de GraphQL.

Calculatoarele încă nu sunt destul de inteligente încât să ne răspundă la întrebări complexe fără să le descriem pas cu pas ceea ce vrem (ca într-un algoritm). De aceea, avem nevoie să definim o schemă pentru GraphQL, care va fi ulterior folosită de clienți.

Această schemă definește limitele API-ului fără să îi ofere o structură strictă, deoarece schema este reprezentată sub forma unui graph.

## Care sunt limitările folosind un REST API?

Principala problemă a unui serviciu REST tradițional constă în clienții care cer de mai multe ori resurse diferite. Acest lucru se întâmplă din cauza faptului că acești clienți ai serviciilor REST nu au un limbaj comun prin care să poată controla ce date primesc de la numeroasele endpoint-uri ale acestora.

Spre exemplu, două endpoint-uri de a citi cărțile pe care le oferă un API pot arăta astfel:

``` 
GET /books // pentru a primi lista cu toate cărțile sau 
GET /books/bookID // pentru a primi o singură carte
```

În cazul acesta, clientul nu poate să îi comunice serverului că are nevoie doar de numele cărții, o poză cu coperta sau că are nevoie și de datele autorului pentru a putea face reclamă  pozitivă.

Altă problemă cu API-urile de tip REST este versionarea lor. Dacă dorim să susținem mai multe versiuni pentru API-ul nostru, atunci trebuie să introducem endpoint-uri noi, care pot fi greu de îngrijit.

Genul acesta de probleme sunt exact ceea ce au vrut autorii GraphQL-ului să rezolve.

## Cum rezolvă GraphQL aceste probleme?

Sunt multe concepte în spatele GraphQL-ului, dar cele mai importe sunt:

* O *schemă* de GraphQL este exprimată prin tipuri de date. Pentru a crea o *schemă*, trebuie să ne definim proprietăți cu tipuri de date. Aceste tipuri pot fi primitive (*Integers*, *Strings*, etc.) sau tipuri definite de către noi.

* GraphQL tratează datele ca și cum ar face parte dintr-un *graf*, reprezentând clar datele și relațiile dintre acestea.

* GraphQL exprimă nevoie de date într-un mod declarativ, oferind clienților un limbaj pentru a-și enunța necesitățile. Acest mod declarativ ne permite să ne gândim la necesititatea noastră pentru date în limbaj natural.

Intrând în detaliu despre fiecare problemă a serviciilor REST, putem înțelege mai bine conceptele enunțate anterior:

* Pentru a rezolva problema cu request-uri multiple către diferite endpoint-uri, GraphQL duce ideea de endpoint customizat la extrem și oferă, astfel, doar un singur endpoint pentru toate nevoile clienților.

* Cu un singur endpoint, atunci apare nevoia de un limbaj prin care clienții să știe cum să ceară anumite date de la un singur endpoint. Dacă nu am avea acest limbaj, s-ar putea să ne trezim că am obținut în interfață toată baza de date, ceea ce nu e dorit. Cu acest limbaj, clientul are control asupra request-ului, lucru care, în trecut, era deținut de către API, obținând ceea ce vrea.

* În ceea ce privește *versionarea*, GraphQL evită această problemă prin structura de *graf* în care sunt reprezentate datele. Oricând putem introduce noi proprietăți fără să le ștergem pe cele vechi, creând noi noduri în *graf* și, odată cu ele, noi drumuri. API-ul nostru doar crește nu se modifică cu totul. Acest lucru este foarte util pentru clienții mobili cărora nu le putem controla versiunea de API pe care aleg s-o folosească. 

Încă în dubii legat de utilitatea GraphQL-ului?

## API-uri REST VS. API-uri GraphQL - exemplu concret

Să ne imaginăm că avem de construit o aplicație care va oferi detalii despre personajele din filmele Star Wars.

în prima noastră sarcină avem de realizat o pagină care să arate detalii despre un singur personaj. Spre exemplu, Darth Vader. Vrem să oferim numele personajului, anul nașterii, planeta de pe care vine și titlul filmelor în care a apărut.

Dacă analizăm cerința, putem vedea că avem de a face cu trei resurse diferite: Personaj, Planeta și Film. Relațiile dintre aceste trei resurse pot fi:

* Personajul are mai multe Filme în care a apărut
* Planeta are mai multe Personaje care își au originea pe aceasta

Să ne uităm cum ar putea arăta toate acestea în format JSON:

```javascript
{
  "data": {
    "persoana": {
      "nume": "Darth Vader",
      "anulNasterii": "41.9BBY",
      "planeta": {
        "nume": "Tatooine"
      },
      "filme": [
        { "titlu": "A New Hope" },
        { "titlu": "The Empire Strikes Back" },
        { "titlu": "Return of the Jedi" },
        { "titlu": "Revenge of the Sith" }
      ]
    }
  }
}
```

Reprezentarea unei componente de UI pentru datele noastre ar putea fi următoarea:

```javascript
<p><strong>Nume: </strong> {persoana.name}</p>
<p><strong>Anul Nasterii: </strong> {persoana.anulNasterii}</p>
<p><strong>Planeta: </strong> {persoana.planeta.nume}</p>
<p><strong>Filme: </strong> {persoana.filme.map(film => film.titlu)}</p>
```

În acest exemplu simplu am consumat toate resursele pe care ni le-a trimis API-ul nostru. Acum, să vedem cum putem cere datele acestea unui API REST:

```
GET - /personaje/{id} // presupunand ca stim id-ul personajului, il vom oferii API-ului nostru ca mai apoi el sa ne dea informatii despre el
```
Pe lângă informațiile caracteristice personajului, un endpoint construit folosind standardele REST, ne-ar oferi și id-ul planetei de pe care provine, plus o listă cu id-ul filmelor în care a apărut.

```javascript
{
  "nume": "Darth Vader",
  "anulNasterii": "41.9BBY",
  "idPlaneta": 1
  "iduriFilme": [1, 2, 3, 6]
}
// reprezentarea json cu ceea ce am putea primi folosind endpoint-ul precedent
```

Apoi, pentru a afla numele planetei personajului, vom trimite încă un request:

```
GET - /planete/1 // vom apela un endpoint similar cu cel definit pentru personaje
```

Iar pentru a obține titlurile filmelor, vom trimite următoarele request-uri:

```
GET - /filme/1
GET - /filme/2
GET - /filme/3
GET - /filme/6
```

După ce vom primi toate răspunsurile, putem să le combinăm pentru a ne modela componenta de UI. Putem observa că, folosind un API clasic de tip REST, vom face șase request-uri pentru o singură componentă.

Acest exemplu a fost bazat pe API-ul public http://swapi.co/, pe care îl puteți încerca pentru a modela componenta descrisă.

Acum să aruncăm o privire la modul cum GraphQL abordează sarcina noastră.
Serverul nostru va expune doar un singur endpoint. Fie că e o operație de tip GET sau o operație de tip POST etc., toate vor ajunge într-un singur loc, iar în cazul nostru, ar putea ajunge în: ```/graphql```.

Din moment ce noi vrem să primim toate datele noastre într-un singur request, trebuie să îi exprimăm nevoia noastră de date endpoint-ului, printr-un GraphQL query:

```
GET or POST /graphql?query={...} // query e doar un string care va avea o structura predefinita cu datele pe care le cerem
```

Dacă ar fi să cerem datele, folosind limbajul natural și poate chiar limba română, am spune *avem nevoie de numele unui personaj, data lui de naștere, numele planetei de proveniență și titlul filmelor în care apare*. Într-un query de GraphQL am scrie în felul următor:

```graphql
{
  personaj(ID: ...) {
    nume,
    anulNasterii,
    planeta {
      nume
   },
   filme {
    titlu
   }
}
```

Dacă ar fi să comparăm query-ul nostru de GraphQL cu JSON-ul pe care vrem să-l primim, putem vedea că sunt aproape același lucru. Singura diferență este că din query-ul nostru lipsesc valorile pe care JSON-ul le conține. Acest lucru derivă de la faptul că și în limbaj natural întrebările noastre seamănă cu răspunsurile pe care le primim.
Spre exemplu, dacă răspunsul pe care îl obținem este:
> Noi suntem programatori.

Întrebarea (*query-ul*) noastră ar arăta așa:

> (Ce) sunteți voi?

Putem folosi API-ul de GraphQL pentru serverul de Star Wars utilizând: https://github.com/graphql/swapi-graphql. Puteți încerca să obtineți toate informațiile de care are nevoie componenta de UI, folosind următorul GraphQL *query*:

```graphql
{
  person(personID: 4) {
    name,
    birthYear,
    homeworld {
      name
    },
    filmConnection {
      films {
        title
      }
    }
  }
}
```

## Cu multă flexibilitate vine responsabilitate mare

Soluții perfecte nu există. Odată cu flexibilitatea introdusă de GraphQL, apar o multitudine de probleme.

O problemă gravă pe care GraphQL a creat-o, sunt *DDOS-urile* (Denial of Service attacks), mult mai accesibile. Un server de GraphQL poate fi atacat cu query-uri recursive sau foarte complexe, care să consume toate resursele acestuia. Aceste tipuri de atacuri nu sunt specifice GraphQL-ului, însă sunt ușor de realizat, datorită flexibilității cu care ne "ajută" acesta.

Problema poate fi rezolvată în câteva metode, nu tocmai perfecte:

* Oprirea request-urilor care țin mult prea mult
* Stabilirea limitelor pentru clienții care vor să acceseze resurse
* Dacă API-ul nostru nu e public, putem să autorizăm *query-urile* clienților noștri cu un identificator unic. Această metodă pare să fie folosită de către Facebook.

Ultimul punct ne duce cu gândul la o altă problemă, și anume, autentificarea și autorizarea clienților. Când să avem grijă de aceste lucruri? Înainte, după sau în timpul executării *query-ului*?

Pentru a rezolva problema, putem să ne inspirăm de la REST API-uri. Putem să privim GraphQL ca un layer între datele noastre și clienți, iar autentificarea și autorizarea ar putea fi un alt layer pe care îl putem pune peste cel de GraphQL. Totuși, dacă vrem să punem aceste layere în spatele GraphQL-ului, putem folosi GraphQL pentru a comunica clienților *tokens* de acces de la layer-ul de securitate și invers.

O altă problemă care ne oferă dificultate, este *caching* pe client. Spre deosebire de un REST API, care are o structură de dicționar, unde fiecare locație ne dă o resursă unică, GraphQL e sub forma de *graf*, acest lucru fiind problematic. Am putea să păstrăm un cache sub forma de ```*query*: valoare```, însa această soluție este limitată.

## Concluzie

NPM registry a prezis că 2019 va fi anul în care GraphQL va exploda ca și popularitate, însă, ca orice trend, trebuie tratat cu grijă pentru că s-ar putea dovedi că nu este soluția problemelor API-urilor noastre existente. Singurul factor care ar trebui să ne facă să decidem dacă GraphQL este viitorul consumului de resurse ale unui API, este să îl încercăm noi înșine.

Puteți consulta următorul repository de Github, unde veți vedea o diferență clară între cum se consumă un API clasic REST și cum se consumă unul de GraphQL: https://github.com/Cosmin26/APIWars.
