document.addEventListener('DOMContentLoaded', () => {
    
    // =======================================================
    // 1. FIREBASE KONFİGÜRASYONU (Sizin Paylaştığınız Bilgiler)
    // =======================================================
    const firebaseConfig = {
        apiKey: "AIzaSyAuEhr-2l_PUJ5LfVFkYy9Z3UvRRLZgOjQ",
        authDomain: "zeron-result.firebaseapp.com",
        projectId: "zeron-result",
        storageBucket: "zeron-result.firebasestorage.app",
        messagingSenderId: "896044676862",
        appId: "1:896044676862:web:7b7e26700dca7fabc257af",
        measurementId: "G-SVPZPYYPDD",
        // Realtime Database URL'sini ekliyoruz
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
                // Uyarı mesajını alert() yerine console.log ile gösterelim.
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
            const leftData = scores[i] || { rank: `#${i < 10 ? '0' + i : i}`, team: '---', total: '0' };

            // Sol Kolon Verileri
            row.innerHTML += `
                <span class="score-cell rank-col">${leftData.rank}</span>
                <span class="score-cell team-col ${isEditable ? 'editable' : ''}" data-index="${i}" data-field="team">${leftData.team}</span>
                <span class="score-cell total-col ${isEditable ? 'editable' : ''}" data-index="${i}" data-field="total">${leftData.total}</span>
            `;

            // Sağ Kolon Verileri
            const rightIndex = i + half;
            const rightData = scores[rightIndex] || { rank: '', team: '', total: '' };

            if (scores[rightIndex]) {
                row.innerHTML += `
                    <span class="score-cell rank-col">${rightData.rank}</span>
                    <span class="score-cell team-col ${isEditable ? 'editable' : ''}" data-index="${rightIndex}" data-field="team">${rightData.team}</span>
                    <span class="score-cell total-col ${isEditable ? 'editable' : ''}" data-index="${rightIndex}" data-field="total">${rightData.total}</span>
                `;
            } else {
                 // Boş hücreler (Simetri için)
                 row.innerHTML += `
                    <span class="score-cell rank-col"></span>
                    <span class="score-cell team-col"></span>
                    <span class="score-cell total-col"></span>
                `;
            }

            scoreRowsContainer.appendChild(row);
        }

        // Kutucukları düzenlenebilir yap
        if (isEditable) {
            document.querySelectorAll('.editable').forEach(cell => {
                cell.setAttribute('contenteditable', 'true');
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
            // Firebase'den gelen veriyi kullan
            scores = snapshot.val();
        } else {
            // Eğer veritabanında hiç veri yoksa, başlangıç verilerini yükle (kaydetme işlemini yapmıyoruz, sadece gösteriyoruz)
            // Yönetici kaydet tuşuna basınca kaydedecektir.
            scores = initialScores; 
        }
        
        // Veri değiştikçe veya yüklendikçe skorboard'u çiz
        renderScoreboard(editMode);
    }, (error) => {
        console.error("Firebase veri okuma hatası: ", error);
        // alert yerine console.error kullanıldı.
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
            // Düzenleme modundan çıkınca veriyi Firebase'den tekrar çek
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
            const newValue = cell.textContent.trim();
            
            if (scores[index]) {
                scores[index][field] = newValue;
            }
        });

        // 2. FIREBASE'E YAZ (TÜM ZİYARETÇİLERE CANLI GÖNDER)
        dbRef.set(scores)
            .then(() => {
                // Kayıt başarılı olduğunda on('value') listener'ı otomatik olarak tetiklenir.
                console.log('Veriler başarıyla kaydedildi ve tüm ziyaretçiler için canlı güncellendi!');
                editMode = false;
                renderScoreboard(editMode); // Kayıt sonrası düzenleme modunu kapat ve tekrar çiz
            })
            .catch((error) => {
                console.error('HATA: Veritabanına kayıt başarısız oldu: ', error);
            });
    });
});
