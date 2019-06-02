import Flip from './flip.js';

const removeCard = card => {
	card.addEventListener('click', _ => card.parentNode.removeChild(card));
};

const removeCards = _ => {
	const cards = Array.from(document.querySelectorAll('.card'));
	cards.forEach(card => removeCard(card));
};

addEventListener('load', removeCards);