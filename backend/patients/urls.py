from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import PatientViewSet, DoctorViewSet, DepartmentViewSet, AppointmentViewSet, api_root

# ... rest of your router setup

router = DefaultRouter()
router.register(r'patients', PatientViewSet, basename='patient')
router.register(r'doctors', DoctorViewSet, basename='doctor')
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'appointments', AppointmentViewSet, basename='appointment')

urlpatterns = [
    path('', api_root, name='api-root'),
    path('', include(router.urls)),
]