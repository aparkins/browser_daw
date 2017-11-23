function Index() {

    const keyboard = document.getElementById('keyboard');
    const wavePicker = document.getElementById('waveformPicker');

    const context = new AudioContext();
    let oscillatorTable = [];
    let masterGainNode = null;
    let currentWaveform = wavePicker.value;

    let notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    function createNoteTable(){
        let noteFrequencies = [];
        noteFrequencies[0] = {
            'C':  16.351597831287414,
            'C#': 17.323914436054505,
            'D':  18.354047994837973,
            'D#': 19.445436482630058,
            'E':  20.601722307054370,
            'F':  21.826764464562743,
            'F#': 23.124651419477150,
            'G':  24.499714748859330,
            'G#': 25.956543598746570,
            'A':  27.500000000000000,
            'A#': 29.135235094880619,
            'B':  30.867706328507756,
        }

        for (let i = 1; i < 9; i++) {
            noteFrequencies[i] = {};
            for (let noteIndex = 0; noteIndex < notes.length; noteIndex++) {
                note = notes[noteIndex];
                noteFrequencies[i][note] = noteFrequencies[i-1][note] * 2;
            }
        }

        return noteFrequencies;
    }

    function changeWaveform(event) {
        currentWaveform = wavePicker.value;
    }

    function createKey(octave, note, frequency) {
        let keyElement = document.createElement('div');
        let labelElement = document.createElement('div');

        keyElement.style['float'] = 'left';
        keyElement.style['width'] = 50;
        keyElement.style['height'] = 100;
        keyElement.style['outline'] = 'solid';
        keyElement.style['margin'] = 5;

        keyElement.dataset['octave'] = octave;
        keyElement.dataset['note'] = note;
        keyElement.dataset['frequency'] = frequency;

        keyElement.addEventListener('mousedown', notePressed, false);
        keyElement.addEventListener('mouseup', noteReleased, false);

        labelElement.innerHTML = note + '<sub>' + octave + '</sub>';
        labelElement.style['width'] = '100%';
        labelElement.style['text-align'] = 'center';
        keyElement.appendChild(labelElement);

        return keyElement;
    }

    function setupOscillator(octave, note, frequency) {
        let oscillator = context.createOscillator();
        oscillator.type = currentWaveform;
        oscillator.frequency.value = frequency;
        oscillator.connect(masterGainNode);

        clearOscillator(octave, note);
        oscillatorTable[octave][note] = oscillator;

        return oscillator;
    }

    function clearOscillator(octave, note) {
        if (oscillatorTable[octave][note]) {
            oscillatorTable[octave][note].stop();
            oscillatorTable[octave][note] = null;
        }
    }

    function notePressed(event) {
        let octave = event.target.dataset['octave'];
        let note = event.target.dataset['note'];
        let frequency = event.target.dataset['frequency'];
        let oscillator = setupOscillator(octave, note, frequency);
        oscillator.start();
    }

    function noteReleased(data) {
        let octave = event.target.dataset['octave'];
        let note = event.target.dataset['note'];
        clearOscillator(octave, note);
    }

    let noteTable = createNoteTable();
    wavePicker.addEventListener('change', changeWaveform, false);

    for (let i = 0; i < noteTable.length; i++) {
        let octave = noteTable[i];
        let octaveElement = document.createElement('div');
        octaveElement.style['height'] = '110';

        for (let noteIndex = 0; noteIndex < notes.length; noteIndex++) {
            let note = notes[noteIndex];
            octaveElement.appendChild(createKey(i, note, octave[note]));
        }

        keyboard.appendChild(octaveElement);

        oscillatorTable[i] = {};
    }

    masterGainNode = context.createGain();
    masterGainNode.connect(context.destination);
    masterGainNode.gain.value = 1.0;
}

Index();
