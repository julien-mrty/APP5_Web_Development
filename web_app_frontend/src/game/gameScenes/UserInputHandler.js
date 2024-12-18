import gameConfig from './../gameConfig/gameConfig.js';

export default class UserInputHandler {
    constructor(scene) {
        this.scene = scene; // Référence à la scène parent
        this.randomSequence = ""; // Séquence générée
        this.playerInput = ""; // Saisie utilisateur
        this.minSequence = 3; // Longueur minimale
        this.maxSequence = 7; // Longueur maximale
        // Ajout explicite des propriétés
        this.sequenceText = null;
        this.playerInputText = null;
        }


    init() {
        this.createSequenceDisplay();
        this.scene.input.keyboard.on("keydown", this.handleSequenceInput, this);
    }

    //Generate a random sequence of three letters.
    generateRandomSequence() {
        //Set of valid characters
       // const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀ-ÖØ-Ýà-öø-ý0123456789&\"'()-_ç@)=/*?\\!§";
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzà-ö0123456789&\"'()-_ç@)=/*?\\!§";

        // Determine a random length between minSequence and maxSequence
        const sequenceLength = Math.floor(Math.random() * (this.maxSequence - this.minSequence + 1)) + this.minSequence;

        let sequence = "";
        for (let i = 0; i < sequenceLength; i++) {
            sequence += letters[Math.floor(Math.random() * letters.length)];
        }
        return sequence;
    }
  
    handleSequenceInput(event) {
        const key = event.key;
          
        // If the key is “Backspace”, delete the last character of playerInput
        if (key === "Backspace") {
            if (this.playerInput.length > 0) {
                this.playerInput = this.playerInput.slice(0, -1); // Deletes the last character
                console.log("Entrée actuelle après suppression :", this.playerInput);
                this.playerInputText.setText(this.playerInput); // Update display
            }
            return; // Ne pas continuer avec le reste de la méthode
        }

        // Si la touche est "Enter", valider la séquence
        if (key === "Enter") {
            if (this.playerInput.length >= this.minSequence && this.playerInput.length <= this.maxSequence) { // Vérifier uniquement si l'utilisateur a bien 3 caractères
                this.checkPlayerInput(); // Appel à la fonction pour vérifier la saisie
            } 
            else {
                console.log("Erreur : La saisie doit contenir entre " + this.minSequence + " et " + this.maxSequence + " caractères.");
                this.passToNextSequence(); // Go directly to the next sequence
            }
            return;
        }


        // Expression régulière pour autoriser :
        // - Lettres majuscules et minuscules (A-Z, a-z)
        // - Lettres accentuées majuscules et minuscules (À-Ö, à-ö, Ø-Ý, ø-ý)
        // - Chiffres (0-9)
        // - Caractères spéciaux (&, ", ', (, -, _, ç, @, ), =, /, *, ?, \, !, §)
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

    //Check the player inputs
    checkPlayerInput() {
        if (this.playerInput === this.randomSequence) {
            console.log("Bien joué !");
            this.passToNextSequence(); // Resets the sequence for a new
        } else {
            console.log("Erreur : La saisie est incorrecte.");
            this.passToNextSequence(); // Move on to the next sequence
        }
    }

    passToNextSequence() {
        this.playerInput = ""; // Réinitialise l'entrée du joueur
        this.randomSequence = this.generateRandomSequence(); // Génère une nouvelle séquence
        this.sequenceText.setText(this.randomSequence); // Met à jour le texte à l'écran
        this.playerInputText.setText(this.playerInput); // Réinitialise l'affichage de l'entrée utilisateur
    }

    
    //Display the sequence of letters created
    createSequenceDisplay() {
        this.randomSequence = this.generateRandomSequence(); // Générer une séquence aléatoire
        this.sequenceText = this.scene.add.text(
            gameConfig.width / 2, 
            50, 
            this.randomSequence, 
            { font: "32px Arial", fill: "#ffffff" }
        ).setOrigin(0.5, 0.5);

        // Ajouter un texte pour l'entrée du joueur
        this.playerInputText = this.scene.add.text(
            gameConfig.width / 2, 
            100, 
            this.playerInput, // Initialement vide
            { font: "32px Arial", fill: "#ff0000" } // Texte en rouge
        ).setOrigin(0.5, 0.5);
    }


}
  