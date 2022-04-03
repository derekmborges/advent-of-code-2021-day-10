import { syntaxCorruptScorer } from './syntaxScorer'

const file: string = 'data/input.txt'
const score: number = syntaxCorruptScorer(file)

console.log('Syntax Corrupt Score:', score)
