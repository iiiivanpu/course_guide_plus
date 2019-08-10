from rest_framework import serializers
from .models import Courses

class ClassSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Courses
        fields = ['code', 'name', 'term', 'lsa_url', 'description', 'credit', 'id', 'section', 'instructor_name', 'instructor_score', 'instructor_url', 'en_prereq', 'ad_prereq', 'status', 'seats', 'restricted_seat', 'seats', 'waitlist', 'time', 'location']

    
