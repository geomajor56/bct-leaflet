import json

with open("/var/www/bct-leaflet/data/points.geojson", "r") as json_file:
    json_data = json.load(json_file)

for feature in json_data['features']:
    for words in feature['properties']['GRANTOR'].split():
        print(words[0:])
        if (words.isupper()) and len(words) > 4:
            new_name = words.capitalize()
            print (words, new_name)
            feature['properties']['GRANTOR'] = new_name

with open('/var/www/bct-leaflet/data/my_file.json', 'w') as f:
    f.write(json.dumps(json_data))

# for feature in json_data['features']:
#     grantor = feature['properties']['GRANTOR'].split(" ")