const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();
passwordSchema
    .is().min(8)             // Longueur minimale de 8 caractères
    .is().max(100)           // Longueur maximale de 100 caractères
    .has().uppercase()       // Doit contenir au moins une lettre majuscule
    .has().lowercase()       // Doit contenir au moins une lettre minuscule
    .has().digits()          // Doit contenir au moins un chiffre
    .has().not().spaces()    // Ne doit pas contenir d'espaces

module.exports = passwordSchema;