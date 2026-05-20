# filepath: \\mucsdv032.eu.infineon.com\csc_bs\02_public\_Jestin\SC trends\Voting format\djangotutorial\mysite\survey\forms.py
from django import forms
from .models import UserInfo

class UserInfoForm(forms.ModelForm):
    class Meta:
        model = UserInfo
        fields = ['username', 'role_in_sc', 'years_working']
        widgets = {
            'years_working': forms.NumberInput(attrs={'step': '0.1'}),  # Allows float input
        }
        labels = {
            'username': 'Name',  # Change this text
            'role_in_sc': 'Role in Supply Chain',  # Change this text
            'years_working': 'Years of Working',  # Change this text
        }