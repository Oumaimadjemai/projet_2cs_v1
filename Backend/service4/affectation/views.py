# # from rest_framework.views import APIView
# # from rest_framework.response import Response
# # from rest_framework import status
# # from .services import assign_themes, is_admin_user
# # from .models import Assignment

# # class AssignThemesView(APIView):
# #     authentication_classes = []  # 👈 Désactive l'authentification DRF standard

# #     def post(self, request):
# #         # Vérifie juste si c'est un admin
# #         if not is_admin_user(request):
# #             return Response({'detail': "Accès réservé à l'administrateur"}, status=status.HTTP_401_UNAUTHORIZED)

# #         # Check si manual_assignments est envoyé
# #         manual_assignments = request.data.get('manual_assignments')

# #         if manual_assignments:
# #             for group_id, theme_id in manual_assignments.items():
# #                 Assignment.objects.update_or_create(
# #                     group_id=group_id,
# #                     defaults={'theme_id': theme_id}
# #                 )
# #             return Response({"message": "Affectation manuelle réussie"}, status=status.HTTP_201_CREATED)

# #         # Sinon assignation auto
# #         assignments = assign_themes()

# #         for group_id, theme_id in assignments.items():
# #             Assignment.objects.update_or_create(
# #                 group_id=group_id,
# #                 defaults={'theme_id': theme_id}
# #             )

# #         return Response(assignments, status=status.HTTP_201_CREATED)
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from .services import assign_themes, is_admin_user, get_theme_info, get_group_members
# from .models import Assignment
# from .utils import get_user_id_from_token

# class AssignThemesView(APIView):
#     authentication_classes = []

#     def post(self, request):
#         if not is_admin_user(request):
#             return Response({'detail': "Accès réservé à l'administrateur"}, status=status.HTTP_401_UNAUTHORIZED)

#         admin_id = get_user_id_from_token(request)
#         manual_assignments = request.data.get('manual_assignments')
#         result = []

#         if manual_assignments:
#             assignments = manual_assignments
#         else:
#             assignments = assign_themes()

#         for group_id, theme_id in assignments.items():
#             # Fetch theme info
#             theme_info = get_theme_info(theme_id)
#             encadrant_id = theme_info.get('enseignant_id') or theme_info.get('entreprise_id')

#             # Perform assignment
#             Assignment.objects.update_or_create(
#                 group_id=group_id,
#                 defaults={
#                     'theme_id': theme_id,
#                     'encadrant': encadrant_id,
#                     'assigned_by_admin_id': admin_id
#                 }
#             )

#             # Fetch group members
#             group_members = get_group_members(group_id, jwt_token=request.headers.get('Authorization'))

#             # Prepare result
#             result.append({
#                 'group_id': group_id,
#                 'theme_id': theme_id,
#                 'encadrant_id': encadrant_id,
#                 'group_members': group_members,
#                 'assigned_by_admin_id': admin_id,
#             })

#         return Response(result, status=status.HTTP_201_CREATED)

# class AssignmentListView(APIView):
#     authentication_classes = []

#     def get(self, request):
#         try:
#             assignments = Assignment.objects.all()
#             result = []

#             for assignment in assignments:
#                 theme_info = get_theme_info(assignment.theme_id)
#                 group_members = get_group_members(assignment.group_id, jwt_token=request.headers.get('Authorization'))

#                 result.append({
#                     "assignment_id": assignment.id,  # ✅ Add this line
#                     "group_id": assignment.group_id,
#                     "theme_id": assignment.theme_id,
#                     "theme_info": theme_info,
#                     "group_members": group_members,
#                     "assigned_by_admin_id": assignment.assigned_by_admin_id,
#                 })

#             return Response(result, status=status.HTTP_200_OK)

#         except Exception as e:
#             print("[ERROR] Failed to fetch assignments:", e)
#             return Response({"error": "Erreur lors de la récupération des attributions"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# ########
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from .models import Assignment
# from .utils import get_user_id_from_token
# from .services import get_submissions, get_group_members, get_theme_info, assign_random_theme_to_group, is_admin_user

# class AssignSingleThemeView(APIView):
#     authentication_classes = []

#     def post(self, request):
#         # ✅ First, verify if user is really admin
#         if not is_admin_user(request):
#             return Response({'detail': "Accès réservé à l'administrateur"}, status=status.HTTP_401_UNAUTHORIZED)

#         # ✅ Extract admin_id after verification
#         admin_id = get_user_id_from_token(request)

#         theme_id = request.data.get('theme_id')

#         if not theme_id:
#             return Response({'detail': "theme_id requis"}, status=status.HTTP_400_BAD_REQUEST)

#         # ✅ Assign a random group to the selected theme
#         group_id, error = assign_random_theme_to_group(theme_id)
#         if error:
#             return Response({'detail': error}, status=status.HTTP_400_BAD_REQUEST)

#         # ✅ Save assignment to DB
#         Assignment.objects.update_or_create(
#             group_id=group_id,
#             defaults={
#                 'theme_id': theme_id,
#                 'assigned_by_admin_id': admin_id
#             }
#         )

#         # ✅ Fetch extra info
#         theme_info = get_theme_info(theme_id)
#         group_members = get_group_members(group_id, jwt_token=request.headers.get('Authorization'))

#         return Response({
#             'group_id': group_id,
#             'theme_id': theme_id,
#             'submitted_by_user_id': theme_info.get('enseignant_id') or theme_info.get('entreprise_id'),
#             'group_members': group_members,
#             'assigned_by_admin_id': admin_id,
#         }, status=status.HTTP_201_CREATED)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Assignment
from .utils import get_user_id_from_token
from .services import get_theme_info, get_group_members, is_admin_user

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Assignment
from .utils import get_user_id_from_token
from .services import get_theme_info, get_group_members, is_admin_user
from django.db import IntegrityError

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
        # group_info = get_group_info(group_id, jwt_token=request.headers.get('Authorization'))
        # if not group_info:
        #   return Response({
        #   'error': 'Le groupe avec cet ID n\'existe pas.'
        # }, status=status.HTTP_404_NOT_FOUND)
        encadrant_id = theme_info.get('enseignant_id') or theme_info.get('entreprise_id')

        assignment = Assignment.objects.create(
            group_id=group_id,
            theme_id=theme_id,
            encadrant=encadrant_id,
            assigned_by_admin_id=admin_id
        )

        group_members = get_group_members(group_id, jwt_token=request.headers.get('Authorization'))

        return Response({
            'assignment_id': assignment.id,
            'group_id': group_id,
            'theme_id': theme_id,
            'encadrant_id': encadrant_id,
            'group_members': group_members,
            'assigned_by_admin_id': admin_id,
        }, status=status.HTTP_201_CREATED)

    def get(self, request):
        """
        GET /assign-manual/ - Liste tous les assignements
        """
        assignments = Assignment.objects.all()
        results = []

        for assignment in assignments:
            theme_info = get_theme_info(assignment.theme_id)
            group_members = get_group_members(assignment.group_id, jwt_token=request.headers.get('Authorization'))

            results.append({
                'assignment_id': assignment.id,
                'group_id': assignment.group_id,
                'theme_id': assignment.theme_id,
                'encadrant_id': assignment.encadrant,
                # 'theme_info': theme_info,
                'group_members': group_members,
                'assigned_by_admin_id': assignment.assigned_by_admin_id,
                'assigned_at': assignment.assigned_at
            })

        return Response(results, status=status.HTTP_200_OK)
