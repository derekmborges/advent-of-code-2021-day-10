import { syntaxCorruptScorer } from './syntaxScorer'

console.log(process.cwd())
const file: string = 'data/input.txt'
const score: number = syntaxCorruptScorer(file)

console.log('Syntax Corrupt Score:', score)
