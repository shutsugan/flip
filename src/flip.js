export default class Flip {
	constructor() {
		this._duration = 500;
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
			const {
				deltaX,
				deltaY,
				deltaWidth,
				deltaHeight
			} = this.getElementDetails(element);

			const steps = [
				{transform: `translate(${deltaX}px, ${deltaY}px) scale(${deltaWidth}, ${deltaHeight})`},
				{transform: 'none'}
			];

			this.setAnimation(element, steps);
		});
	}

	/**
	 * Remove elements with animation
	 *
	 * @param {HTMLElement []} elements
	 */
	remove(elements) {
		elements.forEach(element => element.parentNode.appendChild(element));
		elements.forEach(element => {
			const {
				deltaX,
				deltaY,
				deltaWidth,
				deltaHeight
			} = this.getElementDetails(element);

			const steps = [
				{
					transform: `translate(${deltaX}px, ${deltaY}px)`,
					opacity: 1
				},
				{
					transform: `translate(${deltaX}px, ${deltaY - 30}px)`,
					opacity: 0
				}
			];

			this.setAnimation(element, steps);
			window.setTimeout(_ => element.remove(), this._duration);
		});
	}

	/**
	 * Get element position and dimentions
	 *
	 * @param {HTMLElement} element
	 */
	getElementDetails(element) {
		const id = element.dataset.id;

		const newPosition = element.getBoundingClientRect();
		const oldPosition = this._positions[id];

		const deltaX = oldPosition.x - newPosition.x;
		const deltaY = oldPosition.y - newPosition.y;
		const deltaWidth = oldPosition.width / newPosition.width;
		const deltaHeight = oldPosition.height / newPosition.height;

		return {
			deltaX,
			deltaY,
			deltaWidth,
			deltaHeight
		};
	}

	/**
	 * Set element animation
	 *
	 * @param {HTMLElement} element
	 */
	setAnimation(element, steps) {
		element.animate(steps, {
			duration: this._duration,
			easing: this._easing,
			fill: this._fill
		});
	}
};