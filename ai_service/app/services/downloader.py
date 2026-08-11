import os
import urllib.request
import urllib.parse
import json
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
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
  )
  with urllib.request.urlopen(req, timeout=30) as response:
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

def download_tiktok_tikwm(url: str, output_path: str) -> str:
  """
  Downloads TikTok video directly via TikWM API.
  """
  browser_ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  api_url = f"https://api.tikwm.com/api/?url={urllib.parse.quote(url)}"
  req = urllib.request.Request(api_url, headers={'User-Agent': browser_ua})
  with urllib.request.urlopen(req, timeout=15) as resp:
    res_data = json.loads(resp.read().decode('utf-8'))
  if res_data.get('code') == 0 and 'data' in res_data:
    play_url = res_data['data'].get('play') or res_data['data'].get('wmplay')
    if play_url:
      if play_url.startswith('//'):
        play_url = 'https:' + play_url
      print(f"[Downloader] Stream fetching via TikWM API success: {play_url}")
      return download_direct_video(play_url, output_path)
  raise ValueError("TikWM API extraction returned invalid payload")

def download_via_cobalt(url: str, output_path: str) -> str:
  """
  Downloads media streams (Instagram, TikTok, YouTube, etc.) via Cobalt API.
  """
  browser_ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': browser_ua
  }
  payload = json.dumps({'url': url}).encode('utf-8')
  
  try:
    api_url = "https://api.cobalt.tools/"
    req = urllib.request.Request(api_url, data=payload, headers=headers, method='POST')
    with urllib.request.urlopen(req, timeout=15) as resp:
      res_data = json.loads(resp.read().decode('utf-8'))
    stream_url = res_data.get('url')
    if stream_url:
      print(f"[Downloader] Stream fetching via Cobalt API root success: {stream_url}")
      return download_direct_video(stream_url, output_path)
  except Exception as c_err:
    print(f"[Downloader] Cobalt root endpoint failed ({c_err})")

  try:
    api_url_json = "https://api.cobalt.tools/api/json"
    req_json = urllib.request.Request(api_url_json, data=payload, headers=headers, method='POST')
    with urllib.request.urlopen(req_json, timeout=15) as resp_json:
      res_data_json = json.loads(resp_json.read().decode('utf-8'))
    stream_url = res_data_json.get('url')
    if stream_url:
      print(f"[Downloader] Stream fetching via Cobalt /api/json success: {stream_url}")
      return download_direct_video(stream_url, output_path)
  except Exception as c_json_err:
    print(f"[Downloader] Cobalt /api/json endpoint failed ({c_json_err})")

  raise ValueError("Cobalt API extraction returned no video stream URL")

def download_video_link(url: str, output_dir: str) -> str:
  """
  Downloads streaming video from direct links or platform links (YouTube, TikTok, Instagram, etc.).
  """
  os.makedirs(output_dir, exist_ok=True)
  unique_id = str(uuid.uuid4())
  url_lower = url.lower()

  # TikTok Direct API Fallback
  if "tiktok.com" in url_lower:
    try:
      print("[Downloader] TikTok URL detected. Attempting direct TikWM API extraction...")
      temp_path = os.path.join(output_dir, f"tiktok_{unique_id}.mp4")
      return download_tiktok_tikwm(url, temp_path)
    except Exception as tiktok_err:
      print(f"[Downloader] TikWM API fallback failed ({tiktok_err}). Proceeding to Cobalt/yt-dlp...")

  # Instagram Direct API Fallback
  if "instagram.com" in url_lower or "instagr.am" in url_lower:
    try:
      print("[Downloader] Instagram URL detected. Attempting direct Cobalt API extraction...")
      temp_path = os.path.join(output_dir, f"insta_{unique_id}.mp4")
      return download_via_cobalt(url, temp_path)
    except Exception as cobalt_err:
      print(f"[Downloader] Cobalt API fallback failed ({cobalt_err}). Proceeding to yt-dlp...")

  try:
    if is_direct_link(url):
      print(f"[Downloader] Direct video link detected. Streaming download directly...")
      temp_filename = f"direct_{unique_id}.mp4"
      temp_path = os.path.join(output_dir, temp_filename)
      return download_direct_video(url, temp_path)
    
    print(f"[Downloader] Platform stream link detected. Initiating yt-dlp...")
    
    ydl_opts = {
      'format': 'b[height<=720][ext=mp4]/b[height<=480]/best[height<=720]/best',
      'outtmpl': os.path.join(output_dir, f"platform_{unique_id}_%(id)s.%(ext)s"),
      'max_filesize': 100 * 1024 * 1024,  # 100MB file limit
      'socket_timeout': 15,
      'retries': 3,
      'fragment_retries': 3,
      'quiet': True,
      'no_warnings': True,
      'noprogress': True,
      'nocheckcertificate': True,
      'geo_bypass': True,
      'cookiesfrombrowser': ('chrome',),
      'extractor_args': {
        'youtube': {
          'player_client': ['android', 'web']
        }
      },
      'http_headers': {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }
    
    # 1. Environment-based Proxy Injection for VPS Deployment
    proxy_url = os.getenv('PROXY_URL') or os.getenv('YTDLP_PROXY')
    if proxy_url:
      ydl_opts['proxy'] = proxy_url
      print(f"[Downloader] Routing yt-dlp traffic through proxy: {proxy_url}")

    # 2. Local cookies.txt Session File Injection
    cookie_candidates = [
      os.path.abspath("cookies.txt"),
      os.path.abspath(os.path.join(os.path.dirname(__file__), "cookies.txt")),
      os.path.abspath(os.path.join(os.path.dirname(__file__), "../../cookies.txt")),
    ]
    for c_path in cookie_candidates:
      if os.path.exists(c_path) and os.path.getsize(c_path) > 0:
        ydl_opts['cookiefile'] = c_path
        print(f"[Downloader] Loaded session cookiefile: {c_path}")
        break

    try:
      with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
    except Exception as cookie_err:
      if 'cookiesfrombrowser' in ydl_opts:
        print(f"[Downloader] Browser cookie extraction fallback ({cookie_err}). Retrying without browser cookies...")
        ydl_opts_nocookies = dict(ydl_opts)
        del ydl_opts_nocookies['cookiesfrombrowser']
        with yt_dlp.YoutubeDL(ydl_opts_nocookies) as ydl:
          info = ydl.extract_info(url, download=True)
      else:
        raise cookie_err

    if not info:
      raise ValueError("Link extraction blocked by platform firewall. Please download the .mp4 file directly and use Direct File Upload.")
    filename = ydl.prepare_filename(info)
    if not os.path.exists(filename) or os.path.getsize(filename) == 0:
      files = [os.path.join(output_dir, f) for f in os.listdir(output_dir) if f.startswith(f"platform_{unique_id}") and os.path.getsize(os.path.join(output_dir, f)) > 0]
      if files:
        return os.path.abspath(files[0])
      raise ValueError("Failed to ingest video stream: Downloaded file is empty or missing.")
    return os.path.abspath(filename)
  except Exception as e:
    print(f"[Downloader Error] Failed to download link '{url}': {e}")
    if isinstance(e, ValueError):
      raise e
    raise ValueError("Link extraction blocked by platform firewall. Please download the .mp4 file directly and use Direct File Upload.")
