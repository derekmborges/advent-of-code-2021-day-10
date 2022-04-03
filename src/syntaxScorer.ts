import * as fs from 'fs'

// Constants
const OPENERS = [ '[', '{', '(', '<' ]
const CLOSERS = [ ']', '}', ')', '>' ]
const CORRUPT_POINT_VALUES = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137
}
const INCOMPLETE_POINT_VALUES = {
    ']': 2,
    ')': 1,
    '}': 3,
    '>': 4
}

// Helper functions
const topOpener = (stack: string[]): string =>
    stack[stack.length - 1]

const isMatchingPair = (opener: string, closer: string): boolean =>
    OPENERS.indexOf(opener) === CLOSERS.indexOf(closer)

const getCloser = (opener: string): string =>
    CLOSERS[OPENERS.indexOf(opener)]


// Function that is used by Parts 1 and 2
// Accepts a chunk and returns either:
//      the corrupted character (string),
//      the incomplete closing characters (string[]),
//      or null if it's a complete line
export function findCorruptedOrIncompleteChars(chunk: string): string[] | string | null {
    const openStack = []

    for (let i = 0; i < chunk.length; i++) {
        const c = chunk[i]
        if (OPENERS.includes(c)) {
            openStack.push(c)
        } else {
            if (isMatchingPair(topOpener(openStack), c)) {
                openStack.pop()
            } else {
                return c
            }
        }
    }

    return openStack.length > 0
        ? openStack.map(o => getCloser(o)).reverse()
        : null
}

export function parseChunks(fileName: string): string[] {
    const data = fs.readFileSync(fileName, 'utf8')
    return data.split('\n')
}


// Function to add up the scores of each corrupted line
export function syntaxCorruptScorer(fileName: string): number {
    const chunks: string[] = parseChunks(fileName)
    let score: number = 0
    
    for (let chunk of chunks) {
        const result = findCorruptedOrIncompleteChars(chunk)
        if (result && typeof result === 'string') {
            const corruptedChar: string = result as string
            score += CORRUPT_POINT_VALUES[corruptedChar]
        } 
    }
    return score
}

// Function to calculate the middle score of the incomplete lines
export function syntaxIncompleteScorer(fileName: string): number {
    const chunks: string[] = parseChunks(fileName)
    let scores: number[] = []

    for (let chunk of chunks) {
        const result = findCorruptedOrIncompleteChars(chunk)

        if (result && Array.isArray(result)) {
            const closers: string[] = result as string[]
            let chunkScore: number = 0

            for (let closer of closers) {
                chunkScore = (chunkScore * 5) + INCOMPLETE_POINT_VALUES[closer]
            }
            scores.push(chunkScore)
        }
    }

    return scores.sort((n1, n2) => n1 - n2)[(scores.length - 1) / 2]
}
