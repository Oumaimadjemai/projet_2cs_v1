
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Theme, ThemeSpecialite
from .serializers import ThemeSerializer, ThemeSpecialiteSerializer

class ThemeAPIView(APIView):
    """
    Gère la création et la récupération des thèmes pour les enseignants.
    """

    
    def get(self, request):
        themes = Theme.objects.all()
        serializer = ThemeSerializer(themes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

   
    def post(self, request):
        serializer = ThemeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ThemeSpecialiteAPIView(APIView):
    """
    Gère l'ajout d'une spécialité à un thème donné.
    """

    
    def get(self, request):
        theme_specialites = ThemeSpecialite.objects.all()
        serializer = ThemeSpecialiteSerializer(theme_specialites, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    
    def post(self, request):
        serializer = ThemeSpecialiteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ThemeDetailAPIView(APIView):
    """
    Gère les opérations CRUD pour un thème spécifique.
    """

    
    def get(self, request, pk):
        try:
            theme = Theme.objects.get(pk=pk)
        except Theme.DoesNotExist:
            return Response({'error': 'Thème non trouvé.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ThemeSerializer(theme)
        return Response(serializer.data, status=status.HTTP_200_OK)

    
    def put(self, request, pk):
        try:
            theme = Theme.objects.get(pk=pk)
        except Theme.DoesNotExist:
            return Response({'error': 'Thème non trouvé.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ThemeSerializer(theme, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    def delete(self, request, pk):
        try:
            theme = Theme.objects.get(pk=pk)
        except Theme.DoesNotExist:
            return Response({'error': 'Thème non trouvé.'}, status=status.HTTP_404_NOT_FOUND)

        theme.delete()
        return Response({'message': 'Thème supprimé avec succès.'}, status=status.HTTP_204_NO_CONTENT)