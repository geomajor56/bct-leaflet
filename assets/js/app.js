var map, featureList, boroughSearch = [], pointSearch = [], museumSearch = [], parkIcon;

$(document).on("click", ".feature-row", function (e) {
    sidebarClick(parseInt($(this).attr('id')));
});

$("#about-btn").click(function () {
    $("#aboutModal").modal("show");
    return false;
});

$("#full-extent-btn").click(function () {
    map.fitBounds(brewster.getBounds());
    return false;
});

$("#legend-btn").click(function () {
    $("#legendModal").modal("show");
    return false;
});

$("#login-btn").click(function () {
    $("#loginModal").modal("show");
    return false;
});

$("#list-btn").click(function () {
    $('#sidebar').toggle();
    map.invalidateSize();
    return false;
});

$("#nav-btn").click(function () {
    $(".navbar-collapse").collapse("toggle");
    return false;
});

$("#sidebar-toggle-btn").click(function () {
    $("#sidebar").toggle();
    map.invalidateSize();
    return false;
});

$("#sidebar-hide-btn").click(function () {
    $('#sidebar').hide();
    map.invalidateSize();
});

function sidebarClick(id) {
    map.addLayer(pointLayer)//.addLayer(museumLayer);
    var layer = markerClusters.getLayer(id);
    markerClusters.zoomToShowLayer(layer, function () {
        map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
        layer.fire("click");
    });
    /* Hide sidebar and go to the map on small screens */
    if (document.body.clientWidth <= 767) {
        $("#sidebar").hide();
        map.invalidateSize();
    }
}

/* Basemap Layers */
mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
osm = L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; ' + mapLink + ' Contributors',
        maxZoom: 18
    });

watercolor = L.tileLayer.provider('Stamen.Watercolor')


/* Overlay Layers */
var highlight = L.geoJson(null);

var brewster = L.geoJson(null, {
    style: function (feature) {
        return {
            color: "green",
            weight: 2,
            fill: false,
            opacity: 1,
            clickable: false
        };
    },
    onEachFeature: function (feature, layer) {
        boroughSearch.push({
            name: layer.feature.properties.BoroName,
            source: "Boroughs",
            id: L.stamp(layer),
            bounds: layer.getBounds()
        });
    }
});
$.getJSON("data/brewster.geojson", function (data) {
    brewster.addData(data);
});


/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    disableClusteringAtZoom: 15
});


var greenTree = L.MakiMarkers.icon({
    icon: "park",
    color: "3F9110",
    size: "s"
});
var redTree = L.MakiMarkers.icon({
    icon: "park",
    color: "F04441",
    size: "s"
});
var blueTree = L.MakiMarkers.icon({
    icon: "park",
    color: "442DB5",
    size: "s"
});


var parcels = new L.GeoJSON.AJAX("data/parcels.geojson", {
    style: function (feature) {
        return {
            color: "red",
            weight: 2,
            fill: false,
            opacity: 1,
            clickable: false
        };
    },
});


/* Empty layer placeholder to add to layer control for listening when to add/remove points to markerClusters layer */
var pointLayer = L.geoJson(null);
var points = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
        if (feature.properties.OWNER_TYPE === "A") {
            return L.marker(latlng, {
                icon: greenTree,
                title: feature.properties.BCT,
                riseOnHover: true
            });
        } else if (feature.properties.OWNER_TYPE === "B") {
            return L.marker(latlng, {
                icon: blueTree,
                title: feature.properties.BCT,
                riseOnHover: true
            });

        } else {
            return L.marker(latlng, {
                icon: redTree,
                title: feature.properties.BCT,
                riseOnHover: true
            });
        }
    },
    onEachFeature: function (feature, layer) {
        if (feature.properties) {


            var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.GRANTOR + "</td></tr>" + "<tr><th>Date Acquired</th><td>" + feature.properties.ACQUIRED + "</td></tr>" + "<tr><th>Habitat</th><td>" + feature.properties.HABITAT + "</td></tr>" + "<tr><th>Total Acres</th><td>" + feature.properties.TOTAL + "</td></tr>" + "<table>";
            layer.on({
                click: function (e) {
                    if (feature.properties.OWNER_TYPE === "A") {
                        ownerType = "BCT Owned Land";
                    } else if (feature.properties.OWNER_TYPE === "B") {
                        ownerType = "Conservation Restriction on Private Land";
                    } else {
                        ownerType = 'Conservation Restriction on Town Land';
                    }
                    $("#feature-title").html(feature.properties.BCT + '<h5>' + ownerType + '</h5>');
                    $("#feature-info").html(content);
                    $("#featureModal").modal("show");
                    highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
                        stroke: false,
                        fillColor: "#00FFFF",
                        fillOpacity: 0.7,
                        radius: 10
                    }));
                }
            });
            $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '"><td style="vertical-align: middle;"></td><td class="feature-name">' + layer.feature.properties.GRANTOR + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
            pointSearch.push({
                name: layer.feature.properties.BCT,
                address: layer.feature.properties.GRANTOR,
                source: "Theaters",
                id: L.stamp(layer),
                lat: layer.feature.geometry.coordinates[1],
                lng: layer.feature.geometry.coordinates[0]
            });
        }
    }
});
$.getJSON("data/points.geojson", function (data) {
    points.addData(data);
    map.addLayer(pointLayer);
});
function popUp(f,l){
    var out = [];
    if (f.properties){
        for(key in f.properties){
            out.push(key+": "+f.properties[key]);
        }
        l.bindPopup(out.join("<br />"));
    }
}
var bmwOpen = new L.GeoJSON.AJAX("data/bmw_open.geojson",{onEachFeature:popUp});


map = L.map("map", {
    zoom: 10,
    center: [41.74736621741609, -70.06891250610352],
    layers: [osm, brewster, parcels, markerClusters, highlight],
    //zoomControl: false,
    attributionControl: false
});



bmwOpen.addTo(map);


L.control.navbar().addTo(map);

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function (e) {
    if (e.layer === pointLayer) {
        markerClusters.addLayer(points);
    }

});

map.on("overlayremove", function (e) {
    if (e.layer === pointLayer) {
        markerClusters.removeLayer(points);
    }

});

/* Clear feature highlight when map is clicked */
map.on("click", function (e) {
    highlight.clearLayers();
});


map.on('zoomend', function () {

    if (map.getZoom() > 14) {
        map.addLayer(parcels)
    } else {
        map.removeLayer(parcels)
    }
});

/* Attribution control */
function updateAttribution(e) {
    $.each(map._layers, function (index, layer) {
        if (layer.getAttribution) {
            $("#attribution").html((layer.getAttribution()));
        }
    });
}

map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
    position: "bottomright"
});
attributionControl.onAdd = function (map) {
    var div = L.DomUtil.create("div", "leaflet-control-attribution");
    div.innerHTML = "<span class='hidden-xs'>Developed by <a href='http://bryanmcbride.com'>bryanmcbride.com</a> | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
    return div;
};
map.addControl(attributionControl);

//var zoomControl = L.control.zoom({
//    position: "topleft"
//}).addTo(map);


/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
    var isCollapsed = true;
} else {
    var isCollapsed = false;
}

var baseLayers = {
    "Street Map": osm,

    'Esri WorldImagery': L.tileLayer.provider('Esri.WorldImagery')


};

var groupedOverlays = {
    "BCT Land": {
        "<img src='assets/img/park-12.svg' width='24' height='28'>&nbsp;BCT Land": pointLayer
        //"<img src='assets/img/museum.png' width='24' height='28'>&nbsp;Museums": museumLayer
    },
    "Layers": {
        "Brewster": brewster
        //"Subway Lines": subwayLines
    }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
    collapsed: isCollapsed
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
    $(this).select();
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
    $("#loading").hide();
    /* Fit map to brewster bounds */
    map.fitBounds(brewster.getBounds());
    featureList = new List("features", {valueNames: ["feature-name"]});
    featureList.sort("feature-name", {order: "asc"});

    var brewsterBH = new Bloodhound({
        name: "Boroughs",
        datumTokenizer: function (d) {
            return Bloodhound.tokenizers.whitespace(d.name);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: boroughSearch,
        limit: 10
    });

    var pointsBH = new Bloodhound({
        name: "Theaters",
        datumTokenizer: function (d) {
            return Bloodhound.tokenizers.whitespace(d.name);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: pointSearch,
        limit: 10
    });


    brewsterBH.initialize();
    pointsBH.initialize();

    /* instantiate the typeahead UI */
    $("#searchbox").typeahead({
        minLength: 3,
        highlight: true,
        hint: false
    }, {
        name: "Boroughs",
        displayKey: "name",
        source: brewsterBH.ttAdapter(),
        templates: {
            header: "<h4 class='typeahead-header'>Boroughs</h4>"
        }
    }, {
        name: "Theaters",
        displayKey: "name",
        source: pointsBH.ttAdapter(),
        templates: {
            header: "<h4 class='typeahead-header'><img src='assets/img/point.png' width='24' height='28'>&nbsp;Theaters</h4>",
            suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
        }

    }).on("typeahead:selected", function (obj, datum) {
        if (datum.source === "Boroughs") {
            map.fitBounds(datum.bounds);
        }
        if (datum.source === "Theaters") {
            if (!map.hasLayer(pointLayer)) {
                map.addLayer(pointLayer);
            }
            map.setView([datum.lat, datum.lng], 17);
            if (map._layers[datum.id]) {
                map._layers[datum.id].fire("click");
            }
        }

        if (datum.source === "GeoNames") {
            map.setView([datum.lat, datum.lng], 14);
        }
        if ($(".navbar-collapse").height() > 50) {
            $(".navbar-collapse").collapse("hide");
        }
    }).on("typeahead:opened", function () {
        $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
        $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
    }).on("typeahead:closed", function () {
        $(".navbar-collapse.in").css("max-height", "");
        $(".navbar-collapse.in").css("height", "");
    });
    $(".twitter-typeahead").css("position", "static");
    $(".twitter-typeahead").css("display", "block");
});
