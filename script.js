/* Genel Stil */
body {
    background-color: #0A0A0A; /* Çok Koyu Arkaplan */
    color: #E0E0E0; /* Açık Gri Metin */
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column; 
    min-height: 100vh;
}

/* Arkaplan Resmini Kullanma */
#app-container {
    /* Not: IMG_1212.jpg yerine size uygun bir URL/isim girmeniz gerekebilir */
    background-image: url('IMG_1212.jpg'); 
    background-size: cover; 
    background-position: center; 
    flex-grow: 1; 
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

/* Başlık ve Tarih Alanı */
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    cursor: pointer; 
}

.header-left h1 {
    font-size: 3em;
    margin: 0;
    letter-spacing: 3px;
    color: #FF4500; /* Kırmızı Vurgu */
    text-shadow: 0 0 10px rgba(255, 69, 0, 0.5);
    background-color: rgba(0, 0, 0, 0.7); 
    padding: 5px 15px;
    border-radius: 4px;
    border: 1px solid #FF4500; 
}

.header-right {
    display: flex; 
    flex-direction: column;
    align-items: flex-end;
    font-weight: bold;
}

#live-date {
    font-size: 1.2em;
    color: #A9A9A9; 
    background-color: rgba(0, 0, 0, 0.7);
    padding: 5px 10px;
    border-radius: 3px;
    margin-bottom: 5px;
}

/* YÖNETİCİ SAYACI STİLİ */
#click-counter {
    font-size: 0.9em;
    color: #32CD32; 
    background-color: rgba(0, 0, 0, 0.7);
    padding: 2px 5px;
    border-radius: 3px;
    font-weight: normal;
}


/* Skor Tablosu Alanı - KALICI GÖRÜNÜM */
.scoreboard-area {
    margin-left: auto; 
    margin-right: auto; 
    width: 95%; 
    max-width: 1400px; 
    
    border: 2px solid #555555; 
    background-color: rgba(0, 0, 0, 0.88); 
    margin-top: 40px;
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.6); 
}

.table-header, .score-row {
    display: flex;
    text-align: center;
    font-weight: bold;
    color: #FFF;
}

.table-header {
    background-color: #1A1A1A; 
    border-bottom: 2px solid #555555; 
    text-transform: uppercase;
    font-size: 0.9em;
}

/* Tüm hücrelerin temel stili */
.rank-col, .team-col, .total-col, .color-col {
    padding: 10px 5px;
    box-sizing: border-box;
    border-right: 1px solid #333333; 
    display: flex;
    justify-content: center;
    align-items: center;
}

/* ---------------------------------------------------- */
/* RENK SÜTUNU GİZLEME VE GENİŞLİK AYARLARI (NORMAL MOD VE BAŞLIKLAR) */
/* ---------------------------------------------------- */

/* NORMAL MODDA (table-header VE score-row) Genişlikler (Toplam %100) */
.rank-col { flex-basis: 14%; max-width: 14%; } 
.total-col { flex-basis: 20%; max-width: 20%; } 
.team-col { flex-basis: 66%; max-width: 66%; text-align: left; padding-left: 15px; justify-content: flex-start; } 

/* Renk Sütununu (color-col) Normal Modda Tamamen Gizle */
.score-row .color-col {
    display: none; 
    flex-basis: 0;
    max-width: 0;
    padding: 0;
    border-right: none;
    overflow: hidden; /* İçeriğin taşmasını engelle */
}

/* ---------------------------------------------------- */
/* YÖNETİCİ MODU (admin-mode-active VARSA) GENİŞLİK AYARLARI */
/* ---------------------------------------------------- */

/* YÖNETİCİ MODU: Renk sütununu geri getir */
.score-row.admin-mode-active .color-col {
    display: flex; /* YÖNETİCİ GİRİŞİ: Görünür yap */
    flex-basis: 10%; /* Yönetici için yer aç */
    max-width: 10%;
    padding: 10px 5px;
    border-right: 1px solid #333333;
}

/* YÖNETİCİ MODU: Diğer sütunların genişliğini küçült (Toplam %100'ü korumak için) */
.score-row.admin-mode-active .rank-col { flex-basis: 7%; max-width: 7%; } 
.score-row.admin-mode-active .total-col { flex-basis: 10%; max-width: 10%; } 
.score-row.admin-mode-active .team-col { flex-basis: 33%; max-width: 33%; } 

/* Yönetici Renk Alanı Stili */
.score-row .color-col.color-editable {
    color: #FF4500; /* Yöneticiye Kırmızı renkte HEX kodu göster */
    font-size: 0.8em;
    background-color: rgba(0, 0, 0, 0.98);
    outline: 2px solid #FF4500; 
    cursor: text;
}


/* Satır Stilleri */
.score-row {
    border-bottom: 1px solid #222222; 
}

.score-row:nth-child(odd) {
    background-color: rgba(5, 5, 5, 0.5);
}
.score-row:nth-child(even) {
    background-color: rgba(15, 15, 15, 0.5);
}


/* Düzenlenebilir Kutucuk Stili */
.editable {
    outline: 2px solid #FF4500; 
    cursor: text;
    background-color: rgba(0, 0, 0, 0.98);
    color: #E0E0E0; 
}

/* Yönetici Paneli */
.admin-panel {
    margin-top: 30px;
    padding: 20px;
    margin-left: auto; 
    margin-right: auto;
    width: 95%; 
    max-width: 1400px;
    
    background-color: rgba(0, 0, 0, 0.95);
    border: 1px solid #FF4500; 
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.7);
    text-align: center; 
}

.admin-panel button {
    padding: 10px 15px;
    background-color: #FF4500; 
    color: #FFF;
    border: none;
    cursor: pointer;
    font-weight: bold;
    margin-right: 10px;
    transition: background-color 0.3s;
    border-radius: 4px;
}

.admin-panel button:hover {
    background-color: #CC3700; 
}

.admin-panel .warning {
    color: #32CD32; 
    font-weight: bold;
    margin-top: 15px;
}

/* Alt Kısım (Footer) ve Link Stili */
footer {
    width: 100%;
    text-align: center;
    padding: 15px 0;
    background-color: #1A1A1A; 
    border-top: 1px solid #FF4500; 
    margin-top: 20px;
}

.instagram-link {
    color: #FF4500; 
    text-decoration: none;
    font-weight: bold;
    font-size: 1.1em;
    transition: color 0.3s;
}

.instagram-link:hover {
    color: #FFF; 
    text-decoration: underline;
}
