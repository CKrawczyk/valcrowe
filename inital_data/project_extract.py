from openpyxl import load_workbook
from pprint import pprint

wb = load_workbook(filename='ORIGINAL DATA IDS ETHNICITY.xlsx')
ws = wb['All']

names = {}
for rdx, row in enumerate(ws.rows):
    if rdx > 1:
        if row[2].value is not None:
            exec 'tmp = ' + row[2].value
            for p in tmp:
                names.setdefault(p, 1)

pprint(names.keys())
