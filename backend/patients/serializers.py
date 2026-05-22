from rest_framework import serializers

from .models import Patient


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = [
            'patient_id',
            'full_name',
            'age',
            'contact_number',
            'height_cm',
            'weight_kg',
            'bmi',
            'blood_group',
            'diagnosis',
            'admission_date',
            'status',
        ]
        read_only_fields = ['patient_id', 'bmi', 'admission_date']