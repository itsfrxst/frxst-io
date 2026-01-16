function handleOrientationChange(e) {
    const portrait = e.matches;
    const overlay = document.getElementById('orientationOverlay');
    if (portrait) {
        overlay.style.display = 'flex';
        // Optionally, hide main content
        document.getElementById('landingModal').style.display = 'none';
        document.getElementById('hexagon-wall').style.display = 'none';
    } else {
        overlay.style.display = 'none';
        document.getElementById('landingModal').style.display = '';
        document.getElementById('hexagon-wall').style.display = '';
        createHexagonWall(960, 20, "ENTER");
    }
}

// SPA Navigation and Loading Management
        function showLoadingScreen() {
            const loadingScreen = document.getElementById('loadingScreen');
            loadingScreen.classList.remove('fade-out', 'hidden');
            loadingScreen.style.display = 'flex';
            
            // Force browser to re-trigger CSS animations
            void loadingScreen.offsetWidth;
            
            // Reset SVG animations by cloning and replacing
            const svg = loadingScreen.querySelector('svg');
            const newSvg = svg.cloneNode(true);
            svg.parentNode.replaceChild(newSvg, svg);
        }

        function hideLoadingScreen() {
            const loadingScreen = document.getElementById('loadingScreen');
            loadingScreen.classList.add('fade-out');
            
            setTimeout(function() {
                loadingScreen.classList.add('hidden');
            }, 1000);
        }

        function showSection(sectionId) {
            // Hide all sections
            const sections = document.querySelectorAll('.content-section');
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target section
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        }

// Cache for loaded sections to avoid re-fetching
const sectionCache = {};

// Modified showSection function with dynamic loading
async function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) {
        console.error(`Section ${sectionId} not found`);
        return;
    }
    
    // Check if section content needs to be loaded
    if (!sectionCache[sectionId] && targetSection.dataset.source) {
        try {
            // Show loading indicator (optional)
            targetSection.innerHTML = '<div class="loading">Loading...</div>';
            
            // Fetch the HTML file
            const response = await fetch(targetSection.dataset.source);
            if (!response.ok) throw new Error('Failed to load section');
            
            const html = await response.text();
            targetSection.innerHTML = html;
            
            // Cache the loaded content
            sectionCache[sectionId] = html;
            
            // Execute any scripts in the loaded content (if needed)
            executeScripts(targetSection);
            
        } catch (error) {
            console.error(`Error loading ${sectionId}:`, error);
            targetSection.innerHTML = '<div class="error">Failed to load content</div>';
        }
    }
    
    // Show the section
    targetSection.classList.add('active');
}

// Helper function to execute scripts in loaded HTML
function executeScripts(container) {
    const scripts = container.querySelectorAll('script');
    scripts.forEach(script => {
        const newScript = document.createElement('script');
        if (script.src) {
            newScript.src = script.src;
        } else {
            newScript.textContent = script.textContent;
        }
        document.body.appendChild(newScript);
    });
}

        // Modified accessGranted for SPA
        function accessGranted() {
            // Show loading screen
            showLoadingScreen();
            
            // Hide landing section
            document.getElementById('landingSection').classList.remove('active');
            
            // Wait for animation to complete
            setTimeout(function() {
                // Show main content
                showSection('mainSection');
                
                // Hide loading screen
                hideLoadingScreen();
            }, 4000); // Match snowflake animation duration
        };

function createHexagonWall(numHexagons, hexagonsPerRow, enterWord) {
        const hexagonWall = document.getElementById('hexagon-wall');
        let currentIndex = 0;
        let enterWordIndex = 0;
        
        // Calculate middle range for both rows and columns
        const middleRowStart = Math.floor((numHexagons / hexagonsPerRow) / 5) - Math.floor(enterWord.length / 2);
        const middleRowEnd = middleRowStart + enterWord.length;

        const startColumn = Math.floor(hexagonsPerRow / 2) - Math.floor(enterWord.length / 2);
        
        for (let i = 0; i < numHexagons; i++) {
            // Create a new row element for every "hexagonsPerRow" hexagons
            if (i % hexagonsPerRow === 0) {
                const wallRow = document.createElement('div');
                wallRow.classList.add('wallRow');
                hexagonWall.appendChild(wallRow);
            }

            const hexagon = document.createElement('div');
            hexagon.classList.add('hexagon');
            
            // Calculate the current row and column
            const currentRow = Math.floor(i / hexagonsPerRow);
            const currentColumn = i % hexagonsPerRow;

            // Assign letters to hexagons in the middle region
            if (currentRow >= middleRowStart && currentRow < middleRowEnd && 
                currentColumn >= startColumn && enterWordIndex < enterWord.length) {
                hexagon.textContent = enterWord[enterWordIndex];
                hexagon.setAttribute("data-letter", enterWord[enterWordIndex]);
                enterWordIndex++;
            }

            // Append the hexagon to the current row
            hexagonWall.lastElementChild.appendChild(hexagon);
        }

        hexagons = document.querySelectorAll('.hexagon');
        hexagons.forEach((hexagon) => {
            hexagon.addEventListener('click', () => {
                console.log(hexagon);
                const currentLetter = enterWord[currentIndex];
                hexagon.classList.add('selected');
                if (hexagon.getAttribute('data-letter') === currentLetter) {
                    hexagon.classList.add('active');
                    currentIndex++;
                    if (currentIndex === enterWord.length) {
                        removeHexagonWall()
                        accessGranted()
                    }
                }
            });
        });
}

function removeHexagonWall() {
    // Remove the hexagon wall container with a fade-out effect
    var hexagonWall = document.getElementById('hexagon-wall');
    hexagonWall.style.transition = 'opacity 1s';
    hexagonWall.style.opacity = '0';

    // Delay removal to match the duration of the transition (1s)
    setTimeout(
        function(){ 
            hexagonWall.remove(); 
        }, 
        1000
    ); 
}

const landscapeCheck = window.matchMedia("(orientation: portrait)");
landscapeCheck.addEventListener("change", handleOrientationChange);

// Initial load sequence
        window.addEventListener('DOMContentLoaded', function() {
            // Show landing section initially hidden behind loading screen
            showSection('landingSection');
            
            // Wait for snowflake animation to complete
            setTimeout(function() {
                hideLoadingScreen();
                
                // After fade out, show landing content
                setTimeout(function() {
                    document.getElementById('landingModal').classList.add('show');
                    document.getElementById('hexagon-wall').classList.add('show');
                    
                    // Initialize hexagon wall
                    handleOrientationChange(landscapeCheck);
                }, 1000);
            }, 4000);
        });