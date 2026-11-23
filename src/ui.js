const TEXT = {
  de: {
    stars: 'Sterne', level: 'Gartenlevel', coins: 'Münzen', shop: 'Gartenladen', close: 'Schließen',
    shopTitle: 'Gartenladen', shopHelp: 'Wähle ein Stück Gartenschmuck. Danach kannst du es auf dem Boden platzieren.',
    items: { flowerBed: ['Blumenbeet', 'Ein kleines Beet voller Farbe.'], statue: ['Gartenstatue', 'Ein stiller Wächter für den Garten.'], lantern: ['Laterne', 'Ein warmes Licht für Wege und Abende.'], gnome: ['Zusätzlicher Wichtel', 'Ein fröhlicher neuer Gartenbewohner.'] },
    restoreFountain: 'Brunnen restaurieren · 3 Sterne', restoreBench: 'Bank restaurieren · 2 Sterne',
    controls: 'WASD bewegen · Leertaste springen · E interagieren · Maus ziehen: Kamera drehen',
    touchControls: 'Touch-Steuerung', keyboardControls: 'Tastatur-Steuerung', jump: 'Sprung',
    signPrompt: 'E oder antippen: Match-3 am Gartenschild spielen', fountainPrompt: 'E: Brunnen für 3 Sterne restaurieren', benchPrompt: 'E: Bank für 2 Sterne restaurieren',
    placePrompt: 'Tippe/klicke auf den Gartenboden, um das Objekt zu platzieren · Esc zum Abbrechen', noStars: 'Dafür fehlen noch Sterne.', bought: 'Gekauft! Platziere dein Objekt im Garten.',
    restored: 'Wunderschön! Der Garten ist ein Stück lebendiger.', saved: 'Spielstand gespeichert.', collected: 'Münze eingesammelt!', matchTitle: 'Edelstein-Garten',
    language: 'Sprache', noTarget: 'Nichts in Reichweite. Gehe zum Schild, Brunnen oder zur Bank.',
  },
  'pt-BR': {
    stars: 'Estrelas', level: 'Nível do jardim', coins: 'Moedas', shop: 'Loja do jardim', close: 'Fechar',
    shopTitle: 'Loja do jardim', shopHelp: 'Escolha uma decoração. Depois, coloque-a no chão do jardim.',
    items: { flowerBed: ['Canteiro', 'Um pequeno canteiro cheio de cores.'], statue: ['Estátua do jardim', 'Uma guardiã silenciosa para o jardim.'], lantern: ['Lanterna', 'Uma luz acolhedora para os caminhos.'], gnome: ['Gnomo extra', 'Um novo morador alegre do jardim.'] },
    restoreFountain: 'Restaurar fonte · 3 estrelas', restoreBench: 'Restaurar banco · 2 estrelas',
    controls: 'WASD mover · Espaço pular · E interagir · Arraste: girar câmera',
    touchControls: 'Controles por toque', keyboardControls: 'Controles de teclado', jump: 'Pular',
    signPrompt: 'E ou toque: jogar Match-3 na placa do jardim', fountainPrompt: 'E: restaurar a fonte por 3 estrelas', benchPrompt: 'E: restaurar o banco por 2 estrelas',
    placePrompt: 'Toque/clique no chão para colocar · Esc para cancelar', noStars: 'Você ainda não tem estrelas suficientes.', bought: 'Comprado! Coloque o item no jardim.',
    restored: 'Que bonito! O jardim está mais vivo.', saved: 'Jogo salvo.', collected: 'Moeda coletada!', matchTitle: 'Jardim de Gemas',
    language: 'Idioma', noTarget: 'Nada por perto. Vá até a placa, a fonte ou o banco.',
  },
};

export function createUI({ root, language = 'de', callbacks = {} }) {
  let locale = Object.hasOwn(TEXT, language) ? language : 'de';
  let currentStats = { stars: 0, level: 1, coins: 0, totalCoins: 45 };
  let shopOpen = false;
  let touchVisible = false;
  const text = () => TEXT[locale];

  root.innerHTML = `
    <div id="topHud">
      <div class="ui-panel hud-stat" id="starsStat">✦ <span id="starsValue">0</span> <small></small></div>
      <div class="ui-panel hud-stat" id="levelStat">✿ <span id="levelValue">1</span> <small></small></div>
      <div class="ui-panel hud-stat" id="coinStat">● <span id="coinValue">0/45</span> <small></small></div>
    </div>
    <div id="topActions">
      <button class="game-button" id="shopButton" type="button"></button>
      <button class="game-button" id="controlModeButton" type="button"></button>
      <button class="game-button" id="languageButton" type="button" aria-label="Sprache umschalten">DE / PT</button>
    </div>
    <div class="ui-panel" id="interactionPrompt" aria-live="polite"></div>
    <div class="ui-panel" id="toast" role="status" aria-live="polite"></div>
    <section class="ui-panel" id="shopPanel" hidden>
      <h2></h2><p class="shop-help"></p>
      <div class="shop-items"></div>
      <button class="game-button shop-close" type="button"></button>
    </section>
    <div id="touchControls" aria-label="Touch-Steuerung">
      <div class="joystick-pad" id="joystickPad" role="application" aria-label="Virtueller Joystick"><div class="joystick-knob" id="joystickKnob"></div></div>
      <button class="game-button" id="interactButton" type="button"></button>
      <button class="game-button" id="jumpButton" type="button"></button>
    </div>`;

  const $ = (selector) => root.querySelector(selector);
  const promptElement = $('#interactionPrompt');
  const toastElement = $('#toast');
  const shopPanel = $('#shopPanel');
  let toastTimer = null;

  function renderStats(stats = currentStats) {
    currentStats = { ...currentStats, ...stats };
    $('#starsValue').textContent = String(currentStats.stars);
    $('#levelValue').textContent = String(currentStats.level);
    $('#coinValue').textContent = `${currentStats.coins}/${currentStats.totalCoins}`;
    $('#starsStat small').textContent = text().stars;
    $('#levelStat small').textContent = text().level;
    $('#coinStat small').textContent = text().coins;
    renderShop();
  }

  function renderShop() {
    const labels = text();
    $('#shopButton').textContent = `✿ ${labels.shop}`;
    $('#controlModeButton').textContent = touchVisible ? labels.touchControls : labels.keyboardControls;
    $('#languageButton').title = labels.language;
    $('#shopPanel h2').textContent = labels.shopTitle;
    $('#shopPanel .shop-help').textContent = labels.shopHelp;
    $('#shopPanel .shop-close').textContent = labels.close;
    const prices = { flowerBed: 2, statue: 4, lantern: 3, gnome: 1 };
    const itemsElement = $('#shopPanel .shop-items');
    itemsElement.replaceChildren();
    for (const [key, [name, description]] of Object.entries(labels.items)) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'shop-item';
      button.disabled = currentStats.stars < prices[key];
      button.innerHTML = `<span>${name}<small>${description}</small></span><strong>✦ ${prices[key]}</strong>`;
      button.addEventListener('click', () => callbacks.onBuy?.(key, prices[key]));
      itemsElement.appendChild(button);
    }
    for (const [key, price] of [['fountain', 3], ['bench', 2]]) {
      const already = callbacks.isRestored?.(key) ?? false;
      if (already) continue;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'shop-item';
      button.disabled = currentStats.stars < price;
      button.innerHTML = `<span>${key === 'fountain' ? labels.restoreFountain : labels.restoreBench}</span><strong>✦ ${price}</strong>`;
      button.addEventListener('click', () => callbacks.onRestore?.(key, price));
      itemsElement.appendChild(button);
    }
  }

  function setLanguage(next) {
    locale = Object.hasOwn(TEXT, next) ? next : 'de';
    root.lang = locale;
    renderStats();
    promptElement.textContent = text().controls;
    $('#jumpButton').textContent = text().jump;
    $('#interactButton').textContent = locale === 'de' ? 'Aktion' : 'Ação';
    $('#touchControls').setAttribute('aria-label', text().touchControls);
  }

  function setTouchControls(visible) {
    touchVisible = Boolean(visible);
    $('#touchControls').classList.toggle('is-visible', touchVisible);
    renderShop();
  }

  function setPrompt(message = '') {
    promptElement.textContent = message || text().controls;
  }

  function toast(message, duration = 1900) {
    toastElement.textContent = message;
    toastElement.classList.add('is-visible');
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toastElement.classList.remove('is-visible'), duration);
  }

  function toggleShop(force) {
    shopOpen = typeof force === 'boolean' ? force : !shopOpen;
    shopPanel.hidden = !shopOpen;
    if (shopOpen) renderShop();
    callbacks.onShopChange?.(shopOpen);
  }

  $('#shopButton').addEventListener('click', () => toggleShop());
  $('#shopPanel .shop-close').addEventListener('click', () => toggleShop(false));
  $('#controlModeButton').addEventListener('click', () => {
    setTouchControls(!touchVisible);
    callbacks.onControlModeChange?.(touchVisible);
  });
  $('#languageButton').addEventListener('click', () => callbacks.onLanguageToggle?.());
  $('#jumpButton').addEventListener('pointerdown', (event) => { event.preventDefault(); callbacks.onJump?.(); });
  $('#interactButton').addEventListener('pointerdown', (event) => { event.preventDefault(); callbacks.onInteract?.(); });

  const pad = $('#joystickPad');
  const knob = $('#joystickKnob');
  let pointerId = null;
  function updateStick(event) {
    const rect = pad.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const max = rect.width * 0.31;
    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    const length = Math.hypot(dx, dy);
    const ratio = length > max ? max / length : 1;
    knob.style.transform = `translate(${dx * ratio}px, ${dy * ratio}px)`;
    callbacks.onJoystick?.(Math.max(-1, Math.min(1, dx / max)), Math.max(-1, Math.min(1, -dy / max)));
  }
  pad.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    pointerId = event.pointerId;
    pad.setPointerCapture(pointerId);
    updateStick(event);
  });
  pad.addEventListener('pointermove', (event) => { if (pointerId === event.pointerId) updateStick(event); });
  const endStick = (event) => {
    if (pointerId !== event.pointerId) return;
    pointerId = null;
    knob.style.transform = '';
    callbacks.onJoystick?.(0, 0);
  };
  pad.addEventListener('pointerup', endStick);
  pad.addEventListener('pointercancel', endStick);

  setLanguage(locale);
  renderStats();
  return {
    setLanguage,
    getLanguage: () => locale,
    renderStats,
    setPrompt,
    toast,
    setTouchControls,
    toggleShop,
    isShopOpen: () => shopOpen,
    setPlacementMode(active) { root.classList.toggle('is-placing', Boolean(active)); },
    languageText: () => text(),
  };
}
