// Configuration - easier to modify later
const CONFIG = {
    numHexagons: 960,
    hexagonsPerRow: 20,
    enterWord: "ENTER",
    transitionDuration: 1000,
    nextPage: "./main.html"
};

// Utility function for element selection
const $ = (id) => document.getElementById(id);

// Handle orientation changes
function handleOrientationChange(e) {
    const isPortrait = e.matches;
    const overlay = $('orientationOverlay');
    const modal = $('landingModal');
    const wall = $('hexagon-wall');
    
    if (isPortrait) {
        overlay.style.display = 'flex';
        modal.style.display = 'none';
        wall.style.display = 'none';
    } else {
        overlay.style.display = 'none';
        modal.style.display = '';
        wall.style.display = '';
        
        // Only create wall if it doesn't already exist
        if (!wall.hasChildNodes()) {
            createHexagonWall(CONFIG.numHexagons, CONFIG.hexagonsPerRow, CONFIG.enterWord);
        }
    }
}

function createHexagonWall(numHexagons, hexagonsPerRow, enterWord) {
    const hexagonWall = $('hexagon-wall');
    let currentIndex = 0;
    let enterWordIndex = 0;
    
    // Clear existing content (in case of recreation)
    hexagonWall.innerHTML = '';
    
    // Calculate positioning for the word
    const totalRows = Math.floor(numHexagons / hexagonsPerRow);
    const middleRowStart = Math.floor(totalRows / 2) - Math.floor(enterWord.length / 2);
    const middleRowEnd = middleRowStart + enterWord.length;
    const startColumn = Math.floor(hexagonsPerRow / 2) - Math.floor(enterWord.length / 2);
    
    // Create hexagon grid
    for (let i = 0; i < numHexagons; i++) {
        // Create new row every hexagonsPerRow
        if (i % hexagonsPerRow === 0) {
            const wallRow = document.createElement('div');
            wallRow.classList.add('wallRow');
            hexagonWall.appendChild(wallRow);
        }
        
        const hexagon = document.createElement('div');
        hexagon.classList.add('hexagon');
        
        const currentRow = Math.floor(i / hexagonsPerRow);
        const currentColumn = i % hexagonsPerRow;
        
        // Place letters in calculated middle region
        if (currentRow >= middleRowStart && 
            currentRow < middleRowEnd && 
            currentColumn >= startColumn && 
            enterWordIndex < enterWord.length) {
            
            hexagon.textContent = enterWord[enterWordIndex];
            hexagon.setAttribute('data-letter', enterWord[enterWordIndex]);
            hexagon.setAttribute('data-index', enterWordIndex);
            enterWordIndex++;
        }
        
        hexagonWall.lastElementChild.appendChild(hexagon);
    }
    
    // Add click handlers using event delegation for better performance
    hexagonWall.addEventListener('click', (e) => {
        const hexagon = e.target.closest('.hexagon');
        if (!hexagon) return;
        
        const letter = hexagon.getAttribute('data-letter');
        
        // Only process letter hexagons
        if (!letter) return;
        
        hexagon.classList.add('selected');
        
        // Check if correct letter in sequence
        if (letter === enterWord[currentIndex]) {
            hexagon.classList.add('active');
            currentIndex++;
            
            // All letters clicked in order
            if (currentIndex === enterWord.length) {
                removeHexagonWall();
                accessGranted();
            }
        } else {
            // Optional: add error feedback
            hexagon.classList.add('error');
            setTimeout(() => hexagon.classList.remove('error'), 300);
        }
    });
}

function removeHexagonWall() {
    const hexagonWall = $('hexagon-wall');
    
    hexagonWall.style.transition = `opacity ${CONFIG.transitionDuration}ms ease-out`;
    hexagonWall.style.opacity = '0';
    
    setTimeout(() => {
        hexagonWall.remove();
    }, CONFIG.transitionDuration);
}

function accessGranted() {
    // Optional: add delay for effect
    setTimeout(() => {
        window.location.href = CONFIG.nextPage;
    }, 500);
}

// Initialize
const landscapeCheck = window.matchMedia("(orientation: portrait)");
landscapeCheck.addEventListener("change", handleOrientationChange);

window.addEventListener('DOMContentLoaded', () => {
    handleOrientationChange(landscapeCheck);
});