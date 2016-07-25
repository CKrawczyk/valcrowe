from __future__ import unicode_literals

from django.db import models

# Create your models here.


class Question(models.Model):
    question_text = models.CharField(max_length=200)
    kind = models.ForeignKey(QuestionType, on_delete=models.CASCADE)
    category = models.ForeignKey(
        ADQuestionCategory,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )


class QuestionType(models.Model):
    choices = (
        ('OP', 'Open'),
        ('QU', 'Quiz'),
        ('YN', 'Yes/No'),
        ('AD', 'Agree/Dissagree'),
        ('GN', 'Gender'),
        ('ET', 'Ethnicity'),
        ('ED', 'Education level'),
    )
    kind = models.CharField(choices=choices, max_length=2)


class ADQuestionCategory(models.Model):
    choices = (
        ('PE', 'Protective and Enhancement'),
        ('Va', 'Values'),
        ('Ca', 'Career'),
        ('Un', 'Understanding'),
        ('RC', 'Relative Contribution'),
        ('So', 'Social'),
        ('Co', 'Competitiveness'),
        ('WL', 'Work or Leisure'),
        ('SC', 'Social Capital'),
    )
    category = models.CharField(choices=choices, max_length=2)


class AnswerOpen(models.Model):
    question = model.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.CharField(max_length=200)
    answerID = models.OneToOneField(
        Answer,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='answer'
    )


class AnswerQuiz(models.Model):
    question = model.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.PositiveSmallIntegerField()
    answerID = models.OneToOneField(
        Answer,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='answer'
    )


class AnswerBool(models.Model):
    question = model.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.BooleanField()
    answerID = models.OneToOneField(
        Answer,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='answer'
    )


class AnswerAgree(models.Model):
    question = model.ForeignKey(Question, on_delete=models.CASCADE)
    choices = (
        (0, 'Perfer not to answer'),
        (1, 'Strongly disagree'),
        (2, 'Dissagree'),
        (3, 'Somewhat disagree'),
        (4, 'Neither agree or disagree'),
        (5, 'Somewhat agree'),
        (6, 'Agree'),
        (7, 'Strongly agree'),
    )
    answer = models.PositiveSmallIntegerField(choices=choices)
    answerID = models.OneToOneField(
        Answer,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='answer'
    )


class AnswerEthnicity(models.Model):
    choices = (
        ('W', 'White/Caucasian'),
        ('O', 'Other'),
        ('SA', 'South Asian'),
        ('EA', 'East Asian'),
        ('M', 'Mixed'),
        ('HL', 'Hispanice/Latino'),
        ('C', 'Caribbean'),
        ('ME', 'Middle Eastern'),
        ('BA', 'Black African'),
        ('A', 'Amerindian'),
    )
    answer = models.CharField(choices=choices, max_length=2)
    specify = model.CharField(max_length=200, blank=True, null=True)
    answerID = models.OneToOneField(
        Answer,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='answer'
    )


class AnswerGender(models.Model):
    choices = (
        ('M', 'Male'),
        ('F', 'Female'),
    )
    answer = models.CharField(choices=choices, max_length=1)
    answerID = models.OneToOneField(
        Answer,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='answer'
    )


class AnswerEducationLevel(models.Model):
    choices = (
        (1, 'No education'),
        (2, 'Primary education'),
        (3, 'Lower secondary education'),
        (4, 'Upper secondary education'),
        (5, 'Post secondary non-tertiary education'),
        (6, 'Short cycle tertiary education'),
        (7, 'Bachelors Degree or equivalent'),
        (8, 'Masters Degree or equivalent'),
        (9, 'Doctoral Degree or  equivalent'),
    )
    answer = models.PositiveSmallIntegerField(choices=choices)
    answerID = models.OneToOneField(
        Answer,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='answer'
    )


class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Projects(models.Model):
    choices = (
        (0, 'cancer_cells'),
        (1, 'moon_zoo'),
        (2, 'chimp'),
        (3, 'worms'),
        (4, 'galaxy_zoo_starburst'),
        (5, 'serengeti'),
        (6, 'radio'),
        (7, 'm83'),
        (8, 'wisconsin'),
        (9, 'illustratedlife'),
        (10, 'milky_way'),
        (11, 'higgs_hunter'),
        (12, 'solarstormwatch'),
        (13, 'chicago'),
        (14, 'whales'),
        (15, 'condor'),
        (16, 'planet_hunter'),
        (17, 'crater'),
        (18, 'asteroid'),
        (19, 'kelp'),
        (20, 'spacewarp'),
        (21, 'oldweather'),
        (22, 'andromeda'),
        (23, 'cyclone_center'),
        (24, 'sea_floor'),
        (25, 'sunspot'),
        (26, 'notes_from_nature'),
        (27, 'leaf'),
        (28, 'planet_four'),
        (29, 'orchid'),
        (30, 'penguin'),
        (31, 'war_diary'),
        (32, 'wise'),
        (33, 'galaxy_zoo'),
        (34, 'ancient_lives'),
        (35, 'plankton'),
        (36, 'bat_detective'),
    )
    project = models.PositiveSmallIntegerField(choices=choices)
    classifications = model.PositiveSmallIntegerField()
    home_project = models.BooleanField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class User(models.Model):
    talk_posts = models.PositiveSmallIntegerField()
    duration_first_last_talk_days = models.PositiveSmallIntegerField()
    total_n_classifications = models.PositiveSmallIntegerField()
    total_n_sessions = models.PositiveSmallIntegerField()
    total_n_projects = models.PositiveSmallIntegerField()
    total_unique_days = models.PositiveSmallIntegerField()
    first_classification = models.DateField()
    last_classification = models.DateField()
    duration_first_last_talk_hours = models.FloatField()
    duration_first_last_classification_hours = models.FloatField()
    min_classifications_per_session = models.PositiveSmallIntegerField()
    max_classifications_per_session = models.PositiveSmallIntegerField()
    median_classifications_per_session = models.FloatField()
    mean_classifications_per_session = models.FloatField()
    mean_duration_classification_hours = models.FloatField()
    median_duration_classification_hours = models.FloatField()
    mean_duration_session_hours = models.FloatField()
    median_duration_session_hours = models.FloatField()
    min_duration_session_hours = models.FloatField()
    max_duration_session_hours = models.FloatField()
    mean_duration_session_first2_hours = models.FloatField()
    mean_duration_session_last2_hours = models.FloatField()
    mean_duration_classification_first2_hours = models.FloatField()
    mean_duration_classification_last2_hours = models.FloatField()
    min_number_projects_per_session = models.PositiveSmallIntegerField()
    max_number_projects_per_session = models.PositiveSmallIntegerField()
    median_number_projects_per_session = models.PositiveSmallIntegerField()
    mean_number_projects_per_session = models.FloatField()
    country_choices = (
        ('US', 'United States'),
        ('UK', 'United Kingdom'),
        ('Ca', 'Canada'),
        ('Au', 'Australia'),
        ('Ge', 'Germany'),
        ('Fr', 'France'),
        ('Ne', 'Netherlands'),
        ('Po', 'Poland'),
        ('In', 'Internatinal'),
    )
    country = models.CharField(choices=country_choices, max_length=2)


class SurveyProject(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='survey_project'
    )
    choices = (
        ('GZ', 'Galaxy Zoo'),
        ('PH', 'Planet Hunter'),
        ('PW', 'Penguin Watch'),
        ('SE', 'Seafloor Explorer'),
        ('SS', 'Snapshot Serengeti'),
    )
    project = models.CharField(choices=choices, max_length=2)
    total_n_classifications = models.PositiveSmallIntegerField()
    project_duration_1_days = models.FloatField()
    project_duration_2_days = models.FloatField()
    total_n_sessions = models.PositiveSmallIntegerField()
    max_classifications_per_session = models.PositiveSmallIntegerField()
    mean_classifications_per_session = models.FloatField()
    project_duration_hours = models.FloatField()
    total_n_unique_days = models.PositiveSmallIntegerField()
    mean_duration_session_hours = models.FloatField()
    longest_active_session_hours = models.FloatField()
    longest_inactive_session_hours = models.FloatField()
    mean_duration_classification_hours = models.FloatField()
