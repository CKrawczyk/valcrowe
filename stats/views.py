import rest_framework_filters as filters
from rest_framework import viewsets, views
from rest_framework import renderers
from rest_framework.response import Response
from stats.models import *
from stats.serializers import *
from collections import Counter


class SurveyProjectFilter(filters.FilterSet):
    classifications = filters.AllLookupsFilter(name='total_n_classifications')
    sessions = filters.AllLookupsFilter(name='total_n_sessions')
    days = filters.AllLookupsFilter(name='total_n_unique_days')

    class Meta:
        model = SurveyProject
        fields = ['project', 'classifications', 'sessions']


class UserFilter(filters.FilterSet):
    id = filters.AllLookupsFilter(name='id')
    survey_project = filters.RelatedFilter(
        SurveyProjectFilter, name='survey_project'
    )
    talk_posts = filters.AllLookupsFilter(name='talk_posts')
    classifications = filters.AllLookupsFilter(name='total_n_classifications')
    sessions = filters.AllLookupsFilter(name='total_n_sessions')
    projects = filters.AllLookupsFilter(name='total_n_projects')

    class Meta:
        model = User
        fields = ['id', 'country', 'survey_project', 'talk_posts',
                  'classifications', 'sessions', 'projects']


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    filter_class = UserFilter
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer


class QuestionFilter(filters.FilterSet):
    number = filters.AllLookupsFilter(name='number')
    kind = filters.CharFilter(name='kind__kind')
    category = filters.CharFilter(name='category__category')

    class Meta:
        model = Question
        fields = ['number', 'kind', 'category', 'number']


class QuestionViewSet(viewsets.ReadOnlyModelViewSet):
    filter_class = QuestionFilter
    queryset = Question.objects.all().order_by('number')
    serializer_class = QuestionSerializer


class AnswerFilter(filters.FilterSet):
    question = filters.RelatedFilter(QuestionFilter, name='question')
    user = filters.RelatedFilter(UserFilter, name='user')

    class Meta:
        model = Answer
        fields = ['question', 'user']


class AnswerViewSet(viewsets.ReadOnlyModelViewSet):
    filter_class = AnswerFilter
    queryset = Answer.objects.all().order_by('question__number')
    serializer_class = AnswerSerializer


maps = {
    'GN': {
        'location': 'answerGender__answer',
        'answers': {
            'Male': 'M',
            'Female': 'F',
        },
    },
    'YN': {
        'location': 'answerBool__answer',
        'answers': {
            'false': 0,
            'true': 1,
        },
    },
    'AD': {
        'location': 'answerAD__answer',
        'answers': {
            'Perfer not to answer': 0,
            'Strongly disagree': 1,
            'Dissagree': 2,
            'Somewhat disagree': 3,
            'Neither agree or disagree': 4,
            'Somewhat agree': 5,
            'Agree': 6,
            'Strongly agree': 7,
        }
    },
    'ED': {
        'location': 'answerEdu__answer',
        'answers': {
            'Blank': 0,
            'No education': 1,
            'Primary education': 2,
            'Lower secondary education': 3,
            'Upper secondary education': 4,
            'Post secondary non-tertiary education': 5,
            'Short cycle tertiary education': 6,
            'Bachelors Degree or equivalent': 7,
            'Masters Degree or equivalent': 8,
            'Doctoral Degree or  equivalent': 9,
        }
    },
    'ET': {
        'location': 'answerEthnicity__answer',
        'answers': {
            'White/Caucasian': 'W',
            'Other': 'O',
            'South Asian': 'SA',
            'East Asian': 'EA',
            'Mixed': 'M',
            'Hispanice/Latino': 'HL',
            'Caribbean': 'C',
            'Middle Eastern': 'ME',
            'Black African': 'BA',
            'Amerindian': 'A',
        }
    },
    'QU_confidence': {
        'location': 'answerQuiz__confidence',
        'answers': {
            'Very unconfident': 1,
            'Unconfident': 2,
            'Somewhat unconfident': 3,
            'Neither confident or unconfident': 4,
            'Somewhat confident': 5,
            'Confident': 6,
            'Very confident': 7,
        },
        'reverse': {
            1: 'Very unconfident',
            2: 'Unconfident',
            3: 'Somewhat unconfident',
            4: 'Neither confident or unconfident',
            5: 'Somewhat confident',
            6: 'Confident',
            7: 'Very confident',
        }
    }
}


def cast_value(s):
    try:
        return int(s)
    except ValueError:
        pass
    try:
        return float(s)
    except ValueError:
        return s


class AnswerCountView(views.APIView):
    renderer_classes = (renderers.JSONRenderer, renderers.BrowsableAPIRenderer)

    def get(self, request, format=None):
        filter_set = request.query_params.dict()
        filter_set.setdefault('question__number', 1)
        number = filter_set['question__number']
        question = Question.objects.get(number=number)
        kind = question.kind.kind
        content = {
            'count': Answer.objects.filter(**filter_set).count(),
            'question': {
                'number': question.number,
                'kind': kind,
                'question_text': question.question_text
            },
            'results': {},
        }
        if question.category is not None:
            content['question']['category'] = question.category.get_category_display() # noqa
        if question.context is not None:
            content['question']['context'] = question.context.context
        if kind in maps.keys():
            for key, value in maps[kind]['answers'].iteritems():
                filter_set[maps[kind]['location']] = value
                content['results'][key] = Answer.objects.filter(**filter_set).count() # noqa
        elif kind == 'QU':
            ans = Answer.objects.filter(**filter_set).values('answerQuiz__score', 'answerQuiz__confidence') # noqa
            content['results']['linked'] = Counter(['{0}, {1}'.format(a['answerQuiz__score'], maps['QU_confidence']['reverse'][a['answerQuiz__confidence']]) for a in ans]) # noqa
            content['results']['scores'] = Counter([a['answerQuiz__score'] for a in ans]) # noqa
            content['results']['confidence'] = {}
            for key, value in maps['QU_confidence']['answers'].iteritems():
                filter_set[maps['QU_confidence']['location']] = value
                content['results']['confidence'][key] = Answer.objects.filter(**filter_set).count() # noqa
        else:
            # these are open ended questions
            ans = Answer.objects.filter(**filter_set).values('answerOpen__answer') # noqa
            content['results'] = Counter([cast_value(a['answerOpen__answer']) for a in ans]) # noqa
        return Response(content)


class AnswerValueView(views.APIView):
    renderer_classes = (renderers.JSONRenderer, renderers.BrowsableAPIRenderer)

    def get(self, request, format=None):
        filter_set = request.query_params.dict()
        filter_set.setdefault('question__number', 1)
        number = filter_set['question__number']
        question = Question.objects.get(number=number)
        kind = question.kind.kind
        content = {
            'count': Answer.objects.filter(**filter_set).count(),
            'question': {
                'number': question.number,
                'kind': kind,
                'question_text': question.question_text
            },
            'results': {},
        }
        if question.category is not None:
            content['question']['category'] = question.category.get_category_display() # noqa
        if question.context is not None:
            content['question']['context'] = question.context.context
        if kind in maps.keys():
            ans = Answer.objects.filter(**filter_set).values(maps[kind]['location']) # noqa
            content['results']['values'] = [a[maps[kind]['location']] for a in ans] # noqa
        elif kind == 'QU':
            ans = Answer.objects.filter(**filter_set).values('answerQuiz__score', 'answerQuiz__confidence') # noqa
            content['results']['linked'] = [[a['answerQuiz__score'], a['answerQuiz__confidence']] for a in ans] # noqa
            content['results']['scores'] = [a['answerQuiz__score'] for a in ans] # noqa
            content['results']['confidence'] = [a['answerQuiz__confidence'] for a in ans] # noqa
        else:
            # these are open ended questions
            ans = Answer.objects.filter(**filter_set).values('answerOpen__answer') # noqa
            content['results']['values'] = [cast_value(a['answerOpen__answer']) for a in ans] # noqa
        return Response(content)
