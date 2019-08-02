"""course_guide_api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from api.models import Courses
from rest_framework import routers, serializers, viewsets

class ClassSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Courses
        fields = ['code', 'name', 'term', 'lsa_url', 'description', 'credit', 'id', 'section', 'instructor_name', 'instructor_score', 'instructor_url', 'en_prereq', 'ad_prereq', 'status', 'seats', 'restricted_seats', 'seats', 'waitlist', 'time', 'location']


class ClassViewSet(viewsets.ModelViewSet):
    queryset = Courses.objects.all()
    serializer_class = ClassSerializer

router = routers.DefaultRouter()
router.register(r'classes', ClassViewSet)



urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth', include('rest_framework.urls'))
]
