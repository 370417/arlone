var Buffer = {};

// The HTML element that represents the message buffer
Buffer.element = document.getElementById('buffer');

// A list of all past messages
Buffer.history = [];

// Display a message
Buffer.log = function(message) {
    if (!message) {
        return;
    }
    if (Buffer.element.childNodes.length > 2) {
        Buffer.element.removeChild(Buffer.element.firstChild);
    }
    Buffer.history.push(message);
    var element = document.createElement('div');
    element.textContent = message;
    Buffer.element.appendChild(element);
};