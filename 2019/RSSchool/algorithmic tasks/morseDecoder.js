const MORSE_TABLE = {
    '.-':     'a',
    '-...':   'b',
    '-.-.':   'c',
    '-..':    'd',
    '.':      'e',
    '..-.':   'f',
    '--.':    'g',
    '....':   'h',
    '..':     'i',
    '.---':   'j',
    '-.-':    'k',
    '.-..':   'l',
    '--':     'm',
    '-.':     'n',
    '---':    'o',
    '.--.':   'p',
    '--.-':   'q',
    '.-.':    'r',
    '...':    's',
    '-':      't',
    '..-':    'u',
    '...-':   'v',
    '.--':    'w',
    '-..-':   'x',
    '-.--':   'y',
    '--..':   'z',
    '.----':  '1',
    '..---':  '2',
    '...--':  '3',
    '....-':  '4',
    '.....':  '5',
    '-....':  '6',
    '--...':  '7',
    '---..':  '8',
    '----.':  '9',
    '-----':  '0',
};

function decode(expr) {

    let words = expr.split('**********');
    let letters = [];
    let wordsDecoded = [];

    for (let i = 0; i < words.length; i++) {
        letters.push(words[i].match(/.{1,10}/g));
    }

    for (let i = 0; i < letters.length; i++) {
        for (let k = 0; k < letters[i].length; k++) {
            letters[i][k] = letters[i][k].replace(/0*/, '').replace(/10/g, '.').replace(/11/g, '-');
            letters[i][k] = MORSE_TABLE[letters[i][k]];
        }
        wordsDecoded.push(letters[i].join(''));
    }

    return wordsDecoded.join(' ');
}