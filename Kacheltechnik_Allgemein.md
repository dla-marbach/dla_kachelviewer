# Einbindung OpenSeadragon auf beliebiger Webseite

## OpenSeadragon
[http://openseadragon.github.io](http://openseadragon.github.io)
OpenSeadragon von Homepage laden und entpacken.
Bei Bedarf andere Icons installieren, z. B. [https://github.com/peterthomet/openseadragon-flat-toolbar-icons](https://github.com/peterthomet/openseadragon-flat-toolbar-icons) (ggfls. Höhe der Toolbar anpassen).

## HTML

Diese Elemente an einer beliebigen Stelle einfügen:
```
<div id="dla_kachelviewer_viewport">
  <div id="dla_kachelviewer_toolbar">
    <span id="dla_kachelviewer_seitenanzeige">
      Seite&nbsp;
      <input id="dla_kachelviewer_seite" type="text" value="1" maxlength="4" size="4">
      &nbsp;von&nbsp;
      <span id="dla_kachelviewer_seiten"></span>
    </span>
  </div>
  <div id="dla_kachelviewer_content"></div>
</div>
```

## CSS

Werte an Seite anpassen! CSS in einer Datei speichern.

```
#dla_kachelviewer_viewport {
  width: 777px; /* DLA homepage (default 800px) */
  height: 600px;	
}
#dla_kachelviewer_toolbar {
  width: 100%;
  height: 2.3125rem;	/* DLA input element (default 30px) */
}
}
#dla_kachelviewer_seitenanzeige {
  display: table; 
  margin: auto; 
  padding-left: 1em; /* ggfls. anpassen */
  padding-right: 1em; /* ggfls. anpassen */
  background-color: white; /* ggfls. anpassen */
}
#dla_kachelviewer_seite {
  display: inline; /* nur auf DLA Homepage nötig */
  width: 3em; /* nur auf DLA Homepage nötig */
}
#dla_kachelviewer_content {
  width: 100%;
  height: 100%;
  background-color: black; /* ggfls. anpassen */
}
```
Datei im Header der Seite einbinden:
```
<head>
  …
  <link rel="stylesheet" type="text/css" href="'Pfad/zu/dla_kachelviewer.css'"></link>
  …
</head>
```

## JavaScript

Pfade und tileSources anpassen. Javascript in Datei speichern.
Für IIIF siehe hier: [http://openseadragon.github.io/examples/tilesource-iiif/](http://openseadragon.github.io/examples/tilesource-iiif/)

```
/**
 * Skript zur Anzeige von Kacheln
 */
 
/**
 * Konfiguration
 */
var dlaKachelviewerConfig = {
    id: 'dla_kachelviewer_content'
  , toolbar: 'dla_kachelviewer_toolbar'
  , prefixUrl: 'Pfad/zu/openseadragon/images/'
  , tileSources: ['Pfad/zu/kachel1.dzi', 'Pfad/zu/kachel2.dzi']
  , sequenceMode: true
  , showReferenceStrip: true
}

/**
 * Setup OpenSeadragon Kachelviewer
 */
var dlaKachelviewer
var setupDlaKachelviewer = function () {

  // Bestehende Instanz von dlaKachelviewer löschen
  if (dlaKachelviewer) dlaKachelviewer.destroy()
  
  // Seitennummern setzen
  var totalPages = dlaKachelviewerConfig['tileSources'].length
  document.getElementById("dla_kachelviewer_seite").value = 1
  document.getElementById("dla_kachelviewer_seite").size = String(totalPages).length
  document.getElementById("dla_kachelviewer_seite").maxLength = String(totalPages).length
  document.getElementById("dla_kachelviewer_seiten").innerHTML = String(totalPages)

  // Viewer einrichten
  dlaKachelviewer = OpenSeadragon(dlaKachelviewerConfig)

  /**
   * Event handler definieren
   */

  // Seitenzahlen
  dlaKachelviewer.addHandler("page", function (data) {
    document.getElementById("dla_kachelviewer_seite").value = data.page + 1
  })
  var pageInput = document.getElementById("dla_kachelviewer_seite")
  pageInput.oninput = function (e) {
    var p = pageInput.value
    if (p) {
      if (pageInput.value > totalPages) p = totalPages
      else if (pageInput.value < 1) p = 1
      dlaKachelviewer.goToPage(p - 1)
    }
  }
  pageInput.onpropertychange = pageInput.oninput
}

/**
 * Ausführen
 */
setupDlaKachelviewer()
```

Javascript zusammen mit OpenSeadragon am Ende(!) der Seite einfügen. Reihenfolge beachten.

```
  …
  <script src="Pfad/zu/openseadragon/openseadragon.min.js"></script>
  <script src="Pfad/zu/dla_kachelviewer.js"></script>
</body>
```

___
*6.11.2016, Alexander Harm*