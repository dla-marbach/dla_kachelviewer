/**
 * Skript zur Anzeige von Kacheln
 */

/**
 * Check Extension Variables
 */
if (dlaKachelviewerStoragePath) {
  if (dlaKachelviewerStoragePath.substr(0, 1) !== '/') dlaKachelviewerStoragePath = '/' + dlaKachelviewerStoragePath
  if (dlaKachelviewerStoragePath.substr(dlaKachelviewerStoragePath.length - 1, 1) !== '/') dlaKachelviewerStoragePath = dlaKachelviewerStoragePath + '/'
}
else {
  dlaKachelviewerStoragePath = '/fileadmin/data/repo/dido/'
}
var dlaKachelviewerFullStoragePath = '' // Dependent on dlaKachelviewerStoragePattern (1: Object/Quality/File, 2: Quality/Object/File)

if (dlaKachelviewerShowSearchField) {
  if (dlaKachelviewerShowSearchField === 'True') dlaKachelviewerShowSearchField = true
  else dlaKachelviewerShowSearchField = false
}
else {
  dlaKachelviewerShowSearchField = true
}

if (dlaKachelviewerShowMetadata) {
  if (dlaKachelviewerShowMetadata === 'True') dlaKachelviewerShowMetadata = true
  else dlaKachelviewerShowMetadata = false
}
else {
  dlaKachelviewerShowMetadata = true
}

if (!dlaKachelviewerPhysPage) {
  dlaKachelviewerPhysPage = 0
}

/**
 * Suchfeld anzeigen/verstecken
 */
if (!dlaKachelviewerShowSearchField) document.getElementById('dla_kachelviewer_input').style.display = 'none'

/**
 * Objekt-ID aus URL bestimmen
 * Zwei Quellen möglich: 'searchString', 'userInput'
 */
var dlaKachelviewerGetObjectID = function (source, searchString) {

  // Regular Expression
  var reObjectID
  var reMetadataID
  var rePhysPage = /physpage=([0-9]+)/

  // Anpassen der Parameter an Quelle
  if (source === 'userInput') {
    reObjectID = /([A-Z]{0,2}[_]{0,1}[0-9]{1,8}[0-9Xx]{0,1})/
  }
  else {
    searchString = window.location.search
    reObjectID = /object=([A-Z]{0,2}[_]{0,1}[0-9]{1,8}[0-9Xx]{0,1})/
    reMetadataID = /metadata=((?:[A-Z]{0,2}[_]{0,1}[0-9]{1,8}[0-9Xx]{0,1})|(?:false))/
  }

  // Prüfen ob Seite übergeben wurde
  var physPage = searchString.match(rePhysPage)

  if (physPage && physPage[1]) {
    console.log('PhysPage: ' + physPage[1])
    dlaKachelviewerPhysPage = physPage[1]
  }

  // Objekt-ID
  var objectID = searchString.match(reObjectID)

  if (objectID && objectID[1]) {
    // Objektdaten laden
    console.log('ObjectID: ' + objectID[1])
    document.getElementById("dla_kachelviewer_input_text").value = objectID[1]
    dlaKachelviewerOsDataExists(objectID[1], 1)
  }
  else {
    console.log('No ObjectID')
    dlaKachelviewerShowError()
  }

  // Metadaten-ID
  if (objectID && objectID[1]) {

    var metadataID = searchString.match(reMetadataID)
    if (metadataID && metadataID[1]) {

      if (metadataID[1] === 'false') {
        console.log('MetadataID: false')
      }
      else {
        console.log('MetadataID: ' + metadataID[1])
        dlaKachelviewerLoadKalliasData(metadataID[1])
      }

    }
    else {
      console.log('MetadataID: ' + objectID[1])
      dlaKachelviewerLoadKalliasData(objectID[1])
    }

  }

}

/**
 * Laden der Kallias-Metadaten
 */
var dlaKachelviewerLoadKalliasData = function (metadataID) {

  // Bestand bestimmen
  var kalliasBestand = metadataID.match(/^[A-Z]{2}/)
  // Datensatznummer bestimmen
  var kalliasDatensatznummer = metadataID.match(/[0-9]{1,8}/)

  // API Abfrage
  var kalliasApi = 'https://www.dla-marbach.de/cgi-bin/aDISCGI/kallias_prod/lib/adis.htm?ADISDB='
  kalliasApi += kalliasBestand[0]
  kalliasApi += '&ADISOI='
  kalliasApi += kalliasDatensatznummer[0]
  kalliasApi += '&WEB=JA'

  var xhr = new XMLHttpRequest()
  xhr.open('GET', kalliasApi, true)
  xhr.onload = function (e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log('KalliasData loaded: ' + metadataID)
        dlaKachelviewerParseKallias(xhr.responseText)
      } 
      else {
        console.log('No KalliasData loaded')
      }
    }
  }
  xhr.onerror = function (e) {
    console.log('No KalliasData loaded')
  }
  xhr.send(null)

}

/**
 * Parse Kallias Metadaten
 */
var dlaKachelviewerParseKallias = function (kalliasRawData) {

  // leider können alle getesten Parser (xhr.responseXML, htmlparser) nicht mit dem gelieferten HTML umgehen
  // Identifizieren des span-Elements über RegEx (nicht empfohlen, daher wird RegEx so genau wie möglich definiert)
  var re = /<span class="kginfo">[\s\S]*?document\.close\(\)\s<\/script>\s<\/span>/
  var kalliasData = kalliasRawData.match(re)[0]

  // Manchmal werden mehrere Tabellen zurückgegeben, wir wollen nur die erste
  var reTables = /([\s\S]+?<TABLE[\s\S]+?<\/TABLE>)(?:<TABLE[\s\S]+?<\/TABLE>){0,}([\s\S]+?)/
  kalliasData = kalliasData.replace(reTables, "$1$2")

  // Das Ergebnis kann auch einen Scripttag beinhalten
  var reScript = /<script[\s\S]+<\/script>/
  kalliasData = kalliasData.replace(reScript, "")

  // Tabellenbreite korrigieren
  var reWidth = /width="150%"/
  kalliasData = kalliasData.replace(reWidth, "width=\"100%\"")

  // HTML-Element erstellen
  var kalliasHtmlElement = document.createElement('div')
  kalliasHtmlElement.innerHTML = kalliasData

  // Metadaten-Tabelle analysieren (falls vorhanden)
  var zellen = kalliasHtmlElement.querySelectorAll("td")
  if (zellen.length > 0) {
    // HTML säubern
    for(var i = 0; i < zellen.length; i++) {
      zellen[i].innerHTML = zellen[i].innerText || zellen[i].textContent
    }

    // Kallias Tabelle in Metadaten einfügen
    document.getElementById('dla_kachelviewer_metadaten').innerHTML = kalliasHtmlElement.innerHTML
  }
  else document.getElementById('dla_kachelviewer_metadaten').innerHTML = ''

}

/**
 * Testen ob OpenSeadragon-Metadaten existieren
 */
var dlaKachelviewerOsDataExists = function (objectID, dlaKachelviewerStoragePattern) {

  // storage path
  if (dlaKachelviewerStoragePattern === 1) dlaKachelviewerFullStoragePath = dlaKachelviewerStoragePath + objectID + '/tiles/'
  else dlaKachelviewerFullStoragePath = dlaKachelviewerStoragePath + 'tiles/' + objectID + '/'

  var xhr = new XMLHttpRequest()
  xhr.open('HEAD', dlaKachelviewerFullStoragePath + objectID + '.json', true)
  xhr.onload = function (e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log('OsData found: ' + objectID)
        dlaKachelviewerLoadOsData(objectID, dlaKachelviewerStoragePattern)
      } 
      else {
        if (dlaKachelviewerStoragePattern === 1) dlaKachelviewerOsDataExists(objectID, 2)
        else {
          console.log('No OsData found')
          dlaKachelviewerShowError()
        }
      }
    }
  }
  xhr.onerror = function (e) {
    console.log('OsData: Error')
    dlaKachelviewerShowError()
  }
  xhr.send(null)

}

/**
 * Laden der OpenSeadragon-Metadaten
 */
var dlaKachelviewerLoadOsData = function (objectID) {

  var xhr = new XMLHttpRequest()
  xhr.open('GET', dlaKachelviewerFullStoragePath + objectID + '.json', true)
  xhr.onload = function (e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log('OsData loaded: ' + objectID)
        var osData = JSON.parse(xhr.responseText)
        dlaKachelviewerSetupOpenSeadragon(objectID, osData)
      } 
      else {
        console.log('No OsData loaded')
        dlaKachelviewerShowError()
      }
    }
  }
  xhr.onerror = function (e) {
    dlaKachelviewerShowError()
  }
  xhr.send(null)

}

/**
 * Setup OpenSeadragon
 */
var dlaKachelviewerViewer
var dlaKachelviewerSetupOpenSeadragon = function (objectID, osData) {

  // set visibility of elements
  document.getElementById('dla_kachelviewer_error').style.visibility = 'hidden'
  document.getElementById('dla_kachelviewer_input').style.visibility = 'visible'
  document.getElementById('dla_kachelviewer_viewport').style.visibility = 'visible'

  // set page numbers
  var totalPages = osData['files'].length
  document.getElementById("dla_kachelviewer_seite").value = 1
  document.getElementById("dla_kachelviewer_seite").size = String(totalPages).length
  document.getElementById("dla_kachelviewer_seite").maxLength = String(totalPages).length
  document.getElementById("dla_kachelviewer_seiten").innerHTML = String(totalPages)

  // modify path
  for (var i = 0; i < osData['files'].length; i++) {
    osData['files'][i] = dlaKachelviewerFullStoragePath + osData['files'][i].replace(/\.[a-z]{3,4}$/i, '.dzi')
  }

  // if dlaKachelviewerViewer exists destroy it
  if (dlaKachelviewerViewer) dlaKachelviewerViewer.destroy()

  // create dlaKachelviewerViewer
  dlaKachelviewerViewer = OpenSeadragon({
      id: 'dla_kachelviewer_content'
    , prefixUrl: 'typo3conf/ext/dla_kachelviewer/Resources/Public/openseadragon/images/'
    , tileSources: osData['files']
    , toolbar: 'dla_kachelviewer_toolbar'
    , sequenceMode: true
    , showReferenceStrip: true
  })

  /**
   * add event handlers
   */

  // new image opened
  dlaKachelviewerViewer.addHandler("open", function (data) {

    // Reload Metadata if ShowMetadata is true and MetadataID is a RegEx
    if (dlaKachelviewerShowMetadata === true) {
    
      // Check if MetadataID exists and is a regex
      if (dlaKachelviewerMetadataID && dlaKachelviewerMetadataID.substr(0, 3) === "re:") {
        dlaKachelviewerLoadKalliasData(data.source.match(new RegExp(dlaKachelviewerMetadataID.substr(3)))[1])
      }
    }
  })

  // page numbers
  dlaKachelviewerViewer.addHandler("page", function (data) {
    document.getElementById("dla_kachelviewer_seite").value = data.page + 1
  })
  var pageInput = document.getElementById("dla_kachelviewer_seite")
  pageInput.oninput = function (e) {
    var p = pageInput.value
    if (p) {
      if (pageInput.value > totalPages) p = totalPages
      else if (pageInput.value < 1) p = 1
      dlaKachelviewerViewer.goToPage(p - 1)
    }
  }
  pageInput.onpropertychange = pageInput.oninput

  /**
   * Element fokussieren und Keys zur Navigation nutzen
   */
  // fokussieren
  document.getElementsByClassName('openseadragon-canvas')[0].focus()
  
  var dlaKachelviewerShiftKey = false
  window.addEventListener("keydown", function (e) {

    // aktuelle Seite
    var currentPage = dlaKachelviewerViewer.currentPage()

    // Welcher Key gedrückt?
    var key = e.keyCode || e.which

    // Shift-Key Zustand speichern
    if (key === 16) dlaKachelviewerShiftKey = true
    else {
      // Shift gedrückt?
      if (e.shiftKey || dlaKachelviewerShiftKey) {

        // Shift - Pfeiltaste links
        if (key === 37 || e.key === 'ArrowLeft') {
          e.preventDefault()
          if (currentPage > 0) dlaKachelviewerViewer.goToPage(currentPage - 1)
        }
        // Shift - Pfeiltaste rechts
        if (key === 39 ||  e.key === 'ArrowRight') {
          e.preventDefault()
          if (currentPage < totalPages - 1) dlaKachelviewerViewer.goToPage(currentPage + 1)
        }
      }
    }

  })

  window.addEventListener("keyup", function (e) {

    // Welcher Key gedrückt?
    var key = e.keyCode || e.which
    // Shift-Key Zustand speichern
    if (key === 16) dlaKachelviewerShiftKey = false

  })

  /**
   * Übergebenes Digitalisat aufrufen
   */
  dlaKachelviewerViewer.goToPage(Math.max(0, Math.min(dlaKachelviewerPhysPage - 1, totalPages)))

}

/**
 * Error Handling
 */
var dlaKachelviewerShowError = function () {
  document.getElementById('dla_kachelviewer_error').style.visibility = 'visible'
  document.getElementById('dla_kachelviewer_input').style.visibility = 'visible'
  document.getElementById('dla_kachelviewer_viewport').style.visibility = 'hidden'
}

/**
 * Setup Object Search
 */
var dlaKachelviewerObjectInput = document.getElementById("dla_kachelviewer_input_submit")
dlaKachelviewerObjectInput.onclick = function (e) {
  dlaKachelviewerGetObjectID('userInput', document.getElementById("dla_kachelviewer_input_text").value)
}

/**
 * Execute
 */
if (dlaKachelviewerObjectID) {

  document.getElementById("dla_kachelviewer_input_text").value = dlaKachelviewerObjectID
  dlaKachelviewerOsDataExists(dlaKachelviewerObjectID, 1)

  // Show Metadata
  if (dlaKachelviewerShowMetadata === true) {

    // Check if MetadataID exists
    if (dlaKachelviewerMetadataID) {

      // Load if it is not a RegEx
      if (dlaKachelviewerMetadataID.substr(0, 3) !== "re:") {
        dlaKachelviewerLoadKalliasData(dlaKachelviewerMetadataID)
      }

    }

    // Use ObjectID as default
    else {
      dlaKachelviewerLoadKalliasData(dlaKachelviewerObjectID)
    }
  }
}
else {
  dlaKachelviewerGetObjectID('searchString')
}