# models.py
from django.db import models
import re
from django.utils import timezone

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
        
    # Project date field (e.g., completion date or project date)
    project_date = models.DateField(
        blank=True,
        null=True,
        help_text="Date when the project was completed or the main project date"
    )
        
    # Tech stack
    tech_stack = models.CharField(
        max_length=500,
        help_text="Comma-separated list of technologies (e.g., React, Node.js, MongoDB)"
    )
        
    # GitHub URL
    github_url = models.URLField(
        blank=True,
        null=True,
        help_text="GitHub repository URL"
    )
        
    # YouTube URL
    youtube_url = models.URLField(
        blank=True,
        null=True,
        help_text="YouTube video URL (will be embedded)"
    )
        
    # Preview URL - Generic field for any preview link
    preview_url = models.URLField(
        blank=True,
        null=True,
        help_text="Preview URL for the project (live demo, portfolio page, etc.)"
    )
        
    # LinkedIn URL
    linkedin_url = models.URLField(
        blank=True,
        null=True,
        help_text="LinkedIn project/article URL"
    )

    def tech_list(self):
        """Return list of technologies from comma-separated string"""
        return [tech.strip() for tech in self.tech_stack.split(',') if tech.strip()]

    def youtube_embed_url(self):
        """
        Convert standard YouTube URL to embeddable format
        Handles multiple YouTube URL formats with better error handling
        """
        if not self.youtube_url:
            return None
                    
        # Regular expression to extract YouTube video ID
        patterns = [
            r'(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})',
            r'(?:v=)([a-zA-Z0-9_-]{11})',
            r'(?:be\/)([a-zA-Z0-9_-]{11})',
            r'(?:embed\/)([a-zA-Z0-9_-]{11})'
        ]
                
        video_id = None
        for pattern in patterns:
            match = re.search(pattern, self.youtube_url)
            if match:
                video_id = match.group(1)
                break
                
        if video_id:
            # Use nocookie domain for better privacy and compatibility
            return f"https://www.youtube-nocookie.com/embed/{video_id}"
        return None

    def youtube_id(self):
        """Extract YouTube video ID for thumbnail purposes"""
        if not self.youtube_url:
            return None
                    
        patterns = [
            r'(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})',
            r'(?:v=)([a-zA-Z0-9_-]{11})',
            r'(?:be\/)([a-zA-Z0-9_-]{11})',
            r'(?:embed\/)([a-zA-Z0-9_-]{11})'
        ]
                
        for pattern in patterns:
            match = re.search(pattern, self.youtube_url)
            if match:
                return match.group(1)
        return None

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Project"
        verbose_name_plural = "Projects"
        ordering = ['-project_date']  # Changed from '-created_at' to '-project_date'

class Certification(models.Model):
    title = models.CharField(max_length=200)
    image_url = models.URLField(
        blank=True, 
        null=True,
        help_text="External image URL for certification"
    )
        
    def __str__(self):
        return self.title