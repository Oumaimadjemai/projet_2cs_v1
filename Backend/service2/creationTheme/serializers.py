
from rest_framework import serializers
from .models import Theme, ThemeSpecialite

class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = '__all__'

class ThemeSpecialiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThemeSpecialite
        fields = '__all__'
