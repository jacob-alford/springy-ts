import * as Endo from 'fp-ts/Endomorphism'
import * as RA from 'fp-ts/ReadonlyArray'
import { identity, pipe } from 'fp-ts/function'

import * as Anim from './Animation'

/** Parameters that determine the behavior of a spring */
export interface SpringParameters {
  /** High tension => faster convergence */
  tension: number
  /** High friction => greater tension counteraction */
  friction: number
  /** Big mass => slower acceleration */
  mass: number
  /** The threshold for which consecutive progressions are considered equivalent */
  precision: number
}

export const defaultParams: SpringParameters = {
  mass: 1,
  precision: 0.001,
  tension: 170,
  friction: 26,
}
export const gentle: SpringParameters = {
  mass: 1,
  precision: 0.001,
  tension: 120,
  friction: 14,
}
export const wobbly: SpringParameters = {
  mass: 1,
  precision: 0.001,
  tension: 180,
  friction: 12,
}
export const stiff: SpringParameters = {
  mass: 1,
  precision: 0.001,
  tension: 210,
  friction: 20,
}
export const slow: SpringParameters = {
  mass: 1,
  precision: 0.001,
  tension: 280,
  friction: 60,
}
export const molasses: SpringParameters = {
  mass: 1,
  precision: 0.001,
  tension: 280,
  friction: 120,
}

/** An animatable value */
export interface Spring {
  /** The current value of the spring */
  currentValue: number
  /** Where the spring will come to rest */
  targetValue: number
  /** The number of times consecutive spring-value progressions are calculated */
  animationSteps: number
  /** Spring parameters */
  parameters: SpringParameters
}

export const progress: Endo.Endomorphism<Spring> = (a) => ({
  ...a,
  currentValue: isStill(a)
    ? a.targetValue
    : pipe(
        RA.makeBy(a.animationSteps, identity),
        RA.reduce(
          Anim.initial(a.currentValue),
          Anim.getProgress(a.targetValue, a.parameters)
        ),
        Anim.getPosition
      ),
})

export const setTarget: (target: number) => Endo.Endomorphism<Spring> =
  (target) => (a) => ({
    ...a,
    targetValue: target,
  })

export const isStill: (s: Spring) => boolean = ({
  currentValue,
  targetValue,
  parameters,
}) => Math.abs(targetValue - currentValue) < parameters.precision
