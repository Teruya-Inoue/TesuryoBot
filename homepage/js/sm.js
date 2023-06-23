let drag_item;
// ドラッグが開始された時
document.addEventListener('dragstart', () => {
    // ドラッグした要素を変数に格納
    drag_item = event.target;
    event.target.style.opacity = 0.6;
  });
  
  // ドラッグ中
  document.addEventListener('drag', () => {
  
  });
  
  // ドロップ可能エリアに入った時
  document.addEventListener('dragenter', () => {
  
    if (event.target.className == "pos" | event.target.className =="player") {
      event.target.style.background = '#a9a9a9';
    }
  
  });
  
  // ドロップ可能エリア内にある時
  document.addEventListener("dragover", () => {
    event.preventDefault();
  }, false);
  
  // ドロップ可能エリアから離れた時
  document.addEventListener('dragleave', () => {
  
    if (event.target.className == "pos"| event.target.className =="player") {
      event.target.style.background = '';
    }
  
  });
  
  // ドラッグが終了した時
  document.addEventListener('dragend', () => {
    event.target.style.opacity = 1;
  
  });
  
  // ドロップ時の処理
  document.addEventListener("drop", () => {
  
    if (event.target.className == "pos"| event.target.className =="player") {
      event.target.style.background = '';
      drag_item.parentNode.removeChild(drag_item);
      event.target.appendChild(drag_item);
    }
    // 格納している変数を初期化
    drag_item = null;
  });