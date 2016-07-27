from django.core.management.base import BaseCommand
from stats.models import *
from openpyxl import load_workbook
from ._private import *

# wb = load_workbook(filename='ORIGINAL DATA IDS ETHNICITY.xlsx')
# ws = wb['All']


class Command(BaseCommand):
    def populateStatic(self):
        QTList = ['OP', 'QU', 'YN', 'AD', 'GN', 'ET', 'ED']
        ADList = ['PE', 'Va', 'Ca', 'Un', 'RC', 'So', 'Co', 'WL', 'SC']
        self.QT = {}
        self.AD = {}
        self.questions = {}

        for i in QTList:
            qt = QuestionType.objects.filter(kind__exact=i)
            if len(qt):
                qt = qt[0]
            else:
                qt = QuestionType(kind=i)
                qt.save()
            self.QT[i] = qt

        for j in ADList:
            ad = ADQuestionCategory.objects.filter(category__exact=j)
            if len(ad):
                ad = ad[0]
            else:
                ad = ADQuestionCategory(category=j)
                ad.save()
            self.AD[j] = ad

        for qdx, q in enumerate(questionsList):
            number = qdx + 1
            question = Question.objects.filter(number__exact=number)
            if len(question):
                question = question[0]
            else:
                kwargs = {
                    'number': number,
                    'question_text': q['text'],
                    'kind': self.QT[q['kind']],
                }
                if q['context'] is not None:
                    context = ADQuestionContext.objects.filter(
                        context__exact=q['context']
                    )
                    if len(context):
                        kwargs['context'] = context[0]
                    else:
                        qc = ADQuestionContext(
                            context=q['context']
                        )
                        qc.save()
                        kwargs['context'] = qc
                if q['category'] is not None:
                    kwargs['category'] = self.AD[q['category']]
                question = Question(**kwargs)
                question.save()
            self.questions[number] = question

    def handle(self, *args, **options):
        self.populateStatic()
