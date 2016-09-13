import rest_framework_filters as filters
from rest_framework import viewsets, pagination, views, response
from stats.models import *
from stats.serializers import *
from django.db.models import Prefetch
from collections import OrderedDict, Counter


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
    serializer_class = QuestionCountSerializer

    def get_queryset(self):
        queryset = Question.objects.all().order_by('number')
        queryset = queryset.select_related('kind', 'category', 'context')
        request_params = self.request.query_params.dict()
        answer_queryset = Answer.objects.all()
        answer_set_filter = {}
        question_filter = {}
        for key, value in request_params.iteritems():
            if ('answer_set__' in key):
                if ('__in' in key):
                    answer_set_filter[key.replace('answer_set__', '')] = value.split(',')
                else:
                    answer_set_filter[key.replace('answer_set__', '')] = value
            else:
                if ('__in' in key):
                    question_filter[key.replace('category', 'category__category').replace('kind', 'kind__kind')] = value.split(',')
                else:
                    question_filter[key.replace('category', 'category__category').replace('kind', 'kind__kind')] = value
        if (len(question_filter.keys()) > 0):
            queryset = queryset.filter(**question_filter)
        if (len(answer_set_filter.keys()) > 0):
            answer_queryset = answer_queryset.filter(**answer_set_filter)
        answer_queryset = answer_queryset.select_related(
            'answerOpen',
            'answerBool',
            'answerAD',
            'answerGender',
            'answerEdu',
            'answerEthnicity',
            'answerQuiz'
        )
        queryset = queryset.prefetch_related(Prefetch('answer_set', queryset=answer_queryset))
        return queryset


class LargeResultsSetPagination(pagination.PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 2000


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    pagination_class = LargeResultsSetPagination

    def get_queryset(self):
        request_params = self.request.query_params.dict()
        request_params.pop('page_size', 0)
        request_params.pop('format', '')
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


userCountFieldList = [
    'talk_posts',
    # 'duration_first_last_talk_days',
    'total_n_classifications',
    'total_n_sessions',
    # 'total_n_projects',
    # 'total_unique_days',
    # 'first_classification',
    # 'last_classification',
    # 'duration_first_last_talk_hours',
    # 'duration_first_last_classification_hours',
    # 'min_classifications_per_session',
    # 'max_classifications_per_session',
    # 'median_classifications_per_session',
    # 'mean_classifications_per_session',
    'mean_duration_classification_hours',
    # 'median_duration_classification_hours',
    'mean_duration_session_hours',
    # 'median_duration_session_hours',
    # 'min_duration_session_hours',
    # 'max_duration_session_hours',
    # 'mean_duration_session_first2_hours',
    # 'mean_duration_session_last2_hours',
    # 'mean_duration_classification_first2_hours',
    # 'mean_duration_classification_last2_hours',
    # 'min_number_projects_per_session',
    # 'max_number_projects_per_session',
    # 'median_number_projects_per_session',
    # 'mean_number_projects_per_session'
]

userCountNestedFieldList = [
    'total_n_classifications',
    # 'project_duration_1_days',
    # 'project_duration_2_days',
    'total_n_sessions',
    # 'max_classifications_per_session',
    # 'mean_classifications_per_session',
    # 'project_duration_hours',
    # 'total_n_unique_days',
    'mean_duration_session_hours',
    # 'longest_active_session_hours',
    # 'longest_inactive_session_hours',
    'mean_duration_classification_hours'
]


class UserCountSet(views.APIView):
    def get_queryset(self):
        request_params = self.request.query_params.dict()
        request_params.pop('page_size', 0)
        request_params.pop('format', '')
        user_list_filter = {}
        for key, value in request_params.iteritems():
            if ('__in' in key):
                user_list_filter[key] = value.split(',')
            else:
                user_list_filter[key] = value
        queryset = User.objects.all().order_by('id')
        if (len(user_list_filter.keys()) > 0):
            queryset = queryset.filter(**user_list_filter)
        queryset = queryset.select_related('survey_project')
        return queryset

    def full_list(self, key, queryset, nested=False):
        if nested:
            return [user.survey_project.__getattribute__(key) for user in queryset]
        else:
            return [user.__getattribute__(key) for user in queryset]

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        ret = OrderedDict()
        ret['count'] = len(queryset)
        ret['results'] = OrderedDict()
        ret['results']['survey_project'] = OrderedDict()
        ret['results']['survey_project']['project'] = {
            'results': Counter([user.survey_project.get_project_display() for user in queryset]),
            'plot_type': 'P',
            'context': 'Home Project Classification Data',
            'number': 'survey_project.project'
        }
        for field in userCountNestedFieldList:
            ret['results']['survey_project'][field] = {
                'results': self.full_list(field, queryset, nested=True),
                'plot_type': 'H',
                'context': 'Home Project Classification Data',
                'number': 'survey_project.{0}'.format(field)
            }
        ret['results']['country'] = {
            'results': Counter([user.get_country_display() for user in queryset]),
            'plot_type': 'P',
            'context': 'All Project Classification Data',
            'number': 'country'
        }
        for field in userCountFieldList:
            ret['results'][field] = {
                'results': self.full_list(field, queryset),
                'plot_type': 'H',
                'context': 'All Project Classification Data',
                'number': field
            }
        return response.Response(ret)
