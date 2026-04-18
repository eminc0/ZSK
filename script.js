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

// TERTEMİZ TEK BİR CHECKWIN FONKSİYONU
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

// TAMAM BUTONU TETİKLEYİCİSİ
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
    
    // 1. Ana çerçeveyi (Başlık, tahta, tepsi) gizlemeye başla
    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
        appContainer.style.transition = "opacity 1s ease";
        appContainer.style.opacity = "0";
    }
    
    // 2. ÇOK ÖNEMLİ: Body'ye kaçmış olan yapboz parçalarını tek tek bul ve erit
    const allPieces = document.querySelectorAll('.puzzle-piece');
    allPieces.forEach(piece => {
        piece.style.transition = "opacity 1s ease";
        piece.style.opacity = "0";
    });
    
    // 3. Bir saniye sonra her şeyi tamamen ortadan kaldır ve kartları sahneye al
    setTimeout(() => {
        if (appContainer) appContainer.style.display = "none";
        
        allPieces.forEach(piece => {
            piece.style.display = "none"; // Parçaları tamamen yok et
        });
        
        // Kartları göster
        const cardsContainer = document.getElementById('cards-container');
        if (cardsContainer) {
            cardsContainer.classList.remove('hidden-cards');
            cardsContainer.classList.add('visible-cards');
        }
    }, 1000); // 1 saniyelik yumuşak geçiş süresi
}

// Çiçek Çizim Fonksiyonu (Algoritma)
function drawPureJSBouquet() {
    const container = document.getElementById('final-bouquet-container');
    if (!container) {
        console.error("Dedem HTML'de buket container'ı yok!");
        return;
    }
    container.innerHTML = ''; 
    
    const flowersData = [
        { type: 'lily', x: 0, y: -60, rot: 0, delay: 100, scale: 1 },
        { type: 'daisy', x: -50, y: -20, rot: -20, delay: 350, scale: 0.85 },
        { type: 'daisy', x: 50, y: -20, rot: 20, delay: 600, scale: 0.85 },
        { type: 'lily', x: -35, y: 30, rot: -40, delay: 850, scale: 0.75 },
        { type: 'lily', x: 35, y: 30, rot: 40, delay: 1100, scale: 0.75 },
        { type: 'daisy', x: 0, y: 25, rot: 0, delay: 1300, scale: 1 }
    ];

    flowersData.forEach(data => {
        const flower = document.createElement('div');
        flower.className = `flower ${data.type}`;
        flower.style.left = `calc(50% + ${data.x}px)`;
        flower.style.top = `calc(50% + ${data.y}px)`;
        
        // BAŞLANGIÇTA TAMAMEN GİZLİ VE SIFIR BOYUT
        flower.style.transform = `scale(0)`; 

        const stem = document.createElement('div');
        stem.className = 'stem';
        stem.style.transform = `rotate(${-data.x / 2.5}deg)`;
        flower.appendChild(stem);

        const center = document.createElement('div');
        center.className = 'center';
        flower.appendChild(center);

        const petalCount = data.type === 'daisy' ? 12 : 6; 
        for (let i = 0; i < petalCount; i++) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            const angle = i * (360 / petalCount);
            petal.style.transform = `rotate(${angle}deg)`;
            flower.appendChild(petal);
        }

        container.appendChild(flower);

        // ÇİÇEKLERİ GECİKMELİ OLARAK AÇTIRAN MUCİZE:
        setTimeout(() => {
            flower.style.transform = `scale(${data.scale})`; 
        }, data.delay);
    });

    const ribbon = document.createElement('div');
    ribbon.className = 'ribbon';
    ribbon.innerText = "Sonsuza Dek Bağlıyız";
    container.appendChild(ribbon);
    
    setTimeout(() => {
        ribbon.classList.add('show');
    }, 1500);
}

// Kart Geçiş Motoru ve Final Tetikleyicisi
document.querySelectorAll('.next-card-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        
        // SON BUTON: "Sonsuza Dek" tıklandığında
        if (this.id === 'final-btn') {
            this.innerText = "❤️ Sonsuza Dek ❤️";
            this.style.background = "var(--soft-pink)";
            this.style.color = "var(--burgundy)";
            this.style.pointerEvents = "none"; // Tekrar basılmasını engelle
            
            // PURE JS BUKETİ ÇİZİMİNİ BAŞLAT
            drawPureJSBouquet();
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