import googlemaps
import os
import json
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "valcrowe.settings")
django.setup()
from stats.models import Answer # noqa

gmaps = googlemaps.Client(key=os.environ['MAPSAPI'])

ans = Answer.objects.filter(question__number=2).values('answerOpen__answer')
total = len(ans)
locations = {}
for adx, a in enumerate(ans):
    city = a['answerOpen__answer'].lower()
    if city not in locations:
        results = gmaps.geocode(city)
        if len(results) > 0:
            locations[city] = results[0]['geometry']['location']
    print '{0}/{1}'.format(adx, total)

with open('./stats/static/city_location.json', 'w') as outfile:
    json.dump(locations, outfile)
