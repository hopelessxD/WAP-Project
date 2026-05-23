from rest_framework import serializers
from .models import Patient, Doctor, Department, Appointment

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'
        read_only_fields = ['patient_id', 'bmi', 'admission_date']

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'

# backend/serializers.py
class AppointmentSerializer(serializers.ModelSerializer):
    # Map the model fields to the names you want to use in the API
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.full_name', read_only=True)

    class Meta:
        model = Appointment
        # Use the actual field names from your model here
        fields = ['id', 'day', 'start_time', 'patient_name', 'doctor_name']