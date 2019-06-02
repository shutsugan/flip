# Flip
Flip class that calculates old dimensions, new dimensions and animate them

## Usage

You can use the Flip helper on its own, like this:

```javascript
let flip = new Flip({
  	duration: 500
  	easing: 'ease-in-out',
	fill: 'both'
});

// First position & opacity.
flip.read(elements);

// Do you action removing, adding, or resizing elements

// Play it forwards. with the mutated elements
flip.play(elements);