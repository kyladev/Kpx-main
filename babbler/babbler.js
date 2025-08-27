// Andoni Garcia's Markov Babbler in JS. 2014

var TABLE = new htable(157);

// =====================================================================
// ====================== Hash Table Structs  ==========================
// =====================================================================

// My general "hash" function. Just assigns a number to the each word
// that is "somewhat" unique. THIS FUNCTION DOES NOT preserve properties
// like backtracking resistance or collision resistance.
function hashFn(word){
	var res = 17;
	for(var i = 0; i < word.length; i++){
		var tmp = word.charCodeAt(i) * 31;
		tmp *= 23;
		res += tmp;
	}
	return res;
}

function list(word){
	this.word = word;
	this.count = 1;
	this.nextWord = undefined;
}

function entry(word){
	this.word = word;
	this.count = 1;
	this.nextWord = undefined;
}

function bucket(entry){
	this.e = entry;
	this.nextBucket = undefined;
}

function htable(nBucks){
	var bucks = [];
	for(var i = 0; i < nBucks; i++){
		bucks.push(undefined);
	}

	this.nBuckets = nBucks;
	this.buckets = bucks;
	this.firstWords = [];
}

// =====================================================================
// ====================== Membership Testing ===========================
// =====================================================================

function bucketMem(s, b){
	var tmp = b;
	while(tmp !== undefined && tmp !== null){
		if(tmp.e.word === s)
			return true;
		tmp = tmp.nextBucket;
	}
	return false;
}

function listMem(s, l){
	var tmp = l;
	while(tmp !== undefined && tmp !== null){
		if(tmp.word === s)
			return true;
		tmp = tmp.nextWord;
	}
	return false;
}

function htableMem(s){
	var nBucks = TABLE.nBuckets;
	var hash = hashFn(s);
	var whichBucket = hash % nBucks;
	return bucketMem(s, TABLE.buckets[whichBucket]);
}

// =====================================================================
// ====================== Insertion Functions ==========================
// =====================================================================

function isFirstWord(s){
	var firstChar = s.charCodeAt(0);
	if(65 <= firstChar && firstChar <= 90)
		return true;
	return false;
}

function endOfSent(s){
	var lastChar = s.charAt(s.length - 1);
	if(lastChar === "." || lastChar === "?" || lastChar === "!")
		return true;
	return false;
}

// Checks that at least 1 character in the String is printable
function isPrintable(s){
	for(var i = 0; i < s.length; i++){
		var c = s.charCodeAt(i);
		if((48 <= c && c <= 57) || (65 <= c && c <= 90) ||
			(97 <= c && c <= 122) || c === 45 || c === 39)
			return true;
	}
	return false;
}

function strCleanup(s, bool){
	var newStr = "";
	for(var i = 0; i < s.length; i++){
		var c = s.charCodeAt(i);
		var d = s.charAt(i);
		if(bool && i === (s.length - 1)){
			if(d === "." || d === "?" || d === "!"){
				newStr += d;
				continue;
			}
		}
		if((48 <= c && c <= 57) || (65 <= c && c <= 90) || (97 <= c && c <= 122) || c === 45 || c === 39)
			newStr += d;
	}
	return newStr;
}

function htableInsert(s, nextW){
	// Add to firstWord list
	if(isFirstWord(s))
		TABLE.firstWords.push(s);

	// Adds to the appropriate place in the table
	var a = TABLE.nBuckets;
	var b = hashFn(s);
	var hash = b % a;	

	var curr = TABLE.buckets[hash];
	// If the bucket already contains the current word
	if(bucketMem(s, curr)){
		// Finds the appropriate entry
		while(curr.e.word !== s)
			curr = curr.nextBucket;
		var ent = curr.e;
		// Increments the entry's count
		ent.count++;

		// If the entry already contains the next word
		if(listMem(nextW, ent.nextWord)){
			var nextWd = ent.nextWord;
			// Finds the appropriate list
			while(nextWd.word !== nextW)
				nextWd = nextWd.nextWord;
			// Increments the list's count
			nextWd.count++;
			return;
		// The entry does not contain the word
		} else {
			var newL = new list(nextW);
			newL.nextWord = ent.nextWord;
			ent.nextWord = newL;
			return;
		}
	// The bucket does not contain the current word
	} else {
		var lnew = new list(nextW);
		var enew = new entry(s);
		enew.nextWord = lnew;
		var bnew = new bucket(enew);
		bnew.nextBucket = curr;
		TABLE.buckets[hash] = bnew;
		return;
	}
}

// Treats a "file" as a giant array of words
function insertFile(upload){
	var currentWord, nextWord;
	var end = "EOS";
	var ct = 0;
	var maxlen = upload.length;

	// A function to get the next printable word
	function getNextWord(){
		if(ct >= maxlen)
			return "EOS";
		var word = upload[ct++];
		while(!isPrintable(word) && ct < maxlen){
			word = upload[ct++];
		}
		return word;
	}

	// The insertion algorithm
	currentWord = getNextWord();
	nextWord = getNextWord();
	while(ct < maxlen){
		if(endOfSent(currentWord)){
			var tmp = strCleanup(currentWord, true);
			htableInsert(tmp, end);
		} else {
			var tmp1 = strCleanup(currentWord, false);
			var tmp2 = strCleanup(nextWord, false);
			htableInsert(tmp1, tmp2);
		}
		currentWord = nextWord;
		nextWord = getNextWord();
	}

	// Handling the end case
	var tmp3 = strCleanup(currentWord, true);
	htableInsert(tmp3, end);
	return;
}

// =====================================================================
// ====================== Babbling Functions ===========================
// =====================================================================

function nextWord(e){
	var randNum = Math.floor(Math.random() * e.count);
	var list = e.nextWord;
	while(list !== undefined){
		randNum -= list.count;
		if(randNum <= 0)
			return list.word;
		list = list.nextWord;
	}
	return;
}

function firstWord(){
	var randNum = Math.floor(Math.random() * TABLE.firstWords.length);
	return TABLE.firstWords[randNum];
}

function htableSearch(s){
	var a = TABLE.nBuckets;
	var b = hashFn(s);
	var c = (b % a);
	var bucks = TABLE.buckets[c];
	if(htableMem(s)){
		while(bucks.e.word !== s)
			bucks = bucks.nextBucket;
		return bucks.e;
	}
	return undefined;
}

function sentence(){
	var sent = [];

	var words = Math.floor(Math.random() * 25) + 3;

	//Creates the sentence
	var first = firstWord();
	var lastWord = first;
	var e = htableSearch(first);
	while(words !== 0){
		sent.push(e.word);
		if(words > 0)
			sent.push(" ");
		var nxt = nextWord(e);
		lastWord = nxt;
		if(nxt === "EOS")
			break;
		e = htableSearch(nxt);
		if(e === undefined)
			break;
		words--;
	}
	sent.pop();
	if(!(endOfSent(lastWord)))
		sent.push(".");
	return sent.join("");
}

function paragraph(len){
	var par = [];
	par.push("\t");
	while(len !== 0){
		par.push(sentence());
		par.push(" ");
		len--;
	}
	return par.join("");
}

function babble(pars, sents){
	var bab = [];
	while(pars !== 0){
		bab.push(paragraph(sents));
		bab.push("\n");
		pars--;
	}
	return bab;
}