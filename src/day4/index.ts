import { test, readInput } from "../utils/index"
import { readTestFile, splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

interface Position {
  x: number
  y: number
}

const parseGrid = (lines: string[]): string[][] => {
  const grid: string[][] = []
  for (let i = 0; i < lines.length; i++) {
    grid.push(lines[i].split(""))
  }

  return grid
}

const getNeighbourPositions = (x: number, y: number): Position[] => {
  return [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 },
    { x: x - 1, y: y - 1 },
    { x: x - 1, y: y + 1 },
    { x: x + 1, y: y - 1 },
    { x: x + 1, y: y + 1 },
  ]
}

const isAccessible = (grid: string[][], x: number, y: number): boolean => {
  const blockedNeighbours = getNeighbourPositions(x, y).filter(
    ({ x, y }) =>
      x >= 0 &&
      y >= 0 &&
      grid.length > y &&
      grid[y].length > x &&
      grid[y][x] !== ".",
  )

  return blockedNeighbours.length < 4
}

const goA = (input) => {
  const grid = parseGrid(splitToLines(input))
  let accessible = 0

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "@" && isAccessible(grid, x, y)) {
        accessible++
      }
    }
  }

  return accessible
}

const goB = (input) => {
  const grid = parseGrid(splitToLines(input))
  let accesiblePositions: Position[] = []
  let accessible = 0

  while (accesiblePositions.length > 0 || accessible === 0) {
    accesiblePositions = []

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === "@" && isAccessible(grid, x, y)) {
          accesiblePositions.push({ x, y })
          accessible++
        }
      }
    }

    for (const { x, y } of accesiblePositions) {
      grid[y][x] = "."
    }
  }

  return accessible
}

/* Tests */

test(goA(readTestFile()), 13)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
