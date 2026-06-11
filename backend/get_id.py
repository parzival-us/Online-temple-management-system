import requests, re
try:
    html = requests.get('https://www.youtube.com/@ISKCONVrndavan').text
    m = re.search(r'"channelId":"(UC[^"]+)"', html)
    print("Found:", m.group(1) if m else "Not found")
except Exception as e:
    print(e)
