__author__ = 'mas'

import csv

with open('/home/mas/gis-data/bct/bmw_assessor_2014.csv', 'r') as csvinput:
    with open('/home/mas/gis-data/bct/bmw_csv_new.csv', 'w') as csvoutput:
        dest = csv.writer(csvoutput, lineterminator='\n')
        source = csv.reader(csvinput)

        for row in source:
            result = row[:3] + [row[1] + row[2]]
            dest.writerow(result)




