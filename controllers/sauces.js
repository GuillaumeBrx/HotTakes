const fs = require('fs');

const Sauce = require('../models/sauce');

exports.createThing = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);

  delete sauceObject._id;
  delete sauceObject._userId;

  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  sauce.save()
  .then(() => res.status(201).json({ message: 'Objet créé !' }))
  .catch(error => res.status(400).json({ error }));
};

exports.modifyThing = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non autorisé' });
      } else {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
      };
    })
    .catch(error => res.status(400).json({ error }));
};

exports.deleteThing = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then((sauce) => {
    if (sauce.userId != req.auth.userId) {
      res.status(401).json({ message: 'Non autorisé' });
    } else {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
        .catch(error => res.status(401).json({ error }));
      });
    };
  })
  .catch(error => res.status(400).json({ error }));
};

exports.getOneThing = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllThings = (req, res, next) => {
  Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
};

exports.likeThing = (req, res, next) => {
  const like = req.body.like;
  const userId = req.body.userId;

  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      let message = '';

      switch (like) {
        case 0:
          sauce.usersLiked = sauce.usersLiked.filter(id => id !== userId);
          sauce.usersDisliked = sauce.usersDisliked.filter(id => id !== userId);
          message = 'Like/dislike removed';
          break;

        case 1:
          sauce.usersLiked.push(userId);
          sauce.usersDisliked = sauce.usersDisliked.filter(id => id !== userId);
          message = 'Sauce liked';
          break;

        case -1:
          sauce.usersDisliked.push(userId);
          sauce.usersLiked = sauce.usersLiked.filter(id => id !== userId);
          message = 'Sauce disliked';
          break;

        default:
          return res.status(400).json({ error: 'Invalid like value' });
      }

      Sauce.updateOne({ _id: req.params.id }, {
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked,
        likes: sauce.usersLiked.length,
        dislikes: sauce.usersDisliked.length
      })
        .then(() => res.status(200).json({ message }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(404).json({ error }));
};