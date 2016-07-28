from django.conf.urls import include, url
import stats.views as views
from django.contrib import admin
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'answers', views.AnswerViewSet)
router.register(r'questions', views.QuestionViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^api-auth/',
        include('rest_framework.urls', namespace='rest_framework')
        ),
    url(r'^admin/', include(admin.site.urls)),
]
