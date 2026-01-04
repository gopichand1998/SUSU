from http.server import SimpleHTTPRequestHandler, HTTPServer
import os
import json

class RequestHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/list-images':
            try:
                # List all files in the images directory
                image_dir = os.path.join(os.path.dirname(__file__), 'images')
                images = [f for f in os.listdir(image_dir) 
                         if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp'))]
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(images).encode())
                return
            except Exception as e:
                self.send_error(500, f"Error listing images: {str(e)}")
                return
        
        # Default to serving files as usual
        return SimpleHTTPRequestHandler.do_GET(self)

def run(server_class=HTTPServer, handler_class=RequestHandler, port=8080):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting server on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run()
