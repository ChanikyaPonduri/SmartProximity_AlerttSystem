from django.shortcuts import render
from math import radians, sin, cos, sqrt, atan2

def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0  # km
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c

def distance_view(request):
    context = {}
    if request.method == 'POST':
        try:
            lat1 = float(request.POST['lat1'])
            lon1 = float(request.POST['lon1'])
            lat2 = float(request.POST['lat2'])
            lon2 = float(request.POST['lon2'])

            distance = haversine(lat1, lon1, lat2, lon2)
            context['distance'] = round(distance, 2)
        except:
            context['error'] = 'Invalid input. Please enter valid coordinates.'
    return render(request, 'index.html', context)
