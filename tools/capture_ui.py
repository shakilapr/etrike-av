import http.server
import socketserver
import threading
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

dist_dir = Path(r'E:\work\av_project\autoware\src\extensions\autoware_teleop\autoware_teleop_ui\dist')

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(dist_dir), **kwargs)

PORT = 51738
server = socketserver.TCPServer(('127.0.0.1', PORT), Handler)
t = threading.Thread(target=server.serve_forever, daemon=True)
t.start()
time.sleep(0.5)

out_dir = Path(r'E:\work\av_project\artifacts\screenshots')
out_dir.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1360, 'height': 820})
    page.goto(f'http://127.0.0.1:{PORT}')
    page.wait_for_timeout(800)
    page.screenshot(path=str(out_dir / 'teleop_balanced_stopped.png'), full_page=True)

    # Click exact REMOTE mode button in Operation Authority Mode
    page.get_by_role("button", name="REMOTE", exact=True).click()
    page.wait_for_timeout(300)

    # Click Engage button
    page.locator('button', has_text="PRESS TO ENGAGE DIRECT CONTROL").click()
    page.wait_for_timeout(300)

    # Click Drive gear button
    page.get_by_role("button", name="Drive (D)").click()
    page.wait_for_timeout(300)

    # Click Left turn signal
    page.get_by_role("button", name="◄ Left (Q)").click()
    page.wait_for_timeout(300)

    page.screenshot(path=str(out_dir / 'teleop_balanced_remote_engaged.png'), full_page=True)
    browser.close()

server.shutdown()
print('Balanced screenshots successfully generated!')
