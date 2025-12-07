import { test, readInput } from "../utils/index"
import { readTestFile, splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

enum OPERAND {
  ADD = "+",
  MULTIPLY = "*",
}

interface Problem {
  operand: OPERAND
  values: number[]
}

const simpleParse = (row: string) => {
  return row.split(" ").filter((x) => x !== "")
}

const advancedParse = (rows: string[]) => {
  const problems: Problem[] = []

  let currentProblem: Problem = {
    operand: null,
    values: [],
  }

  for (let i = 0; i < rows[0].length; i++) {
    const columnValues = rows.map((x) => x[i])

    if (columnValues.every((value) => value === " ")) {
      problems.push(currentProblem)
      currentProblem = {
        operand: null,
        values: [],
      }
    } else {
      const parsedColumn = parseColumn(columnValues)

      if (parsedColumn[0].operand !== undefined) {
        currentProblem.operand = parsedColumn[0].operand
      }
      currentProblem.values.push(parsedColumn[0].number)
    }
  }

  problems.push(currentProblem)

  return problems
}

const parseColumn = (
  values: string[],
): { number: number; operand?: OPERAND }[] => {
  const result = values.join("")

  if (result.charAt(result.length - 1) === "*") {
    return [
      {
        number: parseInt(result.slice(0, result.length - 1)),
        operand: OPERAND.MULTIPLY,
      },
    ]
  } else if (result.charAt(result.length - 1) === "+") {
    return [
      {
        number: parseInt(result.slice(0, result.length - 1)),
        operand: OPERAND.ADD,
      },
    ]
  }

  return [{ number: parseInt(result) }]
}

const solveProblem = (problem: Problem) => {
  switch (problem.operand) {
    case "*":
      return problem.values.reduce((a, b) => a * b, 1)
    case "+":
      return problem.values.reduce((a, b) => a + b, 0)
    default:
      throw new Error(`Unknown operand ${problem.operand}`)
  }
}

const goA = (input) => {
  const rows = splitToLines(input).map(simpleParse)
  let overallSum = 0

  for (let i = 0; i < rows[0].length; i++) {
    const values = []
    rows.forEach((row) => {
      values.push(row[i])
    })

    const operand =
      values[values.length - 1] === "+" ? OPERAND.ADD : OPERAND.MULTIPLY

    overallSum += solveProblem({
      values: values.slice(0, values.length - 1).map((x) => parseInt(x)),
      operand,
    })
  }

  return overallSum
}

const goB = (input) => {
  const rows = splitToLines(input)
  const problems = advancedParse(rows)

  let overallSum = 0

  for (let i = 0; i < problems.length; i++) {
    overallSum += solveProblem(problems[i])
  }

  return overallSum
}

/* Tests */

test(goA(readTestFile()), 4277556)
test(goB(readTestFile()), 3263827)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
