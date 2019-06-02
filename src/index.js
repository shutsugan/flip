import Flip from './flip.js';

const flipCards = (cards, card, cb) => {
	const flip = new Flip();
	const cardsToFlip = cards.filter(c => c !== card);
	
	flip.read(cards);

	cb();

	flip.play(cardsToFlip);
};

const removeCard = (cards, card) => {
	card.addEventListener('click', _ => flipCards(cards, card, _ => {
		card.parentNode.removeChild(card);
	}));
};

const removeCards = _ => {
	const cards = Array.from(document.querySelectorAll('.card'));
	cards.forEach(card => removeCard(cards, card));
};

addEventListener('load', removeCards);