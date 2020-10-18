const container = document.querySelector(".container");
const loginPage = document.querySelector(".login");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const rules = document.querySelector(".rules");
const quiz = document.querySelector(".quiz");
const checkButton = document.querySelector("#accept");
const result = document.querySelector(".result");

const ques = document.querySelector(".que");
const op1 = document.querySelector("#opt1");
const op2 = document.querySelector("#opt2");
const op3 = document.querySelector("#opt3");
const op4 = document.querySelector("#opt4");

const showAns = document.querySelector(".cor__ans");
const showAnsBlock = document.querySelector(".correct__ans");

const prevBtn = document.querySelector('#previous');
const nextBtn = document.querySelector('#next');

const loadLogin = () => {
    // Display Login Page
    loginPage.style.display = "inline-block";

    // Fill username and password values
    username.value = "admin";
    password.value = "admin";
};

const validateUser = async () => {

    // Fetch the user accounts from json
    const result = await fetch("data/accounts.json");
    const data = await result.json();

    const accounts = data.accounts;

    const index = accounts.findIndex((el) => el.username === username.value);

    if (index === -1 || accounts[index].password !== password.value) {
        alert("Enter admin as username and admin as password");
    } else {

        // Hide login page and display rules page
        loginPage.style.display = "none";
        rules.style.display = "inline-block";
    }
};

const validateCheck = () => {
    if (!checkButton.checked) {
        alert("Check the I Agree button before proceeding");
    } else {
        return true;
    }
};

var questions = [];
var queToAsk = 0;
var userAnswers = [];

const startQuiz = async () => {
    // Validate the checked button
    const check = validateCheck();

    if (check) {
        rules.style.display = "none";
        quiz.style.display = "inline-block";
    }

    // Fetch the questions from json
    const result = await fetch("data/data.json");
    const data = await result.json();

    questions = data.questions;

    loadQuestion();
};

const loadQuestion = () => {
    //console.log(questions);

    // Render the question
    ques.innerHTML = questions[queToAsk].question;
    op1.innerHTML = questions[queToAsk].options[0];
    op2.innerHTML = questions[queToAsk].options[1];
    op3.innerHTML = questions[queToAsk].options[2];
    op4.innerHTML = questions[queToAsk].options[3];

    if(queToAsk === 0) {
        prevBtn.disabled = true;
    } else {
        prevBtn.disabled = false;
    }

    if(queToAsk === questions.length - 1) {
        nextBtn.textContent = 'Submit';
    } else {
        nextBtn.textContent = 'Next';
    }
};

const showAnswer = (option) => {
    // Get all the options
    const options = document.getElementsByClassName('option');

    // Uncheck all options
    for(var i=0 ; i<options.length ; i++){
        options[i].firstElementChild.checked = false;
    }

    // Check the one which was selected
    option.firstElementChild.checked = true;
    
    // Render correct answer
    showAns.innerHTML = "Correct Answer: " + questions[queToAsk].correctAnswer;
    showAnsBlock.style.display = "block";
    
    // Store the answer to answers array
    initialiseUserAnswerMap(option);
};

const initialiseUserAnswerMap = (option) => {
    if(option.firstElementChild.checked) {
        var spanElement = option.getElementsByTagName("span");
        userAnswers[queToAsk] = spanElement[0].textContent;
        //console.log(userAnswers);
    }
};

const next = () => {

    if(!userAnswers[queToAsk]) {
        alert('Please select a value before proceeding!');
    }  else {

        showAnsBlock.style.display = "none";

        clearAllInputs();
        
        queToAsk++;

        if(queToAsk === questions.length) {
            showResults();
            return;
        }

        loadQuestion();

        if(queToAsk < userAnswers.length) {
            loadInputs();
        }
    }
}

const clearAllInputs = () => {

    // Targetting all inputs
    var chkBox = document.getElementsByClassName('input-check');

    for(var i=0 ; i<chkBox.length ; i++){
        if(chkBox[i].checked) {
            chkBox[i].checked = false;
        }
    }
}

const prev = () => {

    // Hide the answer block
    showAnsBlock.style.display = "none";

    // Clear all inputs
    clearAllInputs();

    // Load previous question
    queToAsk--;
    loadQuestion();

    // Load the previous question input
    loadInputs();
}

const loadInputs = () => {
    // Targetting all span elements
    var spanTags = document.getElementsByClassName('checkmark');

    // Convert span list to array
    const spanArray = Array.from(spanTags);

    const i = spanArray.findIndex(el => el.textContent === userAnswers[queToAsk]);
    
    // Render the selected input
    document.getElementById('radio-' + i).checked = true;
}

const showResults = () => {
    quiz.style.display = "none";
    result.style.display = "inline-block";

    const {right, wrong} = rightWrong();
    const pc = parseInt((right/questions.length) * 100);
    
    document.querySelector('.result__score').innerHTML = 'Your Result is: ' + pc + '%';
    document.querySelector('.questions').innerHTML = 'Total number of Questions: ' + questions.length;
    document.querySelector('.wrong__que').innerHTML = 'Total number of Wrong Answer: ' + wrong;
    document.querySelector('.correct__que').innerHTML = 'Total number of Correct Answer: ' + right;

    const msg = document.querySelector('.result__res-1');

    if(pc < 50) {
        msg.innerHTML = 'Work Hard! Your Score is not upto the mark.'
    } else if(pc > 50 && pc < 80) {
        msg.innerHTML = 'Good Work! You can do better.'
    } else {
        msg.innerHTML = 'Excellent Job!! You are doing Great.';
    }

    for(var i=0 ; i<questions.length ; i++) {
        renderQuiz(i);
    }
}

const rightWrong = () => {
    var right = 0;
    var wrong = 0;

    for(var i=0 ; i<userAnswers.length ; i++) {
        if(userAnswers[i] === questions[i].correctAnswer) {
            right++;
        } else {
            wrong++;
        }
    }
    return {
        right,
        wrong
    }
}

const renderQuiz = (index) => {

    const table = document.querySelector('.quiz__table');
    
    const markup = `
    <tr>
        <th>${index+1}</th>
        <th>${userAnswers[index]}</th>
        <th>${(userAnswers[index] === questions[index].correctAnswer) ? "1 Mark" : "0 Mark"}</th>
    </tr>
    `;

    table.insertAdjacentHTML('beforeend', markup);

}