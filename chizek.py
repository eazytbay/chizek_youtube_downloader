#!/usr/bin/env python3

from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from waitress import serve
from pytube import YouTube
import os
from ffmpy import FFmpeg
import re

app = Flask(__name__)
CORS(app)
app.config.from_pyfile('config.py')
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))


def clean_filename(name):
    """Sanitize filenames by replacing invalid characters."""
    return re.sub(r'[\\/*?:"<>|]', '_', name)


@app.route('/download', methods=['POST'])
def download_youtube_video():
    """Handle the video download request from YouTube and process it."""
    url = request.json['url']
    res = request.json.get('res', '720p')  # Resolution: Default is 720p
    vid_format = request.json.get('vid_format', 'mp4')  # Video format: Default is MP4
    aud_format = request.json.get('aud_format', None)  # Optional audio-only download

    try:
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
                ext = 'mp3'
                convert_audio_to_mp3(title)
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
    serve(app, host='0.0.0.0', port=5000, threads=1)  # Use Waitress to serve the app

