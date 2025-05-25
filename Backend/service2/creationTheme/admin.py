from django.contrib import admin
from .models import Theme

class ThemeAdmin(admin.ModelAdmin):
    list_display = ['titre', 'valide', 'reserve']
    search_fields = ['titre']
    list_filter = ['valide', 'reserve']

admin.site.register(Theme, ThemeAdmin)
