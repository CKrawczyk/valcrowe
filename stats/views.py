from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets
from stats.models import *
from stats.serializers import *
# Create your views here.


def index(request):
    return HttpResponse("Hello, world. You're at the stats index.")


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer


class AnswerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Answer.objects.all().order_by('id')
    serializer_class = AnswerSerializer


class QuestionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Question.objects.all().order_by('number')
    serializer_class = QuestionSerializer
