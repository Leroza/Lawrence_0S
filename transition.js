const desktop = document.getElementById('desktop');
const taskbarApps = document.getElementById('taskbar-apps');
const startButton = document.getElementById('start-button');
const startMenu = document.getElementById('start-menu');
const systemTray = document.getElementById('system-tray');
const windowTemplate = document.getElementById('window-template');

const shutdownOverlay = document.getElementById('shutdown-overlay');
const shutdownMessage = document.getElementById('shutdown-message');
const carouselTextEl = document.getElementById('carousel-text');

const confirmationDialog = document.getElementById('confirmation-dialog');
const confirmationMessage = document.getElementById('confirmation-message');
const confirmYesBtn = document.getElementById('confirm-yes');
const confirmNoBtn = document.getElementById('confirm-no');


let highestZIndex = 100;
const openWindows = {};
let windowCascadeOffset = 0;


// --- ICONS & WINDOWS DATA ---
const iconsData = {
    'about': {
        title: 'README.txt',
        icon: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm8 7h-2V4l4 4h-2z"/></svg>`,
        content: `<h3>> My Design Philosophy</h3>
                  <p>For me, web design isn't just about code and pixels; it's about empathy. It's about understanding the user's journey and crafting an experience that feels natural, engaging, and delightful.</p>
                  <p>I'm a firm believer in clean aesthetics, minimalist principles, and the power of a great story.</p>
                  <h3>> My Toolkit</h3>
                  <p>HTML & CSS | JavaScript | React | Figma | Tailwind CSS | Webflow | User Experience (UX)</p>`,
        position: { top: '20px', left: '20px' }
    },
    'resume': {
         title: 'resume.doc',
         icon: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM9 12c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 6H9v-1.21c0-2 4-3.1 6-3.1s6 1.1 6 3.1V18h-6z"/></svg>`,
         content: `
           <div class="resume-container">
               <div class="resume-photo">
                    <img src="https://placehold.co/100x100/1a1a1a/00e038?text=LawrenceOS" alt="LawrenceOS Barraza">
               </div>
               <div class="resume-header">
                   <h1>LawrenceOS Barraza</h1>
                   <p>Digital Dreamweaver & Web Designer</p>
               </div>
           </div>
           <div class="resume-section">
               <h3>> Experience</h3>
               <p><strong>Lead Web Designer</strong> | PixelPerfect Inc. | 2022 - Present</p>
               <p><strong>UI/UX Intern</strong> | Creative Solutions | 2021 - 2022</p>
           </div>
            <div class="resume-section">
               <h3>> Education</h3>
               <p><strong>B.S. in Web Design & Development</strong> | University of Technology | 2017 - 2021</p>
           </div>
           <div class="resume-section hidden" id="ai-bio-section">
               <h3>> Fun Bio (from AI)</h3>
               <p id="ai-bio-content"></p>
           </div>
           <button class="gemini-btn" id="generate-bio-btn">✨ Generate Fun Bio</button>
         `,
         position: { top: '20px', left: '110px' }
    },
    'projects': {
        title: 'Projects',
        icon: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>`,
        content: `<h3>> Selected Works</h3>
                  <ul class="project-list">
                        <li class="project-item"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M14.59 2.09L15 2.5V3h-1.58l-1.3-1.3.48-.48c.19-.19.44-.29.7-.29.27 0 .52.1.71.29M5.5 3c.83 0 1.5.67 1.5 1.5S6.33 6 5.5 6 4 5.33 4 4.5 4.67 3 5.5 3m13.7 1.29l-3.09 3.09c-.19.19-.44.29-.7.29s-.52-.1-.71-.29l-.48-.48-1.3 1.3V10h.5l.41-.41 4.5-4.5c.29-.29.44-.68.44-1.09s-.15-.8-.44-1.09c-.29-.29-.68-.44-1.09-.44-.41 0-.8.15-1.09.44l-1.09 1.09-3.09 3.09-3.09-3.09L8.81 3.5c-.59-.58-1.59-.58-2.18 0l-1.09 1.09L3.46 6.67c-.29-.29-.44.68-.44 1.09 0 .41.15.8.44 1.09l4.5 4.5.41.41H9v-.5l1.3-1.3.48.48c.19.19.44.29.7.29s.52-.1.71-.29l3.09-3.09 3.09 3.09c.59.58 1.59.58 2.18 0l1.09-1.09 2.08-2.08c.29-.29.44-.68.44-1.09s-.15-.8-.44-1.09l-.1-.1zM18.5 13c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5m-13 7c-.83 0-1.5-.67-1.5-1.5S4.67 17 5.5 17s1.5.67 1.5 1.5S6.33 20 5.5 20m13-7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5m0 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg> <span>Artisan Coffee Co.</span></li>
                        <li class="project-item"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v12H4z" opacity=".3"/><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H4V4h16v12zM6 10h2v2H6zm0-3h2v2H6zm0-3h2v2H6zm4 6h8v2h-8zm0-3h8v2h-8zm0-3h8v2h-8z"/></svg> <span>Zenith Finance Dashboard</span></li>
                        <li class="project-item"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg> <span>Creative Agency Rebrand</span></li>
                  </ul>
                  <button class="gemini-btn" id="suggest-projects-btn">✨ Suggest New Projects</button>
                  `,
        position: { top: '20px', left: '200px' }
    },
    'contact': {
        title: 'contact.sh',
        icon: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4.01c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM4 22V4h16v18H4z M12 14l-4-4h8l-4 4z"/></svg>`,
        content: `<h3>> Let's Collaborate</h3>
                  <p>Have an idea brewing? I'd love to hear about it. Drop a line below.</p>
                  <form id="contact-form">
                       <div class="form-group"><label for="name">NAME:</label><input type="text" id="name" required></div>
                       <div class="form-group"><label for="email">EMAIL:</label><input type="email" id="email" required></div>
                       <div class="form-group"><label for="message">MESSAGE:</label><textarea id="message" rows="4" required></textarea></div>
                       <button type="submit" class="submit-btn">SEND_MESSAGE</button>
                       <div id="form-message" style="margin-top:10px;"></div>
                  </form>`,
        position: { top: '130px', left: '20px' }
    },
    'terminal': {
        title: 'Terminal.exe',
        icon: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM8.3 16.3l-1.4-1.4 2.3-2.3-2.3-2.3 1.4-1.4 3.7 3.7-3.7 3.7zm5.4 0h-4v-2h4v2z"/></svg>`,
        content: `<h3>>_ TERMINAL</h3>
                  <div class="terminal-output" id="terminal-output">Welcome to LawrenceOS. Type 'help' for a list of commands.</div>
                  <div class="terminal-input-line">
                    <span class="terminal-prompt">> </span>
                    <input type="text" class="terminal-input" autofocus>
                  </div>`,
        position: { top: '130px', left: '110px' }
    },
    'tetris': {
        title: 'tetris.exe',
        icon: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M10 2H4v6h6V2zm0 8H4v6h6v-6zm0 8H4v6h6v-6zm8-16h-6v6h6V2zm0 8h-6v6h6v-6zm0 8h-6v6h6v-6z"/></svg>`,
        content: `<div class="tetris-game-container">
                          <div class="tetris-info">
                              <h3>> SCORE</h3>
                              <p id="tetris-score">0</p>
                              <br>
                              <h3>> CONTROLS</h3>
                              <p>A/D: Move</p>
                              <p>W: Rotate</p>
                              <p>S: Speed Up</p>
                          </div>
                          <canvas id="tetris-canvas" width="200" height="400"></canvas>
                          <div class="tetris-mobile-controls">
                            <button class="mobile-btn" id="mc-up">W</button>
                            <button class="mobile-btn" id="mc-left">A</button>
                            <button class="mobile-btn" id="mc-down">S</button>
                            <button class="mobile-btn" id="mc-right">D</button>
                          </div>
                      </div>`,
        position: { top: '130px', left: '200px'}
    },
    'github': {
        title: 'github.link',
        type: 'link',
        url: 'https://github.com',
        icon: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.7-2.8 5.7-5.5 6 .4.3.8 1 .8 2v2.9c0 .3.2.7.8.6A12 12 0 0 0 12 .3z"/></svg>`,
        position: { top: '240px', left: '20px' }
    },
    'music': {
        title: 'chiptune.mp3',
        icon: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H8a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2zm-9 4h5v2h-5V6zm0 4h5v2h-5v-2zm-3-4h2v2H8V6zm0 4h2v2H8v-2zM4 6H2v14a2 2 0 002 2h14v-2H4V6z"/></svg>`,
        content: `<div class="music-player-container">
                        <h3>> Now Playing</h3>
                        <div class="song-info">
                            <p>Ready to play.</p>
                        </div>
                        <button id="play-pause-btn" disabled>PLAY</button>
                        <input type="range" id="progress-bar" value="0" step="0.01" max="100">
                        <div class="music-search">
                            <input type="text" id="music-search-input" class="form-group" placeholder="Search for a vibe (e.g., 'space battle')...">
                            <button class="gemini-btn" id="music-search-btn">✨</button>
                        </div>
                        <input type="file" id="song-upload" accept="audio/*" class="hidden">
                        <button class="gemini-btn" id="add-song-btn">📂 Add Song</button>
                      </div>`,
        position: { top: '240px', left: '110px' }
    },
    'trash': {
        title: 'trash.bin',
        icon: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`,
        content: `<h3>> Trash</h3><p>Directory is empty.</p>`,
        position: { top: 'calc(100% - 100px)', left: 'calc(100% - 100px)' }
    },
    'toolazy': {
        title: 'too_lazy.exe',
        icon: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 4H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 14H5V8h14v10zM5 6h14v2H5z"/></svg>`,
        position: { top: '350px', left: '20px' },
        type: 'confirmLink',
        url: 'https://your-basic-portfolio-link.com', 
        content: `This portfolio is too much for you?<br><br>Redirect to a simpler, more... 'traditional' portfolio?`
    }
};

// --- BACKGROUND ---
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

let resizeTimer;
const setupCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = [];
    for(let x=0; x<columns; x++) drops[x] = 1;

    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";

    function draw() {
        ctx.fillStyle = "rgba(13, 13, 13, 0.05)";
        ctx.fillRect(0,0,canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0, 224, 56, 0.5)";
        ctx.font = fontSize + "px VT323";

        for(let i=0; i<drops.length; i++){
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i*fontSize, drops[i]*fontSize);
            if(drops[i]*fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    setInterval(draw, 33);
};

window.addEventListener('resize', () => {
     clearTimeout(resizeTimer);
     resizeTimer = setTimeout(setupCanvas, 500);
});

setupCanvas();

// --- CAROUSEL ---
const sentences = [
    "is this vibe coded?",
    "how many files did you use?",
    "should i hire you?",
    "hmmm????"
];
let sentenceIndex = 0;

function updateCarousel() {
    carouselTextEl.classList.add('fade');
    setTimeout(() => {
        sentenceIndex = (sentenceIndex + 1) % sentences.length;
        carouselTextEl.textContent = sentences[sentenceIndex];
        carouselTextEl.classList.remove('fade');
    }, 500); // Match CSS transition time
}
carouselTextEl.textContent = sentences[sentenceIndex]; // Initial text
setInterval(updateCarousel, 10000); // 10 seconds

// --- GEMINI API CALLER ---
async function callGeminiApi(prompt, jsonSchema = null, retries = 3, delay = 1000) {
    const apiKey = "AIzaSyAq2m289KR6XletLhRmAVtGU4eI8ysk9Og"; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
    };
    
    if (jsonSchema) {
        payload.generationConfig = {
            responseMimeType: "application/json",
            responseSchema: jsonSchema
        };
    }

    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`);
            }

            const result = await response.json();
            const candidate = result.candidates?.[0];

            if (candidate && candidate.content?.parts?.[0]?.text) {
                return candidate.content.parts[0].text;
            } else {
                 throw new Error("Invalid response structure from API");
            }
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
            if (i === retries - 1) {
                 // Last retry failed
                 return null;
            }
            await new Promise(res => setTimeout(res, delay * Math.pow(2, i)));
        }
    }
    return null; // Should not be reached if retries are configured
}

// --- WINDOW MANAGER ---
function createWindow(id) {
    if (openWindows[id]) {
        focusWindow(id);
        if(openWindows[id].minimized) toggleMinimize(id);
        return;
    }

    const data = iconsData[id];
    const clone = windowTemplate.content.cloneNode(true);
    const windowEl = clone.querySelector('.window');
    
    const cascadeStep = 30;
    windowEl.style.top = `${50 + (windowCascadeOffset * cascadeStep)}px`;
    windowEl.style.left = `${150 + (windowCascadeOffset * cascadeStep)}px`;
    windowCascadeOffset++;
     if ((50 + (windowCascadeOffset * cascadeStep)) > (desktop.clientHeight / 2) || (150 + (windowCascadeOffset * cascadeStep)) > (desktop.clientWidth / 2)) {
        windowCascadeOffset = 0;
    }

    windowEl.querySelector('.title').textContent = data.title;
    windowEl.querySelector('.window-body').innerHTML = data.content;
    
    desktop.appendChild(windowEl);
    openWindows[id] = { el: windowEl, minimized: false, prevSize: null };
    
    setupWindow(id, windowEl);
    createTaskbarApp(id);
    focusWindow(id);
}

function setupWindow(id, windowEl) {
    const titleBar = windowEl.querySelector('.title-bar');
    let isDragging = false, offset = { x: 0, y: 0 };
    
    titleBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        offset = { x: windowEl.offsetLeft - e.clientX, y: windowEl.offsetTop - e.clientY };
        focusWindow(id);
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        windowEl.style.left = e.clientX + offset.x + 'px';
        windowEl.style.top = e.clientY + offset.y + 'px';
    });
    document.addEventListener('mouseup', () => { isDragging = false; });
    
    windowEl.querySelector('.close-btn').addEventListener('click', () => closeWindow(id));
    windowEl.querySelector('.minimize-btn').addEventListener('click', () => toggleMinimize(id, true));
    windowEl.querySelector('.maximize-btn').addEventListener('click', () => toggleMaximize(id));
    windowEl.addEventListener('mousedown', () => focusWindow(id), true);

    if (id === 'contact') {
         const form = windowEl.querySelector('#contact-form');
         const msg = windowEl.querySelector('#form-message');
         form.addEventListener('submit', (e) => {
             e.preventDefault();
             msg.textContent = "> Message sent successfully!";
             setTimeout(() => { msg.textContent = ''; }, 3000);
             form.reset();
         });
    } else if (id === 'terminal') {
        const output = windowEl.querySelector('.terminal-output');
        const input = windowEl.querySelector('.terminal-input');
        input.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter') return;
            e.stopPropagation(); 
            const command = input.value.trim();
            output.textContent += `\n> ${command}\n`;
            handleCommand(command, output);
            input.value = '';
            output.scrollTop = output.scrollHeight;
        });
    } else if (id === 'tetris') {
        const game = initTetris(windowEl);
        openWindows[id].game = game;
    } else if (id === 'music') {
        const player = initMusicPlayer(windowEl);
        openWindows[id].player = player;
    } else if (id === 'resume') {
        const btn = windowEl.querySelector('#generate-bio-btn');
        btn.addEventListener('click', async () => {
            btn.disabled = true;
            btn.textContent = 'Generating...';
            const prompt = `Based on this resume info:\n\nExperience: Lead Web Designer at PixelPerfect Inc. (2022-Present), UI/UX Intern at Creative Solutions (2021-2022).\nEducation: B.S. in Web Design & Development.\n\nRewrite this into a fun, quirky, first-person bio suitable for a creative portfolio, in one paragraph. Keep it concise.`;
            const bio = await callGeminiApi(prompt);
            const bioSection = windowEl.querySelector('#ai-bio-section');
            const bioContent = windowEl.querySelector('#ai-bio-content');
            if (bio) {
                bioContent.textContent = bio;
                bioSection.classList.remove('hidden');
            } else {
                bioContent.textContent = 'AI is sleeping... could not generate bio.';
            }
            btn.disabled = false;
            btn.textContent = '✨ Generate Fun Bio';
        });
    } else if (id === 'projects') {
        const btn = windowEl.querySelector('#suggest-projects-btn');
        const projectList = windowEl.querySelector('.project-list');
        btn.addEventListener('click', async () => {
            btn.disabled = true;
            btn.textContent = 'Generating...';
            const prompt = "Based on existing projects like 'Artisan Coffee Co.', 'Zenith Finance Dashboard', and a 'Creative Agency Rebrand', generate 3 new, creative web design project ideas. Provide a name and a one-sentence description for each.";
            const schema = {
                type: "OBJECT",
                properties: {
                    "projects": {
                        "type": "ARRAY",
                        "items": {
                            "type": "OBJECT",
                            "properties": {
                                "name": { "type": "STRING" },
                                "description": { "type": "STRING" }
                            },
                            "required": ["name", "description"]
                        }
                    }
                }
            };
            const response = await callGeminiApi(prompt, schema);
            if (response) {
                try {
                    const newProjects = JSON.parse(response).projects;
                    newProjects.forEach(p => {
                        const li = document.createElement('li');
                        li.className = 'project-item';
                        li.innerHTML = `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" opacity=".3"/><path d="M11 7h2v6h-2zm0 8h2v2h-2zm1-15C6.48 0 2 4.48 2 10s4.48 10 10 10 10-4.48 10-10S17.52 0 12 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg> <span>${p.name} (AI Idea)</span>`;
                        projectList.appendChild(li);
                    });
                } catch (e) { console.error("Failed to parse project ideas", e); }
            }
            btn.disabled = false;
            btn.textContent = '✨ Suggest New Projects';
        });
    }

}

function closeWindow(id) {
    if (!openWindows[id]) return;
    
    if (openWindows[id].game && openWindows[id].game.stop) openWindows[id].game.stop();
    if (openWindows[id].player && openWindows[id].player.stop) openWindows[id].player.stop();
    
    openWindows[id].el.remove();
    delete openWindows[id];
    
    const taskbarApp = document.getElementById(`task-app-${id}`);
    if(taskbarApp) taskbarApp.remove();

     if (Object.keys(openWindows).length === 0) {
        windowCascadeOffset = 0;
    }
}

function focusWindow(id) {
    if (!openWindows[id]) return;
    highestZIndex++;
    openWindows[id].el.style.zIndex = highestZIndex;
    
    document.querySelectorAll('.taskbar-app').forEach(app => app.classList.remove('active'));
    const taskbarApp = document.getElementById(`task-app-${id}`);
    if(taskbarApp) taskbarApp.classList.add('active');
}

function toggleMinimize(id, byButton = false) {
    const win = openWindows[id];
    if(byButton) win.minimized = true;
    else win.minimized = !win.minimized;
    
    win.el.classList.toggle('hidden', win.minimized);
    if (!win.minimized) focusWindow(id);
}

function toggleMaximize(id) {
    const win = openWindows[id];
    const desktopRect = desktop.getBoundingClientRect();
    if (win.prevSize) {
        Object.assign(win.el.style, win.prevSize);
        win.prevSize = null;
    } else {
         win.prevSize = { width: win.el.style.width, height: win.el.style.height, top: win.el.style.top, left: win.el.style.left };
        Object.assign(win.el.style, { width: `${desktopRect.width - 4}px`, height: `${desktopRect.height - 4}px`, top: '0', left: '0' });
    }
}

// --- TASKBAR ---
function createTaskbarApp(id) {
     if (document.getElementById(`task-app-${id}`)) return;
    const data = iconsData[id];
    const app = document.createElement('div');
    app.className = 'taskbar-app';
    app.id = `task-app-${id}`;
    app.textContent = data.title;
    app.addEventListener('click', () => {
        const win = openWindows[id];
        if (win.el.style.zIndex == highestZIndex && !win.minimized) toggleMinimize(id, true);
        else toggleMinimize(id, false);
    });
    taskbarApps.appendChild(app);
}

// --- POWER CONTROLS ---
function restartSequence(){
     confirmationDialog.classList.add('hidden');
     shutdownMessage.innerHTML = "It is now safe to restart your computer.<br><br>Restarting...";
     shutdownOverlay.classList.remove('hidden');
     setTimeout(() => { window.location.href = 'index.html'; }, 3000);
}

function shutdownSequence(){
     confirmationDialog.classList.add('hidden');
     shutdownMessage.innerHTML = "It is now safe to turn off your computer.<br><br>Shutting down...";
     shutdownOverlay.classList.remove('hidden');
     setTimeout(() => { window.location.href = 'index.html'; }, 3000);
}

function confirmAction(type) {
    startMenu.classList.add('hidden');
    if (type === 'restart') {
        confirmationMessage.textContent = "Are you sure you want to restart?";
        confirmYesBtn.onclick = restartSequence;
    } else if (type === 'shutdown') {
        confirmationMessage.textContent = "Are you sure you want to shut down?";
        confirmYesBtn.onclick = shutdownSequence;
    }
    confirmationDialog.classList.remove('hidden');
}

function confirmRedirect(url, message) {
    startMenu.classList.add('hidden');
    confirmationMessage.innerHTML = message;
    confirmYesBtn.onclick = () => {
        window.open(url, '_blank');
        confirmationDialog.classList.add('hidden');
    };
    confirmationDialog.classList.remove('hidden');
}

confirmNoBtn.addEventListener('click', () => {
    confirmationDialog.classList.add('hidden');
});


// --- START MENU & SYSTEM TRAY ---
startButton.addEventListener('click', (e) => { e.stopPropagation(); startMenu.classList.toggle('hidden'); });
document.addEventListener('click', () => { startMenu.classList.add('hidden'); });

function updateSystemTray() { 
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); 
    const date = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const weather = "29°C Clear";
    const location = "Caloocan City";
    systemTray.textContent = `${weather} | ${location} | ${date} ${time}`;
}
setInterval(updateSystemTray, 1000 * 60); // Update every minute
updateSystemTray();

// --- TERMINAL COMMANDS ---
async function handleCommand(command, output) {
    const args = command.split(' ');
    const cmd = args[0].toLowerCase();
    switch(cmd) {
        case 'help': output.textContent += "Available commands: help, ls, cat, clear, ask ✨"; break;
        case 'ls': output.textContent += '\n' + Object.keys(iconsData).map(id => iconsData[id].title).join('\n'); break;
        case 'cat':
            const filename = args.slice(1).join(' ');
            const fileId = Object.keys(iconsData).find(id => iconsData[id].title === filename);
            if (fileId) {
                 const plainText = new DOMParser().parseFromString(iconsData[fileId].content, 'text/html').body.textContent || "";
                 output.textContent += plainText.replace(/(\r\n|\n|\r)/gm, "\n").trim();
            } else {
                 output.textContent += `cat: ${filename}: No such file or directory`;
            }
            break;
        case 'clear': output.textContent = "Welcome to LawrenceOS. Type 'help' for a list of commands."; break;
        case 'ask':
             const question = args.slice(1).join(' ');
             if (!question) {
                 output.textContent += '\nUsage: ask <your question>';
                 break;
             }
             output.textContent += '\nThinking...';
             output.scrollTop = output.scrollHeight;
             const answer = await callGeminiApi(question);
             if (answer) {
                 output.textContent = output.textContent.replace('Thinking...', `LawrenceOS AI:\n${answer}`);
             } else {
                 output.textContent = output.textContent.replace('Thinking...', 'AI assistant is sleeping...');
             }
             break;
        default: output.textContent += `\ncommand not found: ${command}`;
    }
    output.scrollTop = output.scrollHeight;
}

// --- TETRIS GAME LOGIC ---
function initTetris(windowEl) {
    const canvas = windowEl.querySelector('#tetris-canvas');
    const scoreEl = windowEl.querySelector('#tetris-score');
    const context = canvas.getContext('2d');
    const COLS = 10, ROWS = 20;
    const BLOCK_SIZE = 20;
    
    context.scale(BLOCK_SIZE, BLOCK_SIZE);
    let score = 0;
    let animationFrameId;

    const PIECES = [[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[0,1,1],[1,1,0]],[[1,1,0],[0,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]]];
    const COLORS = ['#0d0d0d', '#00e038', '#007a1e', '#3cff6b', '#90ee90', '#32cd32', '#228b22', '#006400'];

    function createGrid(rows, cols) { return Array.from({length: rows}, () => Array(cols).fill(0)); }
    let grid = createGrid(ROWS, COLS);
    let piece = newPiece();

    function newPiece() {
        const typeId = Math.floor(Math.random() * PIECES.length);
        const matrix = PIECES[typeId];
        return { x: Math.floor(COLS / 2) - Math.floor(matrix[0].length / 2), y: 0, matrix: matrix, color: typeId + 1 };
    }

    function draw() {
        context.fillStyle = '#000';
        context.fillRect(0,0, canvas.width, canvas.height);
        drawMatrix(grid, {x: 0, y: 0});
        drawMatrix(piece.matrix, piece, piece.color);
    }

    function drawMatrix(matrix, offset, color = null) {
        matrix.forEach((row, y) => row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = COLORS[color || value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        }));
    }

    function merge(piece) {
        piece.matrix.forEach((row, y) => row.forEach((value, x) => {
            if(value !== 0) grid[y + piece.y][x + piece.x] = piece.color;
        }));
    }

    function collide(piece) {
        for (let y = 0; y < piece.matrix.length; y++) {
            for (let x = 0; x < piece.matrix[y].length; x++) {
                if (piece.matrix[y][x] !== 0 && (grid[y + piece.y] && grid[y + piece.y][x + piece.x]) !== 0) return true;
            }
        }
        return false;
    }
    
    function rotate(matrix, dir) {
        const rotated = matrix.map((_, index) => matrix.map(col => col[index]));
        if (dir > 0) return rotated.map(row => row.reverse());
        return rotated.reverse();
    }

    function pieceRotate(dir) {
        const pos = piece.x;
        let offset = 1;
        piece.matrix = rotate(piece.matrix, dir);
        while (collide(piece)) {
            piece.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > piece.matrix[0].length) {
                piece.matrix = rotate(piece.matrix, -dir);
                piece.x = pos;
                return;
            }
        }
    }

    function pieceDrop() {
        piece.y++;
        if (collide(piece)) {
            piece.y--;
            merge(piece);
            sweep();
            piece = newPiece();
            if(collide(piece)) { grid.forEach(row => row.fill(8)); } // Game Over
        }
        dropCounter = 0;
    }
    
    function pieceMove(dir) {
        piece.x += dir;
        if (collide(piece)) piece.x -= dir;
    }
    
    function sweep() {
        outer: for (let y = grid.length - 1; y > 0; --y) {
            for (let x = 0; x < grid[y].length; ++x) {
                if (grid[y][x] === 0) continue outer;
            }
            const row = grid.splice(y, 1)[0].fill(0);
            grid.unshift(row);
            ++y;
            score += 10;
            scoreEl.textContent = score;
        }
    }

    let dropCounter = 0, dropInterval = 1000, lastTime = 0;

    function update(time = 0) {
        const deltaTime = time - lastTime;
        lastTime = time;
        dropCounter += deltaTime;
        if (dropCounter > dropInterval) pieceDrop();
        draw();
        animationFrameId = requestAnimationFrame(update);
    }

    function keyHandler(event) {
        if (openWindows['tetris'] && openWindows['tetris'].el.style.zIndex != highestZIndex) return;
        const key = event.key.toLowerCase();
        if (key === 'a') pieceMove(-1);
        else if (key === 'd') pieceMove(1);
        else if (key === 's') pieceDrop();
        else if (key === 'w') pieceRotate(1);
    }

    document.addEventListener('keydown', keyHandler);

    const handleMobileInput = (e, action) => {
         e.preventDefault();
         if (openWindows['tetris'] && openWindows['tetris'].el.style.zIndex == highestZIndex) action();
    };
    
    windowEl.querySelector('#mc-up').addEventListener('touchstart', (e) => handleMobileInput(e, () => pieceRotate(1)), { passive: false });
    windowEl.querySelector('#mc-left').addEventListener('touchstart', (e) => handleMobileInput(e, () => pieceMove(-1)), { passive: false });
    windowEl.querySelector('#mc-down').addEventListener('touchstart', (e) => handleMobileInput(e, () => pieceDrop()), { passive: false });
    windowEl.querySelector('#mc-right').addEventListener('touchstart', (e) => handleMobileInput(e, () => pieceMove(1)), { passive: false });

    update();
    return { stop: () => { cancelAnimationFrame(animationFrameId); document.removeEventListener('keydown', keyHandler); } };
}

// --- MUSIC PLAYER LOGIC ---
function initMusicPlayer(windowEl) {
    const playBtn = windowEl.querySelector('#play-pause-btn');
    const addSongBtn = windowEl.querySelector('#add-song-btn');
    const songUploadInput = windowEl.querySelector('#song-upload');
    const progressBar = windowEl.querySelector('#progress-bar');
    const songInfo = windowEl.querySelector('.song-info p');
    const searchInput = windowEl.querySelector('#music-search-input');
    const searchBtn = windowEl.querySelector('#music-search-btn');
    
    const localAudio = new Audio();
    let currentObjectUrl = null;
    let aiSynth, aiSequence;
    let currentMode = 'local'; // 'local' or 'ai'

    // Local file playback
    addSongBtn.addEventListener('click', () => songUploadInput.click());

    songUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;
        stopAllMusic();

        if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
        currentObjectUrl = URL.createObjectURL(file);
        
        localAudio.src = currentObjectUrl;
        songInfo.textContent = file.name;
        playBtn.disabled = false;
        playBtn.textContent = 'PLAY';
        currentMode = 'local';
    });
    
    playBtn.addEventListener('click', () => {
        if (currentMode === 'local' && localAudio.src) {
            if (localAudio.paused) localAudio.play();
            else localAudio.pause();
            playBtn.textContent = localAudio.paused ? 'PLAY' : 'PAUSE';
        } else if (currentMode === 'ai') {
            if (Tone.Transport.state === 'started') Tone.Transport.pause();
            else {
                 if (Tone.context.state !== 'running') Tone.start();
                 Tone.Transport.start();
            }
            playBtn.textContent = Tone.Transport.state === 'started' ? 'PAUSE' : 'PLAY';
        }
    });

    // Local Audio Listeners
    localAudio.addEventListener('timeupdate', () => {
        if (currentMode === 'local' && localAudio.duration) {
            progressBar.value = (localAudio.currentTime / localAudio.duration) * 100;
        }
    });
    localAudio.addEventListener('ended', () => {
        playBtn.textContent = 'PLAY';
        progressBar.value = 0;
    });
    
    progressBar.addEventListener('input', () => {
        if (currentMode === 'local' && localAudio.duration) {
            localAudio.currentTime = (progressBar.value / 100) * localAudio.duration;
        }
    });

    // AI Music Search
    searchBtn.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        if (!query) return;
        
        stopAllMusic();
        searchBtn.disabled = true;
        searchBtn.textContent = '...';
        songInfo.textContent = `Searching the digital ether for '${query}'...`;

        const titlePrompt = `You are a music database from a retro hacker OS. Based on the user query '${query}', invent a cool, plausible-sounding chiptune/8-bit song title and artist.`;
        const titleSchema = { type: "OBJECT", properties: { "title": { "type": "STRING" }, "artist": { "type": "STRING" } } };
        const titleResponse = await callGeminiApi(titlePrompt, titleSchema);

        if (!titleResponse) {
            songInfo.textContent = "Network error. Try again.";
            searchBtn.disabled = false;
            searchBtn.textContent = '✨';
            return;
        }

        try {
            const { title, artist } = JSON.parse(titleResponse);
            songInfo.textContent = `${title} - ${artist}`;
            
            const melodyPrompt = `Generate a simple, 16-note chiptune melody for a song called '${title}' with a '${query}' vibe. Respond with a JSON array of notes and durations like [["C4", "8n"], ["E4", "8n"], ...]`;
            const melodySchema = { type: "OBJECT", properties: { "melody": { type: "ARRAY", items: { type: "ARRAY", items: { "type": "STRING" } } } } };
            const melodyResponse = await callGeminiApi(melodyPrompt, melodySchema);

            if (melodyResponse) {
                const { melody } = JSON.parse(melodyResponse);
                playAiMelody(melody);
                currentMode = 'ai';
                playBtn.disabled = false;
                playBtn.textContent = 'PAUSE';
            } else {
                songInfo.textContent = 'Could not compose melody.';
            }

        } catch(e) {
            console.error("AI Music Error:", e);
            songInfo.textContent = "AI data stream corrupted.";
        }

        searchBtn.disabled = false;
        searchBtn.textContent = '✨';
    });
    
    function playAiMelody(melody) {
         if (Tone.context.state !== 'running') Tone.start();
         
         aiSynth = new Tone.Synth({
            oscillator: { type: "square" },
            envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.2, },
        }).toDestination();
        
        aiSequence = new Tone.Sequence((time, note) => {
            aiSynth.triggerAttackRelease(note[0], note[1], time);
        }, melody, "8n").start(0);
        
        aiSequence.loop = true;
        Tone.Transport.start();
    }

    function stopAllMusic() {
        // Stop local audio
        localAudio.pause();
        localAudio.currentTime = 0;
        
        // Stop AI audio
        Tone.Transport.stop();
        if (aiSequence) aiSequence.dispose();
        if (aiSynth) aiSynth.dispose();
        
        playBtn.textContent = 'PLAY';
        progressBar.value = 0;
    }

    return { stop: stopAllMusic };
}


// --- INITIALIZE DESKTOP ---
function init() {
    const startMenuList = startMenu.querySelector('ul');
    Object.keys(iconsData).forEach(id => {
        const data = iconsData[id];
        const iconEl = document.createElement('div');
        iconEl.className = 'desktop-icon';
        iconEl.style.top = data.position.top;
        iconEl.style.left = data.position.left;
        iconEl.innerHTML = `${data.icon}<span>${data.title}</span>`;
        
        const startMenuItem = document.createElement('li');
        startMenuItem.innerHTML = `<a data-id="${id}">${data.icon}<span>${data.title}</span></a>`;

        if (data.type === 'link') {
            const action = () => window.open(data.url, '_blank');
            iconEl.addEventListener('dblclick', action);
            startMenuItem.querySelector('a').addEventListener('click', action);
        } else if (data.type === 'confirmLink') {
            const action = () => confirmRedirect(data.url, data.content);
            iconEl.addEventListener('dblclick', action);
            startMenuItem.querySelector('a').addEventListener('click', () => {
                action();
                startMenu.classList.add('hidden');
            });
        } else {
            iconEl.addEventListener('dblclick', () => createWindow(id));
            startMenuItem.querySelector('a').addEventListener('click', () => {
                createWindow(id);
                startMenu.classList.add('hidden');
            });
        }
        
        desktop.appendChild(iconEl);
        if(id !== 'toolazy') { // Keep too_lazy out of start menu
            startMenuList.appendChild(startMenuItem);
        }
    });
    
    // Add power controls to start menu
    const divider = document.createElement('li');
    divider.className = 'divider';
    startMenuList.appendChild(divider);
    
    const restartLi = document.createElement('li');
    restartLi.innerHTML = `<a><svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg><span>Restart</span></a>`;
    restartLi.querySelector('a').addEventListener('click', () => confirmAction('restart'));
    startMenuList.appendChild(restartLi);
    
    const shutdownLi = document.createElement('li');
    shutdownLi.innerHTML = `<a><svg fill="currentColor" viewBox="0 0 24 24"><path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/></svg><span>Shut Down</span></a>`;
    shutdownLi.querySelector('a').addEventListener('click', () => confirmAction('shutdown'));
    startMenuList.appendChild(shutdownLi);
}

init();

