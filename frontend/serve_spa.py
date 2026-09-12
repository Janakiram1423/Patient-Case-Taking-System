import http.server
import socketserver
import os
import sys

PORT = 5173
DIRECTORY = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist")

class SPANoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Resolve requested path
        path = self.translate_path(self.path)
        if not os.path.exists(path) or os.path.isdir(path) and not os.path.exists(os.path.join(path, "index.html")):
            self.path = "/index.html"
        return super().do_GET()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    socketserver.TCPServer.allow_reuse_address = True
    # Listen on 0.0.0.0 so both localhost, 127.0.0.1 and LAN IP can connect
    with socketserver.TCPServer(("0.0.0.0", PORT), SPANoCacheHTTPRequestHandler) as httpd:
        print(f"CliniCase AI Frontend serving at http://127.0.0.1:{PORT} and http://localhost:{PORT}")
        sys.stdout.flush()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
