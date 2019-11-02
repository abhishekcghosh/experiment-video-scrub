const logContainer = document.getElementById('comments');
const log = text => {
    if (logContainer) {
        logContainer.innerHTML += text + '\n';
    } else {
        console.log(text);
    }
};
