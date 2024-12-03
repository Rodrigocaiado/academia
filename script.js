const daysButtons = document.querySelectorAll('.day-btn');
const formTreino = document.getElementById('formTreino');
const listaTreinos = document.getElementById('listaTreinos');
let treinoData = {};
let selectedDay = null;

// Carregar treinos do LocalStorage
function carregarTreinos() {
  const treinosSalvos = localStorage.getItem('treinoData');
  treinoData = treinosSalvos
    ? JSON.parse(treinosSalvos)
    : {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      };
}

// Salvar treinos no LocalStorage
function salvarTreinos() {
  localStorage.setItem('treinoData', JSON.stringify(treinoData));
}

// Mostrar treinos do dia selecionado
function mostrarTreinos() {
  listaTreinos.innerHTML = '';

  if (selectedDay && treinoData[selectedDay]) {
    treinoData[selectedDay].forEach((treino, index) => {
      const divTreino = document.createElement('div');
      divTreino.className = 'treino';
      divTreino.innerHTML = `
        <h3>${treino.nomeExercicio}</h3>
        <p>${treino.series} séries de ${treino.repeticoes} repetições</p>
        <p>Peso: ${treino.peso}kg</p>
        <button onclick="removerTreino(${index})">Remover</button>
        <button onclick="editarTreino(${index})">Editar</button>
      `;
      listaTreinos.appendChild(divTreino);
    });
  }
}

// Remover treino
function removerTreino(index) {
  if (selectedDay && treinoData[selectedDay]) {
    treinoData[selectedDay].splice(index, 1);
    salvarTreinos();
    mostrarTreinos();
  }
}

// Editar treino
function editarTreino(index) {
  const treino = treinoData[selectedDay][index];
  document.getElementById('nomeExercicio').value = treino.nomeExercicio;
  document.getElementById('series').value = treino.series;
  document.getElementById('repeticoes').value = treino.repeticoes;
  document.getElementById('peso').value = treino.peso;

  treinoData[selectedDay].splice(index, 1); // Remove o treino atual para editar
  salvarTreinos();
  mostrarTreinos();
}

// Alternar exibição da seção de treinos
daysButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (selectedDay === button.dataset.day) {
      formTreino.classList.add('hidden');
      selectedDay = null;
      button.classList.remove('active');
    } else {
      selectedDay = button.dataset.day;
      daysButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      formTreino.classList.remove('hidden');
      mostrarTreinos();
    }
  });
});

// Adicionar novo treino
formTreino.addEventListener('submit', (event) => {
  event.preventDefault();

  const nomeExercicio = document.getElementById('nomeExercicio').value;
  const series = document.getElementById('series').value;
  const repeticoes = document.getElementById('repeticoes').value;
  const peso = document.getElementById('peso').value;

  const novoTreino = { nomeExercicio, series, repeticoes, peso };

  if (selectedDay && treinoData[selectedDay]) {
    treinoData[selectedDay].push(novoTreino);
    salvarTreinos();
    mostrarTreinos();
    formTreino.reset();
  }
});

// Inicializar
carregarTreinos();

