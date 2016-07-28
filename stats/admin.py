from django.contrib import admin

from .models import *

# Register your models here.

admin.site.register(QuestionType)
admin.site.register(ADQuestionCategory)
admin.site.register(ADQuestionContext)
admin.site.register(Question)
admin.site.register(User)
admin.site.register(Answer)
admin.site.register(AnswerOpen)
admin.site.register(AnswerQuiz)
admin.site.register(AnswerBool)
admin.site.register(AnswerAgree)
admin.site.register(AnswerEthnicity)
admin.site.register(AnswerGender)
admin.site.register(AnswerEducationLevel)
admin.site.register(Projects)
admin.site.register(SurveyProject)
