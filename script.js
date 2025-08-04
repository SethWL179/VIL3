let teams = [];
let questions = [];
let currentQuestion = null;
let showingAnswer = false;

document.getElementById('addTeam').addEventListener('click', () => {
  const team = { name: 'Team', points: 0 };
  teams.push(team);
  renderTeams();
});
document.getElementById('modal').classList.add('hidden');
function renderTeams() {
  const teamList = document.getElementById('teamList');
  teamList.innerHTML = '';
  teams.forEach((team, index) => {
    const div = document.createElement('div');
    div.className = 'team';

    const input = document.createElement('input');
    input.value = team.name;
    input.addEventListener('change', e => {
      team.name = e.target.value;
    });

    const points = document.createElement('span');
    points.textContent = team.points;

    const add = document.createElement('button');
    add.textContent = '+';
    add.onclick = () => { team.points += 100; renderTeams(); };

    const sub = document.createElement('button');
    sub.textContent = '-';
    sub.onclick = () => { team.points -= 100; renderTeams(); };

    div.appendChild(input);
    div.appendChild(points);
    div.appendChild(add);
    div.appendChild(sub);

    teamList.appendChild(div);
  });
}

document.getElementById('csvInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function(event) {
    parseCSV(event.target.result);
  };
  reader.readAsText(file);
});

function parseCSV(data) {
  const rows = data.trim().split('\n').map(row => row.split(','));
  questions = [];
  const headers = rows[0];
  for (let i = 1; i < rows.length; i += 2) {
    const qs = rows[i];
    const as = rows[i + 1];
    qs.forEach((q, index) => {
      if (!questions[index]) questions[index] = [];
      questions[index].push({ question: q, answer: as[index], used: false, value: ((i + 1) / 2) * 100 });
    });
  }
  buildBoard(headers);
}

function buildBoard(headers) {
  const table = document.getElementById('jeopardyBoard');
  table.innerHTML = '';

  const headerRow = document.createElement('tr');
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  for (let i = 0; i < questions[0].length; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < headers.length; j++) {
      const cell = document.createElement('td');
      cell.textContent = questions[j][i].value;
      cell.addEventListener('click', () => {
        if (!questions[j][i].used) {
          currentQuestion = questions[j][i];
          showModal(currentQuestion.question);
        }
      });
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
}

function showModal(content) {
  showingAnswer = false;
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');
  modal.classList.remove('hidden');
  modalContent.innerHTML = content;

  modal.onclick = () => {
    if (!showingAnswer) {
      showingAnswer = true;
      modalContent.innerHTML = `<div>${currentQuestion.answer}</div><div class="teamSelect">${teams.map((t, i) => `<button onclick="selectTeam(${i})">${t.name}</button>`).join('')}</div>`;
    }
  };
}

function selectTeam(index) {
  teams[index].points += currentQuestion.value;
  currentQuestion.used = true;
  renderTeams();
  updateBoard();
  closeModal();
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  showingAnswer = false;
}

function updateBoard() {
  const cells = document.querySelectorAll('#jeopardyBoard td');
  let k = 0;
  for (let i = 0; i < questions[0].length; i++) {
    for (let j = 0; j < questions.length; j++) {
      if (questions[j][i].used) {
        cells[k].classList.add('used');
      }
      k++;
    }
  }
}

// ✅ DEFAULT DATA: run on load so it never shows blank
const defaultHeaders = ['History', 'Science', 'Sports', 'Movies', 'Geography', 'Wild'];
questions = [
  [ {question:'Who was first president?', answer:'George Washington', used:false, value:100},
    {question:'Who wrote Declaration?', answer:'Thomas Jefferson', used:false, value:200},
    {question:'Test?', answer:'Answer', used:false, value:300} ],
  [ {question:'What is H2O?', answer:'Water', used:false, value:100},
    {question:'Closest planet?', answer:'Mercury', used:false, value:200},
    {question:'Test?', answer:'Answer', used:false, value:300} ],
  [ {question:'Puck sport?', answer:'Hockey', used:false, value:100},
    {question:'Home run worth?', answer:'1 run', used:false, value:200},
    {question:'Test?', answer:'Answer', used:false, value:300} ],
  [ {question:'Directed Jaws?', answer:'Spielberg', used:false, value:100},
    {question:'Played Indy?', answer:'Harrison Ford', used:false, value:200},
    {question:'Test?', answer:'Answer', used:false, value:300} ],
  [ {question:'Largest ocean?', answer:'Pacific', used:false, value:100},
    {question:'Capital of France?', answer:'Paris', used:false, value:200},
    {question:'Test?', answer:'Answer', used:false, value:300} ],
  [ {question:'Wild Q1?', answer:'Wild A1', used:false, value:100},
    {question:'Wild Q2?', answer:'Wild A2', used:false, value:200},
    {question:'Test?', answer:'Answer', used:false, value:300} ]
];
buildBoard(defaultHeaders);
renderTeams();
