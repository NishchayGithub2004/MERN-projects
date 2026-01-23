// create an array of audio objects for each keystroke sound

const keyStrokeSounds = [
    new Audio("/sounds/keystroke1.mp3"),
    new Audio("/sounds/keystroke2.mp3"),
    new Audio("/sounds/keystroke3.mp3"),
    new Audio("/sounds/keystroke4.mp3"),
];

function useKeyboardSound() { // create a custom hook named 'useKeyboardSound' to play random keystroke sounds when uses types on the keyboard
    const playRandomKeyStrokeSound = () => { // define a function named 'playRandomKeyStrokeSound' that plays a random keystroke sound from the array
        const randomSound = keyStrokeSounds[Math.floor(Math.random() * keyStrokeSounds.length)]; // choose a random audio object from the array

        randomSound.currentTime = 0; // reset the audio playback position to the beginning so that next time user presses the key, the sound plays from the beginning not from the point it was paused or stopped
        
        randomSound.play().catch((error) => console.log("Audio play failed:", error)); // play the audio object using it's 'play' function, if any error occurs while playing the audio, log it to the console to know what error occured
    };

    return { playRandomKeyStrokeSound }; // return the function as an object so that it can be used in other components as a custom hook
}

export default useKeyboardSound; // export the custom hook so that it can be used in other parts of the application