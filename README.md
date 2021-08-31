# EON Testovi za kreiranje/brisanje profila

Svi automatski testovi su napisani u Cypress-u i nalaze se u folderu cypress/integration. Selektori i test data nalaze se u folderu cypress/support odakle su importovani u testove. 
Postoji 5 testova:

- createValidProfile.js - Ovaj test kreira random korisnika, proverava da li su informacije na Profile Karti one koje su unete tokom 
kreiranja a zatim proverava da li se broj profila povecao za jedan i da li je profil koji smo napravili prisutan na strani za biranje profila. 
Preduslov je da je broj kreiranih profila manji od 6.
- deleteProfile.js - Ovaj test brise random profil koji nije family i zatim proverava da li se broj profila smanjio za jedan. Preduslov je da postoji vise od jendog profila.
- deleteFamilyProfile.js - Ovaj test proverava da li nije moguce obrisati family profil, odnosno da li je dugme za brisanje neaktivno.
- createValidProfileWhenMaxProfiles.js - Ovaj test proverava da li nije moguce napraviti novi profil ako je broj profila na maksimumu (6), tj da li ce se dobiti odgovarajuca error poruka. 
Preduslov je da je broj kreiranih profila na maksimumu, odnosno 6. 
- createInvalidAdultProfile.js  - Ovaj test proverava da li nije moguce napraviti adult profil sa netacnim infomacijama vezanim za broj godina (negativan broj). 
Preduslov je da je broj kreiranih profila manji od 6. (ovaj test vraca gresku posto je moguce napraviti profil sa netacnim infomracijama)

U folderu cypress/videos mozete naci zaseban video pokretanja svakog od ovih testova.
