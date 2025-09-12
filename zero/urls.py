# urls.py (in your app)
from django.urls import path
from . import views

urlpatterns = [
    path('', views.base, name='base'),
    path('project/', views.project, name='project'),
]

# Make sure your main project urls.py includes this app's URLs