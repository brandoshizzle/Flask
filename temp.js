function foo(a) {
	a2 = _.cloneDeep(a);
	a2.subObject.poop = 4;

	return a2;
}

var input = {
	subObject: {
		poop: 3
	}
	poop2
};

var output = foo(input);

console.log(input.bar, output.bar); // 1? 2?



var savedObj = {
	property1: 1
};

_.assign(savedObj, {
	property1: 2,
	property2: 3
});

console.log(obj.property2, savedObj.property2); //
