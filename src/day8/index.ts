import { test, readInput } from "../utils/index"
import { readTestFile, splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

enum AXIS {
  X,
  Y,
  Z,
}

interface Position {
  x: number
  y: number
  z: number
  alreadyIdentifiedClosest: Position[]
}

interface Node {
  value: number
  axis: AXIS
  left: Node | Leaf
  right: Node | Leaf
}

interface Leaf {
  value: Position
}

type Circuit = Position[]

const isLeaf = (tree: Node | Leaf): tree is Leaf => {
  return !("axis" in tree)
}

const parsePosition = (input: string): Position => {
  const [x, y, z] = input.split(",").map(Number)
  return {
    x,
    y,
    z,
    alreadyIdentifiedClosest: [{ x, y, z, alreadyIdentifiedClosest: [] }],
  }
}

const getValueForAxis = (position: Position, axis: AXIS): number => {
  switch (axis) {
    case AXIS.X:
      return position.x
    case AXIS.Y:
      return position.y
    case AXIS.Z:
      return position.z
  }
}

const buildTree = (positions: Position[], depth: number): Node | Leaf => {
  if (positions.length === 1) {
    return { value: positions[0] }
  }

  const axis = depth % 3
  const sorted = positions.sort((a, b) => a[axis] - b[axis])
  const middle = Math.floor(sorted.length / 2)
  const left = buildTree(sorted.slice(0, middle), depth + 1)
  const right = buildTree(sorted.slice(middle), depth + 1)

  return { value: getValueForAxis(sorted[middle], axis), axis, left, right }
}

const calculateDistance = (a: Position, b: Position) => {
  return Math.sqrt(
    Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2),
  )
}

const findNearestNeighbour = (
  tree: Node | Leaf,
  position: Position,
  currentBest: { distance: number; position: Position },
  ignoreList: Position[],
) => {
  if (isLeaf(tree)) {
    const distance = calculateDistance(tree.value, position)

    if (ignoreList.find((p) => p.x === tree.value.x && p.y === tree.value.y)) {
      return currentBest
    }

    return distance < currentBest.distance
      ? { distance, position: tree.value }
      : currentBest
  }

  const compareValue = getValueForAxis(position, tree.axis)

  if (compareValue < tree.value) {
    currentBest = findNearestNeighbour(
      tree.left,
      position,
      currentBest,
      ignoreList,
    )
    if (
      Math.abs(compareValue - tree.value) <=
      Math.abs(getValueForAxis(position, tree.axis) - tree.value)
    ) {
      currentBest = findNearestNeighbour(
        tree.right,
        position,
        currentBest,
        ignoreList,
      )
    }
  } else {
    currentBest = findNearestNeighbour(
      tree.right,
      position,
      currentBest,
      ignoreList,
    )
    if (
      Math.abs(compareValue - tree.value) <=
      Math.abs(getValueForAxis(position, tree.axis) - tree.value)
    ) {
      currentBest = findNearestNeighbour(
        tree.left,
        position,
        currentBest,
        ignoreList,
      )
    }
  }

  return currentBest
}

const printTree = (tree: Node | Leaf, depth: number) => {
  if (isLeaf(tree)) {
    console.log(" ".repeat(depth * 2), tree.value)
  } else {
    printTree(tree.left, depth + 1)
    console.log(" ".repeat(depth * 2), tree.value)
    printTree(tree.right, depth + 1)
  }
}

const findClosestPositions = (tree: Node | Leaf, positions: Position[]) => {
  let closestPair = {
    distance: Number.MAX_SAFE_INTEGER,
    pos1: null,
    pos2: null,
  }

  positions.forEach((pos) => {
    const nearestPosition = findNearestNeighbour(
      tree,
      pos,
      { distance: Number.MAX_SAFE_INTEGER, position: null },
      pos.alreadyIdentifiedClosest,
    )

    if (nearestPosition.distance < closestPair.distance) {
      closestPair = {
        distance: nearestPosition.distance,
        pos1: pos,
        pos2: nearestPosition.position,
      }
    }
  })

  return closestPair
}

const goA = (input, rounds: number) => {
  const positions = splitToLines(input).map(parsePosition)
  const tree = buildTree(positions, 0)
  const circuits: Circuit[] = []

  for (let i = 0; i < rounds; i++) {
    const closestPair = findClosestPositions(tree, positions)
    closestPair.pos1.alreadyIdentifiedClosest.push(closestPair.pos2)
    closestPair.pos2.alreadyIdentifiedClosest.push(closestPair.pos1)

    const circuitPos1 = circuits.find((circuit) =>
      circuit.find(
        (p) =>
          p.x === closestPair.pos1.x &&
          p.y === closestPair.pos1.y &&
          p.z === closestPair.pos1.z,
      ),
    )
    const circuitPos2 = circuits.find((circuit) =>
      circuit.find(
        (p) =>
          p.x === closestPair.pos2.x &&
          p.y === closestPair.pos2.y &&
          p.z === closestPair.pos2.z,
      ),
    )
    if (circuitPos1 === undefined && circuitPos2 === undefined) {
      circuits.push([closestPair.pos1, closestPair.pos2])
    } else if (circuitPos1 !== undefined && circuitPos2 === undefined) {
      circuitPos1.push(closestPair.pos2)
    } else if (circuitPos2 !== undefined && circuitPos1 === undefined) {
      circuitPos2.push(closestPair.pos1)
    } else if (
      circuitPos1.some(
        (p) =>
          !circuitPos2.find(
            (cp) => cp.x === p.x && cp.y === p.y && cp.z === p.z,
          ),
      )
    ) {
      circuits.splice(circuits.indexOf(circuitPos1), 1)
      circuitPos2.push(...circuitPos1)
    }
  }

  return circuits
    .map((circuit) => circuit.length)
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((a, b) => a * b, 1)
}

const goB = (input) => {
  const positions = splitToLines(input).map(parsePosition)
  const tree = buildTree(positions, 0)
  const circuits: Circuit[] = []
  let result

  while (!result) {
    const closestPair = findClosestPositions(tree, positions)
    closestPair.pos1.alreadyIdentifiedClosest.push(closestPair.pos2)
    closestPair.pos2.alreadyIdentifiedClosest.push(closestPair.pos1)

    const circuitPos1 = circuits.find((circuit) =>
      circuit.find(
        (p) =>
          p.x === closestPair.pos1.x &&
          p.y === closestPair.pos1.y &&
          p.z === closestPair.pos1.z,
      ),
    )
    const circuitPos2 = circuits.find((circuit) =>
      circuit.find(
        (p) =>
          p.x === closestPair.pos2.x &&
          p.y === closestPair.pos2.y &&
          p.z === closestPair.pos2.z,
      ),
    )
    if (circuitPos1 === undefined && circuitPos2 === undefined) {
      circuits.push([closestPair.pos1, closestPair.pos2])
    } else if (circuitPos1 !== undefined && circuitPos2 === undefined) {
      circuitPos1.push(closestPair.pos2)
    } else if (circuitPos2 !== undefined && circuitPos1 === undefined) {
      circuitPos2.push(closestPair.pos1)
    } else if (
      circuitPos1.some(
        (p) =>
          !circuitPos2.find(
            (cp) => cp.x === p.x && cp.y === p.y && cp.z === p.z,
          ),
      )
    ) {
      circuits.splice(circuits.indexOf(circuitPos1), 1)
      circuitPos2.push(...circuitPos1)
    }

    if (circuits.length === 1 && circuits[0].length === positions.length) {
      result = closestPair.pos1.x * closestPair.pos2.x
    }
  }

  return result
}

/* Tests */

test(goA(readTestFile(), 10), 40)
test(goB(readTestFile()), 25272)

/* Results */

console.time("Time")
const resultA = goA(input, 1000)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
