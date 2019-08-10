from django.shortcuts import render
from rest_framework import generics
from .models import Courses
from .serializers import ClassSerializer
# Create your views here.

class ClassView(generics.ListAPIView):
    
    serializer_class = ClassSerializer
    def get_queryset(self):
        course_code = " ".join([self.kwargs['dept'], self.kwargs['code']])
        print(course_code)
        # queryset = Courses.objects.filter(code='THTREMUS 261')
        queryset = Courses.objects.filter(code=course_code)
        return queryset


