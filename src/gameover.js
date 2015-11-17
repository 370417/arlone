var gameover = {
    input: {}
};

gameover.input.keyDown = function(e) {
    var key = input.keyCode[e.keyCode] || e.key || 'Unknown';
    if (key === ' ') {
        window.location.reload(false);
    }
};
