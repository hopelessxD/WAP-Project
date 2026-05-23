from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets
from .models import Patient, Doctor, Department, Appointment
from .serializers import PatientSerializer, DoctorSerializer, DepartmentSerializer, AppointmentSerializer

@api_view(['GET'])
def api_root(request):
    return Response({
        'message': 'Hospital Management System API',
        'patients': '/api/patients/',
        'doctors': '/api/doctors/',
        'departments': '/api/departments/',
        'appointments': '/api/appointments/',
    })

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all().order_by('-patient_id')
    serializer_class = PatientSerializer

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer