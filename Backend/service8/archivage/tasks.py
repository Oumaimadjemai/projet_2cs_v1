# archivage/tasks.py
from urllib import response
from celery import shared_task
import requests
from django.utils import timezone
from .discovery import discover_service
from datetime import date, datetime

@shared_task
def archive_old_annees():
    try:
        print("=== Début de la tâche d'archivage ===")

        service1_base = discover_service("SERVICE1-CLIENT")
        url = f"{service1_base}/annees-academiques/"

        response = requests.get(url)
        response.raise_for_status()

        annees = response.json()

        if not isinstance(annees, list):
            raise ValueError("La réponse du service 1 n'est pas une liste")

        print(f"Nombre d'années récupérées : {len(annees)}")

        for annee in annees:
            try:
                id_ = annee.get("id")
                date_fin_str = annee.get("date_fin")
                archived = annee.get("archived", False)

                if not id_ or not date_fin_str:
                    print(f"❌ Annee incomplète : {annee}")
                    continue

                date_fin = datetime.strptime(date_fin_str, "%Y-%m-%d").date()

                if not archived and timezone.now().date() > date_fin:
                    print(f"🔄 Archivage de l'année {id_} (fin : {date_fin})")
                    archive_url = f"{service1_base}/annees-academiques/{id_}/archive/"
                    patch_response = requests.patch(archive_url, json={"archived": True})
                    patch_response.raise_for_status()
                    print(f"✅ Année {id_} archivée avec succès")
                else:
                    print(f"ℹ️ Année {id_} déjà archivée ou encore active")

            except Exception as inner_e:
                print(f"⚠️ Erreur lors du traitement de l'année {annee}: {inner_e}")

        print("=== Fin de la tâche d'archivage ===")

    except Exception as e:
        print(f"❌ Erreur dans l'archivage global: {e}")


@shared_task
def archiver_themes_expirés():
    print("Tâche d'archivage exécutée")
    try:
        # Étape 1 : Récupère les années expirées depuis Service 1
        service1_url = discover_service("SERVICE1-CLIENT")
        annee_response = requests.get(f"{service1_url}/annees-academiques/")
        if annee_response.status_code != 200:
            return f"Erreur lors de la récupération des années : {annee_response.text}"

        annees = annee_response.json()
        today = date.today()
        expired_ids = [a["id"] for a in annees if a.get("date_fin") and a["date_fin"] < str(today)]
        print(f"Années expirées trouvées : {expired_ids}")

        # Étape 2 : Pour chaque année expirée, récupérer les thèmes
        service2_url = discover_service("SERVICE2-CLIENT")
        for annee_id in expired_ids:
            themes_response = requests.get(f"{service2_url}/themes/by-annee-academique/{annee_id}/")
            if themes_response.status_code != 200:
                print(f"Erreur récupération thèmes pour année {annee_id} : {themes_response.text}")
                continue

            themes = themes_response.json()
            for theme in themes:
                print(f"Traitement du thème {theme['id']} - archived={theme['archived']}")
                if not theme["archived"]:
                    patch_url = f"{service2_url}/themes/{theme['id']}/archived/"
                    response = requests.patch(patch_url)
                    print(f"PATCH {patch_url} status {response.status_code}")

        return f"Archivage terminé pour {len(expired_ids)} années."
    except Exception as e:
        return f"Erreur : {str(e)}"



@shared_task
def archiver_assignments_depuis_annees_archived():
    try:
        # Découverte URL Service 1 et Service 4
        service1_url = discover_service("SERVICE1-CLIENT")
        service4_url = discover_service("SERVICE4-CLIENT")

        # Récupérer années académiques archivées
        resp = requests.get(f"{service1_url}/annees-academiques/?archived=true")
        if resp.status_code != 200:
            return f"Erreur récupération années archivées : {resp.text}"

        annees_archived = resp.json()

        total_archived = 0
        for annee in annees_archived:
            annee_id = annee["id"]
            # Appeler Service 4 pour archiver les assignments de cette année
            patch_resp = requests.patch(f"{service4_url}/assignments/archive_by_annee/{annee_id}/")
            if patch_resp.status_code == 200:
                count = patch_resp.json().get("archived_count", 0)
                total_archived += count
            else:
                print(f"Erreur archivage assignments pour annee {annee_id}: {patch_resp.text}")

        return f"Archivage des assignments terminé, total archivés : {total_archived}"

    except Exception as e:
        return f"Erreur dans tâche archivage assignments : {str(e)}"
    

# @shared_task
# def archiver_soutenances_task():
#     try:
#         service1_url = discover_service("SERVICE1-CLIENT")
#         service6_url = discover_service("SERVICE6-CLIENT")

#         # Récupérer les soutenances non archivées dans service6
#         res = requests.get(f"{service6_url}/soutenances-a-archiver/")
#         res.raise_for_status()
#         soutenances = res.json()

#         for soutenance in soutenances:
#             annee_id = soutenance.get("annee_academique")
#             soutenance_id = soutenance.get("id")

#             # Récupérer l'année académique dans service1
#             res_annee = requests.get(f"{service1_url}/annees-academiques/{annee_id}/")
#             if res_annee.status_code != 200:
#                 print(f"Erreur récupération année académique {annee_id}")
#                 continue
#             annee_data = res_annee.json()

#             archived = annee_data.get("archived")
#             date_fin = annee_data.get("date_fin")

#             # Vérifier si on doit archiver
#             doit_archiver = False
#             if archived is True:
#                 doit_archiver = True
#             elif date_fin:
#                 date_fin_dt = datetime.strptime(date_fin, "%Y-%m-%d").date()
#                 if date_fin_dt < datetime.today().date():
#                     doit_archiver = True

#             if doit_archiver:
#                 patch_res = requests.patch(
#                     f"{service6_url}/soutenances/{soutenance_id}/archiver/",
#                     json={"archived": True}
#                 )
#                 if patch_res.status_code == 200:
#                     print(f"Soutenance {soutenance_id} archivée avec succès.")
#                 else:
#                     print(f"Erreur archivage soutenance {soutenance_id}: {patch_res.text}")

#     except Exception as e:
#         print(f"Erreur dans la tâche d'archivage : {e}")

def get_service1_token(service1_url):
    credentials = {
        "email":"bot@archivage.local",
        "password":"archivage"
    }
    try:
        res = requests.post(f"{service1_url}/login/", json=credentials)
        print("Status code login:", res.status_code)
        print("Response login:", res.text)  # Voir la réponse brute
        res.raise_for_status()
        token = res.json().get("access")
        print("Token reçu :", token)
        if not token:
            raise Exception("Token non reçu du service1/login")
        return token
    except Exception as e:
        print(f"Erreur lors de l'authentification service1 : {e}")
        return None

@shared_task
def archiver_soutenances_task():
    try:
        service1_url = discover_service("SERVICE1-CLIENT")
        service6_url = discover_service("SERVICE6-CLIENT")

        token = get_service1_token(service1_url)
        if not token:
            print("Impossible d'obtenir le token d'authentification, arrêt de la tâche.")
            return

        headers = {"Authorization": f"Bearer {token}"}

        # Récupérer les soutenances non archivées dans service6
        res = requests.get(f"{service6_url}/soutenances-a-archiver/", headers=headers)
        res.raise_for_status()
        soutenances = res.json()

        for soutenance in soutenances:
            annee_id = soutenance.get("annee_academique")
            soutenance_id = soutenance.get("id")

            # Récupérer l'année académique dans service1
            res_annee = requests.get(f"{service1_url}/annees-academiques/{annee_id}/", headers=headers)
            if res_annee.status_code != 200:
                print(f"Erreur récupération année académique {annee_id}")
                continue
            annee_data = res_annee.json()

            archived = annee_data.get("archived")
            date_fin = annee_data.get("date_fin")

            # Vérifier si on doit archiver
            doit_archiver = False
            if archived is True:
                doit_archiver = True
            elif date_fin:
                date_fin_dt = datetime.strptime(date_fin, "%Y-%m-%d").date()
                if date_fin_dt < datetime.today().date():
                    doit_archiver = True

            if doit_archiver:
                patch_res = requests.patch(
                    f"{service6_url}/soutenances/{soutenance_id}/archiver/",
                    json={"archived": True},
                    headers=headers
                )
                if patch_res.status_code == 200:
                    print(f"Soutenance {soutenance_id} archivée avec succès.")
                else:
                    print(f"Erreur archivage soutenance {soutenance_id}: {patch_res.text}")

    except Exception as e:
        print(f"Erreur dans la tâche d'archivage : {e}")