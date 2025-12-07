import { test, readInput } from "../utils/index"
import { readTestFile, splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

interface Position {
  x: number
  y: number
}

const parseMap = (rows: string[]): string[][] => {
  return rows.map((row) => row.split(""))
}

const calculatePossibleOptions = (
  map: string[][],
  x: number,
  y: number,
  cache: Map<string, number>,
): number => {
  if (map.length === y + 1) {
    return 1
  }

  if (cache.has(`${x}-${y}`)) {
    return cache.get(`${x}-${y}`)
  }

  const mapSymbol = map[y + 1][x]

  let result
  if (mapSymbol === ".") {
    result = calculatePossibleOptions(map, x, y + 1, cache)
  } else if (mapSymbol === "^") {
    result =
      calculatePossibleOptions(map, x + 1, y + 1, cache) +
      calculatePossibleOptions(map, x - 1, y + 1, cache)
  }
  cache.set(`${x}-${y}`, result)
  return result
}

const goA = (input): number => {
  const map = parseMap(splitToLines(input))
  let beams: Position[] = [{ x: map[0].indexOf("S"), y: 0 }]
  let splits = 0

  while (beams.length > 0) {
    let newBeams = []

    for (const beam of beams) {
      const x = beam.x
      const y = beam.y

      if (map.length === y + 1) {
        break
      }

      const mapSymbol = map[y + 1][x]
      const beamsToBeCreated = []

      if (mapSymbol === ".") {
        beamsToBeCreated.push({ x, y: y + 1 })
      } else if (mapSymbol === "^") {
        beamsToBeCreated.push({ x: x + 1, y: y + 1 }, { x: x - 1, y: y + 1 })
        splits++
      }

      beamsToBeCreated.forEach((beam) => {
        if (newBeams.find((b) => b.x === beam.x && b.y === beam.y)) {
          return
        }
        newBeams.push(beam)
      })
    }

    beams = newBeams
  }

  console.log(splits)
  return splits
}

const goB = (input) => {
  const map = parseMap(splitToLines(input))
  return calculatePossibleOptions(map, map[0].indexOf("S"), 0, new Map())
}

/* Tests */

test(goA(readTestFile()), 21)
test(goB(readTestFile()), 40)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
