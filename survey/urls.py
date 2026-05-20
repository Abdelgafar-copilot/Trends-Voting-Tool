from django.urls import path
from . import views

urlpatterns = [
    path('export/', views.export_to_excel, name='export_to_excel'),
    path('register/', views.register_user, name='register_user'),
    path('survey/<int:user_id>/', views.survey_graph, name='survey_graph'),
    path('thank-you/', views.thank_you, name='thank_you'),
    path('reset/', views.reset_page, name='reset_page'),  # Render the reset page
    path('reset-data/', views.reset_data, name='reset_data'),  # Trigger backup and reset
]