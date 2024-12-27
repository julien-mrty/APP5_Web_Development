import gameConfig from './../gameConfig/gameConfig.js';

export default class UserInputHandler {
    constructor(scene) {
        this.scene = scene; // Reference to parent scene
        this.playerInput = ""; // Saisie utilisateur
        this.minSequence = 1; // Minimum sequence length
        this.maxSequence = 1; // Maximum sequence length
        this.playerInputText = null;
        }


    init() {
        this.createSequenceDisplay();
        this.scene.input.keyboard.on("keydown", this.handleSequenceInput, this);
    }

    //Generate a random sequence of letters.
    generateRandomSequence() {
        //Set of valid characters
        const letters = "abcdefghijklmnopqrstuvwxyzà-ö0123456789&\"'()-_ç@)=*?!§";

        // Determine a random length between minSequence and maxSequence
        const sequenceLength = Math.floor(Math.random() * (this.maxSequence - this.minSequence + 1)) + this.minSequence;

        let sequence = "";
        for (let i = 0; i < sequenceLength; i++) {
            sequence += letters[Math.floor(Math.random() * letters.length)];
        }
        return sequence;
    }
  
    //Receive the key entered by the player
    handleSequenceInput(event) {
        const key = event.key;
          
        // If the key is “Backspace”, delete the last character of playerInput
        if (key === "Backspace") {
            if (this.playerInput.length > 0) {
                this.playerInput = this.playerInput.slice(0, -1); // Deletes the last character
                console.log("Entrée actuelle après suppression :", this.playerInput);
                this.playerInputText.setText(this.playerInput); // Update display
            }
            return; // Do not continue with the rest of the method
        }

        // If the key is “Enter”, validate the sequence
        if (key === "Enter") {
            if (this.playerInput.length >= this.minSequence && this.playerInput.length <= this.maxSequence) { // Vérifier uniquement si l'utilisateur a bien une chaine dans l'intervalle de minSequence et maxSequence
                //this.checkPlayerInput(); // Call function to check input
                this.scene.checkPlayerInputForEnemies(this.playerInput); // Vérifie l'entrée pour tous les ennemis
                this.playerInput = ""; // Reset après validation
                this.playerInputText.setText(this.playerInput); // Réinitialiser l'affichage
            } 
            else {
                console.log("Erreur : La saisie doit contenir entre " + this.minSequence + " et " + this.maxSequence + " caractères.");
            }
            return;
        }
         
        // - Upper and lower case letters (A-Z, a-z)
        // - Accented upper- and lower-case letters (À-Ö, à-ö, Ø-Ý, ø-ý)
        // - Figures (0-9)
        // - Special characters (&, ", ', (, -, _, ç, @, ), =, /, *, ?, \, !, §)
        const validKeyPattern = /^[A-Za-zÀ-ÖØ-Ýà-öø-ý0-9&"'()_ç@)=/*?\\!§-]$/;
    
        if (validKeyPattern.test(key)) {
            if (this.playerInput.length < this.maxSequence) { // Limit entry to 7 characters
                this.playerInput += key;
                this.playerInputText.setText(this.playerInput);
            }
        }

        if (this.playerInput.length >= this.maxSequence) {
            console.log("Vous avez atteint la longueur maximale d'entrée.");
            return;
        }
       
    }

    //Display the sequence of letters created
    createSequenceDisplay() {
        // Add text for player entry
        this.playerInputText = this.scene.add.text(
            gameConfig.width / 2, 
            50, 
            this.playerInput, // Initially empty
            { font: "32px Arial", fill: "#ffffff" } // Text in red
        ).setOrigin(0.5, 0.5);
    }


}