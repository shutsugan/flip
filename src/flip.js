export default class Flip {
	constructor() {
		this._duration = 150;
		this._easing = 'ease-in-out';
		this._fill = 'both';
		this._positions = {}
	}

	/**
	 * Memorize the elements position
	 *
	 * @param {HTMLElement []} elements
	 */
	read(elements) {
		elements.forEach(element => {
			const id = element.dataset.id;
			this._positions[id] = element.getBoundingClientRect();
		});
	}

	/**
	 * Animate the element toward the new position
	 *
	 * @param {HTMLElement []} elements
	 */
	play(elements) {
		elements.forEach(element => {
			const id = element.dataset.id;

			const newPosition = element.getBoundingClientRect();
			const oldPosition = this._positions[id];

			const deltaX = oldPosition.x - newPosition.x;
			const deltaY = oldPosition.y - newPosition.y;
			const deltaWidth = oldPosition.width / newPosition.width;
			const deltaHeight = oldPosition.height / newPosition.height;

			element.animate([
				{transform: `translate(${deltaX}px, ${deltaY}px) scale(${deltaWidth}, ${deltaHeight})`},
				{transform: 'none'}
			], {
				duration: this._duration,
				easing: this._easing,
				fill: this._fill
			});
		});
	}
};