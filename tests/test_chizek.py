import unittest
from chizek import app  
import json

class FlaskAppTests(unittest.TestCase):

    def setUp(self):
        # Setup a test client for your Flask app
        self.app = app.test_client()
        self.app.testing = True

    def test_serve_react_app(self):
        # Test serving the React app at '/'
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'<!DOCTYPE html>', response.data)  # Checks if HTML content is served

    def test_get_thumbnail(self):
        # Test the /api/get-thumbnail endpoint with a valid URL
        response = self.app.post('/api/get-thumbnail', json={'url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'})
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertIn('thumbnailUrl', data)

        # Test with an invalid URL
        response = self.app.post('/api/get-thumbnail', json={'url': 'invalid-url'})
        self.assertEqual(response.status_code, 400)

    def test_download_youtube_video(self):
        # Test video download endpoint with a valid request
        response = self.app.post('/download', json={
            'url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'res': '720p',
            'vid_format': 'mp4'
        })
        self.assertEqual(response.status_code, 200)

        # Test video download endpoint with an invalid format
        response = self.app.post('/download', json={
            'url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'res': '720p',
            'vid_format': 'invalid_format'
        })
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', data)
        self.assertEqual(data['error'], 'Invalid video format. Supported formats: mp4, 3gp, mkv, webm.')

    def test_download_no_url(self):
        # Test download endpoint without a URL
        response = self.app.post('/download', json={})
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', data)
        self.assertEqual(data['error'], 'Enter a valid URL')


if __name__ == '__main__':
    unittest.main()

