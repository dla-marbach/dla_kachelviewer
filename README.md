# dla_kachelviewer
A Typo3-Extension to view DeepZoomImages using OpenSeadragon

### Installation

Dieses Repositorium klonen und das Unterverzeichnis `dla_kachelviewer` in den Pfad der Typo3-Erweiterungen kopieren (`.../typo3conf/ext/`).

### Einbindung auf einer Typo3-Seite

Auf der gewünschten Seite ein neues `Inhaltselement` Typ `Allgemeines Plug-In` hinzufügen.
Unter `Plug-In` nun den `DLA Kachelviewer` auswählen und speichern.


### Konfiguration

Es gibt folgende Konfigurationsmöglichkeiten im Typo3-Backend:

* Speicherpfad: Pfad unter dem die Digitalisate/Kacheln in Unterordnern gespeichert sind. Normalerweise ist dies der Typo3-Ordner `fileadmin`.

* Objekt ID: Der Verzeichnisname (nicht als vollständiger Pfad!).

* Metadaten anzeigen: Zeigt Metadaten aus dem Kallias-OPAC an.

* Metadaten ID: Falls sich der Verzeichnisname nicht mit der Mediennummer deckt, kann hier eine Alternative angegeben werden. Zusätzlich ist es möglich eine Regular Expression anzugeben. In diesem Fall werden die Metadaten aus den einzelnen Dateinamen generiert. Die Regular Expression muss mit `re:` beginnen und genau eine Match-Group enthalten, z. B. `re:^.*\/(.+)_[0-9]{4}.dzi$` (entfernt die laufende Nummer). Achtung: OpenSeadragon gibt den vollständigen Pfad zurück.

* Startseite: Bei Bedarf kann eine Startseite definiert werden.

* Suchmaske: Bei Bedarf kann eine Suchmaske eingeblendet werden über die direkt Objekte angegeben werden können.

* Speicherstruktur: Es gibt prinzipiell zwei Strukturen in denen die Dateien abgelegt sind:

    * 1. Object/Quality/File: z. B. `.../HS_12345678/tiles/...`
    * 2. Quality/Object/File: z. B. `.../tiles/HS_12345678/...`
    
    Normalerweise wird immer in Struktur 1 abgelegt.
    
### Paramterübergabe per URL

Manche Parameter können auch direkt über die URL im SearchString übergeben werden:

* id: Wird von Typo3 vergeben
* object: Die Objekt ID
* metadata: Die Metadata ID (keine Regular Expression)
* physpage: Die Startseite

Beispiel:

`https://www.dla-marbach.de/index.php?id=1017&object=HS_12345678&metadata=HS_87654321&physpage=10`