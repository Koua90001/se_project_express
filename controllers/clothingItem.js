const ClothingItem = require("../models/clothingItem")

const createItem = (req, res) => {
  console.log(req)
  console.log(req.body)

  const{ name, weather, imageURL } = req.body;

  ClothingItem.create({name,weather, imageURL}).then((item)=> {
  console.log(item);
  res.send({data:item})
  }).catch((err) => {
    return res.status(500).send({ message: err.message});
  })
};

const getItems = (req, res) => {
  ClothingItem.find({}).then((items) => res.status(200).send(items))
  .catch((err) => {
     res.status(500).send({message:"Error from getItems", err})
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
      { new: true }
    )
      .orFail()
      .then((item) => res.status(200).send(item))
      .catch((err) => {
        if (err.name === "DocumentNotFoundError") {
          next(new NotFoundError("Request was not found"));
        } else if (err.name === "CastError") {
          next(new BadRequestError("Format is invalid"));
        } else {
          next(err);
        }
      });
  };

const unlikeClothingItem = (req, res, next) => {
    ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
      .orFail()
      .then((item) => res.send(item))
      .catch((err) => {
        console.error(err);
        if (err.name === "DocumentNotFoundError") {
          next(new NotFoundError("Request was not found"));
        } else if (err.name === "CastError") {
          next(new BadRequestError("Format is invalid"));
        } else {
          next(err);
        }
      });


}


module.exports = { createItem, getItems, updateItem, deleteItem, likeClothingItem, unlikeClothingItem };