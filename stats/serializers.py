from rest_framework import serializers
from stats.models import *
from collections import OrderedDict


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


class UserSerializer(DynamicFieldsModelSerializer, serializers.ModelSerializer):  # noqa
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
        fields = [field for field in self.fields.values() if not field.write_only]  # noqa

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


class AnswerSerializer(DynamicFieldsModelSerializer, serializers.ModelSerializer):  # noqa
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
        fields = [field for field in self.fields.values() if not field.write_only]  # noqa

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
