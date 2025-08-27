// Andoni Garcia's Markov Babbler in JS. 2014

function babblePageRender(text1, bool){
        var text2 = "Sentences: ";
        var text3 = "Paragraphs: ";
        var text4 = "Ready, Set, Babble!";
        var br = $("<br />");
        var br2 = $("<br />");
        if(bool){
            var button1 = $("<button></button>")
                    .attr({"type":"button","disabled":"disabled","id":"descript"})
                    .append(text1);
        } else if (!bool){
            var button1 = $("<input></input>")
                    .attr({"type":"file","id":"files","name":"files[]","multiple":"multiple","required":"required"});
        }
        var input1 = $("<input></input")
                .attr({"type":"number","name":"sentences","min":"1","max":"10","step":"1","value":"3"});
        var label1 = $("<label></label")
                .append(text2, input1);
        var input2 = $("<input></input>")
                .attr({"type":"number","name":"paragraphs","min":"1","max":"5","step":"1","value":"2"});
        var label2 = $("<label></label")
                .append(text3, input2);
        var button2 = $("<button></button>")
                .attr({"type":"button","id":"StartBabble"})
                .append(text4);
        var form = $("<form></form>")
                .attr("name","userInput")
                .append(label1, label2, br2, button2);        
        var div1 = $("<div></div>")
                .attr("class","forms")
                .append(button1, br, form);
        var div2 = $("<div></div>")
                .attr("id","writeHere");
        $("#contentSection")
                .empty()
                .append(div1, div2);    
}

function notReadyYet(s){
    var text = "Sorry we are still working to compile the manuscripts for the ";
    text += s;
    text += ". We will be fully functional soon! For now, Huckleberry Finn works and you should check it out!";
    var para = $("<p></p>")
            .append(text);
    $("#writeHere")
            .empty()
            .append(para);
}

$(document).ready(function(){
    $("#about").click(function(){
        var text1 = $("<p></p>").text("A Markov Chain is a weighted directed graph that maps possible next states from your current state based on their probability. As such, from each point in the chain, you stochastically (and in our case pseud-randomly) move to a next possible point based on the probability of the next point occuring from your current point.");
        var text2 = $("<p></p>").text("Markov Babbling applies this concept of Markov Chains to word choice. We analyze a piece of text (say Shakepeare's Sonnets or Huckleberry Finn) to make our model. Then from a given word (A capital first word as a starting point), we see the probability of the words that follow after in the text. Using our pseudo-random generator, we then take the path of possible next words, writing a somewhat coherent sentence. The eventual application of this is to be able to create rhyming raps based on more sophisticated models or reproduce coherent articles based on a subject. Markov Babbling has been seen in many different contexts, and here is my project playing around with them! Hope you enjoy, and if you have any feedback, feel free to contact me!");

        $("#contentSection").empty()
                .append(text1, text2)
                .css("font-size", "20px");
    });
    
    $("#contact").click(function(){
        var anch1 = $("<a></a>").text("Andoni M. Garcia")
                .attr("href","http://andonigarcia.com")
                .attr("target","_blank")
                .css({"font-size":"32px","font-family":"impact, serif","text-decoration":"underline","color":"#580c64"});
        var anch2 = $("<a></a>").text("andoni@uchicago.edu")
                .attr("href","mailto:andoni@uchicago.edu")
                .attr("target","_blank")
                .css({"font-size":"24px","text-decoration":"underline","color":"#580c64"});
        var text1 = $("<p></p>").append(anch1);
        var text2 = $("<p></p>").append(anch2);
        var text3 = $("<p></p>").text("I am a junior at the University of Chicago, just having fun. I am a frontend web developer playing around with a couple things on my mind. I also am co-founder of a developing start-up. Click my name to see my full bio and website, or checkout my GitHub repo to see some of my public projects.")
                .css("font-size","20px");
        
        $("#contentSection").empty()
                .append(text1, text2, text3);
    });
    
    $("#middleNav").hover(function(){
        $(".navList").slideDown(100);
    },function(){
        $(".navList").slideUp(100);
    });
    
    $("#firstChoice").click(function(){
        babblePageRender("Huckleberry Finn", true);
        TABLE = TABLE_ARRAY[0];
        $("#StartBabble").click(function(){
           start(this.form.sentences.value, this.form.paragraphs.value); 
        });
    });
    
    $("#shakeSpeare").click(function(){
        TABLE = new htable(157);
        babblePageRender("Shakespeare Sonnets", true);
        $("#StartBabble").click(function(){
           notReadyYet("Shakespeare Sonnets"); 
        });
    });
    
    $("#rapGen").click(function(){
        TABLE = new htable(157);
        babblePageRender("Rap Generator", true);
        $("#StartBabble").click(function(){
           notReadyYet("Rap Generator"); 
        });
    });
    
    $("#lastChoice").click(function(){
        TABLE = new htable(157);
        testTable = TABLE;
        babblePageRender("Input Text", false);
        document.getElementById('files').addEventListener('change', handleFileSelect, false);
        $("#StartBabble").click(function(){
            if($("#files").val() === ""){
                var text = "You must input a file first!";
                var para = $("<p></p>")
                    .append(text);
                $("#writeHere")
                    .empty()
                    .append(para);
            } else {
                start(this.form.sentences.value, this.form.paragraphs.value);
            }
        });
    });
    
    $("#landingButton").click(function(){
        TABLE = TABLE_ARRAY[0];
        start(this.form.sentences.value, this.form.paragraphs.value); 
    });
});

