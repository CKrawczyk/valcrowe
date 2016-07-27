from django.conf.urls import include, url
import stats.views
from django.contrib import admin
admin.autodiscover()

urlpatterns = [
    url(r'^$', stats.views.index, name='index'),
    url(r'^admin/', include(admin.site.urls)),
]
