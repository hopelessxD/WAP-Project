from decimal import Decimal, ROUND_HALF_UP

from django.db import models


class Patient(models.Model):
	BLOOD_GROUP_CHOICES = [
		('A+', 'A+'),
		('A-', 'A-'),
		('B+', 'B+'),
		('B-', 'B-'),
		('O+', 'O+'),
		('O-', 'O-'),
		('AB+', 'AB+'),
		('AB-', 'AB-'),
	]

	STATUS_CHOICES = [
		('Admitted', 'Admitted'),
		('Discharged', 'Discharged'),
		('Under Observation', 'Under Observation'),
	]

	patient_id = models.BigAutoField(primary_key=True)
	full_name = models.CharField(max_length=150)
	age = models.PositiveIntegerField()
	contact_number = models.CharField(max_length=15)
	height_cm = models.DecimalField(max_digits=5, decimal_places=2)
	weight_kg = models.DecimalField(max_digits=5, decimal_places=2)
	bmi = models.DecimalField(max_digits=5, decimal_places=2, editable=False, null=True, blank=True)
	blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES)
	diagnosis = models.TextField()
	admission_date = models.DateField(auto_now_add=True)
	status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Admitted')

	def save(self, *args, **kwargs):
		if self.height_cm and self.weight_kg:
			height_m = Decimal(self.height_cm) / Decimal('100')
			bmi_value = self.weight_kg / (height_m * height_m)
			self.bmi = bmi_value.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
		super().save(*args, **kwargs)

	def __str__(self):
		return f'{self.patient_id} - {self.full_name}'
