import Flip from './flip.js';

let cards = Array.from(document.querySelectorAll('.card'));
cards.forEach(card => {
	card.addEventListener('click', _ => {
		const flip = new Flip();
		flip.read(cards);
		flip.remove([card]);

		cards = cards.filter(c => c !== card);
		flip.play(cards);
	});
});