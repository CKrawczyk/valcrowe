import rest_framework_filters as filters
from rest_framework import viewsets
from stats.models import *
from stats.serializers import *
from django.db.models import Prefetch


class SurveyProjectFilter(filters.FilterSet):
    project = filters.AllLookupsFilter(name='project')
    classifications = filters.AllLookupsFilter(name='total_n_classifications')
    sessions = filters.AllLookupsFilter(name='total_n_sessions')
    days = filters.AllLookupsFilter(name='total_n_unique_days')

    class Meta:
        model = SurveyProject
        fields = ['project', 'classifications', 'sessions']


class QuestionFilter(filters.FilterSet):
    number = filters.AllLookupsFilter(name='number')
    kind = filters.CharFilter(name='kind__kind')
    category = filters.CharFilter(name='category__category')

    class Meta:
        model = Question
        fields = ['number', 'kind', 'category', 'plot_type']


class QuestionViewSet(viewsets.ReadOnlyModelViewSet):
    filter_class = QuestionFilter
    queryset = Question.objects.all().order_by('number')
    serializer_class = QuestionSerializer


class QuestionCountSet(viewsets.ReadOnlyModelViewSet):
    filter_class = QuestionFilter
    serializer_class = QuestionCountSerializer

    def get_queryset(self):
        queryset = Question.objects.all().order_by('number')
        queryset = self.get_serializer_class().setup_eager_loading(queryset)
        return queryset


class AnswerFilter(filters.FilterSet):
    question = filters.AllLookupsFilter(name='question__number')

    class Meta:
        model = Answer
        fields = ['question']


class AnswerViewSet(viewsets.ReadOnlyModelViewSet):
    filter_class = AnswerFilter
    queryset = Answer.objects.all().order_by('question__number')
    serializer_class = AnswerSerializer


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserSerializer

    def get_queryset(self):
        # do answer_list filter via Prefetch with a queryset
        # do all project_list and survey_project prefetch as well
        request_params = self.request.query_params.dict()
        user_list_filter = {}
        answer_list_filter = {}
        for key, value in request_params.iteritems():
            if ('answer_list__' in key):
                if ('__in' in key):
                    answer_list_filter[key.replace('answer_list__', '')] = value.split(',')
                else:
                    answer_list_filter[key.replace('answer_list__', '')] = value
            else:
                if ('__in' in key):
                    user_list_filter[key] = value.split(',')
                else:
                    user_list_filter[key] = value
        queryset = User.objects.all().order_by('id')
        if (len(user_list_filter.keys()) > 0):
            queryset = queryset.filter(**user_list_filter)
        # set up prefetch
        queryset = queryset.select_related('survey_project')
        queryset = queryset.prefetch_related('project_list')
        answer_queryset = Answer.objects.all().order_by('question__number')
        if (len(answer_list_filter.keys()) > 0):
            answer_queryset = answer_queryset.filter(**answer_list_filter)
        answer_queryset = answer_queryset.select_related(
            'answerOpen',
            'answerBool',
            'answerAD',
            'answerGender',
            'answerEdu',
            'answerEthnicity',
            'answerQuiz',
            'question',
        )
        queryset = queryset.prefetch_related(Prefetch('answer_list', queryset=answer_queryset))
        return queryset
