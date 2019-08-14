from django.urls import path
from .views import ClassView

urlpatterns = [
    path('<str:dept>/<str:code>', ClassView.as_view(), name="class_all")
]