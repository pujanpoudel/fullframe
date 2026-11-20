"""Integration smoke test. Use ONLY with an isolated CMS_DATA_DIR test server.
Usage: ADMIN_TEST_PASSWORD=... python3 scripts/verify-admin.py http://localhost:3001
"""
import copy, http.cookiejar, json, os, sys, urllib.request, urllib.error
base = sys.argv[1]
jar = http.cookiejar.CookieJar()
client = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
def call(path, method="GET", data=None, origin=True, raw=None, headers=None):
    h = dict(headers or {})
    if origin: h["Origin"] = base
    if data is not None:
        raw = json.dumps(data).encode(); h["Content-Type"] = "application/json"
    req = urllib.request.Request(base+path, data=raw, headers=h, method=method)
    try:
        with client.open(req) as r: return r.status, r.read(), r.headers
    except urllib.error.HTTPError as e: return e.code, e.read(), e.headers
assert call("/api/admin/content")[0] == 401
assert call("/api/admin/upload")[0] == 401
assert call("/api/admin/session","POST",{"password":"bad"})[0] == 401
assert call("/api/admin/session","POST",{"password":os.environ["ADMIN_TEST_PASSWORD"]},origin=False)[0] == 403
assert call("/api/admin/session","POST",{"password":os.environ["ADMIN_TEST_PASSWORD"]})[0] == 200
content=json.loads(call("/api/admin/content")[1])
draft=copy.deepcopy(content); draft["headline"]="Integration draft headline"
assert call("/api/admin/content","PUT",{"content":draft,"publish":False})[0] == 200
assert b"Integration draft headline" not in call("/")[1]
assert json.loads(call("/api/admin/content")[1])["headline"] == draft["headline"]
assert call("/api/admin/content","PUT",{"content":draft,"publish":True},origin=False)[0] == 401
assert call("/api/admin/content","PUT",{"content":draft,"publish":True})[0] == 200
assert b"Integration draft headline" in call("/")[1]
invalid=copy.deepcopy(draft); invalid["projects"][0]["slug"]="../bad"
assert call("/api/admin/content","PUT",{"content":invalid})[0] == 400
boundary="FullframeTestBoundary"
def upload(data,name,mime):
    raw=(f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="{name}"\r\nContent-Type: {mime}\r\n\r\n').encode()+data+f'\r\n--{boundary}--\r\n'.encode()
    return call("/api/admin/upload","POST",raw=raw,headers={"Content-Type":f"multipart/form-data; boundary={boundary}"})
assert upload(b"<svg>no</svg>","unsafe.svg","image/svg+xml")[0] == 400
status,body,_=upload(open("public/work/citrus.webp","rb").read(),"photo.webp","image/webp")
assert status == 200
src=json.loads(body)["src"]
assert call(src)[0] == 200
assert src in json.loads(call("/api/admin/upload")[1])
status,body,_=upload(open("public/work/concept-reel.mp4","rb").read(),"reel.mp4","video/mp4")
assert status == 200
video=json.loads(body)["src"]
assert call(video,headers={"Range":"bytes=0-99"})[0] == 206
new=copy.deepcopy(content["projects"][0]);new.update(slug="integration-project",client="Integration project",image=src,published=True)
draft["projects"].append(new)
assert call("/api/admin/content","PUT",{"content":draft,"publish":True})[0] == 200
assert call("/work/integration-project")[0] == 200
assert b"/work/integration-project" in call("/sitemap.xml")[1]
draft["projects"][-1]["published"]=False
assert call("/api/admin/content","PUT",{"content":draft,"publish":True})[0] == 200
assert call("/work/integration-project")[0] == 404
assert call("/api/admin/content","PUT",{"content":content,"publish":True})[0] == 200
assert call("/api/admin/session","DELETE")[0] == 200
assert call("/api/admin/content")[0] == 401
print("PASS: authentication, origin checks, drafts, publishing, validation, uploads, media ranges, dynamic projects, sitemap, visibility and logout")
