function Index() {

    const context = new AudioContext();

    var oscillator;

    const startTone = function() {
        oscillator = context.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = 440;
        oscillator.connect(context.destination);
        oscillator.start();
    };
    const endTone = function() {
        oscillator.stop();
    };

    const startButton = document.getElementById("startButton");
    startButton.onclick = startTone;

    const endButton = document.getElementById("endButton");
    endButton.onclick = endTone;
}

Index();
