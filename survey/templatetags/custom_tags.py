# filepath: \\mucsdv032.eu.infineon.com\csc_bs\02_public\_Jestin\SC trends\Voting format\djangotutorial\mysite\survey\templatetags\custom_tags.py
from django import template

register = template.Library()

@register.filter
def range_filter(value):
    return range(1, value + 1)