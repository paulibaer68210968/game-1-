const SIZE = 8;
const START_MOVES = 20;
const COLORS = ['Red', 'Blue', 'Green', 'Yellow', 'Purple'];
const COLOR_LABELS = {
  de: { Red: 'Rot', Blue: 'Blau', Green: 'Grün', Yellow: 'Gelb', Purple: 'Lila' },
  'pt-BR': { Red: 'Vermelho', Blue: 'Azul', Green: 'Verde', Yellow: 'Amarelo', Purple: 'Roxo' },
};
const TARGET_BY_LEVEL = ['Red', 'Blue', 'Green', 'Yellow', 'Purple'];

// The original 64 tile instances, read row-by-row from the exported grid coordinates.
// This layout has no matches at startup.
const ORIGINAL_BOARD = [
  ['Green', 'Green', 'Blue', 'Blue', 'Yellow', 'Blue', 'Purple', 'Yellow'],
  ['Yellow', 'Purple', 'Blue', 'Yellow', 'Red', 'Red', 'Green', 'Red'],
  ['Purple', 'Yellow', 'Yellow', 'Purple', 'Blue', 'Purple', 'Purple', 'Yellow'],
  ['Red', 'Green', 'Green', 'Blue', 'Green', 'Red', 'Yellow', 'Green'],
  ['Blue', 'Yellow', 'Purple', 'Purple', 'Blue', 'Red', 'Red', 'Purple'],
  ['Blue', 'Red', 'Yellow', 'Purple', 'Yellow', 'Purple', 'Purple', 'Green'],
  ['Yellow', 'Purple', 'Purple', 'Green', 'Yellow', 'Purple', 'Purple', 'Red'],
  ['Purple', 'Red', 'Red', 'Green', 'Red', 'Green', 'Yellow', 'Purple'],
];

const TEXT = {
  de: {
    title: 'Edelstein-Garten', subtitle: 'Tausche Steine und sammle deine Zielfarbe!',
    back: 'Zurück', moves: 'Züge', goal: 'Ziel', collected: 'Gesammelt',
    hint: 'Wähle zwei benachbarte Steine zum Tauschen.',
    selected: (color, row, col) => `${color}, Reihe ${row}, Spalte ${col} ausgewählt. Wähle einen benachbarten Stein.`,
    invalid: 'Dort entsteht keine Reihe – der Tausch wurde zurückgesetzt.',
    win: 'Wunderbar! Das Gartenziel ist erreicht!', lose: 'Keine Züge mehr. Versuche es noch einmal!',
    colors: COLOR_LABELS.de,
  },
  'pt-BR': {
    title: 'Jardim de Gemas', subtitle: 'Troque as pedras e colete a cor do objetivo!',
    back: 'Voltar', moves: 'Jogadas', goal: 'Meta', collected: 'Coletadas',
    hint: 'Escolha duas pedras vizinhas para trocar.',
    selected: (color, row, col) => `${color}, linha ${row}, coluna ${col} selecionada. Escolha uma pedra vizinha.`,
    invalid: 'Essa troca não formou uma sequência e foi desfeita.',
    win: 'Maravilha! Você alcançou a meta do jardim!', lose: 'As jogadas acabaram. Tente novamente!',
    colors: COLOR_LABELS['pt-BR'],
  },
};

function makeRandomBoard() {
  const board = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const choices = COLORS.filter((color) => {
        const makesHorizontal = col >= 2 && board[row][col - 1] === color && board[row][col - 2] === color;
        const makesVertical = row >= 2 && board[row - 1][col] === color && board[row - 2][col] === color;
        return !makesHorizontal && !makesVertical;
      });
      board[row][col] = choices[Math.floor(Math.random() * choices.length)];
    }
  }
  return board;
}

function findMatches(board) {
  const found = new Set();
  for (let row = 0; row < SIZE; row += 1) {
    let start = 0;
    while (start < SIZE) {
      let end = start + 1;
      while (end < SIZE && board[row][end] && board[row][end] === board[row][start]) end += 1;
      if (board[row][start] && end - start >= 3) {
        for (let col = start; col < end; col += 1) found.add(`${row},${col}`);
      }
      start = end;
    }
  }
  for (let col = 0; col < SIZE; col += 1) {
    let start = 0;
    while (start < SIZE) {
      let end = start + 1;
      while (end < SIZE && board[end][col] && board[end][col] === board[start][col]) end += 1;
      if (board[start][col] && end - start >= 3) {
        for (let row = start; row < end; row += 1) found.add(`${row},${col}`);
      }
      start = end;
    }
  }
  return [...found].map((key) => key.split(',').map(Number));
}

function hasPossibleMove(board) {
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      for (const [dr, dc] of [[0, 1], [1, 0]]) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= SIZE || nc >= SIZE) continue;
        [board[row][col], board[nr][nc]] = [board[nr][nc], board[row][col]];
        const works = findMatches(board).length > 0;
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

export function mountMatch3(container, { level = 1, language = 'de', onBack = () => {}, onReward = () => {} } = {}) {
  if (!container || typeof container.appendChild !== 'function') {
    throw new TypeError('mountMatch3 requires a DOM container.');
  }

  const safeLevel = Math.max(1, Math.floor(Number(level) || 1));
  const targetColor = TARGET_BY_LEVEL[Math.min(safeLevel - 1, TARGET_BY_LEVEL.length - 1)];
  const targetCount = 12 + 3 * safeLevel;
  let locale = Object.hasOwn(TEXT, language) ? language : 'de';
  let board = ORIGINAL_BOARD.map((row) => row.slice());
  let movesLeft = START_MOVES;
  let collected = 0;
  let selected = null;
  let busy = false;
  let finished = false;
  let destroyed = false;
  let returnTimer = null;

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
      <p class="match3-hint" aria-live="polite" aria-atomic="true"></p>
    </div>`;
  container.appendChild(root);

  const $ = (selector) => root.querySelector(selector);
  const boardElement = $('.match3-board');
  const statusElement = $('.match3-hint');
  const movesElement = $('.match3-moves-value');
  const collectedElement = $('.match3-collected-value');
  const goalElement = $('.match3-goal-value');
  const progressElement = $('.match3-progress');
  const progressFill = $('.match3-progress-fill');
  let cells = [];

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
      button.innerHTML = '<span class="match3-gem" aria-hidden="true"></span>';
      button.addEventListener('click', () => handleTile(row, col));
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

  function translate(key) {
    return TEXT[locale][key];
  }

  function updateTexts() {
    const text = TEXT[locale];
    $('.match3-kicker').textContent = `LEVEL ${safeLevel}`;
    $('.match3-title').textContent = text.title;
    $('.match3-subtitle').textContent = text.subtitle;
    $('.match3-back').textContent = text.back;
    $('.match3-moves-label').textContent = text.moves;
    $('.match3-goal-label').textContent = text.goal;
    $('.match3-collected-label').textContent = text.collected;
    $('.match3-stats').setAttribute('aria-label', `${text.moves}, ${text.goal}, ${text.collected}`);
    boardElement.setAttribute('aria-label', text.title);
    $('.match3-target-gem').className = `match3-target-gem match3-gem-${targetColor.toLowerCase()}`;
    goalElement.textContent = `${text.colors[targetColor]} · ${targetCount}`;
    if (!finished && !selected && !busy) statusElement.textContent = text.hint;
    refreshBoard();
    updateCounters();
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
        const color = board[row][col];
        button.className = `match3-tile match3-gem-${color.toLowerCase()}`;
        button.disabled = busy || finished;
        button.setAttribute('aria-pressed', String(Boolean(selected && selected.row === row && selected.col === col)));
        button.setAttribute('aria-label', `${TEXT[locale].colors[color]}, ${locale === 'de' ? 'Reihe' : 'linha'} ${row + 1}, ${locale === 'de' ? 'Spalte' : 'coluna'} ${col + 1}`);
      }
    }
  }

  function swap(first, second) {
    [board[first.row][first.col], board[second.row][second.col]] = [board[second.row][second.col], board[first.row][first.col]];
  }

  function handleTile(row, col) {
    if (busy || finished) return;
    if (!selected) {
      selected = { row, col };
      statusElement.textContent = TEXT[locale].selected(TEXT[locale].colors[board[row][col]], row + 1, col + 1);
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
      statusElement.textContent = TEXT[locale].selected(TEXT[locale].colors[board[row][col]], row + 1, col + 1);
      refreshBoard();
      return;
    }
    selected = null;
    busy = true;
    swap(first, second);
    refreshBoard();
    window.setTimeout(() => {
      if (destroyed) return;
      const matches = findMatches(board);
      if (!matches.length) {
        swap(first, second);
        busy = false;
        statusElement.textContent = TEXT[locale].invalid;
        refreshBoard();
        return;
      }
      movesLeft -= 1;
      updateCounters();
      resolveCascade();
    }, 150);
  }

  function resolveCascade() {
    if (destroyed) return;
    const matches = findMatches(board);
    if (!matches.length) {
      busy = false;
      refreshBoard();
      updateCounters();
      if (collected >= targetCount) finish(true);
      else if (movesLeft <= 0) finish(false);
      else if (!hasPossibleMove(board)) {
        board = freshPlayableBoard();
        refreshBoard();
        statusElement.textContent = TEXT[locale].hint;
      }
      return;
    }

    for (const [row, col] of matches) if (board[row][col] === targetColor) collected += 1;
    for (const [row, col] of matches) cells[row][col].classList.add('match3-clearing');
    updateCounters();
    window.setTimeout(() => {
      if (destroyed) return;
      for (const [row, col] of matches) board[row][col] = null;
      for (let col = 0; col < SIZE; col += 1) {
        let writeRow = SIZE - 1;
        for (let row = SIZE - 1; row >= 0; row -= 1) {
          if (board[row][col] !== null) {
            board[writeRow][col] = board[row][col];
            writeRow -= 1;
          }
        }
        while (writeRow >= 0) {
          board[writeRow][col] = COLORS[Math.floor(Math.random() * COLORS.length)];
          writeRow -= 1;
        }
      }
      refreshBoard();
      window.setTimeout(resolveCascade, 180);
    }, 220);
  }

  function finish(won) {
    if (finished || destroyed) return;
    finished = true;
    busy = false;
    selected = null;
    refreshBoard();
    statusElement.textContent = won ? TEXT[locale].win : TEXT[locale].lose;
    root.classList.add(won ? 'match3-won' : 'match3-lost');
    returnTimer = window.setTimeout(() => {
      if (!destroyed) onBack();
    }, 2000);
    if (won) onReward({ level: safeLevel, nextLevel: safeLevel + 1 });
  }

  $('.match3-back').addEventListener('click', () => {
    if (finished || destroyed) return;
    finished = true;
    if (returnTimer !== null) window.clearTimeout(returnTimer);
    onBack();
  });

  function setLanguage(nextLanguage) {
    locale = Object.hasOwn(TEXT, nextLanguage) ? nextLanguage : 'de';
    updateTexts();
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    if (returnTimer !== null) window.clearTimeout(returnTimer);
    root.remove();
  }

  updateTexts();
  $('.match3-back').focus({ preventScroll: true });
  return { setLanguage, destroy, getLevel: () => safeLevel };
}
