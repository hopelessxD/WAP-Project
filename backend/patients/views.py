from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Patient
from .serializers import PatientSerializer


@api_view(['GET'])
def api_root(request):
    return Response({
        'message': 'Hospital Management System API',
        'patients': '/api/patients/',
    })


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all().order_by('-patient_id')
    serializer_class = PatientSerializer
