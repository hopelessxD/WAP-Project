from django.contrib import admin

from .models import Patient


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
	list_display = ('patient_id', 'full_name', 'age', 'blood_group', 'status', 'admission_date')
	search_fields = ('full_name', 'contact_number', 'diagnosis')
	list_filter = ('blood_group', 'status', 'admission_date')
