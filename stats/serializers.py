from rest_framework import serializers
from stats.models import *
from collections import OrderedDict, Counter
import json
import stats
static_path = stats.__path__[0]+'/static/'
with open(static_path+'city_location.json', 'r') as f:
    map_locations = json.load(f)


def cast_value(s):
    if (type(s) != unicode):
        return s
    try:
        return int(s)
    except ValueError:
        pass
    try:
        return float(s)
    except ValueError:
        return s


class SurveyProjectSerializer(serializers.ModelSerializer):
    project = serializers.CharField(source='get_project_display')

    class Meta:
        model = SurveyProject
        fields = (
            'project',
            'total_n_classifications',
            'project_duration_1_days',
            'project_duration_2_days',
            'total_n_sessions',
            'max_classifications_per_session',
            'mean_classifications_per_session',
            'project_duration_hours',
            'total_n_unique_days',
            'mean_duration_session_hours',
            'longest_active_session_hours',
            'longest_inactive_session_hours',
            'mean_duration_classification_hours'
        )


class QuestionCategoryField(serializers.RelatedField):
    def to_representation(self, value):
        return '{0}'.format(value.get_category_display())


class QuestionTypeField(serializers.RelatedField):
    def to_representation(self, value):
        return '{0}'.format(value.get_kind_display())


class QuestionContextField(serializers.RelatedField):
    def to_representation(self, value):
        return '{0}'.format(value.context)


class QuestionSerializer(serializers.ModelSerializer):
    category = QuestionCategoryField(read_only=True)
    kind = QuestionTypeField(read_only=True)
    context = QuestionContextField(read_only=True)

    class Meta:
        model = Question

    def to_representation(self, instance):
        ret = OrderedDict()
        fields = self._readable_fields
        for field in fields:
            try:
                attribute = field.get_attribute(instance)
            except SkipField:
                continue
            if attribute is not None:
                ret[field.field_name] = field.to_representation(attribute)
        return ret


class AnswerEthnicitySerializer(serializers.ModelSerializer):
    answer = serializers.CharField(source='get_answer_display')

    class Meta:
        model = AnswerEthnicity
        fields = ('answer', 'specify')


class AnswerQuizSerializer(serializers.ModelSerializer):
    # confidence = serializers.CharField(source='get_confidence_display')

    class Meta:
        model = AnswerQuiz
        fields = ('score', 'percent', 'maxScore', 'confidence')


class AnswerField(serializers.RelatedField):
    def to_representation(self, value):
        try:
            return '{0}'.format(value.get_answer_display())
        except AttributeError:
            return value.answer


class AnswerSerializer(serializers.ModelSerializer):
    answerOpen = AnswerField(read_only=True)
    answerBool = AnswerField(read_only=True)
    answerAD = AnswerField(read_only=True)
    answerGender = AnswerField(read_only=True)
    answerEdu = AnswerField(read_only=True)
    answerEthnicity = AnswerEthnicitySerializer()
    answerQuiz = AnswerQuizSerializer()

    class Meta:
        model = Answer
        fields = ('answerOpen', 'answerBool', 'answerAD', 'answerGender', 'answerEdu', 'answerEthnicity', 'answerQuiz', 'question')

    def to_representation(self, instance):
        ret = OrderedDict()
        fields = self._readable_fields
        for field in fields:
            try:
                attribute = field.get_attribute(instance)
            except SkipField:
                continue
            if attribute is not None:
                represenation = field.to_representation(attribute)
                if 'answer' in field.field_name:
                    ret['answer'] = represenation
                else:
                    ret[field.field_name] = represenation
        return ret


answer_lut = {
    'OP': 'answerOpen',
    'QU': 'answerQuiz',
    'YN': 'answerBool',
    'AD': 'answerAD',
    'GN': 'answerGender',
    'ET': 'answerEthnicity',
    'ED': 'answerEdu'
}


class QuestionCountSerializer(serializers.ModelSerializer):
    category = QuestionCategoryField(read_only=True)
    kind = QuestionTypeField(read_only=True)
    context = QuestionContextField(read_only=True)

    class Meta:
        model = Question

    def to_representation(self, instance):
        ret = OrderedDict()
        fields = self._readable_fields
        for field in fields:
            try:
                attribute = field.get_attribute(instance)
            except SkipField:
                continue
            if attribute is not None:
                if field.field_name != 'answer_set':
                    ret[field.field_name] = field.to_representation(attribute)
        answer_set = instance.answer_set.all()
        ret['count'] = len(answer_set)
        plot_type = instance.plot_type
        if plot_type == 'P':
            try:
                ret['results'] = Counter([ans.__getattribute__(answer_lut[instance.kind.kind]).get_answer_display() for ans in answer_set])
            except AttributeError:
                ret['results'] = Counter([ans.__getattribute__(answer_lut[instance.kind.kind]).answer for ans in answer_set])
        elif plot_type == 'H':
            ret['results'] = [cast_value(ans.__getattribute__(answer_lut[instance.kind.kind]).answer) for ans in answer_set]
        elif plot_type == 'Q':
            confidence = [ans.__getattribute__(answer_lut[instance.kind.kind]).confidence for ans in answer_set]
            score = [ans.__getattribute__(answer_lut[instance.kind.kind]).score for ans in answer_set]
            ret['results'] = {
                'confidence': confidence,
                'scores': score,
                'confidence_map': {
                    1: 'Very unconfident',
                    2: 'Unconfident',
                    3: 'Somewhat unconfident',
                    4: 'Neither confident or unconfident',
                    5: 'Somewhat confident',
                    6: 'Confident',
                    7: 'Very confident',
                },
                'count': Counter(['{0}, {1}'.format(ans[0], ans[1]) for ans in zip(score, confidence)]),
            }
        else:
            lat_all = []
            lon_all = []
            city_all = []
            for ans in answer_set:
                city = ans.__getattribute__(answer_lut[instance.kind.kind]).answer.lower()
                if city in map_locations:
                    geo = map_locations[city]
                    lat_all.append(geo['lat'])
                    lon_all.append(geo['lng'])
                    city_all.append(city)
            c = Counter(zip(lat_all, lon_all, city_all))
            lat = []
            lon = []
            city = []
            count = []
            for key, value in c.iteritems():
                lat.append(key[0])
                lon.append(key[1])
                city.append(key[2])
                count.append(value)
            ret['results'] = {
                'lat': lat,
                'lon': lon,
                'city': city,
                'count': count,
            }
        return ret


class UserSerializer(serializers.ModelSerializer):
    survey_project = SurveyProjectSerializer()
    answer_list = AnswerSerializer(many=True)
    country = serializers.CharField(source='get_country_display')

    class Meta:
        model = User

    def to_representation(self, instance):
        ret = OrderedDict()
        fields = self._readable_fields
        for field in fields:
            try:
                attribute = field.get_attribute(instance)
            except SkipField:
                continue
            check_for_none = attribute
            if check_for_none is None:
                ret[field.field_name] = None
            else:
                ret[field.field_name] = field.to_representation(attribute)
        project_list = instance.project_list.all()
        ret['projects'] = [project.get_project_display() for project in project_list]
        ret['projects_classification_count'] = [project.classifications for project in project_list]
        ret['home_project'] = [project.get_project_display() for project in project_list if project.home_project]
        answer_list = ret.pop('answer_list')
        answer_dict = OrderedDict(('question_{0}'.format(answer['question']), cast_value(answer['answer'])) for answer in answer_list)
        ret.update(answer_dict)
        return ret
