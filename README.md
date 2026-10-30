# Campagna Ashkar — Infinity N5

Una applicazione web installabile (PWA) per una campagna casalinga di Infinity N5
in stile X‑COM: **Nomadi contro PanOceania** sul mondo conteso di Ashkar.

All'apertura si sceglie quale delle tre sezioni usare; *Cambia app* in alto a
sinistra riporta sempre alla scelta.

| Sezione | Cartella | A chi serve |
|---|---|---|
| Tabellone | `tabellone/` | comune: mappa, scenari, risultati, dispacci |
| Comando Nomade | `nomadi/` | al giocatore nomade |
| Comando PanOceaniano | `panoceania/` | al giocatore panoceaniano |

Ogni sezione gira nel proprio riquadro isolato, con archivio separato, e
comunica con le altre solo tramite i dispacci.

## Il flusso dei dati

Il tabellone è l'unico che scrive sulla mappa; le plance sono private e non si
vedono fra loro. Dopo ogni partita il tabellone genera un **dispaccio** per ciascuna
fazione coinvolta, con punti, bottino e stato aggiornato dei territori. La plancia
lo riceve, lo mostra nel Quadro e lo applica con un clic.

```
   TABELLONE  ──dispaccio──▶  COMANDO NOMADE
       │
       └───────dispaccio──▶  COMANDO PANOCEANIANO
```

Il dispaccio viaggia su tre canali, provati in quest'ordine:

1. **In rete** — se le app girano come artefatti sullo stesso account, arriva da solo.
2. **Canale locale** — se sono servite dalla stessa origine (lo stesso sito Pages),
   il tabellone scrive in `localStorage` e la plancia lo trova all'apertura.
3. **Codice da incollare** — il tabellone mostra il codice di ogni dispaccio
   sotto *Dispacci spediti*; si copia e si incolla nella scheda Dati della plancia.
   Funziona sempre, anche fra dispositivi diversi e senza rete.

Ogni dispaccio ha un identificativo: applicarlo due volte non raddoppia i punti.

## Partite veloci ai dadi

Oltre alla partita sul tavolo, il tabellone risolve una missione con un tiro
contrapposto. L'attaccante tira 1d20 più i Veterani schierati (fino a +5) e +3
di iniziativa; la guarnigione neutrale tira 1d20 più il doppio della Resistenza
del nodo e lo Stato di Minaccia; un difensore in carne e ossa somma i propri
Veterani e +2 perché difende casa sua.

Le probabilità che ne escono, con tre Veterani in campo: 62% in retrovia, 52% in
terra di nessuno, 43% contro una roccaforte, e circa un terzo contro il Nido Madre
a Minaccia alta. Uno scarto di 8 o più è una vittoria netta e il vincitore non
lascia nessuno sul campo; altrimenti entrambi hanno caduti da risolvere.

## Pubblicare su GitHub Pages

1. Crea un repository, per esempio `campagna-ashkar`.
2. Carica il contenuto di questa cartella nella radice del repo.
3. Settings → Pages → Source: **Deploy from a branch**, branch `main`, cartella `/ (root)`.
4. Dopo un minuto il sito è su `https://<utente>.github.io/campagna-ashkar/`.

Pages serve in HTTPS, requisito per installare una PWA e per i service worker.
I percorsi nei manifest sono relativi, quindi il sito funziona anche nella
sottocartella che Pages crea per il repository.

## Installare l'icona

- **Android / Chrome / Edge**: apri l'app → menu ⋮ → *Installa app*.
- **iPhone / Safari**: apri la pagina → Condividi → *Aggiungi alla schermata Home*.
- **Desktop**: icona di installazione nella barra degli indirizzi.

Si installa una icona sola, con i tre esagoni delle sezioni. Su Android, tenendo
premuta l'icona compaiono le scorciatoie per aprire direttamente una delle tre.

## Cosa fa ogni app

**Tabellone.** Planisfero cliccabile con i ventiquattro nodi, scenario ITS 17
abbinato a ciascuno, assegnazione del controllo, registrazione delle partite
(sul tavolo o ai dadi), Stato di Minaccia, avanzamento del Turno di Campagna,
registro pubblico e dispacci da copiare.

**Le due plance.** Arruolamento dal database di fazione — 173 profili nomadi,
269 panoceaniani, con costo in punti e SWC già compilati — gestione dei cinque
malus delle reclute, officina per produrre equipaggiamento, magazzino con
assegnazione ai Trooper, albero tecnologico a venti nodi, Centro di Addestramento,
infermeria con tiro perdite e decisioni sui feriti in eccesso, ed export della
squadra verso il calcolatore in formato 2.

## Dati e offline

Il service worker usa la strategia rete‑prima: online prendi sempre l'ultima
versione, offline l'app continua a funzionare. Lo stato vive nell'archivio del
browser del dispositivo; **esporta il JSON dopo ogni sessione**, una campagna dura
mesi e una cache svuotata la cancella.

## Crediti

Infinity è un marchio di Corvus Belli S.L. Questo è materiale casalingo non
ufficiale e non affiliato. Gli scenari fanno riferimento al pacchetto ITS
Stagione 17, da scaricare separatamente dal sito ufficiale.
