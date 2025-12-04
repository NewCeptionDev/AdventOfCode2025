import { test, readInput } from "../utils/index"
import { splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

interface Bank {
  batteries: number[]
}

const parseBank = (input: string): Bank => {
  return { batteries: input.split("").map(Number) }
}

const identifyLargestJoltage = (bank: Bank, batteriesToActive: number) => {
  let largestJoltage: number[] = [...bank.batteries.slice(0, batteriesToActive)]

  for (let i = batteriesToActive; i < bank.batteries.length; i++) {
    let updatePerformed = false
    for (let j = 1; j < largestJoltage.length && !updatePerformed; j++) {
      if (largestJoltage[j] > largestJoltage[j - 1]) {
        largestJoltage = updateArray(largestJoltage, j - 1, bank.batteries[i])
        updatePerformed = true
      }
    }

    if (
      !updatePerformed &&
      bank.batteries[i] > largestJoltage[largestJoltage.length - 1]
    ) {
      largestJoltage[largestJoltage.length - 1] = bank.batteries[i]
    }
  }

  return Number(largestJoltage.map(String).join(""))
}

const updateArray = (
  array: number[],
  startIndex: number,
  newValue: number,
): number[] => {
  const newArray = []

  for (let i = 0; i < startIndex; i++) {
    newArray.push(array[i])
  }

  for (let i = startIndex + 1; i < array.length; i++) {
    newArray.push(array[i])
  }

  newArray.push(newValue)

  return newArray
}

const goA = (input) => {
  const banks = splitToLines(input).map(parseBank)
  return banks
    .map((bank) => identifyLargestJoltage(bank, 2))
    .reduce((a, b) => a + b, 0)
}

const goB = (input) => {
  const banks = splitToLines(input).map(parseBank)
  return banks
    .map((bank) => identifyLargestJoltage(bank, 12))
    .reduce((a, b) => a + b, 0)
}

/* Tests */

test(identifyLargestJoltage(parseBank("987654321111111"), 2), 98)
test(identifyLargestJoltage(parseBank("811111111111119"), 2), 89)
test(identifyLargestJoltage(parseBank("234234234234278"), 2), 78)
test(identifyLargestJoltage(parseBank("818181911112111"), 2), 92)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
