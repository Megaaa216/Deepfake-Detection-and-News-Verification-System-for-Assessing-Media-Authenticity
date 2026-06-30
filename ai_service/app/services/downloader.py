import os
import urllib.request
import urllib.parse
import yt_dlp
import uuid

def is_direct_link(url: str) -> bool:
  """
  Checks if the URL points directly to a raw video file by examining its path extension.
  """
  parsed = urllib.parse.urlparse(url)
  path = parsed.path.lower()
  extensions = [".mp4", ".mov", ".mkv", ".avi", ".webm", ".flv", ".m4v"]
  return any(path.endswith(ext) for ext in extensions)

def download_direct_video(url: str, output_path: str) -> str:
  """
  Downloads a raw video file directly using urllib in 1MB chunks.
  """
  req = urllib.request.Request(
    url, 
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
  )
  with urllib.request.urlopen(req) as response:
    # Limit max size to 50MB
    max_bytes = 50 * 1024 * 1024
    bytes_downloaded = 0
    
    with open(output_path, "wb") as f:
      while True:
        chunk = response.read(1024 * 1024)  # Read in 1MB chunks
        if not chunk:
          break
        bytes_downloaded += len(chunk)
        if bytes_downloaded > max_bytes:
          raise ValueError("Downloaded file exceeds the 50MB limit.")
        f.write(chunk)
        
  return os.path.abspath(output_path)

def download_video_link(url: str, output_dir: str) -> str:
  """
  Downloads streaming video from direct links or platform links (YouTube, TikTok, etc.).
  Args:
      url (str): The video stream URL.
      output_dir (str): Folder to store downloaded temporary files.
  Returns:
      str: Absolute local file path of the downloaded video.
  """
  os.makedirs(output_dir, exist_ok=True)
  
  # Generate unique temp filename to prevent thread collision
  unique_id = str(uuid.uuid4())
  
  if is_direct_link(url):
    print(f"[Downloader] Direct video link detected. Streaming download directly...")
    temp_filename = f"direct_{unique_id}.mp4"
    temp_path = os.path.join(output_dir, temp_filename)
    return download_direct_video(url, temp_path)
  
  print(f"[Downloader] Platform stream link detected. Initiating yt-dlp...")
  
  # Configure yt-dlp to download lightweight formats (<480p) for high processing speed
  ydl_opts = {
    'format': 'worstvideo[height>=240][ext=mp4]/worst[ext=mp4]/best[ext=mp4]/best',
    'outtmpl': os.path.join(output_dir, f"platform_{unique_id}_%(id)s.%(ext)s"),
    'max_filesize': 50 * 1024 * 1024,  # 50MB file limit
    'quiet': True,
    'no_warnings': True,
    'noprogress': True,
  }
  
  with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    info = ydl.extract_info(url, download=True)
    filename = ydl.prepare_filename(info)
    return os.path.abspath(filename)
