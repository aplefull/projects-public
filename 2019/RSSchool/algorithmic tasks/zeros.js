function zeros(expression) {
	let num = {
		fives: 0,
		twos: 0
	};
	let arr = expression.split('*');
	let temp;

	for (let i = 0; i < arr.length; i++) {
		temp = count(arr[i].replace(/!/g, ''), arr[i].match(/!/g).length);
		num.fives += temp.fives;
		num.twos += temp.twos;
	}

	return Math.min(num.fives, num.twos);
}

function count(n, fact) {
	let num = {
		fives: 0,
		twos: 0
    };
    let t;
    let decreaseFactor;

    if (fact === 1) decreaseFactor = 1;
    else decreaseFactor = 2;

    for (let i = n; i > 1; i -= decreaseFactor) {
        t = i;

        while (t % 2 === 0 && t >= 1) {
            num.twos++;
            t = t / 2;
        }

        while (t % 5 === 0 && t >= 1) {
            num.fives++;
            t = t / 5;
        }
    }

    return num;
}
