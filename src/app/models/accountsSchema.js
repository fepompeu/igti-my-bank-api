import mongoose from "mongoose";

const accountSchema = mongoose.Schema({
  agencia: {
    type: Number,
    required: true,
  },
  conta: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    validate(balance) {
      if (balance < 0) throw new Error("The value must be greater than 0");
    },
  },
});

const accountsModel = mongoose.model(
  "igit-accounts",
  accountSchema,
  "igit-accounts"
);

export default accountsModel;
