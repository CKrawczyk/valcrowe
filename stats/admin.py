from django.contrib import admin

from .models import *

# Register your models here.

admin.site.register(User)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(QuestionType)
admin.site.register(ADQuestionCategory)
admin.site.register(ADQuestionContext)
