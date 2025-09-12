# views.py
from django.shortcuts import render
from django.core.paginator import Paginator
from django.db.models import Q
from .models import Project , Certification

# Add to the top of views.py temporarily
from django.conf import settings
import logging
import os
logger = logging.getLogger(__name__)

def base(request):
    # Debug database configuration
    logger.info(f"DATABASE_URL exists: {'DATABASE_URL' in os.environ}")
    logger.info(f"Database config: {settings.DATABASES}")
    
    try:
        certifications = Certification.objects.all()
        logger.info(f"Successfully retrieved {certifications.count()} certifications")
    except Exception as e:
        logger.error(f"Database error: {e}")
        raise
        
    return render(request, 'zero/base.html', {
        'certifications': certifications
    })

def project(request):
    """
    Display all projects with optional search and pagination
    """
    # Get search query
    search_query = request.GET.get('search', '')
        
    # Base queryset - order by project_date (newest first), with nulls last
    projects = Project.objects.all().order_by('-project_date')
        
    # Apply search filter if provided
    if search_query:
        projects = projects.filter(
            Q(title__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(tech_stack__icontains=search_query)
        )
        
    context = {
        'projects': projects,
        'search_query': search_query,
    }
        
    return render(request, 'zero/project.html', context)




