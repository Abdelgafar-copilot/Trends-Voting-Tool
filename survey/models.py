from django.db import models

class UserInfo(models.Model):
    username = models.CharField(max_length=100)
    role_in_sc = models.CharField(max_length=100)
    years_working = models.FloatField()
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)

class UserAnswer(models.Model):
    user = models.ForeignKey(UserInfo, on_delete=models.CASCADE)
    graph_number = models.IntegerField()
    impact_value = models.FloatField()
    probability_value = models.FloatField()