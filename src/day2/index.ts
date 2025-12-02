import { test, readInput } from "../utils/index"
import { readTestFile } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

interface Range {
  from: number
  to: number
}

const parseInput = (input: string): Range[] => {
  return input.split(",").map((range) => {
    const [from, to] = range.split("-").map(Number)
    return { from, to }
  })
}

const getSillyIds = (range: Range): number[] => {
  const invalidIds = []

  for (let i = range.from; i <= range.to; i++) {
    if (isInvalidTwoPartId(i)) {
      invalidIds.push(i)
    }
  }

  return invalidIds
}

const getInvalidIds = (range: Range, multipleParts: boolean): number[] => {
  const invalidIds = []

  for (let i = range.from; i <= range.to; i++) {
    if (multipleParts ? isInvalidMultiPartId(i) : isInvalidTwoPartId(i)) {
      invalidIds.push(i)
    }
  }

  return invalidIds
}

const isInvalidTwoPartId = (id: number): boolean => {
  const idString = id.toString()

  return (
    idString.length % 2 === 0 &&
    Number(idString.slice(0, idString.length / 2)) ===
      Number(idString.slice(idString.length / 2))
  )
}

const isInvalidMultiPartId = (id: number): boolean => {
  const idString = id.toString()
  const splits = []

  if (idString.length === 1) {
    return false
  }

  for (let i = 1; i < idString.length / 2 + 1; i++) {
    if (idString.length % i === 0) {
      const splitOption = []
      for (let j = 0; j < idString.length / i; j++) {
        splitOption.push(idString.slice(j * i, (j + 1) * i))
      }
      splits.push(splitOption)
    }
  }

  let isInvalid = false
  for (let i = 0; i < splits.length && !isInvalid; i++) {
    if (splits[i].every((split) => split === splits[i][0])) {
      isInvalid = true
    }
  }

  return isInvalid
}

const goA = (input) => {
  const ranges = parseInput(input)
  const invalidIds = ranges.flatMap((range) => getInvalidIds(range, false))

  return invalidIds.reduce((acc, id) => acc + id, 0)
}

const goB = (input) => {
  const ranges = parseInput(input)
  const invalidIds = ranges.flatMap((range) => getInvalidIds(range, true))

  return invalidIds.reduce((acc, id) => acc + id, 0)
}

/* Tests */

test(getSillyIds({ from: 11, to: 22 }), [11, 22])
test(getSillyIds({ from: 99, to: 115 }), [99])
test(isInvalidMultiPartId(11), true)
test(isInvalidMultiPartId(14), false)
test(goA(readTestFile()), 1227775554)
test(goB(readTestFile()), 4174379265)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
