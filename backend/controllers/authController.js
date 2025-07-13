const jwt = require("jsonwebtoken");
const { User, AuditLog } = require("../models");
const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const login = async (req, res) => {
  try {
    console.log("Tentative de connexion - Données reçues:", req.body);

    const { error } = loginSchema.validate(req.body);
    if (error) {
      console.log("Validation error:", error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = req.body;
    console.log("Recherche utilisateur:", email);

    const user = await User.findOne({ where: { email, isActive: true } });
    if (!user) {
      console.log("Utilisateur non trouvé ou inactif");
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    console.log("Utilisateur trouvé:", user.email);
    console.log("Comparaison mot de passe...");

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      console.log("Mot de passe invalide");
      console.log("Password provided:", password);
      console.log("Password in DB:", user.password);
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    // Mettre à jour la dernière connexion
    await user.update({ lastLogin: new Date() });

    // Créer le token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Log de connexion
    await AuditLog.create({
      userId: user.id,
      action: "LOGIN",
      entity: "User",
      entityId: user.id,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erreur de connexion:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const getProfile = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error("Erreur profil:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

module.exports = { login, getProfile };
