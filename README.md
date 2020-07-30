# ParticleSandbox
An attempt at creating a physics-based particle sandbox.

## Features:
- Solid and liquid particle behaviour

## Challenges:
- Initially, I started by creating this project in React and set up a component that represents each individual particle. I stored the X and Y values in the particles and would rerender them when their values were udpated. I soon realized that this approach was very costly - rerendering even 10+ components at a time was very taxing.
- Instead, I switched to taking advantage of the canvas system that JavaScript has. Built for this purpose, when the user adds a particle, I not only add it to the canvas, but also store a reference to it to be able to manipulate its values when interacted with. This approach can hold approximately 900 particles before it starts to slow down. That said, I believe there is some n^2 time complexity that I can scale down to being linear to help this issue.
