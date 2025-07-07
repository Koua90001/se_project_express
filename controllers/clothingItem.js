const clothingItem = require("../models/clothingItem")
const  BadRequestError  = require("../utils/errors/BadRequestError");
const   NotFoundError  = require("../utils/errors/NotFoundError");
const   ForbiddenError  = require("../utils/errors/ForbiddenError");

const createItem = (req, res, next) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;
  console.log(req.user._id);

  clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid Data"));
      } else {
        next(err);
      }
    });
};

const getItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => res.send( items ))
    .catch((err) => {
      console.error(err);
      next(err );
    });
};


const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  clothingItem
    .findById(itemId)
    .orFail(() => new NotFoundError("Clothing item not found"))
    .then((item) => {
      if (item.owner.toString() !== userId.toString()) {
        throw new ForbiddenError("You are not the owner of this item");
     }
      return clothingItem.findByIdAndDelete(itemId).then((deletedItem) => {
        res.send({ message: "Item deleted successfully", deletedItem });
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid clothing item ID"));
      }
      return next(err);
    });
};

const likeClothingItem = (req, res, next) => {
    console.log(typeof req.user._id);
    clothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true }
    )
    .orFail(() => new NotFoundError("Clothing item not found"))
    .then((likedItem) => {
      res.send({ message: "Item liked successfully", likedItem });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid clothing item ID"));
      }
      return next(err);
    });
  };

const unlikeClothingItem = (req, res, next) => {
    clothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail(() => new NotFoundError("Clothing item not found"))
    .then((likedItem) => {
      res.send({ message: "Item unliked successfully", likedItem });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid clothing item ID"));
      }
      return next(err);
    });


}


module.exports = { createItem, getItems, deleteItem, likeClothingItem, unlikeClothingItem };