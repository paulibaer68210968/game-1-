import { ART } from './art.js';

const SIZE = 8;
const START_MOVES = 20;
const COLORS = ['Red', 'Blue', 'Green', 'Yellow', 'Purple'];
const COLOR_LABELS = {
  de: { Red: 'Rot', Blue: 'Blau', Green: 'Grün', Yellow: 'Gelb', Purple: 'Lila' },
  'pt-BR': { Red: 'Vermelho', Blue: 'Azul', Green: 'Verde', Yellow: 'Amarelo', Purple: 'Roxo' },
};
const TARGET_BY_LEVEL = ['Red', 'Blue', 'Green', 'Yellow', 'Purple'];
const SPECIAL_SYMBOLS = { row: '↔', column: '↕', bomb: '✿', rainbow: '✧' };
// No automatic opening match; row 1, column 5 can swap with row 2, column 5 to form four blues.
const ORIGINAL_BOARD = [
  ['Green', 'Green', 'Blue', 'Blue', 'Yellow', 'Blue', 'Purple', 'Yellow'],
  ['Yellow', 'Purple', 'Blue', 'Yellow', 'Blue', 'Red', 'Green', 'Red'],
  ['Purple', 'Yellow', 'Yellow', 'Purple', 'Blue', 'Purple', 'Purple', 'Yellow'],
  ['Red', 'Green', 'Green', 'Blue', 'Green', 'Red', 'Yellow', 'Green'],
  ['Blue', 'Yellow', 'Purple', 'Purple', 'Blue', 'Red', 'Red', 'Purple'],
  ['Blue', 'Red', 'Yellow', 'Purple', 'Yellow', 'Purple', 'Purple', 'Green'],
  ['Yellow', 'Purple', 'Purple', 'Green', 'Yellow', 'Purple', 'Purple', 'Red'],
  ['Purple', 'Red', 'Red', 'Green', 'Red', 'Green', 'Yellow', 'Purple'],
];

const TEXT = {
  de: {
    levelLabel: 'Level',
    title: 'Edelstein-Garten', subtitle: 'Vierer, Fünfer und Ecken formen Spezialsteine. Tausche benachbarte Steine per Tipp oder Wisch.',
    back: 'Zurück', moves: 'Züge', goal: 'Ziel', collected: 'Gesammelt', hint: 'Wähle zwei benachbarte Steine zum Tauschen.',
    selected: (color, row, col) => `${color}, Reihe ${row}, Spalte ${col} ausgewählt. Wähle einen benachbarten Stein.`,
    invalid: 'Dort entsteht keine Reihe – der Tausch wurde zurückgesetzt.',
    win: 'Wunderbar! Das Gartenziel ist erreicht!', lose: 'Keine Züge mehr. Versuche es noch einmal!',
    colors: COLOR_LABELS.de, powersTitle: 'Spezialsteine', boostersTitle: 'Garten-Booster',
    powerNames: { row: 'Zeilenrakete', column: 'Spaltenrakete', bomb: 'Blumenbombe', rainbow: 'Regenbogenstein' },
    powerHints: { row: 'räumt eine ganze Zeile', column: 'räumt eine ganze Spalte', bomb: 'räumt das Feld rundherum', rainbow: 'räumt Steine einer Farbe' },
    shovel: 'Gartenschaufel', watering: 'Gießkanne', uses: (count) => `${count} übrig`,
    shovelReady: 'Schaufel: Tippe ein Feld zum Entfernen.', wateringReady: 'Gießkanne: Tippe ein Feld für eine 3×3-Fläche.',
    shovelUsed: 'Ein Stein wurde mit der Schaufel entfernt.', wateringUsed: 'Die Gießkanne hat ein 3×3-Feld freigeräumt.', boosterCancel: 'Booster abgewählt. Wähle zwei benachbarte Steine.',
    specialCreated: (name) => `${name} gebildet! Beim Auslösen kann sie weitere Steine mitreißen.`,
    specialActivated: 'Spezialstein ausgelöst – die Kettenreaktion läuft!', noMovesBoosters: 'Keine Züge mehr – setze deine verbleibenden Booster ein!',
    continueGarden: 'Zurück zum Garten', retry: 'Noch einmal spielen',
  },
  'pt-BR': {
    levelLabel: 'Nível',
    title: 'Jardim de Gemas', subtitle: 'Sequências de 4, 5 e cruzamentos criam gemas especiais. Toque ou deslize para trocar pedras vizinhas.',
    back: 'Voltar', moves: 'Jogadas', goal: 'Meta', collected: 'Coletadas', hint: 'Escolha duas pedras vizinhas para trocar.',
    selected: (color, row, col) => `${color}, linha ${row}, coluna ${col} selecionada. Escolha uma pedra vizinha.`,
    invalid: 'Essa troca não formou uma sequência e foi desfeita.',
    win: 'Maravilha! Você alcançou a meta do jardim!', lose: 'As jogadas acabaram. Tente novamente!',
    colors: COLOR_LABELS['pt-BR'], powersTitle: 'Gemas especiais', boostersTitle: 'Impulsos do jardim',
    powerNames: { row: 'Foguete horizontal', column: 'Foguete vertical', bomb: 'Bomba de flores', rainbow: 'Gema arco-íris' },
    powerHints: { row: 'limpa uma linha inteira', column: 'limpa uma coluna inteira', bomb: 'limpa as pedras ao redor', rainbow: 'limpa pedras de uma cor' },
    shovel: 'Pá de jardim', watering: 'Regador', uses: (count) => `${count} restante(s)`,
    shovelReady: 'Pá: toque em uma pedra para removê-la.', wateringReady: 'Regador: toque em uma pedra para limpar 3×3.',
    shovelUsed: 'Uma pedra foi removida com a pá.', wateringUsed: 'O regador limpou uma área de 3×3.', boosterCancel: 'Impulso cancelado. Escolha duas pedras vizinhas.',
    specialCreated: (name) => `${name} criada! Ao ativar, ela pode causar novas reações.`,
    specialActivated: 'Gema especial ativada — as reações em cadeia começaram!', noMovesBoosters: 'As jogadas acabaram — use os impulsos restantes!',
    continueGarden: 'Voltar ao jardim', retry: 'Jogar novamente',
  },
};

function makeGem(color, special = null) { return { color, special }; }
function colorAt(board, row, col) { return board[row]?.[col]?.color || null; }
function keyOf(row, col) { return `${row},${col}`; }
function parseKey(key) { return key.split(',').map(Number); }

function makeRandomBoard() {
  const board = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const choices = COLORS.filter((color) => {
        const makesHorizontal = col >= 2 && colorAt(board, row, col - 1) === color && colorAt(board, row, col - 2) === color;
        const makesVertical = row >= 2 && colorAt(board, row - 1, col) === color && colorAt(board, row - 2, col) === color;
        return !makesHorizontal && !makesVertical;
      });
      board[row][col] = makeGem(choices[Math.floor(Math.random() * choices.length)]);
    }
  }
  return board;
}

function findRuns(board) {
  const runs = [];
  for (let row = 0; row < SIZE; row += 1) {
    let start = 0;
    while (start < SIZE) {
      const color = colorAt(board, row, start);
      let end = start + 1;
      while (end < SIZE && color && colorAt(board, row, end) === color) end += 1;
      if (color && end - start >= 3) {
        runs.push({ color, orientation: 'row', cells: Array.from({ length: end - start }, (_, i) => [row, start + i]) });
      }
      start = end;
    }
  }
  for (let col = 0; col < SIZE; col += 1) {
    let start = 0;
    while (start < SIZE) {
      const color = colorAt(board, start, col);
      let end = start + 1;
      while (end < SIZE && color && colorAt(board, end, col) === color) end += 1;
      if (color && end - start >= 3) {
        runs.push({ color, orientation: 'column', cells: Array.from({ length: end - start }, (_, i) => [start + i, col]) });
      }
      start = end;
    }
  }
  return runs;
}

function matchedKeys(runs) {
  const keys = new Set();
  for (const run of runs) for (const [row, col] of run.cells) keys.add(keyOf(row, col));
  return keys;
}

function hasPossibleMove(board) {
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      for (const [dr, dc] of [[0, 1], [1, 0]]) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= SIZE || nc >= SIZE) continue;
        if (board[row][col]?.special || board[nr][nc]?.special) return true;
        [board[row][col], board[nr][nc]] = [board[nr][nc], board[row][col]];
        const works = findRuns(board).length > 0;
        [board[row][col], board[nr][nc]] = [board[nr][nc], board[row][col]];
        if (works) return true;
      }
    }
  }
  return false;
}

function freshPlayableBoard() {
  let board = makeRandomBoard();
  for (let tries = 0; tries < 100 && !hasPossibleMove(board); tries += 1) board = makeRandomBoard();
  return board;
}

function specialCreatedBy(runs, board, first = null, second = null) {
  const matched = matchedKeys(runs);
  if (!matched.size) return null;
  const preferred = [second, first].filter(Boolean).find(({ row, col }) => matched.has(keyOf(row, col)));
  const rows = new Set();
  const columns = new Set();
  for (const run of runs) {
    const target = run.orientation === 'row' ? rows : columns;
    for (const [row, col] of run.cells) target.add(keyOf(row, col));
  }
  const intersection = [...rows].find((key) => columns.has(key));
  let special;
  let position = preferred;
  if (runs.some((run) => run.cells.length >= 5)) special = 'rainbow';
  else if (intersection) {
    special = 'bomb';
    const [intersectionRow, intersectionCol] = intersection.split(',').map(Number);
    position = { row: intersectionRow, col: intersectionCol };
  } else {
    const longRun = runs.find((run) => run.cells.length >= 4);
    if (!longRun) return null;
    special = longRun.orientation;
  }
  if (!position) {
    const run = runs.find((item) => item.cells.length >= 5) || runs.find((item) => item.cells.length >= 4) || runs[0];
    const [row, col] = run.cells[Math.floor(run.cells.length / 2)];
    position = { row, col };
  }
  if (board[position.row][position.col]?.special) {
    const safeCell = [...matched].map(parseKey).find(([row, col]) => !board[row][col]?.special);
    if (!safeCell) return null;
    [position.row, position.col] = safeCell;
  }
  const gem = board[position.row][position.col];
  return { ...position, gem: makeGem(gem.color, special) };
}

export function mountMatch3(container, { level = 1, language = 'de', extraTools = false, onBack = () => {}, onReward = () => {} } = {}) {
  if (!container || typeof container.appendChild !== 'function') {
    throw new TypeError('mountMatch3 requires a DOM container.');
  }

  const safeLevel = Math.max(1, Math.floor(Number(level) || 1));
  const targetColor = TARGET_BY_LEVEL[Math.min(safeLevel - 1, TARGET_BY_LEVEL.length - 1)];
  const targetCount = 12 + 3 * safeLevel;
  let locale = Object.hasOwn(TEXT, language) ? language : 'de';
  let board = ORIGINAL_BOARD.map((row) => row.map((color) => makeGem(color)));
  let movesLeft = START_MOVES;
  let collected = 0;
  let selected = null;
  let busy = false;
  let finished = false;
  let destroyed = false;
  let armedBooster = null;
  const boosterBase = { shovel: extraTools ? 3 : 2, watering: extraTools ? 2 : 1 };
  const boosterCharges = { ...boosterBase };

  const root = document.createElement('section');
  root.className = 'match3-overlay';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-labelledby', `match3-title-${Math.random().toString(36).slice(2)}`);
  const titleId = root.getAttribute('aria-labelledby');
  root.innerHTML = `
    <div class="match3-card">
      <header class="match3-header">
        <div class="match3-heading"><p class="match3-kicker"></p><h1 class="match3-title" id="${titleId}"></h1></div>
        <button class="match3-back" type="button"></button>
      </header>
      <p class="match3-subtitle"></p>
      <div class="match3-stats" aria-label="">
        <div class="match3-stat"><span class="match3-stat-label match3-moves-label"></span><strong class="match3-moves-value"></strong></div>
        <div class="match3-stat match3-goal-stat"><span class="match3-stat-label match3-goal-label"></span><span class="match3-goal-line"><span class="match3-target-gem" aria-hidden="true"></span><strong class="match3-goal-value"></strong></span></div>
        <div class="match3-stat"><span class="match3-stat-label match3-collected-label"></span><strong class="match3-collected-value"></strong></div>
      </div>
      <div class="match3-progress" role="progressbar" aria-valuemin="0" aria-valuemax="${targetCount}" aria-valuenow="0"><span class="match3-progress-fill"></span></div>
      <div class="match3-board" role="grid" aria-label=""></div>
      <section class="match3-power-guide" aria-label="">
        <strong class="match3-guide-title"></strong>
        <div class="match3-power-list"></div>
      </section>
      <section class="match3-booster-panel" aria-label="">
        <strong class="match3-booster-title"></strong>
        <div class="match3-booster-list">
          <button class="match3-booster" data-booster="shovel" type="button"><span class="match3-booster-icon" aria-hidden="true"><img class="match3-tool-icon match3-tool-shovel" alt=""></span><span class="match3-booster-copy"><b></b><small></small></span></button>
          <button class="match3-booster" data-booster="watering" type="button"><span class="match3-booster-icon" aria-hidden="true"><img class="match3-tool-icon match3-tool-watering" alt=""></span><span class="match3-booster-copy"><b></b><small></small></span></button>
        </div>
      </section>
      <p class="match3-hint" aria-live="polite" aria-atomic="true"></p>
      <div class="match3-result-actions"><button class="match3-result-button" type="button" hidden></button></div>
    </div>`;
  container.appendChild(root);

  const $ = (selector) => root.querySelector(selector);
  $('.match3-tool-shovel').src = ART.shovel;
  $('.match3-tool-watering').src = ART.wateringCan;
  const boardElement = $('.match3-board');
  const statusElement = $('.match3-hint');
  const movesElement = $('.match3-moves-value');
  const collectedElement = $('.match3-collected-value');
  const goalElement = $('.match3-goal-value');
  const progressElement = $('.match3-progress');
  const progressFill = $('.match3-progress-fill');
  const boosterButtons = { shovel: $('[data-booster="shovel"]'), watering: $('[data-booster="watering"]') };
  let cells = [];
  let pointerStart = null;
  let suppressNextClick = false;

  for (let row = 0; row < SIZE; row += 1) {
    const rowElement = document.createElement('div');
    rowElement.className = 'match3-row';
    rowElement.setAttribute('role', 'row');
    const rowCells = [];
    for (let col = 0; col < SIZE; col += 1) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'match3-tile';
      button.setAttribute('role', 'gridcell');
      button.dataset.row = String(row);
      button.dataset.col = String(col);
      button.setAttribute('aria-pressed', 'false');
      button.innerHTML = '<span class="match3-gem" aria-hidden="true"></span><span class="match3-power-icon" aria-hidden="true"></span>';
      button.addEventListener('click', () => {
        if (suppressNextClick) { suppressNextClick = false; return; }
        handleTile(row, col);
      });
      button.addEventListener('keydown', (event) => {
        const offsets = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
        const offset = offsets[event.key];
        if (offset) {
          event.preventDefault();
          const nextRow = (row + offset[0] + SIZE) % SIZE;
          const nextCol = (col + offset[1] + SIZE) % SIZE;
          cells[nextRow][nextCol].focus();
        }
      });
      rowCells.push(button);
      rowElement.appendChild(button);
    }
    cells.push(rowCells);
    boardElement.appendChild(rowElement);
  }

  root.addEventListener('pointerdown', (event) => {
    const tile = event.target.closest?.('.match3-tile');
    if (!tile) return;
    pointerStart = { row: Number(tile.dataset.row), col: Number(tile.dataset.col), x: event.clientX, y: event.clientY };
  });
  root.addEventListener('pointerup', (event) => {
    if (!pointerStart) return;
    const start = pointerStart;
    pointerStart = null;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
    const [dr, dc] = Math.abs(dx) >= Math.abs(dy) ? [0, Math.sign(dx)] : [Math.sign(dy), 0];
    const nextRow = start.row + dr;
    const nextCol = start.col + dc;
    if (nextRow < 0 || nextRow >= SIZE || nextCol < 0 || nextCol >= SIZE) return;
    suppressNextClick = true;
    if (armedBooster) handleTile(start.row, start.col);
    else {
      selected = { row: start.row, col: start.col };
      handleTile(nextRow, nextCol);
    }
    window.setTimeout(() => { suppressNextClick = false; }, 80);
  });
  root.addEventListener('pointercancel', () => { pointerStart = null; });

  function translate(key) { return TEXT[locale][key]; }

  function updateBoosterUI() {
    const text = TEXT[locale];
    const names = { shovel: text.shovel, watering: text.watering };
    for (const kind of ['shovel', 'watering']) {
      const button = boosterButtons[kind];
      const count = boosterCharges[kind];
      button.querySelector('b').textContent = names[kind];
      button.querySelector('small').textContent = text.uses(count);
      button.setAttribute('aria-label', `${names[kind]}: ${text.uses(count)}`);
      button.title = kind === 'shovel' ? text.shovelReady : text.wateringReady;
      button.disabled = busy || finished || count <= 0;
      button.classList.toggle('is-armed', armedBooster === kind);
    }
    root.classList.toggle('match3-booster-armed', Boolean(armedBooster));
  }

  function updateTexts() {
    const text = TEXT[locale];
    $('.match3-kicker').textContent = `${text.levelLabel} ${safeLevel}`;
    $('.match3-title').textContent = text.title;
    $('.match3-subtitle').textContent = text.subtitle;
    $('.match3-back').textContent = text.back;
    $('.match3-moves-label').textContent = text.moves;
    $('.match3-goal-label').textContent = text.goal;
    $('.match3-collected-label').textContent = text.collected;
    $('.match3-stats').setAttribute('aria-label', `${text.moves}, ${text.goal}, ${text.collected}`);
    boardElement.setAttribute('aria-label', text.title);
    $('.match3-power-guide').setAttribute('aria-label', text.powersTitle);
    $('.match3-guide-title').textContent = text.powersTitle;
    $('.match3-booster-panel').setAttribute('aria-label', text.boostersTitle);
    $('.match3-booster-title').textContent = text.boostersTitle;
    if (finished) $('.match3-result-button').textContent = root.classList.contains('match3-won') ? text.continueGarden : text.retry;
    const icons = { row: '↔', column: '↕', bomb: '✿', rainbow: '✧' };
    $('.match3-power-list').replaceChildren();
    for (const kind of ['row', 'column', 'bomb', 'rainbow']) {
      const item = document.createElement('span');
      item.className = `match3-power-chip match3-power-chip-${kind}`;
      item.innerHTML = `<b aria-hidden="true">${icons[kind]}</b><span><strong>${text.powerNames[kind]}</strong><small>${text.powerHints[kind]}</small></span>`;
      $('.match3-power-list').appendChild(item);
    }
    $('.match3-target-gem').className = `match3-target-gem match3-gem-${targetColor.toLowerCase()}`;
    goalElement.textContent = `${text.colors[targetColor]} · ${targetCount}`;
    if (!finished && !selected && !busy && !armedBooster) statusElement.textContent = text.hint;
    refreshBoard();
    updateCounters();
    updateBoosterUI();
  }

  function updateCounters() {
    movesElement.textContent = String(movesLeft);
    collectedElement.textContent = `${Math.min(collected, targetCount)} / ${targetCount}`;
    progressElement.setAttribute('aria-valuenow', String(Math.min(collected, targetCount)));
    progressFill.style.width = `${Math.min(100, (collected / targetCount) * 100)}%`;
    root.classList.toggle('match3-low-moves', movesLeft <= 5);
  }

  function refreshBoard() {
    for (let row = 0; row < SIZE; row += 1) {
      for (let col = 0; col < SIZE; col += 1) {
        const button = cells[row][col];
        const gem = board[row][col];
        const color = gem?.color || 'Green';
        const special = gem?.special || null;
        button.className = `match3-tile match3-gem-${color.toLowerCase()}${special ? ` match3-special match3-special-${special}` : ''}`;
        button.disabled = busy || finished || !gem;
        button.setAttribute('aria-pressed', String(Boolean(selected && selected.row === row && selected.col === col)));
        const colorName = TEXT[locale].colors[color];
        const specialName = special ? `, ${TEXT[locale].powerNames[special]}` : '';
        button.setAttribute('aria-label', `${colorName}${specialName}, ${locale === 'de' ? 'Reihe' : 'linha'} ${row + 1}, ${locale === 'de' ? 'Spalte' : 'coluna'} ${col + 1}`);
        button.querySelector('.match3-power-icon').textContent = special ? SPECIAL_SYMBOLS[special] : '';
      }
    }
    updateBoosterUI();
  }

  function swap(first, second) {
    [board[first.row][first.col], board[second.row][second.col]] = [board[second.row][second.col], board[first.row][first.col]];
  }

  function handleTile(row, col) {
    if (busy || finished || !board[row][col]) return;
    if (armedBooster) {
      useBooster(armedBooster, row, col);
      return;
    }
    if (movesLeft <= 0) {
      selected = null;
      statusElement.textContent = TEXT[locale].noMovesBoosters;
      refreshBoard();
      return;
    }
    if (!selected) {
      selected = { row, col };
      statusElement.textContent = TEXT[locale].selected(TEXT[locale].colors[board[row][col].color], row + 1, col + 1);
      refreshBoard();
      return;
    }
    if (selected.row === row && selected.col === col) {
      selected = null;
      statusElement.textContent = TEXT[locale].hint;
      refreshBoard();
      return;
    }
    const first = selected;
    const second = { row, col };
    if (Math.abs(first.row - row) + Math.abs(first.col - col) !== 1) {
      selected = second;
      statusElement.textContent = TEXT[locale].selected(TEXT[locale].colors[board[row][col].color], row + 1, col + 1);
      refreshBoard();
      return;
    }
    selected = null;
    busy = true;
    swap(first, second);
    refreshBoard();
    window.setTimeout(() => {
      if (destroyed) return;
      const runs = findRuns(board);
      const firstGem = board[first.row][first.col];
      const secondGem = board[second.row][second.col];
      const activatedSpecial = firstGem.special || secondGem.special;
      if (!runs.length && !activatedSpecial) {
        swap(first, second);
        busy = false;
        statusElement.textContent = TEXT[locale].invalid;
        refreshBoard();
        return;
      }
      movesLeft -= 1;
      updateCounters();
      if (activatedSpecial) {
        const triggerColor = firstGem.special === 'rainbow' ? secondGem.color : secondGem.special === 'rainbow' ? firstGem.color : null;
        statusElement.textContent = TEXT[locale].specialActivated;
        resolveCascade({ seedCells: [keyOf(first.row, first.col), keyOf(second.row, second.col)], triggerColor });
        return;
      }
      resolveCascade({ preferredCells: [second, first] });
    }, 150);
  }

  function useBooster(kind, row, col) {
    if (boosterCharges[kind] <= 0) return;
    boosterCharges[kind] -= 1;
    armedBooster = null;
    selected = null;
    busy = true;
    const text = TEXT[locale];
    statusElement.textContent = kind === 'shovel' ? text.shovelUsed : text.wateringUsed;
    updateBoosterUI();
    refreshBoard();
    const seedCells = [];
    if (kind === 'shovel') seedCells.push(keyOf(row, col));
    else {
      for (let r = Math.max(0, row - 1); r <= Math.min(SIZE - 1, row + 1); r += 1) {
        for (let c = Math.max(0, col - 1); c <= Math.min(SIZE - 1, col + 1); c += 1) seedCells.push(keyOf(r, c));
      }
    }
    window.setTimeout(() => { if (!destroyed) resolveCascade({ seedCells }); }, 140);
  }

  function selectBooster(kind) {
    if (busy || finished || boosterCharges[kind] <= 0) return;
    armedBooster = armedBooster === kind ? null : kind;
    selected = null;
    statusElement.textContent = armedBooster
      ? (kind === 'shovel' ? TEXT[locale].shovelReady : TEXT[locale].wateringReady)
      : TEXT[locale].boosterCancel;
    refreshBoard();
    updateBoosterUI();
  }

  function expandSpecials(initialKeys, triggerColor = null) {
    const clear = new Set(initialKeys);
    const queue = [...initialKeys];
    const activated = new Set();
    const add = (row, col) => {
      if (row < 0 || row >= SIZE || col < 0 || col >= SIZE) return;
      const key = keyOf(row, col);
      if (!clear.has(key)) {
        clear.add(key);
        queue.push(key);
      }
    };
    while (queue.length) {
      const key = queue.shift();
      if (activated.has(key)) continue;
      activated.add(key);
      const [row, col] = parseKey(key);
      const gem = board[row]?.[col];
      if (!gem?.special) continue;
      if (gem.special === 'row') {
        for (let c = 0; c < SIZE; c += 1) add(row, c);
      } else if (gem.special === 'column') {
        for (let r = 0; r < SIZE; r += 1) add(r, col);
      } else if (gem.special === 'bomb') {
        for (let r = row - 1; r <= row + 1; r += 1) for (let c = col - 1; c <= col + 1; c += 1) add(r, c);
      } else if (gem.special === 'rainbow') {
        const target = triggerColor || gem.color;
        for (let r = 0; r < SIZE; r += 1) for (let c = 0; c < SIZE; c += 1) if (colorAt(board, r, c) === target) add(r, c);
      }
    }
    return clear;
  }

  function resolveCascade({ seedCells = [], protectedKey = null, triggerColor = null, preferredCells = [] } = {}) {
    if (destroyed) return;
    const runs = findRuns(board);
    let protectedMatchKey = protectedKey;
    if (!protectedMatchKey) {
      const created = specialCreatedBy(runs, board, preferredCells[0] || null, preferredCells[1] || null);
      if (created) {
        board[created.row][created.col] = created.gem;
        protectedMatchKey = keyOf(created.row, created.col);
        statusElement.textContent = TEXT[locale].specialCreated(TEXT[locale].powerNames[created.gem.special]);
      }
    }
    const clear = new Set([...matchedKeys(runs), ...seedCells]);
    if (protectedMatchKey) clear.delete(protectedMatchKey);
    if (!clear.size) {
      busy = false;
      refreshBoard();
      updateCounters();
      if (collected >= targetCount) finish(true);
      else if (movesLeft <= 0) {
        if (boosterCharges.shovel + boosterCharges.watering > 0) statusElement.textContent = TEXT[locale].noMovesBoosters;
        else finish(false);
      }
      else if (!hasPossibleMove(board)) {
        board = freshPlayableBoard();
        refreshBoard();
        statusElement.textContent = TEXT[locale].hint;
      }
      return;
    }

    const expanded = expandSpecials([...clear], triggerColor);
    for (const key of expanded) {
      const [row, col] = parseKey(key);
      if (colorAt(board, row, col) === targetColor) collected += 1;
      cells[row][col].classList.add('match3-clearing');
    }
    updateCounters();
    window.setTimeout(() => {
      if (destroyed) return;
      for (const key of expanded) {
        const [row, col] = parseKey(key);
        board[row][col] = null;
      }
      for (let col = 0; col < SIZE; col += 1) {
        let writeRow = SIZE - 1;
        for (let row = SIZE - 1; row >= 0; row -= 1) {
          if (board[row][col] !== null) {
            board[writeRow][col] = board[row][col];
            writeRow -= 1;
          }
        }
        while (writeRow >= 0) {
          board[writeRow][col] = makeGem(COLORS[Math.floor(Math.random() * COLORS.length)]);
          writeRow -= 1;
        }
      }
      refreshBoard();
      window.setTimeout(() => resolveCascade(), 180);
    }, 220);
  }

  function finish(won) {
    if (finished || destroyed) return;
    finished = true;
    busy = false;
    selected = null;
    armedBooster = null;
    refreshBoard();
    statusElement.textContent = won ? TEXT[locale].win : TEXT[locale].lose;
    root.classList.add(won ? 'match3-won' : 'match3-lost');
    const resultButton = $('.match3-result-button');
    resultButton.textContent = won ? TEXT[locale].continueGarden : TEXT[locale].retry;
    resultButton.hidden = false;
    if (won) onReward({ level: safeLevel, nextLevel: safeLevel + 1 });
  }

  $('.match3-back').addEventListener('click', () => {
    if (finished || destroyed) return;
    finished = true;
    onBack();
  });
  $('.match3-result-button').addEventListener('click', () => {
    if (destroyed || !finished) return;
    if (root.classList.contains('match3-won')) { onBack(); return; }
    board = ORIGINAL_BOARD.map((row) => row.map((color) => makeGem(color)));
    movesLeft = START_MOVES;
    collected = 0;
    selected = null;
    busy = false;
    finished = false;
    armedBooster = null;
    boosterCharges.shovel = boosterBase.shovel;
    boosterCharges.watering = boosterBase.watering;
    root.classList.remove('match3-won', 'match3-lost');
    $('.match3-result-button').hidden = true;
    statusElement.textContent = TEXT[locale].hint;
    refreshBoard();
    updateCounters();
  });
  boosterButtons.shovel.addEventListener('click', () => selectBooster('shovel'));
  boosterButtons.watering.addEventListener('click', () => selectBooster('watering'));

  function setLanguage(nextLanguage) {
    locale = Object.hasOwn(TEXT, nextLanguage) ? nextLanguage : 'de';
    updateTexts();
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    root.remove();
  }

  updateTexts();
  $('.match3-back').focus({ preventScroll: true });
  return { setLanguage, destroy, getLevel: () => safeLevel };
}
