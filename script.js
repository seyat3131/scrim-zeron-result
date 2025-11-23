document.addEventListener('DOMContentLoaded', () => {
    
    // YÖNETİCİ TIKLAMA İŞLEVİ AYARLARI
    const REQUIRED_CLICKS = 50; // 30-100 aralığı için seçilen değer
    const TOTAL_TEAMS = 25; // Takım sayısı
    let clickCount = 0;
    const adminPanel = document.querySelector('.admin-panel');
    
    // Yönetici panelini başlangıçta gizle
    adminPanel.style.display = 'none'; 

    // TIKLAMA ALANI: Yönetici panelini açmak için body'nin tamamını kullan
    document.body.addEventListener('click', (event) => {
        // Eğer panel gizliyse saymaya başla
        if (adminPanel.style.display === 'none') {
            
            // Eğer butona veya linke tıklanmadıysa (yanlışlıkla açılmasın diye)
            if (event.target.tagName !== 'BUTTON' && event.target.tagName !== 'A') {
                clickCount++;
            }
            
            if (clickCount >= REQUIRED_CLICKS) {
                adminPanel.style.display = 'block'; 
                alert('YÖNETİCİ GİZLİ KONTROL PANELİ ETKİNLEŞTİRİLDİ.');
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

    let scores = JSON.parse(localStorage.getItem('zeronScores')) || initialScores;
    const scoreRowsContainer = document.getElementById('score-rows');

    function renderScoreboard(editable = false) {
        scoreRowsContainer.innerHTML = ''; 
        
        // 25 takım: 13 sol / 12 sağ
        const half = Math.ceil(scores.length / 2);
        
        for (let i = 0; i < half; i++) {
            const row = document.createElement('div');
            row.className = 'score-row';
            const leftData = scores[i] || { rank: `#${i < 10 ? '0' + i : i}`, team: '', total: '' };

            // Sol Kolon Verileri
            row.innerHTML += `
                <span class="score-cell rank-col">${leftData.rank}</span>
                <span class="score-cell team-col ${editable ? 'editable' : ''}" data-index="${i}" data-field="team">${leftData.team}</span>
                <span class="score-cell total-col ${editable ? 'editable' : ''}" data-index="${i}" data-field="total">${leftData.total}</span>
            `;

            // Sağ Kolon Verileri
            const rightIndex = i + half;
            const rightData = scores[rightIndex] || { rank: '', team: '', total: '' };

            if (scores[rightIndex]) {
                row.innerHTML += `
                    <span class="score-cell rank-col">${rightData.rank}</span>
                    <span class="score-cell team-col ${editable ? 'editable' : ''}" data-index="${rightIndex}" data-field="team">${rightData.team}</span>
                    <span class="score-cell total-col ${editable ? 'editable' : ''}" data-index="${rightIndex}" data-field="total">${rightData.total}</span>
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
        if (editable) {
            document.querySelectorAll('.editable').forEach(cell => {
                cell.setAttribute('contenteditable', 'true');
            });
        } else {
            document.querySelectorAll('.score-cell').forEach(cell => {
                cell.removeAttribute('contenteditable');
            });
        }
    }

    renderScoreboard(false);

// ... renderScoreboard(false); satırından sonrası

// --- Yönetici Düzenleme Fonksiyonları ---
let editMode = false;
const toggleButton = document.getElementById('toggle-edit-mode');
const saveButton = document.getElementById('save-data');

toggleButton.addEventListener('click', () => {
    // Panel görünür değilse (50 tıklama yapılmamışsa) çalışmasın
    if (adminPanel.style.display === 'none') return; 
    
    editMode = !editMode;
    if (editMode) {
        alert('Yönetici Düzenleme Modu Açıldı. Kutucuklara yazı yazabilirsiniz.');
    } else {
        // Düzenleme modundan çıkınca kaydedilmemiş değişiklikleri geri al
        scores = JSON.parse(localStorage.getItem('zeronScores')) || initialScores;
        alert('Düzenleme Modu Kapatıldı.');
    }
    renderScoreboard(editMode);
});

saveButton.addEventListener('click', () => {
    if (!editMode) {
        alert('Önce Düzenleme Modunu açmanız gerekiyor.');
        return;
    }
    
    // Düzenlenen verileri topla
    document.querySelectorAll('.editable').forEach(cell => {
        const index = cell.getAttribute('data-index');
        const field = cell.getAttribute('data-field');
        const newValue = cell.textContent.trim();
        
        if (scores[index]) {
            scores[index][field] = newValue;
        }
    });

    // Veriyi LocalStorage'a kaydet (herkesin görmesi için canlı güncelleme)
    localStorage.setItem('zeronScores', JSON.stringify(scores));
    renderScoreboard(false); // Tabloyu düzenleme modu kapalı olarak yeniden çiz
    editMode = false;
    alert('Veriler başarıyla kaydedildi ve canlı güncellendi!');
});

}); // document.addEventListener('DOMContentLoaded', ... kapanışı    
