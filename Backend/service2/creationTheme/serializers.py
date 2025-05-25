from rest_framework import serializers
from .models import Theme

class ThemeSerializer(serializers.ModelSerializer):
    date_soumission = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Theme
        fields = '__all__'
        read_only_fields = ['date_soumission']

    def get_date_soumission(self, obj):
        return obj.date_soumission.isoformat()
