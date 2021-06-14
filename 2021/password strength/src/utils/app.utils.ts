import {passwords} from "./passwords";

export function containsUpper(str: string) {
    return /[A-Z]/.test(str);
}

export function containsLower(str: string) {
    return /[a-z]/.test(str);
}

export function containsNumber(str: string) {
    return /[0-9]/.test(str);
}

export function containsSpecialSymbol(str: string) {
    return /[^A-Za-z0-9]/.test(str);
}

export function isPopularPassword(str: string) {
    return passwords.has(str);
}

export function isRepeating(str: string, repetitionNumber: number) {
    let temp = '.';
    for (let i = 1; i < str.length / 2; i++) {
        if (new RegExp(`(${temp})\\1{${repetitionNumber - 1}}`).test(str))
            return true;
        else temp += '.';
    }
    return false;
}