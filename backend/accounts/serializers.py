from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str

from .models.auth import Auth
from .models.utente import Utente

# --- JWT CUSTOM SERIALIZER ---
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Aggiunge il ruolo dell'utente direttamente nel payload del token JWT.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Aggiungi custom claims
        if hasattr(user, 'profilo'):
            token['role'] = user.profilo.role
        return token

# --- SERIALIZER PROFILO NORMALE ---
class UtenteSerializer(serializers.ModelSerializer):
    """
    Gestisce la visualizzazione e l'aggiornamento del profilo.
    L'email è in sola lettura.
    """
    email = serializers.EmailField(source='auth.email', read_only=True)
    is_active = serializers.BooleanField(source='auth.is_active', read_only=True)

    class Meta:
        model = Utente
        fields = ['id', 'email', 'role', 'nome', 'cognome', 'is_active']
        read_only_fields = ['id', 'email', 'role', 'is_active'] # L'utente non può cambiarsi il ruolo o attivarsi da solo

# --- SERIALIZER REGISTRAZIONE PUBBLICA ---
class PublicRegistrationSerializer(serializers.Serializer):
    """
    Serializer per la registrazione autonoma. Assegna sempre il ruolo 'giornalista'.
    """
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    nome = serializers.CharField(max_length=100, allow_blank=True, required=False)
    cognome = serializers.CharField(max_length=100, allow_blank=True, required=False)

    def validate_email(self, value):
        if Auth.objects.filter(email=value).exists():
            raise serializers.ValidationError("Questa email è già registrata.")
        return value

    def create(self, validated_data):
        # 1. Crea Auth
        user_auth = Auth.objects.create_user(
            email=validated_data['email'],
            username=validated_data['email'], 
            password=validated_data['password']
        )
        # 2. Crea Profilo (Ruolo forzato a 'giornalista')
        utente = Utente.objects.create(
            auth=user_auth,
            role='giornalista',
            nome=validated_data.get('nome', ''),
            cognome=validated_data.get('cognome', '')
        )
        return utente

# --- SERIALIZERS PER RESET PASSWORD ---
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetConfirmSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate(self, attrs):
        try:
            uid = force_str(urlsafe_base64_decode(attrs['uidb64']))
            self.user = Auth.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, Auth.DoesNotExist):
            raise serializers.ValidationError("Link di reset non valido.")

        if not PasswordResetTokenGenerator().check_token(self.user, attrs['token']):
            raise serializers.ValidationError("Il token è scaduto o non valido.")

        return attrs

    def save(self):
        self.user.set_password(self.validated_data['new_password'])
        self.user.save()
        return self.user
