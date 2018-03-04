function multiply(first, second) {
	let	str1 = '';
	let	str2 = '0';
	let	carrying = '0';
	let	temp = '0';
	let x = 0;

	if (first.length < second.length) {
		temp = first;
		first = second;
		second = temp;
		temp = '0';
	}

	for (let i = second.length; i > 0; i--) {
		for (let k = first.length; k > 0; k--) {
			temp = (+second[i - 1] * +first[k - 1] + +carrying).toString();
			carrying = '0';

			if (temp.length > 1 && k != 1) {
				carrying = temp[0];
				temp = temp[1];
			}

			str1 = temp + str1;
		}

		for (let j = 0; j < x; j++) {
			str1 = str1 + '0';
		}
		x++;
		str2 = add(str1, str2);
		str1 = '';
	}
	return str2;
}

function add(a, b) {
	let temp = '0';
	let	res = '';
	let	carrying = '0';

	if (a.length < b.length) {
		temp = a;
		a = b;
		b = temp;
		temp = '0';
	}

	let originalLength = b.length;
	for (let i = 0; i < a.length - originalLength; i++) {
		b = '0' + b;
	}

	for (let i = b.length; i > 1; i--) {
		temp = (+a[i - 1] + +b[i - 1] + +carrying).toString();
		carrying = '0';

		if (temp.length > 1) {
			carrying = temp[0];
			temp = temp[1];
		}
		res = temp + res;
		temp = '0';
	}

	temp = (+a[0] + +b[0] + +carrying).toString();
	res = temp + res;
	return res;
}
