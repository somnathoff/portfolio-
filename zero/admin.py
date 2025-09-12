# admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import Project, Certification

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'project_date', 'has_github', 'has_youtube', 'has_preview')
    list_filter = ('project_date',)  # Removed 'created_at' from filter
    search_fields = ('title', 'description', 'tech_stack')
        
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'tech_stack', 'project_date')
        }),
        ('Links', {
            'fields': ('github_url', 'youtube_url', 'preview_url', 'linkedin_url')
        }),
    )
        
    #def tech_preview(self, obj):
    #   tech_list = obj.tech_list()
    #   if len(tech_list) > 3:
    #       preview = ', '.join(tech_list[:3]) + f' (+{len(tech_list)-3} more)'
    #   else:
    #       preview = ', '.join(tech_list)
    #   return preview or '—'
    #tech_preview.short_description = 'Technologies'
        
    def has_github(self, obj):
        if obj.github_url:
            return format_html('<span style="color: green;">✓ Yes</span>')
        return format_html('<span style="color: red;">✗ No</span>')
    has_github.short_description = 'GitHub'
        
    def has_youtube(self, obj):
        if obj.youtube_url:
            return format_html('<span style="color: green;">✓ Yes</span>')
        return format_html('<span style="color: red;">✗ No</span>')
    has_youtube.short_description = 'YouTube'
        
    def has_preview(self, obj):
        if obj.preview_url:
            return format_html('<span style="color: green;">✓ Yes</span>')
        return format_html('<span style="color: red;">✗ No</span>')
    has_preview.short_description = 'Preview URL'

@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ('title',)
    fields = ('title', 'image_url')
        
    def get_readonly_fields(self, request, obj=None):
        return ()  # No readonly fields needed with only title and image_url