import requests

EUREKA_SERVER = "http://registry:8761/eureka"  # à adapter si besoin

def discover_service(app_name):
    url = f"{EUREKA_SERVER}/apps/{app_name}"
    response = requests.get(url, headers={"Accept": "application/json"})
    response.raise_for_status()
    app_info = response.json()['application']['instance'][0]
    host = app_info['hostName']
    port = app_info['port']['$']
    return f"http://{host}:{port}"
