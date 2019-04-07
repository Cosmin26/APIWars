# REST a bit and try GraphQL (Optimizarea Api-urilor pentru client cu GraphQL)
## Introducere

Dupa ani intregi in care am avut de a face cu API-uri de tip REST, fie consumandu-le ca si simplu client, fie construind propriul serviciu, am putut simti cum neajunsurile unui serviciu REST pot provoca frustrari. In momentul in care serviciile noastre de tip REST cresc in dimensiune si compplexitate intervin probleme precum organizarea endpoint-urilor intr-un mod eficient si structurat si satisfacerea nevoii de date a clientilor API-ului construit. Acest tip de frustrari i-au impins pe cei de la Facebook sa anunte in 2012 si apoi sa-l ofere gratuit in 2015, un nou concept de API si anume GraphQL. La momentul introducerii sale, GraphQL a fost privit ca o alternativa excelenta in domeniul API-urilor datorita flexibilitatii pe care o oferea.

Dar v-ati intreba totusi de ce a-ti avea nevoie chiar voi de GraphQL?

## Pe scurt: De ce GraphQL?

Cele mai importante probleme pe care GraphQL incearca sa le rezolve sunt:

* Necesitatea de a face mai multe request-uri pentru datele de care avem nevoie: Cu GraphQL, putem face un singur request pentru datele de care avem nevoie de la un server deoarece clientul nostru stie cum sa ii ceara unui GraphQL server datele folosind un singur query (mai multe detalii in continuare). Pentru a face acelasi lucru cu un REST API, trebuie sa introducem conditii si parametrii in plus care sunt greu de ingrijit cand aplicatia creste;
* Clientii depind de serveri: Cu GraphQL, clientul poate comunica cu serverul intr-un limbaj special care ne permite sa eliminam necesitatea serveruiui sa ofere forma sau dimensiunea datelor si ii ofera clientului independenta fata de server. Astfel putem mentine si imbunatatii un server si un client separat.
* Experienta neplacuta ca si front-end developer: Datorita GraphQL-ului, developerii pot exprima nevoile interfetelor lor printr-un limbaj declarativ. Ei exprima ce au nevoie, nu cum sa il obtina.

In acest articol vom explica in detaliu cum GraphQL ne va rezolva toate aceste probleme.

Inainte de a continua, pentru cei care nu sunt familiari deloc cu GraphQL, ii vom oferi o definitie.

## Ce este GraphQL?

GraphQL se ocupa de comunicarea de date. Aveti un server si un client, iar amandoi trebuie sa vorbeasca intre ei. Clientul trebuie sa ii spuna serverului de ce date are nevoie, si serverul trebuie sa fie capabil sa ii trimita datele cerute. In acest proces de comunicare intervine GraphQL.

Dar nu se poate comunicarea asta sa fie direct intre client si server, fara niciun alt intermediar? Este posibil, cum a fost si pana acum in serverele noastre REST.

Sunt cateva motive pentru care totusi am vrea sa avem un intermediar. Unul dintre acele motive, si probabil cel mai popular este eficienta. 
Uitandu-ne la o librarie online am vrea sa vedem mai multe detalii despre: carti, autori, si posibile review-uri. Un server clasic REST ne-ar oferi endpoint-uri diferite pentru toate cele 3 entitati si clientul ar trebui sa ceara pe rand ceea ce vrea sa vada.

<img src="https://jscomplete.com/images/reads/introduction-to-graphql/f104.png" width="554"/>
* Imagine preluata de pe https://jscomplete.com/learn/complete-intro-graphql/why-graphql


Cu GraphQL, transformam procesul de a cere mai multe resurse in mai multe request-uri, intr-unul singur. Clientul ii va cere serviciului de GraphQL, printr-un singur request resursele de care are nevoie si va primi doar un singur raspuns cu exact ceea ce doreste. Acest lucru bineinteles poate fi realizat si cu un REST API, insa am devia de la normele dupa care ne ghidam atunci cand contruim un astfel de serviciu, lucru care nu este foarte recomandat in API-uri publice ca sa numim un exemplu.

<img src="https://jscomplete.com/images/reads/introduction-to-graphql/f105.png" width="554"/>
* Imagine preluata de pe https://jscomplete.com/learn/complete-intro-graphql/why-graphql


Inca un beneficiu major pe care ni-l ofera GraphQL este comunicarea cu mai multe API-uri. Cand avem mai multe clienti care cer date din multe locuri diferite, un layer de GraphQL poate veni in ajutor simplificand si standarlizand comunicarea. Desi acesta nu este un factor major pentru a folosi GraphQL peste REST, un GraphQL layer poate oferi o structura comuna intre clienti si servicii.

Putem sa privim layer-ul de GraphQL ca un traducator. Sa presupunem ca avem 3 oamenii de la care vrem sa obtinem un raspuns pentru intrebarea noastra. Insa cei 3 oameni vorbesc 3 limbi diferite si toti 3 detin bucati de informatii de care avem nevoie pentru a ajunge la adevaratul raspuns de care avem nevoie. Daca am avea un traducator care sa vorbeasca cele 3 limbi ale oamenilor nostri, si sa stie cum sa ii intrebe pe fiecare in parte in asa fel incat sa combine raspunsurile, atunci problema noastra e ca si rezolvata. Exact asta face si layer-ul de GraphQL.

Calculatoarele inca nu sunt destul de inteligente incat sa ne raspunda la intrebari complexe fara sa le descriem pas cu pas ceea ce vrem (ca intr-un algoritm). De aceea avem nevoie sa definim o schema pentru GraphQL care va fi ulterior folosita de catre clienti.

Aceasta schema practic defineste limitele API-ului nostru fara sa ii ofere o structura stricta deoarece schema este reprezentata sub forma unui graph.

## Care sunt limitarile folosind un REST API?

Principala problema a unui serviciu REST traditional este ca clientii trebuie sa ceara de mai multe ori resurse diferite. Acest lucru se intampla din cauza faptul ca clientii servicilor noastre REST nu au un limbaj comun prin care sa poata sa controleze ce date primesc de la numeroasele endpoint-uri ale acestora.

Spre exemplu un endpoint de a citi cartile pe care le ofera un API pot arata astfel:

``` 
GET /books // pentru a primi lista cu toate cartile sau 
GET /books/bookID // pentru a primi o singura carte
```

In cazul acesta clientul nu poate sa ii comunice serverului ca are nevoie doar de numele cartii si o poza cu coperta sau ca are nevoie si de datele autorului ca sa poata sa ii faca o reclama pozitiva. Daca ar fi sa folosim termenii inventati de catre autorii GraphQL, noi am enuntat o problema de *over-fetching* sau de *under-fetching*.

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
