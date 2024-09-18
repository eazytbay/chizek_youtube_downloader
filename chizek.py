#!/usr/bin/env python3

from flask import Flask, send_from_directory, jsonify, request, Response
from flask_cors import CORS
from yt_dlp import YoutubeDL
import os
import re
import traceback

app = Flask(__name__, static_folder='dashboard/build', static_url_path='/')
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow requests from the React frontend
app.config['CORS_HEADERS'] = 'Content-Type'
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path != '' and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

def clean_filename(name):
    """Sanitize filenames by replacing invalid characters."""
    return re.sub(r'[\\/*?#:"<>|]', '_', name)

# New endpoint to fetch the YouTube thumbnail
@app.route('/api/get-thumbnail', methods=['POST'])
def get_thumbnail():
    try:
        url = request.json['url']
        if not url:
            return jsonify({'error': 'Enter a valid URL'}), 400

        # Use yt-dlp to fetch the video metadata
        ydl_opts = {'skip_download': True}
        with YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(url, download=False)
            thumbnail_url = info_dict.get('thumbnail')

        return jsonify({'thumbnailUrl': thumbnail_url}), 200
    except Exception as e:
        print(f"Error getting thumbnail: {e}")
        return jsonify({'error': 'Invalid YouTube URL'}), 400

@app.route('/download', methods=['POST'])
def download_youtube_video():
    """Handle the video download request from YouTube and process it."""
    try:
        url = request.json.get('url', None)
        if not url:
            return jsonify({'error': 'Enter a valid URL'}), 400
        res = request.json.get('res', '720p')  # Resolution: Default is 720p
        vid_format = request.json.get('vid_format', 'mp4')  # Video format: Default is MP4
        aud_format = request.json.get('aud_format', None)  # Optional audio-only download

        # Supported video formats
        supported_formats = ['mp4', '3gp', 'mkv', 'webm']
        if vid_format not in supported_formats and not aud_format:
            return jsonify({'error': 'Invalid video format. Supported formats: mp4, 3gp, mkv, webm.'}), 400

        # Prepare yt-dlp options for video or audio-only downloads
        ydl_opts = {
            'format': f'bestvideo[height<={res}]+bestaudio/best' if not aud_format else 'bestaudio/best',
            'outtmpl': 'downloads/%(title)s.%(ext)s',
            'merge_output_format': vid_format if not aud_format else aud_format,
            'noplaylist': True,
        }

        with YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(url, download=True)
            title = clean_filename(info_dict.get('title', 'downloaded_video'))
            ext = vid_format if not aud_format else aud_format
            print(f"Downloaded video: {title}")

        # Create the downloads directory if it doesn't exist
        os.makedirs('downloads', exist_ok=True)

        # Prepare file for download
        file_path = os.path.join('downloads', f'{title}.{ext}')
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            return jsonify({'error': 'File not found after download.'}), 400

        try:
            with open(file_path, 'rb') as file:
                resp_file = file.read()

            # Clean up the file after sending the response
            os.remove(file_path)
            print(f"File successfully deleted: {file_path}")
        except Exception as e:
            print(f"Error reading or deleting the file: {e}")
            return jsonify({'error': 'Failed to read the file or delete it.'}), 500

        return Response(
            response=resp_file,
            status=200,
            headers={
                'Content-Type': f'video/{ext}' if not aud_format else f'audio/{ext}',
                'Content-Disposition': f'attachment; filename="{title.encode("utf-8").decode("latin-1", "ignore")}.{ext}"',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        )

    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
