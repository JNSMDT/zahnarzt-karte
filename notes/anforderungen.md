# Regionaler Versorgungsindex
## Mitversorger (dunkelgrün)
Eine Gemeinde, welche sich durch das Vorhandensein von lokalen Zahnärzten (über ein gewisses Index-Maß) selbst versorgen kann und,
zusätzlich dazu, unmittelbar anliegende Regionen (Versorgte), welche keine eigenen Arztkapazitäten aufweisen, durch Hausbesuche mitversorgt. 

[lokale Ärzte (+ verfügbare Hausbesuchsärzte)]
## Selbstversorger (hellgrün): 
Eine Gemeinde, welche sich durch das Vorhandensein von lokalen Zahnärzten (über ein gewisses Index-Maß) selbst versorgen kann, jedoch aufgrund fehlender Hausbesuch-Ärzte keine angrenzenden Gemeinden mitversorgt.

[lokale Ärzte, keine Hausbesuche]
## Selbst-Unterversorgte (gelb): 
Eine Gemeinde, welche zwar Zahnärzte aufweist, ihren eigenen Gemeindekreis ausreichend versorgt, jedoch nicht über das gewisse Index-Maß hinauskommt.
Sie haben nicht die Fähigkeit, angrenzende Regionen zu versorgen.

[lokale Ärzte (+ Hausbesuche)]
## Versorgte (orange): 
Eine Gemeinde, welche zwar keine eigene lokale Zahnarztkapazität aufweist, jedoch an einen unmittelbar anliegenden Mitversorger angrenzt, und somit hypothetisch den eigenen Bedarf zumindest ansatzweise decken kann 

[keine lokalen Ärzte, jedoch versorgt durch unmittelbar angrenzende Mitversorger].
## Unterversorgte (rot): 
Eine Gemeinde, welche keine eigene lokale Zahnarztkapazität aufweist und zudem auch nicht von einem unmittelbar anliegenden Mitversorger versorgt wird 

[keine lokalen Ärzte, keine unmittelbar angrenzenden Mitversorger].


# Anforderungen von Jessica

* Mitversorger muss leider von Hand gemacht werden, dafür gibt es nicht direkt eine Indexzahl
* Selbstversorger > .95
* Bedarfsdeckende > 0.75
* Versorgte muss höchstwahrscheinlich beim 2. Rendern per Hand gemacht werden
* Unterversorgt + ZA < .75 mit lokalen Zahnärzten
* Unterversorgt < 0.75 ohne lokale Zahnärzte