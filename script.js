const board = document.getElementById('puzzle-board');
const tray = document.getElementById('pieces-tray');
const successMessage = document.getElementById('success-message');

const imageURL = 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=300&h=300&auto=format&fit=crop'; 
const gridSize = 2;
const boardSize = 300;
const pieceSize = boardSize / gridSize;

let pieces = [];
let slots = [];
let correctPlacements = 0;

function initPuzzle() {
    // 1. Şık ve zarif boş yuvaları ekle
    for (let i = 0; i < gridSize * gridSize; i++) {
        let slot = document.createElement('div');
        slot.classList.add('slot');
        slot.dataset.index = i;
        board.appendChild(slot);
        slots.push(slot);
    }

    // 2. Parçaları oluştur ve sıralı şekilde tepsiye diz
    for (let i = 0; i < gridSize * gridSize; i++) {
        let piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        piece.dataset.index = i;
        
        let x = (i % gridSize) * pieceSize;
        let y = Math.floor(i / gridSize) * pieceSize;
        
        piece.style.backgroundImage = `url(${imageURL})`;
        piece.style.backgroundPosition = `-${x}px -${y}px`;

        // Parçaları temizce tepsiye ekle (Rotasyon veya rastgelelik YOK)
        tray.appendChild(piece);
        pieces.push(piece);
        
        addTouchEvents(piece);
    }

    // Oyunu zorlaştırmak için tepsiyi oluşturduktan sonra içindeki html'i karıştırabiliriz
    // Şimdilik sırayla yan yana dizili gelecekler.
}

function addTouchEvents(piece) {
    let startX, startY, initialLeft, initialTop;

    piece.addEventListener('touchstart', (e) => {
        if (piece.classList.contains('locked')) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const rect = piece.getBoundingClientRect();

        // ÇOK KRİTİK: Parça eğer tepsideyse, onu "koparıp" serbest bırakıyoruz
        if (piece.parentElement === tray) {
            piece.style.position = 'absolute';
            piece.style.left = `${rect.left}px`;
            piece.style.top = `${rect.top}px`;
            piece.style.margin = '0'; 
            document.body.appendChild(piece); // Tüm sınırların üstüne çık!
        }

        startX = touch.clientX;
        startY = touch.clientY;

        // Koparıldıktan sonraki yeni pozisyonu al
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
            
            // Mıknatıs etkisi: Eğer parçanın merkezi yuvanın içindeyse
            if (
                pieceCenterX > slotRect.left &&
                pieceCenterX < slotRect.right &&
                pieceCenterY > slotRect.top &&
                pieceCenterY < slotRect.bottom &&
                slot.dataset.index === piece.dataset.index
            ) {
                // DOĞRU YER! Yuvaya kilitle
                piece.style.left = `${slotRect.left}px`;
                piece.style.top = `${slotRect.top}px`;
                piece.classList.add('locked');
                
                // Kilitlenme efekti (köşeleri keskinleştir, gölgeyi al)
                piece.style.boxShadow = 'none'; 
                piece.style.borderRadius = '0'; 
                piece.style.border = 'none'; 
                
                snapped = true;
                correctPlacements++;
                
                checkWin();
            }
        });

        // YANLIŞ YER! Tepsiye geri yolla
        if (!snapped) {
            piece.classList.add('returning');
            // Stil özelliklerini sıfırla ki CSS Flexbox onu tekrar tepsiye dizebilsin
            setTimeout(() => {
                piece.style.position = 'relative';
                piece.style.left = 'auto';
                piece.style.top = 'auto';
                tray.appendChild(piece); // Tepsiye geri sok
            }, 50); // Tarayıcının render alması için minik bir gecikme
        }
    });
}

function checkWin() {
    if (correctPlacements === gridSize * gridSize) {
        // Yapboz bitince tahtanın o buzlu cam hissini kaldır, netleştir
        board.style.backdropFilter = "none";
        board.style.background = "transparent";
        board.style.border = "4px solid var(--soft-pink)";
        board.style.boxShadow = "0 0 30px rgba(244, 143, 177, 0.6)"; // Pembe bir parlama
        
        successMessage.classList.replace('hidden', 'visible');
        
        // Buradan sonra muazzam son sürpriz animasyonuna geçeceğiz!
    }
}

initPuzzle();

// checkWin fonksiyonunun içindeki successMessage kısmını bununla değiştir:
function checkWin() {
    if (correctPlacements === gridSize * gridSize) {
        // Tahtayı ve parçaları sabitle
        board.style.backdropFilter = "none";
        board.style.background = "transparent";
        board.style.border = "4px solid var(--soft-pink)";
        
        // Minik bir gecikme ile "Sahte Uyarıyı" göster (Gerçekçilik için)
        setTimeout(() => {
            const overlay = document.getElementById('fake-alert-overlay');
            overlay.classList.add('visible');
        }, 800);
    }
}

// "Tamam" butonuna tıklama olayı
document.getElementById('alert-btn').addEventListener('click', () => {
    const overlay = document.getElementById('fake-alert-overlay');
    overlay.classList.remove('visible');
    
    // Şimdi burada devreye girecek olan şey senin hayal gücün!
    // Butona bastıktan sonra ekranın kalplerle dolması mı, 
    // yoksa bir sonraki animasyonun başlaması mı? 
    startFinalSurprise(); 
});

function startFinalSurprise() {
    console.log("Büyük final başlıyor...");
    // Buraya bir sonraki aşamanın kodlarını yazacağız dedem.
}