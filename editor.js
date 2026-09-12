
(function(){
  var PASS_DEFAULT = "KremAdmin@2024";
  var STORAGE_KEY = "krem_content_overrides";
  var PASS_KEY = "krem_admin_pass";
  var unlocked = false;
  var mode = null; // 'text' | 'image' | 'highlight' | null
  var LONG_PRESS_MS = 550;

  function getPass(){ return localStorage.getItem(PASS_KEY) || PASS_DEFAULT; }

  function compressImageFile(file, callback){
    var maxDim = 1600, quality = 0.8;
    try {
      var reader = new FileReader();
      reader.onload = function(ev){
        var img = new Image();
        img.onload = function(){
          var w = img.width, h = img.height;
          if(w > maxDim || h > maxDim){
            if(w > h){ h = Math.round(h * maxDim / w); w = maxDim; }
            else { w = Math.round(w * maxDim / h); h = maxDim; }
          }
          var canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          var out;
          try { out = canvas.toDataURL('image/jpeg', quality); } catch(e2){ out = ev.target.result; }
          callback(out);
        };
        img.onerror = function(){ callback(ev.target.result); };
        img.src = ev.target.result;
      };
      reader.onerror = function(){ callback(null); };
      reader.readAsDataURL(file);
    } catch(e){ callback(null); }
  }

  function sanitizeOverrides(o){
    o = o || {};
    o.texts = o.texts || {}; o.images = o.images || {}; o.highlights = o.highlights || {};
    // Drop any legacy (pre-fingerprint) entries — position alone isn't a safe identifier
    // in this app, so entries saved before this fix could point at the wrong element on
    // a different page. Only keep entries saved in the new, verified {value, fp} format.
    ['texts','images'].forEach(function(kind){
      Object.keys(o[kind]).forEach(function(path){
        var v = o[kind][path];
        if(!v || typeof v !== 'object' || typeof v.fp !== 'string'){
          delete o[kind][path];
        }
      });
    });
    Object.keys(o.highlights).forEach(function(path){
      var v = o.highlights[path];
      if(!v || typeof v !== 'object' || typeof v.fp !== 'string'){
        delete o.highlights[path];
      }
    });
    return o;
  }

  function loadOverrides(){
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return {texts:{}, images:{}, highlights:{}};
      return sanitizeOverrides(JSON.parse(raw));
    } catch(e){ return {texts:{}, images:{}, highlights:{}}; }
  }

  // A lightweight fingerprint of an element's tag + class list. Two elements in
  // different parts of this app essentially never share the same tag+className,
  // because every element uses a long, specific Tailwind utility string. We use this
  // to confirm, right before applying a saved edit, that the element currently sitting
  // at a saved position is still the SAME element it was when the edit was made — not
  // some unrelated element from a different page that now happens to occupy that slot.
  function fingerprint(el){
    return el.tagName + '|' + (el.className || '');
  }

  var saveStatusEl = null;
  function showSaveStatus(msg, isError){
    if(!saveStatusEl){
      saveStatusEl = document.createElement('div');
      saveStatusEl.id = 'kc-save-status';
      saveStatusEl.style.cssText = 'position:fixed;bottom:70px;right:16px;z-index:2147483000;max-width:260px;padding:10px 14px;border-radius:12px;font-size:12px;font-family:Inter,Poppins,sans-serif;color:#fff;';
      document.body.appendChild(saveStatusEl);
    }
    saveStatusEl.textContent = msg;
    saveStatusEl.style.background = isError ? 'rgba(180,40,40,0.95)' : 'rgba(20,20,20,0.92)';
    saveStatusEl.style.border = isError ? '1px solid rgba(255,120,120,0.5)' : '1px solid rgba(255,255,255,0.2)';
    clearTimeout(saveStatusEl._t);
    saveStatusEl._t = setTimeout(function(){ if(saveStatusEl && saveStatusEl.parentNode) saveStatusEl.parentNode.removeChild(saveStatusEl); saveStatusEl = null; }, isError ? 6000 : 3000);
  }

  function saveOverrides(){
    var localErr = null;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    } catch(err){ localErr = err && err.message ? err.message : String(err); }
    if(localErr){
      showSaveStatus('❌ Save failed: '+localErr, true);
    } else {
      showSaveStatus('Saved on this device only.', true);
    }
  }
  var overrides = loadOverrides();

  function getRoot(){ return document.getElementById('root'); }

  function pathOf(el){
    var root = getRoot();
    if(!root) return null;
    var path = [];
    var node = el;
    while(node && node !== root){
      var parent = node.parentElement;
      if(!parent) return null;
      var idx = Array.prototype.indexOf.call(parent.children, node);
      path.unshift(idx);
      node = parent;
    }
    if(node !== root) return null;
    return path.join('-');
  }

  function elAtPath(path){
    var root = getRoot();
    if(!path || !root) return null;
    var node = root;
    var parts = path.split('-');
    for(var i=0;i<parts.length;i++){
      var idx = parseInt(parts[i],10);
      if(!node.children || !node.children[idx]) return null;
      node = node.children[idx];
    }
    return node;
  }

  function isLeafTextEl(el){
    if(el.closest('#kc-toolbar')) return false;
    if(el.children && el.children.length>0) return false;
    var t = el.textContent ? el.textContent.trim() : '';
    if(!t) return false;
    var tag = el.tagName;
    if(tag==='SCRIPT'||tag==='STYLE'||tag==='INPUT'||tag==='TEXTAREA') return false;
    return true;
  }

  function hasFormControl(el){
    return !!(el.querySelector && el.querySelector('input,textarea,select,button'));
  }
  function applyOverrides(){
    var root = getRoot();
    if(!root) return;
    var active = document.activeElement;
    Object.keys(overrides.texts).forEach(function(path){
      var entry = overrides.texts[path];
      if(!entry || typeof entry !== 'object') return;
      var el = elAtPath(path);
      if(!el) return;
      if(fingerprint(el) !== entry.fp) return; // stale path now points at a different element — skip, never corrupt it
      if(el === active || (el.contains && active && el.contains(active))) return;
      if(hasFormControl(el)) return;
      el.textContent = entry.value;
    });
    Object.keys(overrides.images).forEach(function(path){
      var entry = overrides.images[path];
      if(!entry || typeof entry !== 'object') return;
      var el = elAtPath(path);
      if(!el || el.tagName!=='IMG') return;
      if(fingerprint(el) !== entry.fp) return; // same safety check for images
      el.src = entry.value;
    });
    Object.keys(overrides.highlights).forEach(function(path){
      var entry = overrides.highlights[path];
      if(!entry || typeof entry !== 'object') return;
      var el = elAtPath(path);
      if(!el) return;
      if(fingerprint(el) !== entry.fp) return;
      el.classList.toggle('kc-hl', !!entry.on);
    });
  }

  var reapplyTimer = null;
  function scheduleReapply(){
    clearTimeout(reapplyTimer);
    reapplyTimer = setTimeout(function(){
      var active = document.activeElement;
      var tag = active && active.tagName;
      if(tag==='INPUT' || tag==='TEXTAREA' || tag==='SELECT'){
        scheduleReapply();
        return;
      }
      applyOverrides();
    }, 300);
  }

  function injectStyle(){
    var style = document.createElement('style');
    style.textContent =
      '.kc-hl{outline:3px solid #FFD700 !important;background:rgba(255,215,0,0.18) !important;border-radius:4px;}' +
      '.kc-editable-text:hover{outline:2px dashed #2E8B57;cursor:text;}' +
      '.kc-editable-img{cursor:pointer;filter:brightness(0.85);outline:2px dashed #2E8B57;}' +
      '#kc-toolbar{position:fixed;bottom:16px;right:16px;z-index:2147483000;display:flex;flex-direction:column;gap:8px;align-items:flex-end;font-family:Inter,Poppins,sans-serif;}' +
      '#kc-toolbar button{padding:10px 14px;border-radius:999px;border:1px solid rgba(255,255,255,0.25);background:rgba(20,20,20,0.92);color:#fff;font-size:12px;cursor:pointer;backdrop-filter:blur(8px);white-space:nowrap;}' +
      '#kc-toolbar button.active{background:#2E8B57;border-color:#2E8B57;}' +
      '#kc-hint{position:fixed;bottom:16px;left:16px;z-index:2147483000;max-width:260px;background:rgba(20,20,20,0.92);color:#fff;font-size:11px;padding:10px 12px;border-radius:12px;font-family:Inter,Poppins,sans-serif;}';
    document.head.appendChild(style);
  }

  var fileInput = null;
  var pendingImgEl = null;
  function setupFileInput(){
    fileInput = document.createElement('input');
    fileInput.type='file';
    fileInput.accept='image/*';
    fileInput.style.display='none';
    document.body.appendChild(fileInput);
    fileInput.addEventListener('change', function(){
      var file = fileInput.files && fileInput.files[0];
      if(!file || !pendingImgEl) return;
      compressImageFile(file, function(dataUrl){
        if(!dataUrl) return;
        pendingImgEl.src = dataUrl;
        var p = pathOf(pendingImgEl);
        if(p){ overrides.images[p] = {value:dataUrl, fp:fingerprint(pendingImgEl)}; saveOverrides(); }
      });
      fileInput.value = '';
    });
  }

  var TRANSPARENT = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

  function refreshHandlers(){
    var root = getRoot();
    if(!root) return;
    var texts = root.querySelectorAll('.kc-editable-text');
    for(var i=0;i<texts.length;i++){ texts[i].removeAttribute('contenteditable'); texts[i].classList.remove('kc-editable-text'); }
    var imgs = root.querySelectorAll('.kc-editable-img');
    for(var j=0;j<imgs.length;j++){ imgs[j].classList.remove('kc-editable-img'); }

    if(mode==='text'){
      var all = root.querySelectorAll('*');
      for(var k=0;k<all.length;k++){
        if(isLeafTextEl(all[k])){
          all[k].setAttribute('contenteditable','true');
          all[k].classList.add('kc-editable-text');
        }
      }
    }
    if(mode==='image'){
      var allImgs = root.querySelectorAll('img');
      for(var m=0;m<allImgs.length;m++){
        allImgs[m].classList.add('kc-editable-img');
      }
    }
  }

  document.addEventListener('focusout', function(e){
    if(mode==='text' && e.target && e.target.classList && e.target.classList.contains('kc-editable-text')){
      var p = pathOf(e.target);
      if(p){ overrides.texts[p] = {value:e.target.textContent, fp:fingerprint(e.target)}; saveOverrides(); }
    }
  }, true);

  var pressTimer = null;
  var pressTarget = null;
  var longPressFired = false;

  function onPointerDown(e){
    if(mode!=='image') return;
    var img = e.target && e.target.closest && e.target.closest('.kc-editable-img');
    if(!img) return;
    pressTarget = img;
    longPressFired = false;
    pressTimer = setTimeout(function(){
      longPressFired = true;
      if(confirm('Remove this image?')){
        img.src = TRANSPARENT;
        var p = pathOf(img);
        if(p){ overrides.images[p] = {value:TRANSPARENT, fp:fingerprint(img)}; saveOverrides(); }
      }
    }, LONG_PRESS_MS);
  }
  function onPointerUp(e){
    if(mode!=='image') return;
    clearTimeout(pressTimer);
    if(pressTarget && !longPressFired){
      var img = pressTarget;
      var real = e.target && e.target.closest && e.target.closest('.kc-editable-img');
      if(real===img){
        pendingImgEl = img;
        fileInput.click();
      }
    }
    pressTarget = null;
  }

  document.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('pointerup', onPointerUp, true);

  document.addEventListener('click', function(e){
    if(mode==='image'){
      var img = e.target && e.target.closest && e.target.closest('.kc-editable-img');
      if(img){ e.preventDefault(); e.stopPropagation(); }
      return;
    }
    if(mode==='highlight'){
      var root = getRoot();
      var el = e.target;
      if(el && root && root.contains(el) && el!==root && !el.closest('#kc-toolbar')){
        e.preventDefault(); e.stopPropagation();
        var on = !el.classList.contains('kc-hl');
        el.classList.toggle('kc-hl', on);
        var p = pathOf(el);
        if(p){
          if(on) overrides.highlights[p] = {on:true, fp:fingerprint(el)}; else delete overrides.highlights[p];
          saveOverrides();
        }
      }
    }
  }, true);

  function setMode(newMode){
    mode = (mode===newMode) ? null : newMode;
    var buttons = document.querySelectorAll('#kc-toolbar button[data-mode]');
    for(var i=0;i<buttons.length;i++){
      buttons[i].classList.toggle('active', buttons[i].getAttribute('data-mode')===mode);
    }
    refreshHandlers();
  }

  function buildToolbar(){
    if(document.getElementById('kc-toolbar')) return;
    var bar = document.createElement('div');
    bar.id = 'kc-toolbar';
    bar.innerHTML =
      '<button data-mode="text">Edit Text</button>' +
      '<button data-mode="image">Edit Images</button>' +
      '<button data-mode="highlight">Highlight</button>' +
      '<button id="kc-reset">Reset My Edits</button>' +
      '<button id="kc-exit">Exit Editor</button>';
    document.body.appendChild(bar);

    var hint = document.createElement('div');
    hint.id = 'kc-hint';
    hint.textContent = 'Content Editor unlocked. Edit Text: tap any text and type. Edit Images: tap an image to pick from your gallery, or press-and-hold to remove it. Highlight: tap anything to glow it.';
    document.body.appendChild(hint);
    setTimeout(function(){ if(hint.parentNode) hint.parentNode.removeChild(hint); }, 9000);

    var modeButtons = bar.querySelectorAll('button[data-mode]');
    for(var i=0;i<modeButtons.length;i++){
      modeButtons[i].addEventListener('click', (function(btn){
        return function(){ setMode(btn.getAttribute('data-mode')); };
      })(modeButtons[i]));
    }
    document.getElementById('kc-reset').addEventListener('click', function(){
      if(confirm('Remove all text, image and highlight edits made in this Content Editor? (Prices/links in the Secret Admin Dashboard are not affected.)')){
        overrides = {texts:{}, images:{}, highlights:{}};
        saveOverrides();
        location.reload();
      }
    });
    document.getElementById('kc-exit').addEventListener('click', function(){
      mode = null;
      refreshHandlers();
      bar.parentNode.removeChild(bar);
    });
  }

  function unlock(){
    if(unlocked) return;
    unlocked = true;
    injectStyle();
    setupFileInput();
    buildToolbar();
    applyOverrides();
    new MutationObserver(scheduleReapply).observe(getRoot() || document.body, {childList:true, subtree:true});
  }
  window.kcOpenEditor = unlock;
  window.kcPickImage = function(callback){
    if(!fileInput){ setupFileInput(); }
    var handler = function(){
      var file = fileInput.files && fileInput.files[0];
      fileInput.removeEventListener('change', handler);
      if(!file) return;
      compressImageFile(file, function(dataUrl){
        if(dataUrl) callback(dataUrl);
      });
      fileInput.value = '';
    };
    fileInput.addEventListener('change', handler);
    fileInput.click();
  };

  function promptPassword(){
    var entered = prompt('Enter admin password to unlock the content editor:');
    if(entered===null) return;
    if(entered===getPass()) unlock();
    else alert('Wrong password');
  }

  function tryUnlockFromURL(){
    var p = new URLSearchParams(location.search).get('admin');
    if(p==='krem2024') unlock();
  }

  var logoTaps = 0;
  var logoTapTimer = null;
  function bindLogoTap(){
    document.addEventListener('click', function(e){
      var header = e.target && e.target.closest && e.target.closest('header');
      if(!header) return;
      var clickable = e.target.closest('.cursor-pointer');
      if(!clickable) return;
      logoTaps++;
      clearTimeout(logoTapTimer);
      logoTapTimer = setTimeout(function(){ logoTaps = 0; }, 1500);
      if(logoTaps>=5){ logoTaps = 0; promptPassword(); }
    }, true);
  }

  document.addEventListener('keydown', function(e){
    if(e.ctrlKey && e.shiftKey && (e.key==='E' || e.key==='e')){
      promptPassword();
    }
  });

  function startWatching(){
    applyOverrides();
    new MutationObserver(scheduleReapply).observe(getRoot() || document.body, {childList:true, subtree:true});
    // The site's own content (images/prices/text) loads asynchronously from the cloud too,
    // and can re-render the page shortly after this editor's first pass. Re-check once more
    // shortly after so overrides still get applied correctly to that final layout — safe to
    // do because applyOverrides() only ever touches elements whose fingerprint still matches.
    setTimeout(applyOverrides, 1500);
    setTimeout(applyOverrides, 4000);
  }

  function waitForRootThenStart(triesLeft){
    var root = getRoot();
    if(root && root.children && root.children.length>0){
      startWatching();
      return;
    }
    if(triesLeft<=0){ startWatching(); return; }
    setTimeout(function(){ waitForRootThenStart(triesLeft-1); }, 200);
  }

  function init(){
    tryUnlockFromURL();
    bindLogoTap();
    waitForRootThenStart(20);
  }

  if(document.readyState==='complete' || document.readyState==='interactive'){
    setTimeout(init, 300);
  } else {
    document.addEventListener('DOMContentLoaded', function(){ setTimeout(init, 300); });
  }
})();

  