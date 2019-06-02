export default class Flip {
	/**
	 * Flip animation
	 *
	 * @param {Number} duration
	 * @param {String} easing
	 * @param {String} fill
	 */
	constructor({
		duration = 500,
		easing = 'ease-in-out',
		fill = 'both'
	} = {}) {
		this._duration = duration;
		this._easing = easing;
		this._fill = fill;
		this._positions = {}
	}

	/**
	 * Memorize the elements position
	 *
	 * @param {HTMLElement} elements
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
	 * @param {HTMLElement} elements
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
	 * @param {HTMLElement} elements
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
	 * Replace elements with animation
	 *
	 * @param {HTMLElement} oldElements
	 * @param {HTMLElement} newElements
	 */
	replace(oldElements, newElements) {
		const parent = oldElements[0].parentNode;
		const removeElements = [];

		this.read(oldElements);

		const newIds = newElements.map(element => {
			parent.appendChild(element);

			return element.dataset.id;
		});

		oldElements.forEach(element => {
			const id = element.dataset.id;

			if (newIds.includes(id)) parent.removeChild(element);
			else removeElements.push(element);
		});

		this.remove(removeElements);
		this.play(newElements);
	}

	/**
	 * Get element position and dimentions
	 *
	 * @param {HTMLElement} element
	 * @returns {Object} element dimensions
	 */
	getElementDetails(element) {
		const id = element.dataset.id;

		const newPosition = element.getBoundingClientRect();
		const oldPosition = this._positions[id];

		if (oldPosition === undefined) {
			const steps = [
				{
					transform: `translate(0, -30px)`,
					opacity: 0
				},
				{
					transform: 'none',
					opacity: 1
				}
			];

			this.setAnimation(element, steps);

			return;
		}

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