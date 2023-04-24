const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user');
const validatePassword = require('../middleware/password-validator');

exports.signup = (req, res, next) => {
    const isValidPassword = validatePassword.validate(req.body.password);

    if (!isValidPassword) {
        return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et pas d\'espace.' });
    }

    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if (user === null) {
            res.status(401).json({ message: 'identifiant/mot de passe incorrects' });
        } else {
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    res.status(401).json({ message: 'identifiant/mot de passe incorrects' });
                } else {
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.JWT_KEY,
                            { expiresIn: '24h' }
                        )
                    });
                }
            })
            .catch(error => res.status(500).json({ error }));
        };
    })
    .catch(error => res.status(400).json({ error }));
};