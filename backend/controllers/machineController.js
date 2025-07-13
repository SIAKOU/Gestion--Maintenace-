// controllers/machineController.js
const { Machine } = require("../models");
const Joi = require("joi");

// --- CORRECTION : Schéma de validation aligné sur le modèle Sequelize ---
// On ne garde que les champs que le frontend envoie et que le modèle peut accepter.
const createMachineSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  reference: Joi.string().required(),
  brand: Joi.string().min(2).max(50).allow("").optional(), // Permet une chaîne vide
  model: Joi.string().min(2).max(50).allow("").optional(),
  serialNumber: Joi.string().allow("").optional(), // Assurez-vous que ce champ est envoyé ou non
  location: Joi.string().min(2).max(100).required(),
  department: Joi.string().required(),
  description: Joi.string().allow("").optional(),
  status: Joi.string()
    .valid("operational", "maintenance", "breakdown", "retired")
    .optional(),
  priority: Joi.string().valid("low", "medium", "high", "critical").optional(),
  // On ne valide pas les dates ici car elles sont souvent gérées par le backend ou optionnelles
});

// ... (votre fonction getMachines)
const getMachines = async (req, res) => {
  /* ... */
};

const createMachine = async (req, res) => {
  try {
    const { error } = createMachineSchema.validate(req.body);
    if (error) {
      // On renvoie un message d'erreur clair au frontend
      return res.status(400).json({ message: error.details[0].message });
    }

    // On ne crée la machine qu'avec les données validées
    const newMachine = await Machine.create(req.body);
    res.status(201).json(newMachine);
  } catch (error) {
    console.error("Erreur création machine:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({
          message:
            "Une machine avec cette référence ou ce numéro de série existe déjà.",
        });
    }
    res.status(500).json({ message: "Erreur serveur interne." });
  }
};

module.exports = {
  getMachines,
  createMachine,
};
