// define a reusable list of preloaded keystroke sound audio objects to avoid recreating them on every key press
const keyStrokeSounds = [
    new Audio("/sounds/keystroke1.mp3"),
    new Audio("/sounds/keystroke2.mp3"),
    new Audio("/sounds/keystroke3.mp3"),
    new Audio("/sounds/keystroke4.mp3"),
];

function useKeyboardSound() { // define a custom hook to encapsulate keyboard sound playback logic
    const playRandomKeyStrokeSound = () => { // define a function to play a randomly selected keystroke sound
        const randomSound = keyStrokeSounds[Math.floor(Math.random() * keyStrokeSounds.length)]; // select a random audio object from the keystroke sound list
        randomSound.currentTime = 0; // reset audio playback position to allow rapid consecutive key sounds
        randomSound.play().catch((error) => console.log("Audio play failed:", error)); // attempt to play sound and log failure without breaking app flow
    };

    return { playRandomKeyStrokeSound }; // expose the sound-playing function for use in consuming components
}

export default useKeyboardSound; // export the custom hook to enable keyboard sound effects across the application