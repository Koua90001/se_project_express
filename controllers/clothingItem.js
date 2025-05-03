const ClothingItem = require("../models/clothingItem")
const { BadRequestError } = require("../utils/errors/BadRequestError");
const { NotFoundError } = require("../utils/errors/NotFoundError");

const createItem = (req, res, next) => {
  console.log(req)
  console.log(req.body)

  const{ name, weather, imageUrl } = req.body;
  console.log(req.user._id);


  ClothingItem.create({ name, weather,imageUrl, owner: req.user._id }) // error
  .then((item)=> {
    return res.status(201).send({ data:item });
  }).catch((err) => {
    res.status(400).send({ message: 'Validation error'});
  });
}

const getItems = (req, res) => {
  ClothingItem.find({}).then((items) => res.status(200).send(items))
  .catch((err) => {
     return res.status(500).send({message:"Error from getItems", err})
  })

}

const updateItem  = (req, res) => {
  const{itemId} = req.params;
  const{imageURL} = req.body;

ClothingItem.findByIdAndUpdate(itemId, {$set: {imageURL}}).orFail().then((item) => res.status(200).send({data:item}))
.catch((err) => {
  res.status(500).send({message:"Error from updateItem", err})
})

}

const deleteItem = (req, res) => {
  const{ itemId } = req.params;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId).orFail().then((item)=> res.status(204).send({}))

  .catch((err) => {
    res.status(500).send({message:"Error from deleteItem", err})
  })
}

const likeClothingItem = (req, res, next) => {
    console.log(typeof req.user._id);
    ClothingItem.findByIdAndUpdate(
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
    ClothingItem.findByIdAndUpdate(
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


module.exports = { createItem, getItems, updateItem, deleteItem, likeClothingItem, unlikeClothingItem };