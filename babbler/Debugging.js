// Andoni Garcia's Markov Babbler in JS. 2014

// =====================================================================
// ====================== Debugging Functions ==========================
// =====================================================================

function printList(l){
	var list = l;
	while(list !== undefined){
		console.log("\t"+list.word+" - "+list.count);
		list = list.nextWord;
	}
	return;
}

function printEntry(e){
	var entry = e;
	console.log("   "+entry.word+" - "+entry.count);
	printList(entry.nextWord);
	return;
}

function printBucket(b){
	var bckt = b;
	while(bckt !== undefined){
		printEntry(bckt.e);
		bckt = bckt.nextBucket;
	}
	return;
}

function printHtable(){
	console.log(TABLE.nBuckets+" buckets");
	for(var i = 0; i < TABLE.nBuckets; i++){
		console.log(i+"\n");
		printBucket(TABLE.buckets[i]);
	}
	console.log("END\n");
}