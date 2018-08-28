// Liste des clefs/layers pour tester du vecteur tuilé sur Geoserver© :
// sur http://calac-4.ign.fr:8080/geoserver/
// (cf. data/config.json)
//      layer simple
//          -> "INCA:n0_bati_surf"
//      alias ou agregats
//          -> "INCA:pyramide_proto"
//              ->-> "INCA:pyramide_n0"
//              ->-> "INCA:pyramide_n10"
//              ->-> "INCA:pyramide_n99"

// clef par defaut !
var keyByDefault = "states"; // GeoJSON...

// proxy par defaut (surchargé par config.json)
var proxy = "http://localhost/proxy/proxy.php?url=";

// carte
var map;

/** Métadonnées des couches */
fetch('data/config.json').then(
    function(response) {
        response.json().then(function(cfg) {
            // chargement de la carte avec une couche par defaut
            loadMap(cfg);

            // chargement du menu des couches disponibles
            loadLayers(cfg);
        });
    }
);

/**
* Chargement de la carte
*/
function loadMap (config) {

    // controle mouseposition
    var mousePositionControl = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(4),
        projection: 'EPSG:4326',
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position'),
        undefinedHTML: '&nbsp;'
    });

    // controle layerswitcher
    var layerSwitcher = new ol.control.LayerSwitcher();

    // couche de base
    var osm = new ol.layer.Tile({
        title: 'OSM',
        source: new ol.source.OSM(),
        opacity: 0.5
    });

    // gestion du layerswitcher
    var layersGroup = new ol.layer.Group({
        title: 'Base Map',
        layers: [
            osm
        ]
    });

    // carte
    map = new ol.Map({
        target: 'map',
        layers: [
            layersGroup
        ],
        controls: ol.control.defaults({}).extend([mousePositionControl, layerSwitcher]),
        view: new ol.View({
            center: (config[keyByDefault].center) ? ol.proj.transform(config[keyByDefault].center, 'EPSG:4326', 'EPSG:3857') : [270000, 6250000],
            rotation: 0,
            zoom: config[keyByDefault].zoom || 15
        })
    });

    // gestion du style
    _addLayerStyle(config, keyByDefault);

    // gestion du zoom
    var zoomContainer = document.getElementById('zoom-level');
    map.on('moveend', function (event) {
        var map = event.map;
        var zoom = map.getView().getZoom();
        zoomContainer.innerHTML = zoom;
    });

    // gestion du controle mouseposition
    var projectionSelect = document.getElementById('mouse-projection');
    projectionSelect.addEventListener('change', function (event) {
        mousePositionControl.setProjection(event.target.value);
    });

    var precisionInput = document.getElementById('mouse-precision');
    precisionInput.addEventListener('change', function (event) {
        var format = ol.coordinate.createStringXY(event.target.valueAsNumber);
        mousePositionControl.setCoordinateFormat(format);
    });
}

/**
* Chargement du style mapbox & ajout de la couche sur la carte
*/
function _addLayerStyle (config, key) {

    // gestion du style
    var _id      = config[key].service.key;
    var _proxy   = config[key].service.proxy;
    var _url     = config[key].service.host + config[key].service.path;
    var _title   = config[key].title;
    var _visible = config[key].visible;
    var _format  = (config[key].service.type === "vector") ? new ol.format.MVT() : new ol.format.GeoJSON();
    var _style   = config[key].service.style;

    var _center  = (config[key].center) ? ol.proj.transform(config[key].center, 'EPSG:4326', 'EPSG:3857') : [270000, 6250000];
    var _zoom    = config[key].zoom || 17;

    // couche à ajouter
    var _layer = new ol.layer.VectorTile({
        id: key,
        title: _title,
        visible: _visible,
        source : new ol.source.VectorTile({
            tilePixelRatio: 1, // oversampling when > 1
            tileGrid: ol.tilegrid.createXYZ({
                tileSize : 256
            }),
            format: _format,
            url: _proxy + _url
        }),
        // minResolution : 0,      // TODO ?
        // maxResolution : 200000, // TODO ?
        declutter: true
    });

    // application du style
    fetch(_style)
    .then(
        function(response) {
            if (response.ok) {
                response.json().then(function(style) {
                    console.log(style);
                    olms.applyStyle(_layer, style, _id).then(function () {
                        map.addLayer(_layer);
                    });
                })
                .catch(function (error) {
                    console.error(error);
                    map.addLayer(_layer);
                });
            }
        }
    )
    .then(
        function () {
            map.getView().setCenter(_center);
            map.getView().setZoom(_zoom);
        }
    );
};

/**
* Suppression de la couche stylisée
*/
function _removeLayerStyle (key) {
    map.getLayers().forEach(function (layer) {
        if (layer && layer.get('id') != undefined && layer.get('id') === key) {
            map.removeLayer(layer);
        }
    });
}

/**
* Chargement du menu (choix des couches)
*/
function loadLayers (config) {
    var container = document.getElementById("menu-container");

    var titre = document.createElement("label");
    titre.innerHTML = "Liste des couches disponibles";
    container.appendChild(titre);
    container.appendChild(document.createElement("br"));

    for (var key in config) {
        if (config.hasOwnProperty(key)) {

            var div = document.createElement("div");
            div.id =  key + "-menu";
            div.className = "menu-item";

            var _createDomImage = function (key, container) {
                var _container = container;
                if (!_container) {
                    _container = document.getElementById(key + "-menu");
                }

                if (_container) {
                    var div = document.createElement("div");
                    div.id =  key + "-images";
                    div.className = "images-item";

                    var titre = document.createElement("label");
                    titre.innerHTML = "Thème '" + config[key].resources.label + "'";
                    div.appendChild(titre);
                    div.appendChild(document.createElement("br"));

                    var img = document.createElement("img");
                    img.src = config[key].resources.image;
                    img.alt = config[key].resources.description;
                    div.appendChild(img);
                    div.appendChild(document.createElement("br"));

                    var desc = document.createElement("label");
                    desc.innerHTML = config[key].resources.description;
                    div.appendChild(desc);
                    div.appendChild(document.createElement("br"));

                    _container.appendChild(div);
                }
            };

            var _removeDomImage = function (key, container) {
                var _container = container;
                if (!_container) {
                    _container = document.getElementById(key + "-images");
                }

                if (_container) {
                    _container.remove();
                }
            };

            var input = document.createElement("input");
            input.type = "checkbox";
            input.id = key;
            input.name = "layers"
            input.value = key;
            // input.disabled = true; // TODO ...
            input.addEventListener('click', function (e) {
                if (e.target.checked) {
                    keyByDefault = e.target.id;
                    _addLayerStyle(config, e.target.id);
                    _createDomImage(e.target.id);

                } else {
                    _removeLayerStyle(e.target.id);
                    _removeDomImage(e.target.id);
                }
            });
            div.appendChild(input);

            var label = document.createElement("label");
            label.for = key;
            label.innerHTML = config[key].resources.title;
            div.appendChild(label);

            // selection par defaut
            if (key === keyByDefault) {
                input.checked = true;
                _createDomImage(key, div);
            }

            container.appendChild(div);
        }
    }
}
