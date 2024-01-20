let languageNames = null;
let languages_list = new Map();
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
    // setTimeout(() => {
    //     $("#status").text("Press Here to Test your knowledge now")
    // }, 3000);
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
        console.log(data);
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

$.get(readmeUrl, (data)=>initialize(data));