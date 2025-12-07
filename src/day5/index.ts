import { test, readInput } from "../utils/index"
import { readTestFile, splitToAllLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

interface Range {
  from: number
  to: number
}

const parseRange = (range: string): Range => {
  const [from, to] = range.split("-").map(Number)
  return { from, to }
}

const parseInput = (
  input: string[],
): { fresh: Range[]; ingredients: number[] } => {
  const freshIngredientRanges: Range[] = []
  const ingredients: number[] = []

  let parsingRanges = true

  input.forEach((line) => {
    if (line === "") {
      parsingRanges = false
    } else if (parsingRanges) {
      freshIngredientRanges.push(parseRange(line))
    } else {
      ingredients.push(Number(line))
    }
  })

  return { fresh: freshIngredientRanges, ingredients }
}

const mergeRangeWithRanges = (ranges: Range[]): Range[] => {
  let newRanges: Range[] = []
  const rangeToMerge = ranges[0]
  let mergedRanges = false

  for (let i = 1; i < ranges.length && !mergedRanges; i++) {
    const currentRange = ranges[i]
    const mergedRange = mergeTwoRanges(rangeToMerge, currentRange)

    if (mergedRange.length === 1) {
      newRanges = [
        ...ranges.slice(1, i),
        ...mergedRange,
        ...ranges.slice(i + 1),
      ]
      mergedRanges = true
    }
  }

  return mergedRanges ? newRanges : [...ranges.slice(1), rangeToMerge]
}

const mergeRanges = (ranges: Range[]): Range[] => {
  for (let i = 0; i < ranges.length * 2; i++) {
    ranges = mergeRangeWithRanges(ranges)
  }

  return ranges
}

const mergeTwoRanges = (range1: Range, range2: Range): Range[] => {
  let lowerRange
  let secondRange

  if (range1.from <= range2.from) {
    lowerRange = range1
    secondRange = range2
  } else {
    lowerRange = range2
    secondRange = range1
  }

  if (lowerRange.to >= secondRange.from) {
    return [
      {
        from: lowerRange.from,
        to: Math.max(lowerRange.to, secondRange.to),
      },
    ]
  } else if (lowerRange.to < secondRange.from) {
    return [
      {
        from: lowerRange.from,
        to: lowerRange.to,
      },
      {
        from: secondRange.from,
        to: secondRange.to,
      },
    ]
  }
}

const goA = (input) => {
  const { fresh, ingredients } = parseInput(splitToAllLines(input))

  let freshIngredients = 0

  ingredients.forEach((ingredient, index) => {
    let isFresh = false

    for (let i = 0; i < fresh.length && !isFresh; i++) {
      const freshRange = fresh[i]
      isFresh = freshRange.from <= ingredient && freshRange.to >= ingredient
    }

    if (isFresh) {
      freshIngredients++
    }
  })

  return freshIngredients
}

const goB = (input) => {
  const { fresh, ingredients } = parseInput(splitToAllLines(input))

  const mergedRanges = mergeRanges(fresh)

  let potentialFresh = 0
  for (let i = 0; i < mergedRanges.length; i++) {
    potentialFresh += mergedRanges[i].to - mergedRanges[i].from + 1
  }
  return potentialFresh
}

/* Tests */

test(goA(readTestFile()), 3)
test(
  mergeRanges([
    { from: 1, to: 3 },
    { from: 2, to: 4 },
  ]),
  [{ from: 1, to: 4 }],
)
test(
  mergeRanges([
    { from: 1, to: 3 },
    { from: 4, to: 6 },
    { from: 2, to: 4 },
  ]),
  [{ from: 1, to: 6 }],
)
test(goB(readTestFile()), 14)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
