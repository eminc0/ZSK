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

// Kartlar arası geçiş motoru
document.querySelectorAll('.next-card-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        
        // Eğer son butona tıklandıysa işlemi bitir (Veya buraya konfeti ekleriz)
        if (this.id === 'final-btn') {
            console.log("Sürpriz tamamlandı!");
            // Şimdilik butonun üzerindeki yazıyı değiştirip kalpler çıkaralım
            this.innerText = "❤️ Sonsuza Dek ❤️";
            return;
        }

        const currentCard = this.parentElement;
        const nextCardId = 'card-' + this.getAttribute('data-next');
        const nextCard = document.getElementById(nextCardId);

        // Mevcut kartı yukarı doğru kaydırarak sil
        currentCard.classList.remove('active-card');
        currentCard.classList.add('fade-out');

        // Yarım saniye bekle (CSS transition bitene kadar), sonra yenisini getir
        setTimeout(() => {
            currentCard.style.display = 'none';
            currentCard.classList.remove('fade-out'); // Temizlik
            
            nextCard.style.display = 'flex';
            
            // Tarayıcının render alabilmesi için çok minik bir gecikme
            setTimeout(() => {
                nextCard.classList.add('active-card');
            }, 50);
            
        }, 600); 
    });
});