import express from "express";
import { formatterValue } from "../helpers/numberFormat.js";
import accountsModel from "../models/accountsSchema.js";

const router = express.Router();

router.get("/4/:agencia/:conta/:valor", async (req, res, next) => {
  try {
    const { agencia, conta, valor } = req.params;
    const account = await accountsModel.findOne({ agencia, conta });

    if (!account) {
      return res.status(404).send("Account not found");
    }

    const { name, balance } = account;

    const newBalance = balance + parseInt(valor);

    const accountUpdated = await accountsModel.findOneAndUpdate(
      { agencia, conta },
      { account, conta, name, balance: newBalance },
      { new: true }
    );

    res.send(accountUpdated);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.get("/5/:agencia/:conta/:valor", async (req, res, next) => {
  try {
    const { agencia, conta, valor } = req.params;
    const account = await accountsModel.findOne({ agencia, conta });

    if (!account) {
      return res.status(404).send("Account not found");
    }

    const { name, balance } = account;

    const newBalance = balance - (parseInt(valor) + 1);

    if (newBalance < 0) {
      return res.status(400).send("Account doesn't have enough balance");
    }

    const accountUpdated = await accountsModel.findOneAndUpdate(
      { agencia, conta },
      { account, conta, name, balance: newBalance },
      { new: true }
    );

    res.send(accountUpdated);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.get("/getBalance/:agencia/:conta", async (req, res, next) => {
  try {
    const { agencia, conta } = req.params;
    const account = await accountsModel.findOne({ agencia, conta });

    if (!account) {
      return res.status(404).send("Account not found");
    }

    res.send(account);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.get("/deleteAccount/:agencia/:conta", async (req, res, next) => {
  try {
    const { agencia, conta } = req.params;
    await accountsModel.deleteMany({ agencia, conta });

    const activatedAccounts = await accountsModel.find({ agencia });

    res.send({ activatedAccounts: activatedAccounts.length });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.get("/transfer/:conta1/:conta2/:valor", async (req, res, next) => {
  try {
    const { conta1, conta2, valor } = req.params;

    let account1 = await accountsModel.findOne({ conta: conta1 });
    let account2 = await accountsModel.findOne({ conta: conta2 });

    if (!account1 || !account2) {
      return res.status(404).send("Account not found");
    }

    let deductValue = 0;

    if (account1.agencia !== account2.agencia) {
      deductValue = parseInt(valor) + 8;
    } else {
      deductValue = valor;
    }

    if (account1.balance < deductValue) {
      return res.status(400).send("Account doesn't have enough balance");
    }

    account1.balance = account1.balance - deductValue;
    account2.balance = account2.balance + parseInt(valor);

    const accountUpdated1 = await accountsModel.findOneAndUpdate(
      { conta: conta1 },
      account1,
      { new: true }
    );
    await accountsModel.findOneAndUpdate({ conta: conta2 }, account2);

    res.send(accountUpdated1);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.get("/averageAgency/:agencia", async (req, res, next) => {
  try {
    const { agencia } = req.params;
    const accounts = await accountsModel.find({ agencia });

    if (!accounts.length) {
      return res.status(404).send("Agency not found");
    }

    const agencyBalance = accounts.reduce((accumulator, current) => {
      return accumulator + current.balance;
    }, 0);

    const avarageAgency = (agencyBalance / accounts.length).toFixed(2);

    res.send({ avarageAgency: formatterValue(avarageAgency) });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.get("/getMinBalance/:fetchValues", async (req, res, next) => {
  try {
    const { fetchValues } = req.params;
    const accounts = await accountsModel.find({});

    const sortedAccounts = accounts.sort((a, b) => a.balance - b.balance);

    const fetchSortedAccounts = sortedAccounts.slice(0, fetchValues);

    res.send(fetchSortedAccounts);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.get("/getMaxBalance/:fetchValues", async (req, res, next) => {
  try {
    const { fetchValues } = req.params;
    const accounts = await accountsModel.find({});

    const sortedAccounts = accounts.sort((a, b) => b.balance - a.balance);

    const fetchSortedAccounts = sortedAccounts.slice(0, fetchValues);

    res.send(fetchSortedAccounts);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.get("/transferToPrivate", async (req, res, next) => {
  try {
    const accounts = await accountsModel.find({});

    // const agenciesAccounts = accounts.map((account) => account.agencia);

    // const uniqueAccounts = [...new Set(agenciesAccounts)];

    const newAccounts = [];

    accounts.forEach((account) =>
      newAccounts.push({ agencia: account.agencia, account })
    );

    const sortedAccounts = newAccounts.sort(
      (a, b) => b.account.balance - a.account.balance
    );

    const accountsToTransfer = sortedAccounts.filter(
      (account, index, self) =>
        index === self.findIndex((a) => a.agencia === account.agencia)
    );

    accountsToTransfer.forEach(async (a) => {
      await accountsModel.findByIdAndUpdate(a.account._id, {
        agencia: 99,
        conta: a.account.conta,
        name: a.account.name,
        balance: a.account.balance,
      });
    });

    const privateAgency = await accountsModel.find({ agencia: 99 });

    res.send(privateAgency);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
// router.use((err, req, res, next) => {
//   logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
//   res.status(400).send({ error: err.message });
// });

export default router;
