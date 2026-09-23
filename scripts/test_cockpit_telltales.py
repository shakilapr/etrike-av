from playwright.sync_api import sync_playwright
import time

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})
        page.goto('http://127.0.0.1:8080')
        page.wait_for_selector('text=seer', timeout=10000)
        time.sleep(1)
        
        # 1. Switch to 3D Cockpit
        page.keyboard.press('Tab')
        time.sleep(2)
        page.screenshot(path='C:/Users/logsh/.gemini/antigravity/brain/5e903809-cdf2-4143-a32c-9711007ac34b/telltales_chase_nominal.png')

        # 2. Orbit view
        page.keyboard.press('3')
        time.sleep(0.5)
        page.mouse.move(960, 540)
        page.mouse.down()
        page.mouse.move(500, 540, steps=10)
        page.mouse.up()
        time.sleep(0.5)
        page.screenshot(path='C:/Users/logsh/.gemini/antigravity/brain/5e903809-cdf2-4143-a32c-9711007ac34b/telltales_orbit_view.png')

        # 3. Simulate braking event to capture the red gradient rising from bottom
        page.evaluate('''() => {
            const divs = Array.from(document.querySelectorAll('div'));
            const flare = divs.find(d => d.style.background && d.style.background.includes('linear-gradient'));
            if (flare) {
                flare.style.opacity = '0.9';
                flare.style.height = '40%';
            }
        }''')
        page.screenshot(path='C:/Users/logsh/.gemini/antigravity/brain/5e903809-cdf2-4143-a32c-9711007ac34b/telltales_brake_flare.png')

        # 4. Simulate E-Stop event to capture full-screen emergency pulse
        page.evaluate('''() => {
            const estopDiv = document.createElement('div');
            estopDiv.className = 'fixed inset-0 pointer-events-none z-50 bg-rose-950/30 border-8 border-rose-600/80 shadow-[inset_0_0_100px_rgba(225,29,72,0.7)]';
            document.body.appendChild(estopDiv);
        }''')
        page.screenshot(path='C:/Users/logsh/.gemini/antigravity/brain/5e903809-cdf2-4143-a32c-9711007ac34b/telltales_estop_strobe.png')

        browser.close()
    print('All views captured successfully')

if __name__ == '__main__':
    main()
