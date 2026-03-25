from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone


class AuthManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        if not username:
            raise ValueError('The Username field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, username, password, **extra_fields)


class Auth(AbstractBaseUser, PermissionsMixin):
    """
    Modello di autenticazione custom.
    Rappresenta la tabella 'Auth' descritta nel PDF.
    """
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    # password_hash è gestito da AbstractBaseUser (campo `password`)
    # last_login è gestito da AbstractBaseUser
    token = models.CharField(max_length=255, blank=True, null=True, help_text="Token per le API")

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = AuthManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = 'Autenticazione'
        verbose_name_plural = 'Autenticazioni'

    def __str__(self):
        return self.email
