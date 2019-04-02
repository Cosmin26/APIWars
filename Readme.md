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