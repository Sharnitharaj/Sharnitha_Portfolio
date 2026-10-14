import http.server
import socketserver
import webbrowser
import os

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

if __name__ == "__main__":
    url = f"http://localhost:{PORT}"
    print("=" * 60)
    print("  Sharnitha T - Full Stack Data Analyst Portfolio")
    print(f"  Local Server: {url}")
    print("  Theme: Maroon & Dark Palette (#120609)")
    print("=" * 60)
    webbrowser.open(url)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving portfolio at port {PORT}. Press Ctrl+C to stop.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
