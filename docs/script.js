class QuestionABCD {
    constructor(name, question, answers) {
        this.name = name;
        this.question = question;
        this.answers = answers;
    }
}

let loadingCircle = '<span class=\"loading\"\>\n\t<span class=\"inside\"\>\n\t\t<span class=\"anim\">\n\t\t</span\>\n\t</span\>\n</span>'

let questions = new Array();
questions.push(new QuestionABCD("1", "Question 1?", ["a1", "b1", "c1", "d1"]));
questions.push(new QuestionABCD("2", "Question 2?", ["a2", "b2", "c2", "d2"]));
questions.push(new QuestionABCD("3", "Question 3?", ["a3", "b3", "c3", "d3"]));

let definitions = new Array(); 
definitions.push("you are definitely A person");
definitions.push("you are definitely B person");
definitions.push("you are definitely C person");
definitions.push("you are definitely D person");

let checkedAnswers = [];
let progress = 0;
let maxProgress = questions.length;

let INTERVAL;
let INTERVAL_DELETE;
let TIMEOUT;
let TIMEOUT_QUESTION;

function getPercentage(value, of ) {
    let result = (value / of ) * 100;
    return result.toFixed(0);
}

async function typeEffect(element, context) {

    clearInterval(INTERVAL);
    clearInterval(INTERVAL_DELETE);
    clearTimeout(TIMEOUT);

    let varIndex = element.textContent.length - 1;
    let oldTextContent = element.textContent;

    INTERVAL_DELETE = setInterval(() => {
        if (varIndex < 1) {
            clearInterval(INTERVAL_DELETE);
            element.textContent = "";
        } else {

            let text = oldTextContent.substring(0, varIndex - 1);
            element.textContent = text;
            varIndex--;
        }
    }, 50);

    TIMEOUT = setTimeout(function () {
        varIndex = 0;

        INTERVAL = setInterval(() => {
            let text = context.substring(0, varIndex + 1);
            element.textContent = text;
            varIndex++;

            if (varIndex == context.length)
                clearInterval(INTERVAL);
        }, 100);
    }, 50 * (oldTextContent.length) + 500);

}

window.addEventListener("load", function (event) {

    updateProgressBar();
    loadFirstQuestion(); 

    let leftNavBtn = document.getElementById("btn-left");
    let rightNavBtn = document.getElementById("btn-right");

    leftNavBtn.addEventListener("click", leftNavBtnClicked);
    rightNavBtn.addEventListener("click", rightNavBtnClicked);


    ["a-ans", "b-ans", "c-ans", "d-ans"].forEach(function (id) {
        let radiobutton = document.getElementById(id);
        radiobutton.addEventListener("click", enableForward);
    });

    function enableForward() {
        var selected = document.querySelector('input[type=radio][name=question-1]:checked');
        checkedAnswers[progress] = selected.value;
        rightNavBtn.classList.remove("disabled");
    }

    function leftNavBtnClicked() {
        progress--;
        if (progress < (maxProgress - 1))
            rightNavBtn.classList.remove("disabled");

        updateQuestion();
    }

    function rightNavBtnClicked() {

        progress++;
        if (progress > 0)
            leftNavBtn.classList.remove("disabled")
        if (progress == maxProgress) {
            endOfQuiz();
        } else {
            updateQuestion();
        }
    }

    function endOfQuiz(){

        updateProgressBar(); 

        clearInterval(INTERVAL_DELETE);
        clearInterval(INTERVAL);
        clearTimeout(TIMEOUT);

        let suerveyDiv = document.getElementById("survey");
        suerveyDiv.classList.add("opacity-0")
        setTimeout(()=>{
            while(suerveyDiv.firstChild){
                suerveyDiv.removeChild(suerveyDiv.firstChild);
            }
            setTimeout(()=>{
                suerveyDiv.innerHTML = loadingCircle;
                suerveyDiv.classList.remove("opacity-0");
                setTimeout(()=>{
                    suerveyDiv.classList.add("opacity-0");
                    setTimeout(() => {
                        let result = processResults();
                        console.log(result);
                        displayResults(suerveyDiv, result);
                        suerveyDiv.classList.remove("opacity-0");
                    }, 1000);
                }, 3000);
            }, 1000);
        }, 1000);
    }

    function displayResults(element, result){
        let abcd = ['a','b','c','d'];
        element.innerHTML = '<div class="chart"></div><div class="legend"></div>'
        let chart = document.querySelector(".chart");
        let legend = document.querySelector(".legend");
        for(let i = 0 ; i < 4; i ++){
            let bar = document.createElement("div")
            bar.classList.add("bar");
            bar.innerHTML = '<div class="fill-bar a-color"></div>'
            bar.innerHTML = '<div style="height:'+result[i]+'%" class="fill-bar '+abcd[i]+'-color"></div>'
            chart.appendChild(bar);
        }

        for(let i = 0 ; i < 4; i ++){
            let box = document.createElement("span");
            let tag = document.createElement("span");
            let space = document.createElement("span");
            space.classList.add("space");
            box.classList.add("color-box");
            box.classList.add((abcd[i]+"-color"));
            tag.innerHTML = abcd[i].toUpperCase();
            legend.appendChild(box);
            legend.appendChild(tag);
            if(i!=3)
                legend.appendChild(space);
        }

        for(let i = 0; i < 4; i++){
            let def = document.createElement("p");
            def.classList.add("definition");
            def.innerHTML="<b>"+abcd[i].toUpperCase()+"</b> - "+definitions[i];
            element.appendChild(def);
        }
    }

    function updateProgressBar() {
        let progressBar = document.getElementById("progress-made");
        progressBar.style.width = getPercentage(progress, maxProgress) + "%";
    }

    function loadFirstQuestion() {
        let question = document.getElementById("question");
        let answers = document.getElementsByTagName("label");
       
        question.textContent = questions[progress].question;

        for (i = 0; i < 4; i++) {
            answers[i].textContent = questions[progress].answers[i];
        }
    }


    function processResults() {
        let abcd = [0,0,0,0]
        for(let i = 0; i < checkedAnswers.length; i++){
            switch(checkedAnswers[i]){
                case "a":
                    abcd[0]++;
                    break; 
                case "b":
                    abcd[1]++; 
                    break; 
                case "c":
                    abcd[2]++;
                    break; 
                case "d": 
                    abcd[3]++;
                    break;
            }
        }

        let result = [];
        result[0] = getPercentage(abcd[0], maxProgress);
        result[1] = getPercentage(abcd[1], maxProgress);
        result[2] = getPercentage(abcd[2], maxProgress);
        result[3] = getPercentage(abcd[3], maxProgress);
        
        return result;
    }

    function indexOfMax(array){
        let max = array[0];
        let index = 0; 

        for(let i = 1; i < array.length; i++){
            if(array[i] > max){
                max = array[i];
                index = i;
            }
        }

        return index;
    }

    function updateQuestion() {

        clearTimeout(TIMEOUT_QUESTION);

        if (checkedAnswers.length > progress) {
            var selected = document.querySelector("input[type=radio][name=question-1][value=" + checkedAnswers[progress] + "]");
            selected.checked = true;
        } else {
            ["a-ans", "b-ans", "c-ans", "d-ans"].forEach(function (id) {
                let radiobutton = document.getElementById(id);
                if (radiobutton.checked) {
                    radiobutton.checked = false;
                }
            });
            rightNavBtn.classList.add("disabled");
        }

        setTimeout(() => {

            let question = document.getElementById("question");
            let answers = document.getElementsByTagName("label");
            typeEffect(question, questions[progress].question);
            //question.textContent = questions[progress].question;

            for (i = 0; i < 4; i++) {
                answers[i].textContent = questions[progress].answers[i];
            }

            updateProgressBar()

        }, 500);

    }
})