import * as Endo from 'fp-ts/Endomorphism'

import { SpringParameters } from './Spring'

export interface Animation {
  velocity: number
  position: number
}

export const getProgress: (
  target: number,
  parameters: SpringParameters,
  step?: number
) => Endo.Endomorphism<Animation> =
  (target, { tension, friction, mass }, step = 1) =>
  ({ velocity: velocity_, position: position_ }) => {
    const springForce = -tension * 0.000001 * (position_ - target)
    const dampingForce = -friction * 0.001 * velocity_
    const acceleration = (springForce + dampingForce) / mass
    const velocity = velocity_ + acceleration * step
    const position = position_ + velocity * step
    return {
      velocity,
      position,
    }
  }

export const initial: (position: number) => Animation = (position) => ({
  velocity: 0,
  position,
})

export const getPosition: (a: Animation) => number = ({ position }) => position
