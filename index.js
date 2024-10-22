const text = "Robin";
const container = document.querySelector('.container');

// Função para criar uma span para cada letra com atraso de animação
text.split('').forEach((char, index) => {
  const span = document.createElement('span');
  span.textContent = char;
  span.classList.add('letter');
  span.style.animationDelay = `${index * 0.2}s`; // Atraso progressivo
  container.appendChild(span);
});