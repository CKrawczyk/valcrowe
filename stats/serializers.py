from rest_framework import serializers
from stats.models import *
from collections import OrderedDict, Counter
from answer_lookup import answer_lookup, cast_value


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    '''
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    '''

    def __init__(self, *args, **kwargs):
        super(DynamicFieldsModelSerializer, self).__init__(*args, **kwargs)
        if not self.context:
            return
        fields = self.context['request'].query_params.get('fields')
        if fields:
            fields = fields.split(',')
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields.keys())
            not_to_display = existing - allowed

            if not_to_display != existing:
                for field_name in not_to_display:
                    self.fields.pop(field_name)


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


class ProjectSerializer(serializers.ModelSerializer):
    project = serializers.CharField(source='get_project_display')

    class Meta:
        model = Projects()
        fields = ('project', 'classifications', 'home_project')


class UserSerializer(DynamicFieldsModelSerializer, serializers.ModelSerializer):
    survey_project = SurveyProjectSerializer()
    project_list = ProjectSerializer(many=True)
    country = serializers.CharField(source='get_country_display')

    class Meta:
        model = User


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
        """
        Object instance -> Dict of primitive datatypes.
        """
        ret = OrderedDict()
        fields = [field for field in self.fields.values() if not field.write_only]

        for field in fields:
            try:
                attribute = field.get_attribute(instance)
            except SkipField:
                continue

            if attribute is not None:
                represenation = field.to_representation(attribute)
                if represenation is None:
                    # Do not seralize empty objects
                    continue
                if isinstance(represenation, list) and not represenation:
                    # Do not serialize empty lists
                    continue
                ret[field.field_name] = represenation

        return ret


class QuestionCountSerializer(serializers.ModelSerializer):
    category = QuestionCategoryField(read_only=True)
    kind = QuestionTypeField(read_only=True)
    context = QuestionContextField(read_only=True)

    class Meta:
        model = Question

    def to_representation(self, instance):
        ret = OrderedDict()
        fields = [field for field in self.fields.values() if not field.write_only]

        for field in fields:
            try:
                attribute = field.get_attribute(instance)
            except SkipField:
                continue

            if attribute is not None:
                represenation = field.to_representation(attribute)
                if represenation is None:
                    # Do not seralize empty objects
                    continue
                if isinstance(represenation, list) and not represenation:
                    # Do not serialize empty lists
                    continue
                ret[field.field_name] = represenation
        # add answer counts
        request_params = self.context['request'].query_params.dict()
        filter_set = {
            'question__number': instance.number
        }
        for key, value in request_params.iteritems():
            if key not in self.fields.keys():
                filter_set[key] = value
        kind = instance.kind.kind
        lookup = answer_lookup[kind]
        ans = Answer.objects.filter(**filter_set)
        ret['count'] = ans.count()
        if kind == 'QU':
            val = ans.values(lookup['location_score'], lookup['location_confidence'])
            ret['results'] = {
                'confidence': Counter([lookup['answers'][a[lookup['location_confidence']]] for a in val]),
                'scores': Counter([a[lookup['location_score']] for a in val]),
                'linked': Counter(['{0}, {1}'.format(a[lookup['location_score']], lookup['answers'][a[lookup['location_confidence']]]) for a in val])
            }
        elif kind == 'OP':
            val = ans.values(lookup['location'])
            ret['results'] = Counter([a[lookup['location']] for a in val])
        else:
            val = ans.values(lookup['location'])
            ret['results'] = Counter([lookup['answers'][a[lookup['location']]] for a in val])
        return ret


class QuestionValueSerializer(serializers.ModelSerializer):
    category = QuestionCategoryField(read_only=True)
    kind = QuestionTypeField(read_only=True)
    context = QuestionContextField(read_only=True)

    class Meta:
        model = Question

    def to_representation(self, instance):
        ret = OrderedDict()
        fields = [field for field in self.fields.values() if not field.write_only]

        for field in fields:
            try:
                attribute = field.get_attribute(instance)
            except SkipField:
                continue

            if attribute is not None:
                represenation = field.to_representation(attribute)
                if represenation is None:
                    # Do not seralize empty objects
                    continue
                if isinstance(represenation, list) and not represenation:
                    # Do not serialize empty lists
                    continue
                ret[field.field_name] = represenation
        # add answer values
        request_params = self.context['request'].query_params.dict()
        filter_set = {
            'question__number': instance.number
        }
        for key, value in request_params.iteritems():
            if key not in self.fields.keys():
                filter_set[key] = value
        kind = instance.kind.kind
        lookup = answer_lookup[kind]
        ans = Answer.objects.filter(**filter_set)
        ret['count'] = ans.count()
        if kind == 'QU':
            val = ans.values(lookup['location_score'], lookup['location_confidence'])
            ret['results'] = {
                'confidence': [lookup['answers'][a[lookup['location_confidence']]] for a in val],
                'scores': [a[lookup['location_score']] for a in val],
                'linked': [[a[lookup['location_score']], lookup['answers'][a[lookup['location_confidence']]]] for a in val]
            }
        elif kind == 'OP':
            val = ans.values(lookup['location'])
            ret['results'] = [cast_value(a[lookup['location']]) for a in val]
        else:
            val = ans.values(lookup['location'])
            ret['results'] = [lookup['answers'][a[lookup['location']]] for a in val]
        return ret


class AnswerEthnicitySerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerEthnicity
        fields = ('answer', 'specify')


class AnswerQuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerQuiz
        fields = ('score', 'percent', 'maxScore', 'confidence')


class AnswerField(serializers.RelatedField):
    def to_representation(self, value):
        return value.answer


class AnswerSerializer(DynamicFieldsModelSerializer, serializers.ModelSerializer):
    answerOpen = AnswerField(read_only=True)
    answerBool = AnswerField(read_only=True)
    answerAD = AnswerField(read_only=True)
    answerGender = AnswerField(read_only=True)
    answerEdu = AnswerField(read_only=True)
    answerEthnicity = AnswerEthnicitySerializer()
    answerQuiz = AnswerQuizSerializer()
    question = QuestionSerializer()

    class Meta:
        model = Answer

    def to_representation(self, instance):
        """
        Object instance -> Dict of primitive datatypes.
        """
        answerTypeList = [
            'answerOpen',
            'answerBool',
            'answerAD',
            'answerGender',
            'answerEdu',
            'answerEthnicity',
            'answerQuiz',
        ]
        ret = OrderedDict()
        fields = [field for field in self.fields.values() if not field.write_only]

        for field in fields:
            try:
                attribute = field.get_attribute(instance)
            except SkipField:
                continue

            if attribute is not None:
                represenation = field.to_representation(attribute)
                if represenation is None:
                    # Do not seralize empty objects
                    continue
                if isinstance(represenation, list) and not represenation:
                    # Do not serialize empty lists
                    continue
                if field.field_name in answerTypeList:
                    ret['answer'] = represenation
                else:
                    ret[field.field_name] = represenation

        return ret
