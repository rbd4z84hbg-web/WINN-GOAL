<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>WINN GOAL</title>
<style>
*{box-sizing:border-box}
body{margin:0;background:#07110e;color:#f2f7f4;font-family:Arial,sans-serif}
header{padding:22px 18px;background:#0d2119;border-bottom:1px solid #1b4935}
.logo{font-size:27px;font-weight:900;color:#36e58a}
.sub{font-size:12px;color:#a5b9ad;margin-top:5px}
nav{display:flex;gap:8px;padding:14px;overflow:auto}
nav button{background:#14271f;color:#c5d4cb;border:0;padding:12px 16px;border-radius:10px;white-space:nowrap}
nav button.active{background:#20bd70;color:#06140d;font-weight:bold}
main{padding:14px}
h2{font-size:18px;margin:12px 0}
.card{background:#10231b;border:1px solid #244333;border-radius:14px;padding:16px;margin:12px 0}
.live{color:#36e58a;font-size:12px;font-weight:bold}
.teams{display:flex;justify-content:space-between;align-items:center;font-size:17px;font-weight:bold;margin:14px 0}
.score{font-size:23px;color:#fff}
.muted{color:#9eb2a5;font-size:12px}
.signal{background:#183d2b;color:#4df49b;padding:9px;border-radius:8px;margin-top:12px;font-weight:bold}
input{width:100%;padding:12px;margin:6px 0;background:#07150f;border:1px solid #31513e;color:white;border-radius:8px}
.action{width:100%;padding:13px;background:#20bd70;border:0;border-radius:9px;font-weight:bold;margin-top:8px}
.hidden{display:none}
footer{text-align:center;padding:25px;color:#779184;font-size:11px}
</style>
</head>
<body>
<header>
<div class="logo">⚽ WINN GOAL</div>
<div class="sub">FUTBOL • GOL SİNYALİ • MAÇ ANALİZİ</div>
</header>

<nav>
<button class="active" onclick="show('live',this)">Canlı Maçlar</button>
<button onclick="show('signals',this)">Gol Sinyalleri</button>
<button onclick="show('analysis',this)">Maç Analizi</button>
<button onclick="show('tools',this)">İstatistik</button>
</nav>

<main>
<section id="live">
<h2>🔴 Canlı Maç Merkezi</h2>
<div class="card">
<div class="live">● DEMO CANLI MAÇ</div>
<div class="teams"><span>Takım A</span><span class="score">1 - 0</span><span>Takım B</span></div>
<div class="muted">Dakika: Demo veri • Gerçek canlı veri bağlı değil</div>
<div class="signal">Maç takip ekranı</div>
</div>
<div class="card">
<div class="live">● DEMO CANLI MAÇ</div>
<div class="teams"><span>Takım C</span><span class="score">0 - 0</span><span>Takım D</span></div>
<div class="muted">Dakika: Demo veri • Gerçek canlı veri bağlı değil</div>
<div class="signal">Maç takip ekranı</div>
</div>
</section>

<section id="signals" class="hidden">
<h2>🎯 Gol Sinyalleri</h2>
<div class="card">
<h3>İlk Yarı Gol</h3>
<p class="muted">İlk yarı gol ihtimalini değerlendirmek için maç istatistiklerini kullan.</p>
</div>
<div class="card">
<h3>2.5 Üst</h3>
<p class="muted">Toplam gol beklentisi ve maç temposu değerlendirmesi.</p>
</div>
<div class="card">
<h3>Karşılıklı Gol</h3>
<p class="muted">İki takımın gol üretme performansını incele.</p>
</div>
<p class="muted">Bunlar tahmin kategorileridir; kesin sonuç veya kazanç garantisi değildir.</p>
</section>

<section id="analysis" class="hidden">
<h2>📊 Maç Analizi</h2>
<div class="card">
<h3>Analiz kriterleri</h3>
<p>• Son maçlardaki gol ortalaması</p>
<p>• İç saha ve deplasman performansı</p>
<p>• İlk yarı gol istatistikleri</p>
<p>• Savunma ve hücum performansı</p>
<p>• Son 10 dakika baskısı</p>
</div>
</section>

<section id="tools" class="hidden">
<h2>📈 Manuel İstatistik Analizi</h2>
<div class="card">
<label>Ev sahibi şut</label>
<input id="s1" type="number" min="0" placeholder="Örn. 12">
<label>Deplasman şut</label>
<input id="s2" type="number" min="0" placeholder="Örn. 7">
<label>Ev sahibi korner</label>
<input id="c1" type="number" min="0" placeholder="Örn. 6">
<label>Deplasman korner</label>
<input id="c2" type="number" min="0" placeholder="Örn. 3">
<label>Maç dakikası</label>
<input id="minute" type="number" min="1" max="120" placeholder="Örn. 72">
<button class="action" onclick="calculate()">ANALİZ ET</button>
<div id="result" class="signal" style="display:none"></div>
</div>
</section>
</main>

<footer>
WINN GOAL © 2026<br>
Demo sürüm • Gerçek maç verisi henüz bağlı değil
</footer>

<script>
function show(id,btn){
document.querySelectorAll('main section').forEach(x=>x.classList.add('hidden'));
document.getElementById(id).classList.remove('hidden');
document.querySelectorAll('nav button').forEach(x=>x.classList.remove('active'));
btn.classList.add('active');
}
function calculate(){
let a=Number(document.getElementById('s1').value)||0;
let b=Number(document.getElementById('s2').value)||0;
let c=Number(document.getElementById('c1').value)||0;
let d=Number(document.getElementById('c2').value)||0;
let m=Number(document.getElementById('minute').value)||0;
let pressure=a+b+c+d;
let r=document.getElementById('result');
let level=pressure>=25?'Yüksek istatistiksel hareketlilik':pressure>=12?'Orta düzey hareketlilik':'Düşük hareketlilik';
r.style.display='block';
r.innerHTML='Analiz sonucu: '+level+'<br>Toplam şut ve korner: '+pressure+'<br>Maç dakikası: '+m+'<br><small>Bu sonuç gol tahmini değildir; tek başına bahis kararı için kullanılmamalıdır.</small>';
}
</script>
</body>
</html>
