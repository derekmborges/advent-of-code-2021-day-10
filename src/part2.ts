import { syntaxIncompleteScorer } from './syntaxScorer'

const file: string = 'data/input.txt'
const score: number = syntaxIncompleteScorer(file)

console.log('Syntax Incomplete Score:', score)
