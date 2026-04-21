const board = document.getElementById('puzzle-board');
const tray = document.getElementById('pieces-tray');

const imageURL = 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=300&h=300&auto=format&fit=crop'; 
const gridSize = 2;
const boardSize = 300;
const pieceSize = boardSize / gridSize;

let pieces = [];
let slots = [];
let correctPlacements = 0;

function initPuzzle() {
    for (let i = 0; i < gridSize * gridSize; i++) {
        let slot = document.createElement('div');
        slot.classList.add('slot');
        slot.dataset.index = i;
        board.appendChild(slot);
        slots.push(slot);
    }

    for (let i = 0; i < gridSize * gridSize; i++) {
        let piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        piece.dataset.index = i;
        
        let x = (i % gridSize) * pieceSize;
        let y = Math.floor(i / gridSize) * pieceSize;
        
        piece.style.backgroundImage = `url(${imageURL})`;
        piece.style.backgroundPosition = `-${x}px -${y}px`;

        tray.appendChild(piece);
        pieces.push(piece);
        
        addTouchEvents(piece);
    }
}

function addTouchEvents(piece) {
    let startX, startY, initialLeft, initialTop;

    piece.addEventListener('touchstart', (e) => {
        if (piece.classList.contains('locked')) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const rect = piece.getBoundingClientRect();

        if (piece.parentElement === tray) {
            piece.style.position = 'absolute';
            piece.style.left = `${rect.left}px`;
            piece.style.top = `${rect.top}px`;
            piece.style.margin = '0'; 
            document.body.appendChild(piece); 
        }

        startX = touch.clientX;
        startY = touch.clientY;

        initialLeft = parseFloat(piece.style.left) || rect.left;
        initialTop = parseFloat(piece.style.top) || rect.top;

        piece.classList.remove('returning');
        piece.classList.add('dragging');
    }, {passive: false});

    piece.addEventListener('touchmove', (e) => {
        if (piece.classList.contains('locked')) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;

        piece.style.left = `${initialLeft + dx}px`;
        piece.style.top = `${initialTop + dy}px`;
    }, {passive: false});

    piece.addEventListener('touchend', (e) => {
        if (piece.classList.contains('locked')) return;
        piece.classList.remove('dragging');

        const pieceRect = piece.getBoundingClientRect();
        const pieceCenterX = pieceRect.left + pieceSize / 2;
        const pieceCenterY = pieceRect.top + pieceSize / 2;

        let snapped = false;

        slots.forEach(slot => {
            const slotRect = slot.getBoundingClientRect();
            
            if (
                pieceCenterX > slotRect.left &&
                pieceCenterX < slotRect.right &&
                pieceCenterY > slotRect.top &&
                pieceCenterY < slotRect.bottom &&
                slot.dataset.index === piece.dataset.index
            ) {
                piece.style.left = `${slotRect.left}px`;
                piece.style.top = `${slotRect.top}px`;
                piece.classList.add('locked');
                
                piece.style.boxShadow = 'none'; 
                piece.style.borderRadius = '0'; 
                piece.style.border = 'none'; 
                
                snapped = true;
                correctPlacements++;
                
                checkWin();
            }
        });

        if (!snapped) {
            piece.classList.add('returning');
            setTimeout(() => {
                piece.style.position = 'relative';
                piece.style.left = 'auto';
                piece.style.top = 'auto';
                tray.appendChild(piece); 
            }, 50); 
        }
    });
}

function checkWin() {
    if (correctPlacements === gridSize * gridSize) {
        board.style.backdropFilter = "none";
        board.style.background = "transparent";
        board.style.border = "4px solid var(--soft-pink)";
        board.style.boxShadow = "0 0 30px rgba(244, 143, 177, 0.6)";
        
        setTimeout(() => {
            const overlay = document.getElementById('fake-alert-overlay');
            if(overlay) {
                overlay.classList.add('visible');
            } else {
                console.error("HTML'de 'fake-alert-overlay' ID'li div bulunamadı!");
            }
        }, 800);
    }
}

initPuzzle();

const alertBtn = document.getElementById('alert-btn');
if(alertBtn) {
    alertBtn.addEventListener('click', () => {
        const overlay = document.getElementById('fake-alert-overlay');
        overlay.classList.remove('visible');
        
        startFinalSurprise(); 
    });
}

function startFinalSurprise() {
    console.log("Büyük final başladı: Ekran temizleniyor...");
    
    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
        appContainer.style.transition = "opacity 1s ease";
        appContainer.style.opacity = "0";
    }
    
    const allPieces = document.querySelectorAll('.puzzle-piece');
    allPieces.forEach(piece => {
        piece.style.transition = "opacity 1s ease";
        piece.style.opacity = "0";
    });
    
    setTimeout(() => {
        if (appContainer) appContainer.style.display = "none";
        
        allPieces.forEach(piece => {
            piece.style.display = "none"; 
        });
        
        const cardsContainer = document.getElementById('cards-container');
        if (cardsContainer) {
            cardsContainer.classList.remove('hidden-cards');
            cardsContainer.classList.add('visible-cards');
        }
    }, 1000); 
}

// --- PEMBE VE BEYAZ LALE BUKETİ ÇİZİM FONKSİYONU ---
function drawPureJSTulipBouquet() {
    const container = document.getElementById('final-bouquet-container');
    if (!container) {
        console.error("Dedem HTML'de buket container'ı yok!");
        return;
    }
    container.innerHTML = ''; 
    
    // Buketteki lalelerin konumu, açısı, rengi ve çıkış sırası
    const tulipsData = [
        { x: 0, y: -40, rot: 0, delay: 200, scale: 1, color: 'pink' },       // Merkez Uzun Pembe
        { x: -45, y: -10, rot: -15, delay: 500, scale: 0.9, color: 'white' }, // Sol Orta Beyaz
        { x: 45, y: -10, rot: 15, delay: 800, scale: 0.9, color: 'pink' },    // Sağ Orta Pembe
        { x: -80, y: 30, rot: -30, delay: 1100, scale: 0.8, color: 'pink' },  // Sol Alt Pembe
        { x: 80, y: 30, rot: 30, delay: 1400, scale: 0.8, color: 'white' },   // Sağ Alt Beyaz
        { x: -20, y: 40, rot: -5, delay: 1700, scale: 0.85, color: 'white' }, // Ön Sol Beyaz
        { x: 20, y: 40, rot: 5, delay: 2000, scale: 0.85, color: 'pink' }     // Ön Sağ Pembe
    ];

    tulipsData.forEach(data => {
        // Lale Ana Konteyneri (Rengi class olarak atıyoruz)
        const tulip = document.createElement('div');
        tulip.className = `tulip ${data.color}`;
        
        // Buket formunu vermek için pozisyon ve başlangıç açısı
        tulip.style.left = `calc(50% + ${data.x}px)`;
        tulip.style.top = `calc(50% + ${data.y}px)`;
        tulip.style.transform = `scale(0) rotate(${data.rot}deg)`; 

        // Taç Yapraklar (Head)
        const head = document.createElement('div');
        head.className = 'tulip-head';
        
        const petalLeft = document.createElement('div');
        petalLeft.className = 'tulip-petal left';
        
        const petalRight = document.createElement('div');
        petalRight.className = 'tulip-petal right';
        
        const petalCenter = document.createElement('div');
        petalCenter.className = 'tulip-petal center';

        head.appendChild(petalLeft);
        head.appendChild(petalRight);
        head.appendChild(petalCenter);
        tulip.appendChild(head);

        // Sağ ve Sol Yeşil Yapraklar
        const leafLeft = document.createElement('div');
        leafLeft.className = 'tulip-leaf left';
        tulip.appendChild(leafLeft);

        const leafRight = document.createElement('div');
        leafRight.className = 'tulip-leaf right';
        tulip.appendChild(leafRight);

        // Yeşil Gövde (Stem)
        const stem = document.createElement('div');
        stem.className = 'tulip-stem';
        tulip.appendChild(stem);

        container.appendChild(tulip);

        // Laleleri sırayla kendi açılarında ve boyutlarında patlatarak açtır
        setTimeout(() => {
            tulip.classList.add('bloom');
            tulip.style.transform = `scale(${data.scale}) rotate(${data.rot}deg)`; 
        }, data.delay);
    });
}

// Kart Geçiş Motoru ve Final Tetikleyicisi
document.querySelectorAll('.next-card-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        
        // SON BUTON TIKLANDIĞINDA
        if (this.id === 'final-btn') {
            // Tıklandıktan sonra butonun alacağı yeni hal
            this.innerText = "❤️ İyi Ki Varsın ❤️"; 
            this.style.background = "var(--soft-pink)";
            this.style.color = "var(--burgundy)";
            this.style.pointerEvents = "none"; // Tekrar basılmasını engelle
            
            // PURE JS PEMBE-BEYAZ LALE BUKETİ ÇİZİMİNİ BAŞLAT
            drawPureJSTulipBouquet();
            return;
        }

        // Diğer kartların geçişi
        const currentCard = this.parentElement;
        const nextCardId = 'card-' + this.getAttribute('data-next');
        const nextCard = document.getElementById(nextCardId);

        currentCard.classList.remove('active-card');
        currentCard.classList.add('fade-out');

        setTimeout(() => {
            currentCard.style.display = 'none';
            currentCard.classList.remove('fade-out'); 
            
            nextCard.style.display = 'flex';
            
            setTimeout(() => {
                nextCard.classList.add('active-card');
            }, 50);
            
        }, 600); 
    });
});