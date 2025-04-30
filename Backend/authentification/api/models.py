from django.db import models
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager,PermissionsMixin,Group,Permission
from cloudinary.models import CloudinaryField
# Create your models here.

from django.contrib.auth.models import BaseUserManager
#parametres
class Departement(models.Model):
    title = models.CharField(max_length=50,null=True)
    def __str__(self):
        return self.title

class Annee(models.Model):
    departement = models.ForeignKey(Departement,on_delete=models.CASCADE,null=True)
    title = models.CharField(max_length=50)
    has_specialite = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.title} {self.departement.title}"
    
class Specialite(models.Model):
    #annee = models.ForeignKey(Annee,on_delete=models.CASCADE,null=True)
    title = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.title}"

class Salle(models.Model):
    departement = models.ForeignKey(Departement, on_delete=models.CASCADE, null=True)
    type = models.CharField(max_length=50)
    num = models.IntegerField()
    disponible = models.BooleanField(default=True)
    nom_salle = models.CharField(max_length=100, null=True, blank=True)  # Nouveau champ

    def __str__(self):
        return f"Salle {self.num} {self.type}"


class CustomUserManager(BaseUserManager):
    def create_user(self, email, nom, prenom, password=None, **extra_fields):
        if not email:
            raise ValueError("L'email est obligatoire")
        email = self.normalize_email(email)
        extra_fields.setdefault("is_active", True)  # Active par défaut

        user = self.model(email=email, nom=nom, prenom=prenom, **extra_fields)
        if password:
            user.set_password(password)  # Hachage du mot de passe
        user.save(using=self._db)
        if user.id is None:  # Vérifier s'il a bien été créé
            raise ValueError("L'utilisateur n'a pas été correctement sauvegardé.")
        return user

    def create_superuser(self, email, nom, prenom, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser doit avoir is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser doit avoir is_superuser=True.")

        return self.create_user(email=email, nom=nom, prenom=prenom, password=password, **extra_fields)


# Modèle utilisateur de base
class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    nom = models.CharField(max_length=20)
    prenom = models.CharField(max_length=20)
    photo_profil = CloudinaryField('image', blank=True, null=True)
    password = models.CharField(max_length=128)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Seuls les Admins auront True
    is_superuser = models.BooleanField(default=False)  # Seuls les Admins auront True

    groups = models.ManyToManyField(Group, related_name="custom_user_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="custom_user_permissions", blank=True)
    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['nom', 'prenom']

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        """Vérifie si l'utilisateur a une permission spécifique"""
        return self.is_superuser  # Seul l'Admin aura toutes les permissions

    def has_module_perms(self, app_label):
        """Vérifie si l'utilisateur peut voir une application spécifique"""
        return self.is_superuser  # Seul l'Admin peut voir toutes les apps

    def is_enseignant(self):
        """Vérifie si l'utilisateur est un enseignant."""
        return hasattr(self, 'enseignant')

    def is_entreprise(self):
        """Vérifie si l'utilisateur est lié à une entreprise."""
        return hasattr(self, 'entreprise')    

# Modèle Admin (avec accès superuser)
class Admin(User):
    objects = CustomUserManager()

    class Meta:
        verbose_name = "Admin"
        verbose_name_plural = "Admins"

    def save(self, *args, **kwargs):
        self.is_staff = True
        self.is_superuser = True
        super().save(*args, **kwargs)

# Modèle Enseignant
class Enseignant(User):
    matricule=models.CharField(max_length=20,unique=True,null=True)
    grade = models.CharField(max_length=20,null=True)
    def __str__(self):
        return f"{self.nom} {self.prenom} - {self.matricule}"

# Modèle Étudiant
class Etudiant(User):
    annee_etude = models.ForeignKey(Annee,on_delete=models.CASCADE,null=True)
    specialite = models.ForeignKey(Specialite,on_delete=models.CASCADE,null=True)
    moyenne_etudiant = models.FloatField(null=True, blank=True)
    matricule = models.CharField(max_length=20, unique=True,null=True)
    chef_equipe = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.nom} {self.prenom} - {self.matricule}"



from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Entreprise(models.Model):
    STATUT_CHOICES = [
        ('pending', 'En attente'),
        ('approved', 'Approuvée'),
        ('rejected', 'Rejetée'),
    ]

    nom = models.CharField(max_length=255)
    secteur_activite = models.CharField(max_length=255)
    adresse = models.TextField()
    wilaya = models.CharField(max_length=100)
    ville = models.CharField(max_length=100)
    site_web = models.URLField(blank=True, null=True)

    # Informations du représentant
    representant_nom = models.CharField(max_length=255)
    representant_prenom = models.CharField(max_length=255,null=True)
    representant_poste = models.CharField(max_length=255)
    representant_email = models.EmailField(unique=True)
    representant_telephone = models.CharField(max_length=20)

    # Statut de validation
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='pending')
    date_soumission = models.DateTimeField(auto_now_add=True)

    # Compte utilisateur du représentant (créé si validé)
    compte_utilisateur = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)

    # Motif du refus si l'entreprise est rejetée
    motif_refus = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.nom} - {self.get_statut_display()}"

