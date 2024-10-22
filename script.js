const sendButton = document.getElementById('sendButton');
const userInput = document.getElementById('userInput');
const messages = document.getElementById('messages');

// Carrega mensagens salvas ao iniciar a página
loadMessages();

// Adiciona eventos de clique e tecla Enter para enviar mensagens
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') sendMessage();
});

function sendMessage() {
  const query = userInput.value.trim();
  if (query) {
    const userName = localStorage.getItem('nme') || 'Você'; // Verifica se existe um nome salvo
    addMessage(query, 'user', userName); // Exibe a mensagem do usuário
    addMessage("Aguarde, estou pesquisando...", 'bot'); // Feedback de carregamento
    fetchWikipedia(query); // Busca a resposta
    userInput.value = ''; // Limpa o campo de entrada
  }
}

function addMessage(text, sender, userName = 'Você') {
  const messageElement = document.createElement('div');

  messageElement.innerHTML =
    sender === 'user' ?
    `${userName}: ${text}` :
    `Robin: ${text} <br><img src="/imagem/robot.png" alt="bot">`;

  messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
  messages.appendChild(messageElement);
  messages.scrollTop = messages.scrollHeight; // Rolagem automática para a última mensagem

  // Salva a mensagem no localStorage
  saveMessage(text, sender);

  // Fala a resposta do bot em voz alta, se for uma mensagem dele
  if (sender === 'bot') {
    speak(text);
  }
}

async function fetchWikipedia(query) {
  const url = "https://pt.wikipedia.org/w/api.php";
  const params = {
    action: "query",
    format: "json",
    list: "search",
    srsearch: query,
    origin: "*",
  };

  try {
    const response = await fetch(`${url}?${new URLSearchParams(params)}`);
    const data = await response.json();
    clearLoadingMessage(); // Remove a mensagem de carregamento

    if (data.query.search.length > 0) {
      const snippet = data.query.search[0].snippet.replace(/<[^>]+>/g, '');
      addMessage(snippet, 'bot'); // Exibe a resposta do bot
    } else {
      addMessage("Não encontrei informações sobre isso.", 'bot');
    }
  } catch (error) {
    console.error('Erro:', error);
    clearLoadingMessage(); // Remove a mensagem de carregamento
    addMessage("Ocorreu um erro ao buscar informações. Tente novamente mais tarde.", 'bot');
  }
}

function clearLoadingMessage() {
  const loadingMessage = messages.querySelector('.bot-message:last-child');
  if (loadingMessage && loadingMessage.textContent.includes('Aguarde')) {
    loadingMessage.remove();
  }
}

// Função para transformar texto em fala
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'pt-BR';
  speechSynthesis.speak(utterance);
}

function saveMessage(text, sender) {
  const storedMessages = JSON.parse(localStorage.getItem('messages') || '[]');
  storedMessages.push({ text, sender });
  localStorage.setItem('messages', JSON.stringify(storedMessages));
}

function loadMessages() {
  const storedMessages = JSON.parse(localStorage.getItem('messages') || '[]');
  storedMessages.forEach((msg) => addMessage(msg.text, msg.sender));
}