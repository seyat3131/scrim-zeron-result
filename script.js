document.addEventListener('DOMContentLoaded', () => {
    
    // =======================================================
    // 1. FIREBASE KONFİGÜRASYONU 
    // =======================================================
    const firebaseConfig = {
        apiKey: "AIzaSyAuEhr-2l_PUJ5LfVFkYy9Z3UvRRLZgOjQ",
        authDomain: "zeron-result.firebaseapp.com",
        projectId: "zeron-result",
        storageBucket: "zeron-result.firebasestorage.app",
        messagingSenderId: "896044676862",
        appId: "1:896044676862:web:7b7e26700dca7fabc257af",
        measurementId: "G-SVPZPYYPDD",
        databaseURL: "https://zeron-result-default-rtdb.europe-west1.firebasedatabase.app" 
    };

    // Firebase'i Başlat (v8 yapısı)
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    const dbRef = database.ref('scoreboard/teams'); // Veri yolu: scoreboard/teams
    // =======================================================


    // YÖNETİCİ TIKLAMA İŞLEVİ AYARLARI
    const REQUIRED_CLICKS = 50; 
    const TOTAL_TEAMS = 25; 
    let clickCount = 0;
    const adminPanel = document.querySelector('.admin-panel');
    let editMode = false;
    
    adminPanel.style.display = 'none'; 

    // TIKLAMA ALANI: Yönetici panelini açmak için body'nin tamamını kullan
    document.body.addEventListener('click', (event) => {
        if (adminPanel.style.display === 'none') {
            
            // Eğer butona veya linke tıklanmadıysa (yanlışlıkla açılmasın diye)
            if (event.target.tagName !== 'BUTTON' && event.target.tagName !== 'A' && event.target.contentEditable !== 'true') {
                clickCount++;
            }
            
            if (clickCount >= REQUIRED_CLICKS) {
                adminPanel.style.display = 'block'; 
                // Uyarıyı konsola yazdır
                console.log('YÖNETİCİ GİZLİ KONTROL PANELİ ETKİNLEŞTİRİLDİ.');
                clickCount = 0; 
            }
        }
    });
    
    // --- Canlı Tarih Güncelleme ---
    const liveDateElement = document.getElementById('live-date');
    function updateLiveDate() {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        };
        const formattedDate = now.toLocaleDateString('tr-TR', options);
        liveDateElement.textContent = formattedDate;
    }
    setInterval(updateLiveDate, 1000);
    updateLiveDate(); 

    // --- Puan Durumu Verisi ve Görünüm Fonksiyonları ---
    let initialScores = [];
    for (let i = 1; i <= TOTAL_TEAMS; i++) {
        initialScores.push({ 
            rank: `#${i < 10 ? '0' + i : i}`, 
            team: `TEAM ${i}`, 
            color: '#FF4136', // Varsayılan Kırmızı Renk (PUBG temasına uygun)
            total: '0' 
        });
    }

    let scores = initialScores;
    const scoreRowsContainer = document.getElementById('score-rows');

    function renderScoreboard(isEditable) {
        scoreRowsContainer.innerHTML = ''; 
        
        // 25 takım: 13 sol / 12 sağ
        const half = Math.ceil(scores.length / 2);
        
        for (let i = 0; i < half; i++) {
            const row = document.createElement('div');
            row.className = 'score-row';
            // Yeni: Renk verisini de ekliyoruz
            const leftData = scores[i] || { rank: `#${i < 10 ? '0' + i : i}`, team: '---', color: '#FF4136', total: '0' };
            const teamColorL = leftData.color || '#FF4136';

            // Sol Kolon Verileri (4 Sütun)
            row.innerHTML += `
                <span class="score-cell rank-col">${leftData.rank}</span>
                <span class="score-cell team-col ${isEditable ? 'editable' : ''}" data-index="${i}" data-field="team" style="color: ${teamColorL};">${leftData.team}</span>
                <span class="score-cell color-col ${isEditable ? 'editable color-editable' : ''}" data-index="${i}" data-field="color">
                    ${isEditable ? teamColorL : `<div class="color-preview" style="background-color: ${teamColorL};"></div>`}
                </span>
                <span class="score-cell total-col ${isEditable ? 'editable' : ''}" data-index="${i}" data-field="total">${leftData.total}</span>
            `;

            // Sağ Kolon Verileri (4 Sütun)
            const rightIndex = i + half;
            const rightData = scores[rightIndex] || { rank: '', team: '', color: '', total: '' };

            if (scores[rightIndex]) {
                const teamColorR = rightData.color || '#FF4136';
                row.innerHTML += `
                    <span class="score-cell rank-col">${rightData.rank}</span>
                    <span class="score-cell team-col ${isEditable ? 'editable' : ''}" data-index="${rightIndex}" data-field="team" style="color: ${teamColorR};">${rightData.team}</span>
                    <span class="score-cell color-col ${isEditable ? 'editable color-editable' : ''}" data-index="${rightIndex}" data-field="color">
                         ${isEditable ? teamColorR : `<div class="color-preview" style="background-color: ${teamColorR};"></div>`}
                    </span>
                    <span class="score-cell total-col ${isEditable ? 'editable' : ''}" data-index="${rightIndex}" data-field="total">${rightData.total}</span>
                `;
            } else {
                 // Boş hücreler (Simetri için)
                 row.innerHTML += `
                    <span class="score-cell rank-col"></span>
                    <span class="score-cell team-col"></span>
                    <span class="score-cell color-col"></span>
                    <span class="score-cell total-col"></span>
                `;
            }

            scoreRowsContainer.appendChild(row);
        }

        // Kutucukları düzenlenebilir yap
        if (isEditable) {
            document.querySelectorAll('.editable').forEach(cell => {
                cell.setAttribute('contenteditable', 'true');
                // Renk kutusu düzenlenirken tam HEX kodunu göster
                if (cell.classList.contains('color-editable')) {
                    const index = cell.getAttribute('data-index');
                    cell.textContent = scores[index].color || '#FF4136';
                }
            });
        } else {
            document.querySelectorAll('.score-cell').forEach(cell => {
                cell.removeAttribute('contenteditable');
            });
        }
    }

    // =======================================================
    // FIREBASE OKUMA (CANLI DİNLEME) İŞLEVİ - HERKES GÖRÜR
    // =======================================================
    dbRef.on('value', (snapshot) => {
        if (snapshot.exists()) {
            scores = snapshot.val();
        } else {
            // Eğer veritabanında hiç veri yoksa, başlangıç verilerini yükle ve kaydet
            dbRef.set(initialScores);
            scores = initialScores;
        }
        
        // Veri değiştikçe veya yüklendikçe skorboard'u çiz
        renderScoreboard(editMode);
    }, (error) => {
        console.error("Firebase veri okuma hatası: ", error);
        console.error("Veri yüklenirken bir hata oluştu. Konsolu kontrol edin.");
    });


    // --- Yönetici Düzenleme Fonksiyonları ---
    const toggleButton = document.getElementById('toggle-edit-mode');
    const saveButton = document.getElementById('save-data');

    toggleButton.addEventListener('click', () => {
        if (adminPanel.style.display === 'none') return; 
        
        editMode = !editMode;
        if (editMode) {
            console.log('Yönetici Düzenleme Modu Açıldı. Kutucuklara yazı yazabilirsiniz.');
        } else {
            console.log('Düzenleme Modu Kapatıldı. Son kaydedilen veriler gösteriliyor.');
        }
        renderScoreboard(editMode);
    });

    saveButton.addEventListener('click', () => {
        if (!editMode) {
            console.log('Önce Düzenleme Modunu açmanız gerekiyor.');
            return;
        }
        
        // 1. Düzenlenen verileri topla (scores nesnesini güncelle)
        document.querySelectorAll('.editable').forEach(cell => {
            const index = cell.getAttribute('data-index');
            const field = cell.getAttribute('data-field');
            let newValue = cell.textContent.trim();
            
            // Renk alanında '#' işareti yoksa ekle
            if (field === 'color' && newValue.length > 0 && newValue[0] !== '#') {
                newValue = '#' + newValue;
            }

            if (scores[index]) {
                scores[index][field] = newValue;
            }
        });

        // 2. FIREBASE'E YAZ (TÜM ZİYARETÇİLERE CANLI GÖNDER)
        dbRef.set(scores)
            .then(() => {
                console.log('Veriler başarıyla kaydedildi ve tüm ziyaretçiler için canlı güncellendi!');
                editMode = false;
                renderScoreboard(editMode);
            })
            .catch((error) => {
                console.error('HATA: Veritabanına kayıt başarısız oldu: ', error);
            });
    });
});
