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
            }, 5000); // Match snowflake animation duration
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

function accessGranted() {
    var newUrl = "./main.html"
    document.location.href = newUrl;
}

const landscapeCheck = window.matchMedia("(orientation: portrait)");
landscapeCheck.addEventListener("change", handleOrientationChange);

// Initial check on load
window.addEventListener('DOMContentLoaded', function() {
    handleOrientationChange(landscapeCheck);
    if (!landscapeCheck.matches) {
        
    }
});