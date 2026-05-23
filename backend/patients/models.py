from decimal import Decimal, ROUND_HALF_UP
from django.db import models

class Department(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name

class Doctor(models.Model):
    full_name = models.CharField(max_length=150)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    contact_number = models.CharField(max_length=15)

    def __str__(self):
        return f'Dr. {self.full_name}'

class Patient(models.Model):
    # ... (Your existing Patient model fields remain the same)
    BLOOD_GROUP_CHOICES = [('A+', 'A+'), ('A-', 'A-'), ('B+', 'B+'), ('B-', 'B-'), 
                           ('O+', 'O+'), ('O-', 'O-'), ('AB+', 'AB+'), ('AB-', 'AB-')]
    STATUS_CHOICES = [('Admitted', 'Admitted'), ('Discharged', 'Discharged'), ('Under Observation', 'Under Observation')]

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

class Appointment(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, null=True, blank=True)
    day = models.DateField()
    start_time = models.TimeField()

    def __str__(self):
        return f'{self.doctor} - {self.day} at {self.start_time}'