from rest_framework import serializers
from .models import Theme

class ThemeSerializer(serializers.ModelSerializer):
    date_soumission = serializers.DateField(read_only=True)
    class Meta:
        model = Theme
        fields = '__all__'


