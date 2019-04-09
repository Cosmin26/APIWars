# REST a bit and try GraphQL (Optimizarea Api-urilor pentru client cu GraphQL)
## Introducere

După ani întregi în care am avut de a face cu API-uri de tip REST, fie consumându-le ca și simplu client, fie construind propriul serviciu, am putut simți cum neajunsurile unui serviciu REST pot provoca frustrări. În momentul în care serviciile noastre de tip REST cresc în dimensiune și complexitate, intervin probleme precum organizarea endpoint-urilor într-un mod eficient, structurat și satisfacerea nevoii de date ale clienților API-ului construit. Acest tip de frustrări i-au împins pe cei de la Facebook să anunțe în 2012 și, apoi, să-l ofere gratuit în 2015, un nou concept de API, și anume GraphQL. La momentul introducerii sale, GraphQL a fost privit ca o alternativă excelentă în domeniul API-urilor, datorită flexibilității pe care o oferea.

Dar v-ați întreba totuși, de ce ați avea nevoie chiar voi de GraphQL?

## Pe scurt: De ce GraphQL?

Cele mai importante probleme pe care GraphQL încearcă să le rezolve sunt:

* Necesitatea de a face mai multe request-uri pentru datele de care avem nevoie: Cu GraphQL, putem face un singur request pentru datele de care avem nevoie de la un server, deoarece clientul nostru știe cum să îi ceară unui GraphQL server datele, folosind un singur query. Pentru a face același lucru cu un REST API, trebuie să introducem condiții și parametrii în plus, aceștia fiind greu de îngrijit când aplicația crește;
* Clienții depind de serveri: Cu GraphQL, clientul poate comunica cu serverul într-un limbaj special, care ne permite să eliminăm necesitatea serveruiui să ofere forma sau dimensiunea datelor și îi oferă clientului independența față de server. Astfel, putem menține și imbunatați un server și un client, separat.
* Experiența neplacută drept front-end developer: Datorită GraphQL-ului, developerii pot exprima nevoile interfețelor proprii printr-un limbaj declarativ. Ei exprimă ce au nevoie, nu cum să îl obțină.

În acest articol vom explica în detaliu cum GraphQL ne va rezolva toate aceste probleme.

Înainte de a continua, pentru cei care nu sunt familiari deloc cu GraphQL, le voi oferi o definiție.

## Ce este GraphQL?

GraphQL se ocupă de comunicarea de date. Aveți un server și un client, iar amândoi trebuie să vorbească între ei. Clientul trebuie să îi spună serverului de ce date are nevoie, iar serverul trebuie să fie capabil să îi trimită datele cerute. În acest proces de comunicare intervine GraphQL.

Nu se poate ca această comunicare să fie direct între client și server, fără niciun alt intermediar? Este posibil, cum a fost și până acum, în serverele noastre REST.

Sunt câteva motive pentru care, totusi, am vrea să avem un intermediar. Unul dintre acele motive, și probabil cel mai popular, este eficiența. 
Uitandu-ne la o librarie online am vrea sa vedem mai multe detalii despre: carti, autori, si posibile review-uri. Un server clasic REST ne-ar oferi endpoint-uri diferite pentru toate cele 3 entitati si clientul ar trebui sa ceara pe rand ceea ce vrea sa vada.

<img src="https://jscomplete.com/images/reads/introduction-to-graphql/f104.png" width="554"/>
* Imagine preluată de pe https://jscomplete.com/learn/complete-intro-graphql/why-graphql


Cu GraphQL, transformăm procesul de a cere mai multe resurse în mai multe request-uri, intr-unul singur. Clientul îi va cere serviciului de GraphQL, printr-un singur request resursele de care are nevoie, primind doar un singur răspuns, cu exact ceea ce dorește. Bineînțeles, acest lucru poate fi realizat și cu un REST API, însă am devia de la normele după care ne ghidăm atunci când construim un astfel de serviciu, lucru care nu este foarte recomandat în API-uri publice, de exemplu.

<img src="https://jscomplete.com/images/reads/introduction-to-graphql/f105.png" width="554"/>
* Imagine preluată de pe https://jscomplete.com/learn/complete-intro-graphql/why-graphql


Încă un beneficiu major pe care ni-l oferă GraphQL, este comunicarea cu mai multe API-uri. Când avem mai mulți clienți, care cer date din locuri diferite, un layer de GraphQL poate veni în ajutor, simplificand și standardizând comunicarea. Deși acesta nu este un factor major pentru a folosi GraphQL peste REST, un GraphQL layer poate oferi o structură comună între clienți și servicii.

Putem să privim layer-ul de GraphQL ca un traducător. Să presupunem că avem trei oameni de la care vrem să obținem un răspuns pentru întrebarea noastră. Totuși, oamenii vorbesc limbi diferite și dețin bucăți de informații de care avem nevoie pentru a ajunge la adevăratul răspuns. Dacă am avea un traducător care să vorbească limbile vorbite de oameni și să știe cum să îi întrebe pe fiecare în parte pentru a combina răspunsurile, atunci problema este ca și rezolvată. Exact asta face și layer-ul de GraphQL.

Calculatoarele încă nu sunt destul de inteligente încât să ne răspundă la întrebări complexe fără să le descriem pas cu pas ceea ce vrem (ca într-un algoritm). De aceea, avem nevoie să definim o schemă pentru GraphQL, care va fi ulterior folosită de clienți.

Această schemă definește limitele API-ului fără să îi ofere o structură strictă, deoarece schema este reprezentată sub forma unui graph.

## Care sunt limitările folosind un REST API?

Principala problemă a unui serviciu REST tradițional constă în clienții care cer de mai multe ori resurse diferite. Acest lucru se întâmplă din cauza faptului că acești clienți ai serviciilor REST nu au un limbaj comun prin care să poată controla ce date primesc de la numeroasele endpoint-uri ale acestora.

Spre exemplu, un endpoint de a citi cărțile pe care le oferă un API pot arăta astfel:

``` 
GET /books // pentru a primi lista cu toate cărțile sau 
GET /books/bookID // pentru a primi o singură carte
```

În cazul acesta, clientul nu poate să îi comunice serverului că are nevoie doar de numele cărții, o poză cu coperta sau că are nevoie și de datele autorului pentru a putea face reclamă  pozitiva. Daca ar fi sa folosim termenii inventati de catre autorii GraphQL, noi am enuntat o problema de *over-fetching* sau de *under-fetching*.

Alta problema cu API-urile de tip REST este versionarea lor. Daca dorim sa sustinem mai multe versiuni pentru API-ul nostru atunci trebuie sa introducem endpoint-uri noi care pot fi greu de ingrijit.

Genul acesta de probleme sunt exact ceea ce au vrut autorii GraphQL-ului sa rezolve.

## Cum rezolva GraphQL aceste probleme?

Sunt multe concepte in spatele GraphQL-ului, dar cele mai importe sunt:

* O *schema* de GraphQL este exprimata prin tipuri de date. Pentru a crea o *schema*, trebuie sa ne definim proprietati cu tipuri. Aceste tipuri pot fi primitive (*Integers*, *Strings*, etc.) sau tipuri definite de care noi.

* GraphQL trateaza datele ca si cum ar face parte dintr-un *graf*, reprezentand clar datele si relatiile dintre acestea.

* GraphQL exprima nevoie de date intr-un mod declarativ, oferind clientilor un limbaj pentru a-si enunta necesitatile. Acest mod declarativ ne permite sa ne gandim la necesititatea noastra pentru date in limbaj natural.

Mergand in detaliu peste fiecare problema a serviciilor REST putem intelege mai bine conceptele enuntate anterior:

* Pentru a rezolva problema cu request-uri multiple catre diferite endpoint-uri, GraphQL duce ideea de endpoint customizat la extrem si ofera astfel doar un singur endpoint pentru toate nevoile clientilor.

* Cu un singur endpoint atunci apare nevoia de un limbaj prin care clientii sa stie cum sa ceara anumite date de la un singur endpoint. Daca nu am avea acest limbaj s-ar putea sa ne trezim ca am obtinut in interfata practic toata baza de date, lucru care nu e dorit. Cu acest limbaj clientul are control asupra request-ului, lucru care in trecut era detinut de catre API, si obtine ceea ce vrea.

* In ceea ce priveste *versionarea*, GraphQL pur si simplu evita aceasta problema prin structura de *graf* in care sunt reprezentate datele. Oricand putem introduce noi proprietati fara sa le stergem pe cele vechi, creand noi noduri in *graf* si odata cu ele noi drumuri. API-ul nostru doar creste nu se modifica cu totul. Acest lucru este foarte util pentru clienti mobili la care nu putem controla versiunea de API pe care aleg s-o foloseasca. Odata instalata o aplicatie mobila poate ramane nemodificata ani buni prin refuzarea update-urilor.

Inca in dubii legat de utilitatea GraphQL-ului?

## API-uri REST vs. API-uri GraphQL - exemplu concret

Sa ne imaginam ca avem de construit o aplicatie care va oferii detalii despre personajele din filmele Star Wars.

In primul nostru task vrem sa construim o pagina care sa arate detalii despre un singur personaj. Spre exemplu, Darth Vader si toate filmele in care a aparut. Vrem sa oferim numele personajului, anul nasterii, planeta de pe care vine si titlul filmelor in care a aparut.

Daca analizam cerinta, putem vedea ca avem de a face cu 3 resurse diferite: Personaj, Planeta si Film. Relatii dintre aceste 3 resurse pot fi:

* Personajul are mai multe Filme in care a aparut
* Planeta are mai multe Personaje cu originea de pe aceasta

Sa ne uitam cum ar putea arata toate acestea in format JSON:

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

Reprezentarea unei componente de UI pentru datele noastre ar putea fi urmatoarea:

```javascript
<p><strong>Nume: </strong> {persoana.name}</p>
<p><strong>Anul Nasterii: </strong> {persoana.anulNasterii}</p>
<p><strong>Planeta: </strong> {persoana.planeta.nume}</p>
<p><strong>Filme: </strong> {persoana.filme.map(film => film.titlu)}</p>
```

In acest exemplu simplu am consumat toate resursele pe care ni le-a trimis API-ul nostru. Acum sa vedem cum putem cere datele acestea unui API REST:

```
GET - /personaje/{id} // presupunand ca stim id-ul personajului, il vom oferii API-ului nostru ca mai apoi el sa ne dea informatii despre el
```

Un endpoint construit folosind standardele REST ne-ar da pe langa informatiile caracteristice personajului si id-ul planetei de pe care provine si o lista cu id-urile filmelor in care a aparut.

```javascript
{
  "nume": "Darth Vader",
  "anulNasterii": "41.9BBY",
  "idPlaneta": 1
  "iduriFilme": [1, 2, 3, 6]
}
// reprezentarea json cu ceea ce am putea primi folosind endpoint-ul precedent
```

Apoi pentru a afla numele planetei personajului, vom trimite inca un request:

```
GET - /planete/1 // vom apela un endpoint similar cu cel definit pentru personaje
```

Iar pentru a obtine titlurile filmelor vom trimite urmatoarele request-uri:

```
GET - /filme/1
GET - /filme/2
GET - /filme/3
GET - /filme/6
```

Dupa ce vom primi toate raspunsurile putem sa le combinam pentru a ne modela componenta de detalii a personajului. Putem observa ca folosind un API clasic de tip REST vom face 6 request-uri pentru o singura componenta, si pe langa asta a trebuit sa descriem fiecare request pe care l-am facut intr-un mod imperativ.

Acest exemplu a fost bazat pe API-ul public http://swapi.co/ pe care-l puteti incerca pentru a modela componenta descrisa.

Putem evita totusi toate acele request-uri pentru filme daca am incerca sa ne facem un endpoint care ar arata in felul urmator:

```
GET - /personaje/{id}filme
```

In API-uri REST clasice nu vom vedea prea des un endpoint care sa ne ofere datele intr-un astfel de mod si va trebui sa vorbim cu inginerii nostri care lucreaza la API sa implementeze acest tip de endpoint. Adesea asa cresc API-urile REST, adaugam endpoint-uri specifice pentru nevoile clientilor.

Acum sa aruncam o privire la cum GraphQL abordeaza task-ul nostru.
Serverul nostru acum va expune doar un singur endpoint iar canalul de comunicare nu va conta. Fie ca e o operatie de tip GET sau o operatie de tip POST si asa mai departe toate vor ajunge intr-un singur loc si in cazul nostru ar putea ajunge in: ```/graphql```.

Din moment ce noi vrem sa primim toate datele noastre intr-un singur request trebuie sa ii exprimam aceasta dorinta endpoint-ului printr-un GraphQL query:

```
GET or POST /graphql?query={...} // query e doar un string care va avea o structura predefinita cu datele pe care le cerem
```

Daca ar fi sa cerem datele folosind limbajul natural si poate chiar limba romana am spune *avem nevoie de numele unui personaj, data lui de nastere, numele planetei de provenienta si titlul filmelor in care apare*. Intr-un query de GraphQL am scrie in felul urmator:

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

Daca ar fi sa comparam query-ul nostru de GraphQL cu JSON-ul pe care vrem sa-l primim, putem vedea ca sunt aproape acelasi lucru, singurul lucru care lipseste din query-ul nostru sunt valorile pe care JSON-ul le contine. Acest lucru deriva de la faptul ca si in limbaj natural intrebarile noastre seamana cu raspunsurile pe care le primim.
Spre exemplu daca raspunsul pe care il obtinem este:
> Noi suntem programatori.

Intrebarea (*query-ul*) noastra ar arata asa:

> (Ce) sunteti voi?

In acest lucru se ascunde inca un feature al GraphQL-ului: nu este nevoie sa inspectam raspunsul unui request pentru a-l putea reprezenta in UI.

Putem folosi API-ul de GraphQL pentru API-ul de Star Wars utilizand: https://github.com/graphql/swapi-graphql. Puteti incerca sa obtineti toate informatiile de care are nevoie componenta noastra de detalii folosind urmatorul GraphQL *query*:

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

## Cu multa flexibilitate vine responsabilitate mare

Solutii perfecte nu exista. Odata cu flexibilitatea introdusa de GraphQL apar o multitudine de probleme.

O problema grava pe care GraphQL a creat-o sunt *DDOS-urile* (Denial of Service attacks) mult mai accesibile. Un server de GraphQL poate fi atacat cu query-uri recursive sau foarte complexe, care sa consume toate resursele acestuia. Aceste tipuri de atacuri nu sunt specifice GraphQL-ului insa sunt facute usor de realizat datorita flexibilitatii cu care ne "ajuta" acesta.

Aceasta problema poate fi rezolvata in cateva metode nu tocmai perfecte printre care:

* Oprirea request-urilor care tin mult prea mult
* Stabilirea limitelor pentru clienti care vor sa acceseze resurse
* Daca API-ul nostru nu e public putem sa autorizam query-urilor clientilor nostrii cu un identificator unic. Aceasta metoda pare sa fie folosita de catre Facebook.

Ultimul punct ne duce cu gandul la o alta problema si anume autentificarea si autorizarea clientilor. Cand sa avem grija de aceste lucruri, inainte, dupa sau in timpul executarii procesului?

Pentru a rezolva problema asta, putem sa ne inspiram de la REST API-uri. Putem sa privim GraphQL ca un layer intre datele noastre si clienti, iar autentificarea si autorizatia ar putea fi un alt layer pe care il putem pune peste cel de GraphQL. Dar daca vrem sa punem aceste layere in spatele GraphQL-ului, putem folosi GraphQL pentru a comunica clientilor token-urile de acces de la layer-ul de securitate si invers.

O alta problema care ne da batai de cap este *caching* pe client. Spre deosebire de un REST API care are o structura de dictionar unde fiecare locatie ne da o resursa unica, GraphQL e sub forma de *graf* si acest lucru e problematic. Am putea sa pastram un cache sub forma de *query*: valoare insa aceasta solutie este limitata.

Si lista de probleme continua prin probleme mult mai complexe precum *N+1 SQL queries*. Pentru a putea intelege cum ne afecteaza *N+1 SQL queries* putem sa ilustram o relatie simpla intre un *User* tip si un tip *Adresa*:

```graphql
type User {
  id: ID
  adresa: Adresa
}
type Adresa {
  id: ID
  nuneStrada: String
  oras: String
}
```

Si sa presupunem ca facem un *query* simplu pentru a obtine lista cu toti userii:

```graphql
query ObtineListaUser {
  userLista {
    id
    adresa {
      id
      numeStrasda
    }
  }
}
```

Pentru a putea primii rezultatul acelui query GraphQL merge printr-o serie de pasi care se numesc si *resolveri*. Primul *query resolver* este ```userLista``` care ne va citi din baza de date printr-un singur query toti userii:

```javascript
const resolvers = {
  query: {
    userList: (root) => {
      return db.users.all()
    }
  }
}
```

Al doilea pas ar fi ca pentru fiecare *n* useri din acea lista, GraphQL sa foloseasca alt *resolver* pentru a lua atributul de adresa, adica sa faca cate un query pentru fiecare element din lista:

```javascript
const resolvers = {
  User: {
    address: (user) => {
      return db.addresses.fromId(user.addressId)
    }
  }
}
```

Acest lucru este foarte ineficient sa obtinem o lista de atribute si adesea baza noastra de date ne-ar permite sa obtinem lista de adrese folosind o operatie precum: ```db.addresses.fetchFromIds(addressIds)``` si asa am dori sa facem si noi.

O solutie pentru problema de *n+1 SQL queries* poate fi un modul numit **_DataLoader_**, un proiect contribuit comunitatii de catre Facebook, care se ocupa cu 2 lucruri:
1. Face cache la request-uri similare
2. Grupeaza request-urile unui singur obiect

## Concluzie

NPM registry a prezis ca 2019 va fi anul in care GraphQL va exploda ca si popularitate, insa ca orice trend trebuie tratat cu grija pentru ca s-ar putea dovedi ca nu este solutia problemelor api-urilor voastre existente. Singurul factor care ar trebui sa va faca sa decideti daca GraphQL intr-adevar viitorul consumptiei de API-uri este sa-l incercati.

Puteti consulta urmatorul repository de Github unde puteti vedea o diferenta clara intre cum se consuma un api clasic REST si cum se consuma unul de GraphQL: https://linkcatregit.com/
