#!/usr/bin/env python3

from flask import Flask, send_from_directory, jsonify, request, Response
from flask_cors import CORS
from pytube import YouTube
import os
from ffmpy import FFmpeg
import re

app = Flask(__name__, static_folder='dashboard/build', static_url_path='/')
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Allow requests from the React frontend
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
    return re.sub(r'[\\/*?:"<>|]', '_', name)

# New endpoint to fetch the YouTube thumbnail
@app.route('/api/get-thumbnail', methods=['POST'])
def get_thumbnail():
    try:
        url = request.json['url']
        if not url:
            return jsonify({'error': 'Enter a valid URL'}), 400
        yt = YouTube(url)
        thumbnail_url = yt.thumbnail_url
        return jsonify({'thumbnailUrl': thumbnail_url}), 200
    except Exception as e:
        return jsonify({'error': 'Invalid YouTube URL'}), 400

@app.route('/download', methods=['POST'])
def download_youtube_video():
    """Handle the video download request from YouTube and process it."""
    try:
        url = request.json.get('url', None)
        if not url:
            return jsonify({'error': 'Enter a valid URL'}), 400
        res = request.json.get('res', '720p')  # Resolution: Defauilt is 720p
        vid_format = request.json.get('vid_format', 'mp4')  # Video format: Default is MP4
        aud_format = request.json.get('aud_format', None)  # Optional audio-only download

    # Supported video formats
        supported_formats = ['mp4', '3gp', 'mkv', 'webm']

        yt = YouTube(url)
        title = clean_filename(yt.title)
        print(f"Downloading video: {title}")

        ext = ''  # File extension

        # Handle audio-only downloads
        if aud_format:
            if aud_format == 'flac':
                aud_stream = yt.streams.filter(only_audio=True).filter(file_extension='webm').first()
                aud_stream.download('downloads/')
                convert_audio_to_flac(title)
                ext = 'flac'
            elif aud_format == 'mp3':
                aud_stream = yt.streams.filter(only_audio=True).filter(file_extension='mp4').first()
                aud_stream.download('downloads/')
                convert_audio_to_mp3(title)
                ext = 'mp3'
            elif aud_format == 'wav':
                aud_stream = yt.streams.filter(only_audio=True).filter(file_extension='webm').first()
                aud_stream.download('downloads/')
                convert_audio_to_wav(title)
                ext = 'wav'
            else:
                return jsonify({'error': 'Invalid audio format.'}), 400
        else:  # Handle video downloads
            if res not in ['1080p', '720p', '480p', '360p']:
                return jsonify({'error': 'Invalid resolution.'}), 400

            if vid_format not in supported_formats:
                return jsonify({'error': 'Invalid video format. Supported formats: mp4, 3gp, mkv, webm.'}), 400

            vid_stream = yt.streams.filter(res=res, file_extension=vid_format).first()

            if vid_stream:
                vid_stream.download('downloads/')
                ext = vid_format
            else:
                return jsonify({'error': 'Resolution/format not available.'}), 400

        # Prepare file for download
        file_path = os.path.join('downloads', f'{title}.{ext}')
        with open(file_path, 'rb') as file:
            resp_file = file.read()

        # Clean up the file after sending the response
        os.remove(file_path)

        return Response(
            response=resp_file,
            status=200,
            headers={
                'Content-Type': f'video/{ext}' if not aud_format else f'audio/{ext}',
                'Content-Disposition': f'attachment; filename="{title}.{ext}"',
                'Video-Title': title
            }
        )

    except Exception as e:
        return jsonify({'error': str(e)}), 500


def convert_audio_to_flac(title):
    """Convert the downloaded audio to FLAC format."""
    input_file = f"downloads/{title}.webm"
    output_file = f"downloads/{title}.flac"
    ff = FFmpeg(inputs={input_file: None}, outputs={output_file: '-y -c:a flac'})
    ff.run()
    os.remove(input_file)


def convert_audio_to_mp3(title):
    """Convert the downloaded audio to MP3 format."""
    input_file = f"downloads/{title}.mp4"
    output_file = f"downloads/{title}.mp3"
    ff = FFmpeg(inputs={input_file: None}, outputs={output_file: '-y -vn -c:a libmp3lame -r 48000 -ab 320k'})
    ff.run()
    os.remove(input_file)


def convert_audio_to_wav(title):
    """Convert the downloaded audio to WAV format."""
    input_file = f"downloads/{title}.webm"
    output_file = f"downloads/{title}.wav"
    ff = FFmpeg(inputs={input_file: None}, outputs={output_file: '-y -c:a pcm_s16le'})
    ff.run()
    os.remove(input_file)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)

