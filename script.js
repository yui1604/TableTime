// テーマ切り替えで操作する要素を最初に取得
const clockElement = document.querySelector('.clock');
const hourHandImg = document.getElementById('hour-hand-img');
const minuteHandImg = document.getElementById('minute-hand-img');
const secondHandImg = document.getElementById('second-hand-img');

// 現在のテーマ（'day' または 'night'）を保持する変数
let currentTheme = null;

/**
 * 時間に応じてDay/Nightテーマを切り替える関数
 */
function updateTheme() {
  const now = new Date();
  const hour = now.getHours();
  
  // 23時以降 または 6時未満 の場合はナイトモード
  const isNight = hour >= 23 || hour < 6;
  const newTheme = isNight ? 'night' : 'day';

  // テーマが変更された場合のみ、DOM操作を実行
  if (newTheme !== currentTheme) {
    currentTheme = newTheme; // 現在のテーマを更新

    // bodyのクラスを更新 (CSSのスタイルを適用)
    document.body.classList.toggle('night-mode', isNight);

    // 時計の針の画像ソースを更新
    hourHandImg.src   = `assets/${currentTheme}/hour-hand.png`;
    minuteHandImg.src = `assets/${currentTheme}/minute-hand.png`;
    secondHandImg.src = `assets/${currentTheme}/second-hand.png`;
  }
}

/* 時計を回す（秒針なめらか + 針画像を左90°補正） */
function updateClockSmooth() {
  const now = new Date();
  const ms = now.getMilliseconds();
  const s = now.getSeconds() + ms / 1000;  // 秒＋ミリ秒
  const m = now.getMinutes() + s / 60;     // 分＋秒
  const h = now.getHours() + m / 60;       // 時＋分

  const offset = -90; // 画像が右向きなので、上(0°)を基準にするため-90°補正

  const secondDeg = s * 6 + offset;        // 1秒=6° + 補正
  const minuteDeg = m * 6 + offset;        // 1分=6° + 補正
  const hourDeg   = (h % 12) * 30 + offset;// 1時間=30° + 補正

  document.querySelector('.second-hand').style.transform =
    `translate(-50%, -50%) rotate(${secondDeg}deg)`;
  document.querySelector('.minute-hand').style.transform =
    `translate(-50%, -50%) rotate(${minuteDeg}deg)`;
  document.querySelector('.hour-hand').style.transform   =
    `translate(-50%, -50%) rotate(${hourDeg}deg)`;

  requestAnimationFrame(updateClockSmooth); // 毎フレーム更新
}

/* カレンダー生成（月曜始まり、土日グレー、今日に白丸 + 二桁は文字間隔調整） */
function generateCalendar(){
  const calendar = document.getElementById('calendar');
  calendar.innerHTML = '';

  const now   = new Date();
  const year  = now.getFullYear();
  const month = now.getMonth();      // 0-11
  const today = now.getDate();

  const monthNames = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  const weekdays   = ['月','火','水','木','金','土','日'];

  // 月
  const monthDiv = document.createElement('div');
  monthDiv.className = 'month';
  monthDiv.innerHTML = monthNames[month].replace('月', '<span class="month-kanji">月</span>');
  calendar.appendChild(monthDiv);

  // 曜日
  const weekdaysDiv = document.createElement('div');
  weekdaysDiv.className = 'weekdays';
  weekdays.forEach((label, idx) => {
    const d = document.createElement('div');
    d.innerHTML = `<span class="weekday-kanji">${label}</span>`;
    if (idx === 5) d.classList.add('sat'); // 土
    if (idx === 6) d.classList.add('sun'); // 日
    weekdaysDiv.appendChild(d);
  });
  calendar.appendChild(weekdaysDiv);

  // 日
  const daysDiv = document.createElement('div');
  daysDiv.className = 'days';

  let firstDay = new Date(year, month, 1).getDay(); // 0=日,1=月...
  if (firstDay === 0) firstDay = 7; // 日曜始まりを月曜始まりに補正
  for (let i = 1; i < firstDay; i++){
    daysDiv.appendChild(document.createElement('div'));
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++){
    const cell = document.createElement('div');
    cell.textContent = d;

    // 二桁の日付にはクラスを追加
    if (d >= 10) {
      cell.classList.add('two-digit');
    }

    const dow = new Date(year, month, d).getDay(); // 0=日,6=土
    if (dow === 6) cell.classList.add('sat');
    if (dow === 0) cell.classList.add('sun');
    if (d === today) cell.classList.add('today');

    daysDiv.appendChild(cell);
  }

  calendar.appendChild(daysDiv);
}

/* ===== 実行 ===== */
generateCalendar();
updateClockSmooth();

// 初回読み込み時にテーマを設定
updateTheme();
// 1秒ごとに時間をチェックしてテーマを更新
setInterval(updateTheme, 1000);