
let en = ['`','1','2','3','4','5','6','7','8','9','0','-','=','Backspace',
    'Tab','q','w','e','r','t','y','u','i','o','p','[',']','\\', 'Delete',
    'CapsLock','a','s','d','f','g','h','j','k','l',';','\'','Enter',
    'Shift','z','x','c','v','b','n','m',',','.','/','Up','Shift',
    'Ctrl','Win','Alt',' ','Alt','Fn','Ctrl','Left','Down','Right'
];

let enCaps = ['`','1','2','3','4','5','6','7','8','9','0','-','=','Backspace',
    'Tab','Q','W','E','R','T','Y','U','I','O','P','[',']','\\', 'Delete',
    'CapsLock','A','S','D','F','G','H','J','K','L',';','\'','Enter',
    'Shift','Z','X','C','V','B','N','M',',','.','/','Up','Shift',
    'Ctrl','Win','Alt',' ','Alt','Fn','Ctrl','Left','Down','Right'
];

let enShift = ['~','!','@','#','$','%','^','&','*','(',')','_','+','Backspace',
    'Tab','Q','W','E','R','T','Y','U','I','O','P','{','}','|', 'Delete',
    'CapsLock','A','S','D','F','G','H','J','K','L',':','"','Enter',
    'Shift','Z','X','C','V','B','N','M','<','>','?','Up','Shift',
    'Ctrl','Win','Alt',' ','Alt','Fn','Ctrl','Left','Down','Right'
];

let ru = ['ё','1','2','3','4','5','6','7','8','9','0','-','=','Backspace',
    'Tab','й','ц','у','к','е','н','г','ш','щ','з','х','ъ','\\', 'Delete',
    'CapsLock','ф','ы','в','а','п','р','о','л','д','ж','э','Enter',
    'Shift','я','ч','с','м','и','т','ь','б','ю','.','Up','Shift',
    'Ctrl','Win','Alt',' ','Alt','Fn','Ctrl','Left','Down','Right'
];

let ruCaps = ['Ё','1','2','3','4','5','6','7','8','9','0','-','=','Backspace',
    'Tab','Й','Ц','У','К','Е','Н','Г','Ш','Щ','З','Х','Ъ','\\', 'Delete',
    'CapsLock','Ф','Ы','В','А','П','Р','О','Л','Д','Ж','Э','Enter',
    'Shift','Я','Ч','С','М','И','Т','Ь','Б','Ю','.','Up','Shift',
    'Ctrl','Win','Alt',' ','Alt','Fn','Ctrl','Left','Down','Right'
];

let ruShift = ['Ё','!','"','№',';','%',':','?','*','(',')','_','+','Backspace',
    'Tab','Й','Ц','У','К','Е','Н','Г','Ш','Щ','З','Х','Ъ','/', 'Delete',
    'CapsLock','Ф','Ы','В','А','П','Р','О','Л','Д','Ж','Э','Enter',
    'Shift','Я','Ч','С','М','И','Т','Ь','Б','Ю',',','Up','Shift',
    'Ctrl','Win','Alt',' ','Alt','Fn','Ctrl','Left','Down','Right'
];

let keyCodes = [
    192, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 187, 8,
    9, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 220, 46,
    20, 65, 83, 68, 70, 71, 72, 74, 75, 76, 186, 222, 13,
    16, 90, 88, 67, 86, 66, 78, 77, 188, 190, 191, 38, 16,
    17, 91, 18, 32, 18, 93, 17, 37, 40, 39
];

// true = en, false = ru
if(localStorage.en == undefined){
    var currentLanguage = en;
    localStorage.setItem('en', true);
} 
else if(localStorage.getItem('en') == "true"){
    var currentLanguage = en;
}
else var currentLanguage = ru;

let currentlyPressed = [];
let capsIsOn = false;
let str = "";

//base
let temp = document.body.appendChild(document.createElement('div'));
temp.classList.add("wrapper");
temp = document.querySelector(".wrapper").appendChild(document.createElement('div'));
temp.classList.add("center-block");
temp = document.querySelector(".center-block").appendChild(document.createElement('textarea'));
temp.classList.add("textarea");
temp = document.querySelector(".center-block").appendChild(document.createElement('div'));
temp.classList.add("keyboard");
temp = document.querySelector(".keyboard").appendChild(document.createElement('div'));
temp.classList.add("capsIndicator");


//keys initialization
function keysInit(){
    for(let i = 0; i < currentLanguage.length; i++){
        temp = document.querySelector(".keyboard").appendChild(document.createElement('div'));
        temp.classList.add("key");
        document.querySelectorAll('.key')[i].innerHTML = currentLanguage[i];
    }
}

//keys reinit in case of language/register change
function keysRedo(arr){
    for(let i = 0; i < arr.length; i++){
        document.querySelectorAll('.key')[i].innerHTML = arr[i];
    }
}

keysInit();

//special keys
document.querySelectorAll('.key')[13].classList.add("key-doubleSize"); 
document.querySelectorAll('.key')[29].classList.add("key-doubleSize"); 
document.querySelectorAll('.key')[41].classList.add("key-doubleSize"); 
document.querySelectorAll('.key')[42].classList.add("key-doubleSize"); 
document.querySelectorAll('.key')[55].classList.add("key-doubleSize"); 
document.querySelectorAll('.key')[58].classList.add("key-spacebar"); 

//keyboard listeners
document.addEventListener("keydown", keyDown, false);
document.addEventListener("keydown", languageChange, false);
document.addEventListener("keydown", toggleShiftOn, false);
document.addEventListener("keyup", keyUp, false);
document.addEventListener("keyup", toggleCaps, false);
document.addEventListener("keyup", toggleShiftOff, false);

//mouse listeners
for(let i = 0; i < currentLanguage.length; i++){
    document.querySelectorAll('.key')[i].addEventListener("mousedown", mouseDown);
    document.querySelectorAll('.key')[i].addEventListener("mouseup", mouseUp);
    document.querySelectorAll('.key')[i].onmouseout = mouseLeave;
}

document.querySelector(".textarea").focus();

//disable alt so keyboard doesn't lose focus 
document.onkeydown = function() 
{
    if(event.keyCode == 18) 
    {
        event.returnValue = false;
        return false;
    }
}

function keyDown(e) {
    //changing color on key press
    let keyCode = e.keyCode;
    
    //if right special keys are pressed
    if(e.code == "ControlRight") document.querySelectorAll('.key')[61].style.cssText = "background-color: #0F7B99; border-radius: 17px; !important";
    else if(e.code == "ShiftRight") document.querySelectorAll('.key')[54].style.cssText = "background-color: #0F7B99; border-radius: 17px; !important";
    else if(e.code == "AltRight") document.querySelectorAll('.key')[59].style.cssText = "background-color: #0F7B99; border-radius: 17px; !important";
    else if(document.querySelectorAll('.key')[keyCodes.indexOf(keyCode)] != undefined){
        document.querySelectorAll('.key')[keyCodes.indexOf(keyCode)].style.cssText = "background-color: #0F7B99; border-radius: 17px; !important";
    }
    
    if(e.key != "Shift" && e.key != "Control" && e.key != "Tab" && e.key != "Alt" && e.key != "ContextMenu" && e.key != "Backspace" && e.key != "Delete" && e.key != "CapsLock"
    && e.key != "ArrowLeft" && e.key != "ArrowUp" && e.key != "ArrowDown" && e.key != "ArrowRight"){
        let t = document.querySelector(".textarea");
        str = str.slice(0, t.selectionStart ) + e.key + str.slice(t.selectionEnd, str.length);
    }


    //delete char from textarea string if backspace is pressed
    if(keyCode == 8){
        let t = document.querySelector(".textarea");
        if(t.selectionStart == t.selectionEnd) str = str.slice(0, t.selectionStart - 1) + str.slice(t.selectionEnd, str.length);
        else str = str.slice(0, t.selectionStart ) + str.slice(t.selectionEnd, str.length);
    }

    if(keyCode == 46){
        let t = document.querySelector(".textarea");
            if(t.selectionStart == t.selectionEnd) str = str.slice(0, t.selectionStart) + str.slice(t.selectionEnd + 1, str.length);
            else str = str.slice(0, t.selectionStart) + str.slice(t.selectionEnd, str.length);
    }
    //pushing to an array of currently pressed keys
    if(!currentlyPressed.includes(keyCode)) currentlyPressed.push(e.keyCode);
}

function keyUp(e) {
    //changing color back
    let keyCode = e.keyCode;
    if(e.code == "ControlRight") document.querySelectorAll('.key')[61].style.cssText = null;
    else if(e.code == "ShiftRight") document.querySelectorAll('.key')[54].style.cssText = null;
    else if(e.code == "AltRight") document.querySelectorAll('.key')[59].style.cssText = null;
    else if(document.querySelectorAll('.key')[keyCodes.indexOf(keyCode)] != undefined){
        document.querySelectorAll('.key')[keyCodes.indexOf(keyCode)].style.cssText = null;
    }

    //removing from the array of currently pressed keys
    currentlyPressed.splice(currentlyPressed.indexOf(keyCode),1);
}

function languageChange(){
    //check if both shift and alt are pressed
    if(currentlyPressed.includes(18) && currentlyPressed.includes(16)){
        if(currentLanguage == en){
            currentLanguage = ru;
            keysRedo(ru);
        }

        else if(currentLanguage == ru){
            currentLanguage = en;
            keysRedo(en);
        }
        
        else if(currentLanguage == enCaps){
            currentLanguage = ruCaps;
            keysRedo(ruCaps);
        }

        else if(currentLanguage == ruCaps){
            currentLanguage = enCaps;
            keysRedo(enCaps);
        }

        else if(currentLanguage == enShift){
            currentLanguage = ruShift;
            keysRedo(ruShift);
        }

        else if(currentLanguage == ruShift){
            currentLanguage = enShift;
            keysRedo(enShift);
        }

    } 
}

function toggleShiftOn(e){
    if(e.keyCode == 16){
        if(currentLanguage == en && capsIsOn == false){
            keysRedo(enShift);
            currentLanguage = enShift;
        }

        else if(currentLanguage == ru && capsIsOn == false){
            keysRedo(ruShift);
            currentLanguage = ruShift;
        }

        else if(currentLanguage == ruCaps){
            keysRedo(ru);
            currentLanguage = ru;
        }

        else if(currentLanguage == enCaps){
            keysRedo(en);
            currentLanguage = en;
        }
    }
}

function toggleShiftOff(e){
    if(e.keyCode == 16 && capsIsOn == false){
        if(currentLanguage == enShift){
            keysRedo(en);
            currentLanguage = en;
        }

        else if(currentLanguage == ruShift){
            keysRedo(ru);
            currentLanguage = ru;
        }
    }

    else if(e.keyCode == 16 && capsIsOn == true){
        if(currentLanguage == en){
            keysRedo(enCaps);
            currentLanguage = enCaps;
        }

        else if(currentLanguage == ru){
            keysRedo(ruCaps);
            currentLanguage = ruCaps;
        }
    }
}

function toggleCaps(e){
    //toggle caps and change state of capsIsOn
    if(e.keyCode == 20){

        if(capsIsOn == false){
            capsIsOn = true;
            document.querySelector(".capsIndicator").classList.add("caps-active");
            if(currentLanguage == en || currentLanguage == enShift){
                keysRedo(enCaps);
                currentLanguage = enCaps;
            } 

            else{
                keysRedo(ruCaps);
                currentLanguage = ruCaps;
            }
        }

        else{
            capsIsOn = false;
            document.querySelector(".capsIndicator").classList.remove("caps-active");
            if(currentLanguage == enCaps){
                keysRedo(en);
                currentLanguage = en;
            }

            else{
                keysRedo(ru);
                currentLanguage = ru;
            }
        }
    }
}

function toggleCapsOnClick(){
    //same as toggleCaps but on mouse click
    if(capsIsOn == false){
        capsIsOn = true;
        document.querySelector(".capsIndicator").classList.add("caps-active");
        if(currentLanguage == en || currentLanguage == enShift){
            keysRedo(enCaps);
            currentLanguage = enCaps;
        } 

        else{
            keysRedo(ruCaps);
            currentLanguage = ruCaps;
        }
    }

    else{
        capsIsOn = false;
        document.querySelector(".capsIndicator").classList.remove("caps-active");
        if(currentLanguage == enCaps){
            keysRedo(en);
            currentLanguage = en;
        }

        else{
            keysRedo(ru);
            currentLanguage = ru;
        }
    }
}

function mouseDown(e){
    //change color on mouseclick
    e.target.style.cssText = "background-color: #0F7B99; border-radius: 17px; !important";
}

function mouseUp(e){

    if(e.which == 1){
        //change color back to normal
        e.target.style.cssText = null;
        let start = 0, end = 0;
        //if special key is clicked
        if(e.target.innerHTML == "Tab") str = str + "   ";
        else if(e.target.innerHTML == "Backspace"){
            let t = document.querySelector(".textarea");
            start = t.selectionStart;
            end = t.selectionEnd;

            if(t.selectionStart == t.selectionEnd && start >= 1){
                str = str.slice(0, t.selectionStart - 1) + str.slice(t.selectionEnd, str.length);
            }
            else{
                str = str.slice(0, t.selectionStart) + str.slice(t.selectionEnd, str.length);
            }
        } 
        else if(e.target.innerHTML == "Delete"){
            let t = document.querySelector(".textarea");
            start = t.selectionStart + 1;
            end = t.selectionEnd + 1;
            if(t.selectionStart == t.selectionEnd) str = str.slice(0, t.selectionStart) + str.slice(t.selectionEnd + 1, str.length);
            else str = str.slice(0, t.selectionStart) + str.slice(t.selectionEnd, str.length);
        }
        else if(e.target.innerHTML == "Enter") str = str + "\n";
        else if(e.target.innerHTML == "CapsLock") toggleCapsOnClick();
        else if(e.target.innerHTML == "Left"){
            let t = document.querySelector(".textarea");
            if(t.selectionStart > 0){
                start = t.selectionStart;
                end = t.selectionEnd;
            }
        }
        else if(e.target.innerHTML == "Right"){
            let t = document.querySelector(".textarea");
            if(t.selectionStart < str.length){
                start = t.selectionStart + 2;
                end = t.selectionEnd + 2;
            }
        }
        else if(e.target.innerHTML == "Shift" || e.target.innerHTML == "Ctrl" || e.target.innerHTML == "Fn" || e.target.innerHTML == "Alt" || e.target.innerHTML == "Win" || e.target.innerHTML == "Right" || e.target.innerHTML == "Left") str = str + '';
        else{
            let t = document.querySelector(".textarea");
            str = str = str.slice(0, t.selectionStart ) + e.target.innerHTML + str.slice(t.selectionEnd, str.length);
            start = t.selectionStart + 2;
            end = t.selectionEnd + 2;
        }

        document.querySelector('textarea').value = str;
        document.querySelector(".textarea").focus();
        if(start > 0){
            document.querySelector(".textarea").setSelectionRange(start - 1, end - 1);
        }

        else document.querySelector(".textarea").setSelectionRange(start, end);
    }

}

function mouseLeave(e){
    //change color of the key to normal if mouse leaves button w/o mouseUp
    if(capsIsOn == false && !currentlyPressed.includes(16)){
        document.querySelectorAll('.key')[currentLanguage.indexOf(e.target.innerHTML)].style.cssText = null;
    }

    else{

        if(currentLanguage == en){
            if(capsIsOn == true) document.querySelectorAll('.key')[enCaps.indexOf(e.target.innerHTML)].style.cssText = null;
            else document.querySelectorAll('.key')[enShift.indexOf(e.target.innerHTML)].style.cssText = null;
        }

        else{
            if(capsIsOn == true) document.querySelectorAll('.key')[ruCaps.indexOf(e.target.innerHTML)].style.cssText = null;
            else document.querySelectorAll('.key')[ruShift.indexOf(e.target.innerHTML)].style.cssText = null;
        }
    }
}

window.onbeforeunload = function() {
    //add language to locale storage before exiting
    if(currentLanguage == en || currentLanguage == enShift || currentLanguage == enCaps) localStorage.setItem('en', true);
    else localStorage.setItem('en', false);
  };