"""Capture the authorized public COLLINS frontend without its private backend."""
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlsplit, unquote
from urllib.request import Request, urlopen
from xml.etree import ElementTree

ORIGIN = "https://wearecollins.com"
DEST = Path(__file__).resolve().parent.parent / ".reference-site"
SITEMAP = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
ASSET_SUFFIXES = {".js", ".css", ".json", ".woff", ".woff2", ".ico", ".png", ".svg", ".webp", ".jpg", ".webmanifest", ".jpeg", ".gif", ".xml", ".mp4", ".vtt", ".txt"}
LOCAL_FILE = re.compile(r"""["'`(]((?:/_nuxt/|/fonts/|/icons/|\./)[^\s"'()<>`]+?\.(?:js|css|woff2?|svg|png|json|webp|jpg|ico))(?:[?"'`)]|$)""")


def fetch(url):
    for attempt in range(3):
        try:
            request = Request(url, headers={"User-Agent": "Fullframe public reference preview"})
            with urlopen(request, timeout=35) as response:
                if urlsplit(response.url).hostname != "wearecollins.com":
                    raise ValueError(f"Unexpected redirect: {response.url}")
                return response.read(), response.headers.get_content_type()
        except (HTTPError, URLError, TimeoutError) as error:
            if isinstance(error, HTTPError) and error.code < 500 and error.code != 429:
                raise
            if attempt == 2:
                raise
            time.sleep(attempt + 1)


def save(path, data):
    absolute = DEST / path.lstrip("/")
    absolute.parent.mkdir(parents=True, exist_ok=True)
    temporary = absolute.with_name(absolute.name + ".part")
    temporary.write_bytes(data)
    temporary.replace(absolute)


class PageLinks(HTMLParser):
    def __init__(self, page):
        super().__init__()
        self.page = page
        self.assets = set()
        self.routes = set()

    def handle_starttag(self, tag, values):
        attributes = dict(values)
        for attribute in ("href", "src", "data-src", "poster", "srcset", "imagesrcset"):
            value = attributes.get(attribute) or ""
            if attribute in ("srcset", "imagesrcset"):
                if value.startswith("data:"):
                    continue
                candidates = [entry.strip().split()[0] for entry in value.split(",") if entry.strip()]
            else:
                candidates = [value]
            for candidate in candidates:
                if not candidate or candidate.startswith(("#", "data:", "blob:", "mailto:", "tel:")):
                    continue
                url = urlsplit(urljoin(ORIGIN + self.page, candidate))
                if url.hostname != "wearecollins.com":
                    continue
                if Path(url.path).suffix in ASSET_SUFFIXES:
                    self.assets.add(url.path + (f"?{url.query}" if url.query else ""))
                elif tag == "a" and attribute == "href" and not url.path.startswith("/api/"):
                    self.routes.add(url.path.rstrip("/") or "/")


def capture_page(path):
    data, content_type = fetch(ORIGIN + path)
    if content_type != "text/html":
        raise ValueError(f"{path} returned {content_type}")
    links = PageLinks(path)
    html = data.decode()
    links.feed(html)
    for candidate in LOCAL_FILE.findall(html):
        if candidate.startswith("/"):
            links.assets.add(candidate)
    save("pages" + path.rstrip("/") + "/index.html", data)
    return links


def capture_asset(path):
    pathname = unquote(urlsplit(path).path)
    data, content_type = fetch(ORIGIN + path)
    if content_type == "text/html":
        raise ValueError(f"{path} returned HTML")
    save("assets" + pathname, data)
    if Path(pathname).suffix in (".js", ".css"):
        return {urlsplit(urljoin(ORIGIN + pathname, ref)).path for ref in LOCAL_FILE.findall(data.decode())}
    return set()


def run():
    sitemap, _ = fetch(ORIGIN + "/sitemap.xml")
    root = ElementTree.fromstring(sitemap)
    pending = {urlsplit(element.text).path.rstrip("/") or "/" for element in root.iter(SITEMAP + "loc")}
    pages, visited, files = set(), set(), set()
    failures = {}
    with ThreadPoolExecutor(max_workers=8) as pool:
        while pending:
            batch = sorted(pending - visited)
            if not batch:
                break
            visited.update(batch)
            pending = set()
            for path, job in zip(batch, [pool.submit(capture_page, route) for route in batch]):
                try:
                    links = job.result()
                    pages.add(path)
                    pending.update(links.routes)
                    files.update(links.assets)
                except (HTTPError, URLError, TimeoutError, ValueError) as error:
                    failures[path] = str(error)
            print(f"Pages captured: {len(pages)} / {len(visited)}", flush=True)
        captured, attempted = set(), set()
        while files:
            batch = sorted({urlsplit(file).path: file for file in sorted(files) if urlsplit(file).path not in attempted}.values())
            attempted.update(urlsplit(file).path for file in batch)
            files = set()
            for path, job in zip(batch, [pool.submit(capture_asset, file) for file in batch]):
                try:
                    files.update(job.result())
                    captured.add(urlsplit(path).path)
                except (HTTPError, URLError, TimeoutError, ValueError) as error:
                    failures[path] = str(error)
            print(f"Assets captured: {len(captured)} / {len(attempted)}", flush=True)
    save("manifest.json", json.dumps({
        "pages": sorted(pages), "assets": sorted(captured), "failures": failures,
    }, indent=2).encode())
    print(f"Captured {len(pages)} pages and {len(captured)} assets. {len(failures)} unresolved URLs.", flush=True)
    if failures:
        print(json.dumps(failures, indent=2))
    if not pages:
        raise SystemExit(1)


if __name__ == "__main__":
    run()
