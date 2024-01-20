let languageNames = null;
let languages_list = new Map();
let langKey = null;

var points = 0;
var playtimer = 0;
var correctBtn = -1;
var isRunning = false;
var interval_id = -1;
const readmeUrl = "https://raw.githubusercontent.com/leachim6/hello-world/main/readme.md";
function inputsource(element) {    
    if($(element).attr("for") === "sourceBtnGuthub") {
        $.get(readmeUrl, (data)=>initialize(data));
    }
}

function initialize(content) {
    const beginIndex = content.indexOf("## Languages ");
    const endIndex = content.lastIndexOf("<!--Languages end-->");
    lines = content.substr(beginIndex, endIndex - beginIndex).split("](");
    for (let index = 0 ; index <= lines.length-2 ; index++) {
        langName = lines[index].split("\n* ")[1];
        langUrl = lines[index].split("\n* ")[0];
        key = langName.substr(1, langName.length);
        value = langUrl.substr(0, langUrl.length-1);
        if(languages_list.has(key))
            key = value.substr(value.lastIndexOf("/"), value.length - value.lastIndexOf("/"));
        languages_list.set(key, value);
    }
    var _oldKey = "";
    for (const key of languages_list.keys()) {
        if(_oldKey !== ""){
            languages_list.set(_oldKey, languages_list.get(key));
        }
        _oldKey = key;
    }
    languageNames = Array.from(languages_list.keys());
    printRandomCode();
    $("#length").text(languages_list.size);
    setTimeout(() => {
        $("#status").text("Press Here to Test your knowledge now")
    }, 3000);
    showActions();
}

function printRandomCode() {
    var number = getRandomInt(0, languages_list.size);
    langKey = languageNames[number];
    language_path = decodeURI(languages_list.get(langKey));
    language_url = "https://raw.githubusercontent.com/leachim6/hello-world/main/"+language_path;
    $.get(language_url, (data)=>{
        $("#codePath").attr("href", "https://github.com/leachim6/hello-world/tree/main/"+language_path);
        $("#codeName").text(langKey);
        $("#codearea").text(data);
        $("#codearea").removeAttr("class")
        $("#codearea").removeAttr("data-highlighted")
        hljs.highlightAll();
        if(playtimer == 5){
            playReady();
        }
    });
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function showActions() {
    $("#languageSource")[0].style.display = "none";
    $("#Actions")[0].style.display = "inline";
}

function playReady() {
    correctBtn = getRandomInt(0, 4);
    $("#btnAction-"+correctBtn).text(langKey);
    for (let index = 0; index < 4; index++) {
        if (correctBtn != index) {
            text = langKey;
            while(text === langKey){
                text = languageNames[getRandomInt(0, languages_list.size)];
            }
            $("#btnAction-"+index).text(text);
        }
    }
    $("#playpart")[0].style.display = "inline";
    isRunning = true;
}

function go() {
    if(playtimer <= 0)
        points = 0;
    playtimer = 5;
    printRandomCode();
    chnagebarstatus("none");
    clearInterval(interval_id);
    interval_id = setInterval(() => {
        if(playtimer <= 0){
            kill();
        }else {
            $("#progress")[0].style.width = ((100/5)*playtimer-1)+"%"
            if(isRunning)
                playtimer--;
        }
    }, 1000);
}

function kill() {
    isRunning = false;
    clearInterval(interval_id);
    chnagebarstatus("block");
    $("#playpart")[0].style.display = "none";
    $("#status").html("Your point is "+points+"<br>The language was "+langKey+"<br>Press Here to Test your knowledge now");
    points = 0;
}

function chnagebarstatus(display) {
    let elemetns = $(".bar");
    for (let index = 0; index < elemetns.length; index++) {
        elemetns[index].style.display = display;
    }
}

function gameBtn(element) {
    if (element.getAttribute("id") === "btnAction-"+correctBtn) {
        points+=5*playtimer;
        go();
    }else {
        playtimer = 0;
    }
}

$.get(readmeUrl, (data)=>initialize(data));