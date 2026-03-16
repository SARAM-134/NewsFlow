from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import PasswordResetTokenGenerator

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models.auth import Auth
from .models.utente import Utente
from .serializers import (
    UtenteSerializer, 
    PublicRegistrationSerializer, 
    CustomTokenObtainPairSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer
)

# --- PERMESSO CUSTOM ---
class IsAdminRole(permissions.BasePermission):
    """
    Permesso riservato agli utenti con ruolo 'admin'.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            hasattr(request.user, 'profilo') and 
            request.user.profilo.role == 'admin'
        )

# --- LOGIN (JWT Custom) ---
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# --- REGISTRAZIONE PUBBLICA ---
class RegisterView(generics.CreateAPIView):
    """
    POST: Permette a chiunque di registrarsi. Assegnerà ruolo 'giornalista' di default.
    """
    serializer_class = PublicRegistrationSerializer
    permission_classes = [permissions.AllowAny]

# --- VISTA PROFILO PERSONALE ---
class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    GET: Ottiene il profilo dell'utente loggato.
    PUT/PATCH: Aggiorna il profilo (es. nome/cognome). Email e Ruolo read-only.
    """
    serializer_class = UtenteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profilo

# --- VISTE ADMIN (GESTIONE UTENTI E SOFT DELETE) ---
class AdminUserManagementView(generics.ListAPIView):
    """
    GET: (Solo Admin) Lista tutti gli Utenti.
    """
    queryset = Utente.objects.all().select_related('auth')
    serializer_class = UtenteSerializer
    permission_classes = [IsAdminRole]

class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET/PUT/PATCH: (Solo Admin) Gestisce un utente specifico.
    DELETE: Esegue un Soft Delete disattivando l'utente.
    """
    queryset = Utente.objects.all().select_related('auth')
    serializer_class = UtenteSerializer
    permission_classes = [IsAdminRole]

    def perform_destroy(self, instance):
        # Soft delete: disattiva l'utente invece di cancellarlo dal DB.
        instance.auth.is_active = False
        instance.auth.save()

# --- VISTE PASSWORD RESET ---
class PasswordResetRequestView(APIView):
    """
    POST: Richiede l'invio di un'email con il link di reset della password.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = Auth.objects.get(email=email)
            except Auth.DoesNotExist:
                # Per ragioni di sicurezza, ritorniamo 200 anche se non esiste
                return Response({"message": "Se l'email esiste, riceverai un link di reset."}, status=status.HTTP_200_OK)

            # Genera token e uid
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = PasswordResetTokenGenerator().make_token(user)

            # Costruisci il link per il frontend 
            # Frontend URL configurato in settings (es. http://localhost:3000/reset-password/)
            frontend_url = getattr(settings, 'PASSWORD_RESET_FRONTEND_URL', 'http://localhost:3000/reset-password/')
            reset_link = f"{frontend_url}{uid}/{token}/"

            # Invia email (assicurati che EMAIL_BACKEND sia configurato nei settings)
            send_mail(
                subject="Ripristina la tua password NewsFlow",
                message=f"Clicca su questo link per reimpostare la tua password: {reset_link}",
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@newsflow.com'),
                recipient_list=[user.email],
                fail_silently=False,
            )

        return Response({"message": "Se l'email esiste, riceverai un link di reset."}, status=status.HTTP_200_OK)

class PasswordResetConfirmView(APIView):
    """
    POST: Reimposta la password validando l'uid e il token inviati dal frontend.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Password modificata con successo."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
