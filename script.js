const daysButtons = document.querySelectorAll('.day-btn');
const formTreino = document.getElementById('formTreino');
const listaTreinos = document.getElementById('listaTreinos');
const btnAntesDepois = document.getElementById('btnAntesDepois');
const photosSection = document.getElementById('photosSection');
let treinoData = {};
let selectedDay = null;
let editIndex = null; // Índice do exercício em edição
let photoData = [];

// Carregar treinos do LocalStorage
function carregarTreinos() {
  const treinosSalvos = localStorage.getItem('treinoData');
  treinoData = treinosSalvos ? JSON.parse(treinosSalvos) : {
    monday: [], tuesday: [], wednesday: [],
    thursday: [], friday: [], saturday: [], sunday: []
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
  if (selectedDay && treinoData[selectedDay]) {
    const treino = treinoData[selectedDay][index];
    document.getElementById('nomeExercicio').value = treino.nomeExercicio;
    document.getElementById('series').value = treino.series;
    document.getElementById('repeticoes').value = treino.repeticoes;
    document.getElementById('peso').value = treino.peso;

    formTreino.classList.remove('hidden');
    editIndex = index; // Define o índice do treino em edição
  }
}

// Adicionar ou atualizar treino
formTreino.addEventListener('submit', event => {
  event.preventDefault();

  const nomeExercicio = document.getElementById('nomeExercicio').value;
  const series = document.getElementById('series').value;
  const repeticoes = document.getElementById('repeticoes').value;
  const peso = document.getElementById('peso').value;

  const novoTreino = { nomeExercicio, series, repeticoes, peso };

  if (selectedDay && treinoData[selectedDay]) {
    if (editIndex !== null) {
      // Atualiza o treino existente
      treinoData[selectedDay][editIndex] = novoTreino;
      editIndex = null; // Reseta o índice após a edição
    } else {
      // Adiciona um novo treino
      treinoData[selectedDay].push(novoTreino);
    }
    salvarTreinos();
    mostrarTreinos();
    formTreino.reset();
  }
});

// Alternar exibição da seção de treinos
daysButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (selectedDay === button.dataset.day) {
      formTreino.classList.add('hidden');
      photosSection.classList.add('hidden'); // Oculta a seção "Antes e Depois"
      btnAntesDepois.textContent = 'Antes e Depois';
      selectedDay = null;
      button.classList.remove('active');
    } else {
      selectedDay = button.dataset.day;

      // Atualiza a classe ativa nos botões dos dias
      daysButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Exibe a seção de treinos
      formTreino.classList.remove('hidden');
      photosSection.classList.add('hidden'); // Oculta a seção "Antes e Depois"
      btnAntesDepois.textContent = 'Antes e Depois';

      mostrarTreinos();
    }
  });
});

// Alternar exibição da seção "Antes e Depois"
btnAntesDepois.addEventListener('click', () => {
  if (photosSection.classList.contains('hidden')) {
    photosSection.classList.remove('hidden'); // Mostra "Antes e Depois"
    formTreino.classList.add('hidden'); // Oculta a seção de treinos
    btnAntesDepois.textContent = 'Fechar Antes e Depois'; // Atualiza texto do botão
  } else {
    photosSection.classList.add('hidden'); // Oculta "Antes e Depois"
    btnAntesDepois.textContent = 'Antes e Depois'; // Atualiza texto do botão
  }
});

// Inicializar
carregarTreinos();
