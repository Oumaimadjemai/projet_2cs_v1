
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Assignment
from .utils import get_user_id_from_token
from .services import *
from django.db import IntegrityError
from .serializers import AssignmentSerializer
from .services import get_theme_info, get_group_members, is_admin_user

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Assignment
from .utils import get_user_id_from_token
from .services import *
from django.db import IntegrityError
import jwt

from .serializers import AssignmentSerializer

class AssignManualThemeView(APIView):
    authentication_classes = []

    def post(self, request):
        if not is_admin_user(request):
            return Response({'error': 'Accès refusé. Seul l\'administrateur peut affecter des groupes.'}, status=status.HTTP_401_UNAUTHORIZED)

        group_id = request.data.get('group_id')
        theme_id = request.data.get('theme_id')

        if not group_id or not theme_id:
            return Response({'error': 'Les champs group_id et theme_id sont obligatoires.'}, status=status.HTTP_400_BAD_REQUEST)

        # 🚫 Contrôle : groupe déjà assigné ?
        if Assignment.objects.filter(group_id=group_id).exists():
            return Response({
                'error': 'Ce groupe est déjà assigné à un thème.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # 🟢 Traitement normal
        admin_id = get_user_id_from_token(request)
        theme_info = get_theme_info(theme_id)
        if not theme_info:
            return Response({
            'error': 'Le thème avec cet ID n\'existe pas.'
          }, status=status.HTTP_404_NOT_FOUND)
        
        assigned_count = Assignment.objects.filter(theme_id=theme_id).count()
        max_groups = theme_info.get('numberOfGrp', 1)
        if assigned_count >= max_groups:
          return Response({
            'error': f"Ce thème a atteint sa capacité maximale de {max_groups} groupe(s)."
          }, status=status.HTTP_400_BAD_REQUEST)
       
        encadrant_id = theme_info.get('enseignant_id') or theme_info.get('entreprise_id')

        assignment = Assignment.objects.create(
            group_id=group_id,
            theme_id=theme_id,
            encadrant=encadrant_id,
            assigned_by_admin_id=admin_id
        )

        group_data = get_group_members(group_id, jwt_token=request.headers.get('Authorization'))
        group_members = group_data["members"] if group_data else None
        chef_id = group_data["chef_id"] if group_data else None

        return Response({
        'assignment_id': assignment.id,
        'group_id': group_id,
        'theme_id': theme_id,
        'encadrant_id': encadrant_id,
        'group_members': group_members,
        'chef_id': chef_id,
        'assigned_by_admin_id': admin_id,
        'assigned_at': assignment.assigned_at,
    }, status=status.HTTP_201_CREATED)

    def get(self, request):
        """
        GET /assign-manual/ - Liste tous les assignements
        """
        assignments = Assignment.objects.all()
        results = []

        for assignment in assignments:
            #theme_info = get_theme_info(assignment.theme_id)
            # group_members = get_group_members(assignment.group_id, jwt_token=request.headers.get('Authorization'))
            group_data = get_group_members(assignment.group_id, jwt_token=request.headers.get('Authorization'))
            group_members = group_data["members"] if group_data else None
            chef_id = group_data["chef_id"] if group_data else None

            results.append({
                'assignment_id': assignment.id,
                'group_id': assignment.group_id,
                'theme_id': assignment.theme_id,
                'encadrant_id': assignment.encadrant,
                # 'theme_info': theme_info,
                'group_members': group_members,
                'chef_id': chef_id,
                'assigned_by_admin_id': assignment.assigned_by_admin_id,
                'assigned_at': assignment.assigned_at
            })

        return Response(results, status=status.HTTP_200_OK)

class GetEncadrantByGroupView(APIView):
    def get(self, request, group_id):
        try:
            assignment = Assignment.objects.get(group_id=group_id)
            return Response({
                'group_id': group_id,
                'encadrant_id': assignment.encadrant
            }, status=status.HTTP_200_OK)
        except Assignment.DoesNotExist:
            return Response({
                'error': 'Aucun encadrant trouvé pour ce groupe.'
            }, status=status.HTTP_404_NOT_FOUND)





class IsEncadrantOfGroupView(APIView):
    authentication_classes = []  

    def get(self, request, group_id):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'Token manquant ou invalide.'}, status=status.HTTP_401_UNAUTHORIZED)

        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, options={"verify_signature": False})
            user_id = payload.get('user_id') or payload.get('id')
            if not user_id:
                return Response({'error': 'user_id manquant dans le token.'}, status=status.HTTP_401_UNAUTHORIZED)

            assignment = Assignment.objects.filter(group_id=group_id).first()
            if not assignment:
                return Response({'error': 'Aucun encadrement trouvé pour ce groupe.'}, status=status.HTTP_404_NOT_FOUND)

            if assignment.encadrant != int(user_id):
                return Response({'authorized': False, 'message': 'Vous ne gérez pas ce groupe.'}, status=status.HTTP_403_FORBIDDEN)

            return Response({'authorized': True, 'message': 'Vous êtes l\'encadrant de ce groupe.'}, status=status.HTTP_200_OK)

        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token expiré'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
    




class AssignmentDetailView(APIView):
    def get(self, request, group_id):
        try:
            assignment = Assignment.objects.get(group_id=group_id)
            serializer = AssignmentSerializer(assignment)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Assignment.DoesNotExist:
            return Response({'error': 'Affectation non trouvée'}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, group_id):
        try:
            assignment = Assignment.objects.get(group_id=group_id)
            serializer = AssignmentSerializer(assignment, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Assignment.DoesNotExist:
            return Response({'error': 'Affectation non trouvée'}, status=status.HTTP_404_NOT_FOUND)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Assignment
from .serializers import AssignmentSerializer

class AssignmentByEncadrantView(APIView):
    def get(self, request, encadrant):
        assignments = Assignment.objects.filter(encadrant=encadrant)
        if not assignments.exists():
            return Response({'error': 'Aucune affectation trouvée pour cet encadrant'}, status=status.HTTP_404_NOT_FOUND)
        serializer = AssignmentSerializer(assignments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class EncadrantByGroupeView(APIView):
    def get(self, request, group_id):
        try:
            assignment = Assignment.objects.get(group_id=group_id)
            return Response({"encadrant": assignment.encadrant}, status=status.HTTP_200_OK)
        except Assignment.DoesNotExist:
            return Response({"error": "Affectation introuvable pour ce groupe"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
   


class GetEncadrantByGroupView(APIView):
    def get(self, request, group_id):
        try:
            assignment = Assignment.objects.get(group_id=group_id)
            return Response({
                'group_id': group_id,
                'encadrant_id': assignment.encadrant
            }, status=status.HTTP_200_OK)
        except Assignment.DoesNotExist:
            return Response({
                'error': 'Aucun encadrant trouvé pour ce groupe.'
            }, status=status.HTTP_404_NOT_FOUND)





class IsEncadrantOfGroupView(APIView):
    authentication_classes = []  

    def get(self, request, group_id):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'Token manquant ou invalide.'}, status=status.HTTP_401_UNAUTHORIZED)

        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, options={"verify_signature": False})
            user_id = payload.get('user_id') or payload.get('id')
            if not user_id:
                return Response({'error': 'user_id manquant dans le token.'}, status=status.HTTP_401_UNAUTHORIZED)

            assignment = Assignment.objects.filter(group_id=group_id).first()
            if not assignment:
                return Response({'error': 'Aucun encadrement trouvé pour ce groupe.'}, status=status.HTTP_404_NOT_FOUND)

            if assignment.encadrant != int(user_id):
                return Response({'authorized': False, 'message': 'Vous ne gérez pas ce groupe.'}, status=status.HTTP_403_FORBIDDEN)

            return Response({'authorized': True, 'message': 'Vous êtes l\'encadrant de ce groupe.'}, status=status.HTTP_200_OK)

        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token expiré'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
