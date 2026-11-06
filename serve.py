import os
import sys
import mimetypes
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, unquote

PORT = int(os.environ.get("PORT", 3000))
ROOT = os.path.dirname(os.path.abspath(__file__))

CUSTOM_MIMES = {
    ".mjs": "application/javascript; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".webp": "image/webp",
    ".webm": "video/webm",
    ".mp4": "video/mp4",
    ".woff2": "font/woff2",
    ".woff": "font/woff",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg"
}

class AlethiaHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def translate_path(self, path):
        parsed = urlparse(path)
        clean_path = unquote(parsed.path)
        if clean_path == "/":
            clean_path = "/index.html"
            
        local_path = os.path.join(ROOT, clean_path.lstrip("/\\"))
        
        # SPA routing: if path doesn't exist and has no dot extension or is .html, serve index.html
        if not os.path.exists(local_path):
            ext = os.path.splitext(clean_path)[1]
            if not ext or ext == ".html":
                return os.path.join(ROOT, "index.html")
                
        return local_path

    def guess_type(self, path):
        ext = os.path.splitext(path)[1].lower()
        if ext in CUSTOM_MIMES:
            return CUSTOM_MIMES[ext]
        return super().guess_type(path)

if __name__ == "__main__":
    os.chdir(ROOT)
    server = HTTPServer(("0.0.0.0", PORT), AlethiaHandler)
    print(f"\n========================================")
    print(f"  Alethia Earth local server running!")
    print(f"  URL: http://localhost:{PORT}")
    print(f"========================================\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server.")
        server.server_close()
