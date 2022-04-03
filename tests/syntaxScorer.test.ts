import {
    findCorruptedOrIncompleteChars,
    parseChunks,
    syntaxCorruptScorer,
    syntaxIncompleteScorer
} from '../src/syntaxScorer'

describe('findCorruptedOrIncompleteChars', () => {

    test('basic valid chunks', () => {
        expect(findCorruptedOrIncompleteChars('[]')).toBeNull()
        expect(findCorruptedOrIncompleteChars('{}')).toBeNull()
        expect(findCorruptedOrIncompleteChars('()')).toBeNull()
        expect(findCorruptedOrIncompleteChars('<>')).toBeNull()
    })
    
    test('basic invalid chunks', () => {
        expect(findCorruptedOrIncompleteChars('[}')).toBe('}')
        expect(findCorruptedOrIncompleteChars('{)')).toBe(')')
        expect(findCorruptedOrIncompleteChars('(>')).toBe('>')
        expect(findCorruptedOrIncompleteChars('<]')).toBe(']')
    })

    test('complex valid chunks', () => {
        expect(findCorruptedOrIncompleteChars('([])')).toBeNull()
        expect(findCorruptedOrIncompleteChars('{()()()}')).toBeNull()
        expect(findCorruptedOrIncompleteChars('<([{}])>')).toBeNull()
        expect(findCorruptedOrIncompleteChars('[<>({}){}[([])<>]]')).toBeNull()
        expect(findCorruptedOrIncompleteChars('(((((((((())))))))))')).toBeNull()
    })
    
    test('complex invalid chunks', () => {
        expect(findCorruptedOrIncompleteChars('{()()()>')).toBe('>')
        expect(findCorruptedOrIncompleteChars('(((()))}')).toBe('}')
        expect(findCorruptedOrIncompleteChars('<([]){()}[{}])')).toBe(')')
    })

    test('super complex invalid chunks', () => {
        expect(findCorruptedOrIncompleteChars('{([(<{}[<>[]}>{[]{[(<()>')).toBe('}')
        expect(findCorruptedOrIncompleteChars('[[<[([]))<([[{}[[()]]]')).toBe(')')
        expect(findCorruptedOrIncompleteChars('[{[{({}]{}}([{[{{{}}([]')).toBe(']')
        expect(findCorruptedOrIncompleteChars('[<(<(<(<{}))><([]([]()')).toBe(')')
        expect(findCorruptedOrIncompleteChars('<{([([[(<>()){}]>(<<{{')).toBe('>')
    })

    test('super complex incomplete lines', () => {
        expect(findCorruptedOrIncompleteChars('[({(<(())[]>[[{[]{<()<>>'))
            .toStrictEqual(['}', '}', ']', ']', ')', '}', ')', ']'])
        expect(findCorruptedOrIncompleteChars('[(()[<>])]({[<{<<[]>>('))
            .toStrictEqual([')', '}', '>', ']', '}', ')'])
        expect(findCorruptedOrIncompleteChars('(((({<>}<{<{<>}{[]{[]{}'))
            .toStrictEqual(['}', '}', '>', '}', '>', ')', ')', ')', ')'])
        expect(findCorruptedOrIncompleteChars('{<[[]]>}<{[{[{[]{()[[[]'))
            .toStrictEqual([']', ']', '}', '}', ']', '}', ']', '}', '>'])
        expect(findCorruptedOrIncompleteChars('<{([{{}}[<[[[<>{}]]]>[]]'))
            .toStrictEqual([']', ')', '}', '>'])
    })

})

describe('syntaxScorer', () => {

    test('text file input', () => {
        expect(parseChunks('data/testInput.txt')).toHaveLength(10)
        expect(parseChunks('data/input.txt')).toHaveLength(110)
    })

    test('sample input score - part 1', () => {
        expect(syntaxCorruptScorer('data/testInput.txt')).toBe(26397)
    })

    test('sample input score - part 2', () => {
        expect(syntaxIncompleteScorer('data/testInput.txt')).toBe(288957)
    })

})
