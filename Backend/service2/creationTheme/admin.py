from django.contrib import admin
from .models import Theme

class ThemeAdmin(admin.ModelAdmin):
    list_display = ['titre', 'annee_academique_id', 'valide', 'reserve']
    search_fields = ['titre', 'annee_academique_id']
    list_filter = ['valide', 'reserve']

admin.site.register(Theme, ThemeAdmin)
