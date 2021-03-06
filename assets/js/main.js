var map = L.map('map').setView([ 41.74614949822607,  -70.07320404052734], 13);

		L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
			id: 'examples.map-20v6611k'
		}).addTo(map);


//bctParcels = new L.GeoJSON.AJAX("data/bct-parcels.geojson", {
//    style: style,
//    onEachFeature: onEachFeature
//});
		// control that shows state info on hover
		var info = L.control();

		info.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'info');
			this.update();
			return this._div;
		};

		info.update = function (props) {
			this._div.innerHTML = '<h4>Grantors</h4>' +  (props ?
				'<b>' + props.BCT + '</b><br />' + props.GRANTOR// + ' people / mi<sup>2</sup>'
				: 'Hover over a property');
		};

		info.addTo(map);


		// get color depending on population density value
		//function getColor(d) {
		//	return d > 1000 ? '#800026' :
		//	       d > 500  ? '#BD0026' :
		//	       d > 200  ? '#E31A1C' :
		//	       d > 100  ? '#FC4E2A' :
		//	       d > 50   ? '#FD8D3C' :
		//	       d > 20   ? '#FEB24C' :
		//	       d > 10   ? '#FED976' :
		//	                  '#FFEDA0';
		//}
function getColor(d) {
    return d == 'A' ? '#d9ef8b' :
        d == 'B' ? '#0000CC' :
            d == 'C' ? '#FF0000' :
                              '#000000';
}
		function style(feature) {
			return {
				weight: 1,
				opacity: 1,
				color: 'white',
				//dashArray: '3',
				fillOpacity: 0.7,
				fillColor: getColor(feature.properties.OWNER_TY_2)
			};
		}

		function highlightFeature(e) {
			var layer = e.target;

			layer.setStyle({
				weight: 2,
				color: '#666',
				//dashArray: '',
				fillOpacity: 0.1
			});

			if (!L.Browser.ie && !L.Browser.opera) {
				layer.bringToFront();
			}

			info.update(layer.feature.properties);
		}

		var geojson;

		function resetHighlight(e) {
			geojson.resetStyle(e.target);
			info.update();
		}

		function zoomToFeature(e) {
			map.fitBounds(e.target.getBounds());
		}

		function onEachFeature(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature
			});
		}
geojson = new L.GeoJSON.AJAX("data/bct-parcels.geojson", {
    style: style,
    onEachFeature: onEachFeature
    }).addTo(map);

//});
//		geojson = L.geoJson('data/bct-parcels.js', {
//			style: style,
//			onEachFeature: onEachFeature
//		}).addTo(map);

		map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


		//var legend = L.control({position: 'bottomright'});
        //
        //legend.onAdd = function (map) {
        //
			//var div = L.DomUtil.create('div', 'info legend'),
			//	grades = [0, 10, 20, 50, 100, 200, 500, 1000],
			//	labels = [],
			//	from, to;
            //
            //for (var i = 0; i < grades.length; i++) {
				//from = grades[i];
				//to = grades[i + 1];
                //
                //labels.push(
					//'<i style="background:' + getColor(from + 1) + '"></i> ' +
					//from + (to ? '&ndash;' + to : '+'));
			//}
            //
            //div.innerHTML = labels.join('<br>');
            //return div;
		//};
        //
        //legend.addTo(map);