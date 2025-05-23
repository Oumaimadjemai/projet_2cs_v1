from django.db import models


# Create your models here.
class Assignment(models.Model):
    group_id = models.CharField(max_length=100,unique=True,null=True)
    theme_id = models.IntegerField(null=True)
    encadrant=models.IntegerField(null=True)
    assigned_at=models.DateTimeField(auto_now_add=True)
    assigned_by_admin_id = models.IntegerField(null=True)
    soutenance_valide=models.BooleanField(default=False)

    def __str__(self):
        return f"Group {self.group_id} -> Theme {self.theme_id}"

