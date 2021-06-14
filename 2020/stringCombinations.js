const alphabet = 'abcabc';

console.log(tuples(alphabet, 2));

function permutations(str) {
    let arr = [];

    if (typeof str !== 'string') {
        return 'Enter a string';
    }

    doTheThing('', str);

    function doTheThing(init, carry) {
        if (carry.length === 1) arr.push(init + carry);

        else {
            for (let i = 0; i < carry.length; i++) {
                doTheThing(init + carry[i], carry.slice(0, i) + carry.slice(i + 1, carry.length));
            }
        }
    }

    function removeDuplicates(dupes) {
        return [...new Set(dupes)];
    }

    return removeDuplicates(arr).sort();
}

function tuples(str, n) {
    let arr = [];

    if (typeof str !== 'string' || typeof n !== 'number') {
        return 'Enter a string and a number';
    }

    doTheThing('', str);

    function doTheThing(init, carry) {
        if (init.length === n) arr.push(init);

        else {
            for (let i = 0; i < carry.length; i++) {
                doTheThing(init + carry[i], carry);
            }
        }
    }

    function removeDuplicates(dupes) {
        return [...new Set(dupes)];
    }

    console.log(removeDuplicates(arr).length);
    return removeDuplicates(arr).sort();
}