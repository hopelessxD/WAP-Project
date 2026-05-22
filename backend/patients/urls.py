from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import PatientViewSet, api_root

router = DefaultRouter()
router.register(r'patients', PatientViewSet, basename='patient')

urlpatterns = [
    path('', api_root, name='api-root'),
    path('', include(router.urls)),
]