import http.server
import socketserver
import random

PORT_LIST = [1234]

HOST = "localhost"
PORT = random.choice(PORT_LIST)

HANDLER = http.server.SimpleHTTPRequestHandler

def run_server():
    try:
        with socketserver.TCPServer((HOST, PORT), HANDLER) as httpd:
            print(f"Server successfully running: http://{HOST}:{PORT}")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("Shutting down server...")
        httpd.shutdown()

if __name__ == '__main__':
    run_server()
