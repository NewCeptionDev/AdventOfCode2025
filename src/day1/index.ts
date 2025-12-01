import { test, readInput } from "../utils/index"
import { readTestFile, splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const enum DIRECTION {
  LEFT,
  RIGHT,
}

interface Instruction {
  direction: DIRECTION
  amount: number
  fullCircles: number
}

const parseInstruction = (instruction: string): Instruction => {
  const direction =
    instruction.charAt(0) === "L" ? DIRECTION.LEFT : DIRECTION.RIGHT
  const amount = Number(instruction.slice(1))

  return {
    direction,
    amount: amount % 100,
    fullCircles: Math.abs(Math.floor(amount / 100)),
  }
}

const applyInstruction = (startPosition: number, instruction: Instruction) => {
  let newPosition
  switch (instruction.direction) {
    case DIRECTION.LEFT:
      newPosition = startPosition - instruction.amount
      return newPosition < 0 ? newPosition + 100 : newPosition
    case DIRECTION.RIGHT:
      newPosition = startPosition + instruction.amount
      return newPosition > 99 ? newPosition % 100 : newPosition
  }
}

const goA = (input) => {
  const instructions = splitToLines(input).map(parseInstruction)

  let position = 50
  let amountOfTimesAtZero = 0

  instructions.forEach((instruction) => {
    position = applyInstruction(position, instruction)
    if (position === 0) {
      amountOfTimesAtZero++
    }
  })

  return amountOfTimesAtZero
}

const goB = (input) => {
  const instructions = splitToLines(input).map(parseInstruction)

  let position = 50
  let amountOfTimesAtZero = 0

  instructions.forEach((instruction) => {
    let newPosition = applyInstruction(position, instruction)

    if (
      position !== 0 &&
      (newPosition === 0 ||
        (instruction.direction === DIRECTION.RIGHT && newPosition < position) ||
        (instruction.direction === DIRECTION.LEFT && newPosition > position))
    ) {
      amountOfTimesAtZero++
    }
    amountOfTimesAtZero += instruction.fullCircles
    position = newPosition
  })

  return amountOfTimesAtZero
}

/* Tests */

test(goA(readTestFile()), 3)
test(goB(readTestFile()), 6)
test(
  applyInstruction(0, {
    direction: DIRECTION.LEFT,
    amount: 1,
    fullCircles: 1,
  }),
  99,
)
test(
  applyInstruction(0, {
    direction: DIRECTION.LEFT,
    amount: 0,
    fullCircles: 1,
  }),
  0,
)
test(
  applyInstruction(0, {
    direction: DIRECTION.RIGHT,
    amount: 1,
    fullCircles: 1,
  }),
  1,
)
test(
  applyInstruction(0, {
    direction: DIRECTION.RIGHT,
    amount: 0,
    fullCircles: 1,
  }),
  0,
)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
