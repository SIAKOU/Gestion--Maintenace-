require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const os = require("os");

const db = require("./models");

const app = express();
const PORT = process.env.PORT || 5000;

// --- CORRECTION CLÉ : Ajouter l'IP du réseau local aux origines autorisées ---

// Fonction pour obtenir l'IP locale
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

// Remplacez '192.168.1.XX' par l'adresse IP réelle de votre ordinateur serveur.
const LOCAL_IP = process.env.LOCAL_IP || getLocalIP();

const allowedOrigins = [
  `http://localhost:${PORT}`,
  `http://localhost:5173`,
  `http://${LOCAL_IP}:${PORT}`,
  `http://${LOCAL_IP}:5173`,
  `http://${LOCAL_IP}:8080`,
  // Ajoutez ici l'URL de votre frontend en production si différente
];

// En production, vous n'autoriserez que votre vrai nom de domaine.
// Configuration CORS améliorée
const corsOptions = {
  origin: function (origin, callback) {
    // En développement, autoriser toutes les origines depuis le réseau local
    if (process.env.NODE_ENV !== "production") {
      // Autoriser les requêtes sans origine (comme les apps mobiles ou Postman)
      if (!origin) return callback(null, true);

      // Vérifier si l'origine est locale ou sur le réseau local
      const isLocal =
        origin.includes("localhost") ||
        origin.includes("127.0.0.1") ||
        origin.includes(LOCAL_IP);
      if (isLocal) return callback(null, true);
    }

    // En production, vérifier les origines autorisées
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error("Accès non autorisé par la politique CORS"));
  },
  credentials: true,
  optionsSuccessStatus: 200, // Pour les navigateurs anciens
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(helmet());
app.use(cors(corsOptions));

// Limitation du nombre de requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Trop de requêtes depuis cette IP, réessayez plus tard.",
});
app.use("/api/", limiter);

// Middleware pour parser le JSON
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Servir les fichiers statiques
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes API
app.use("/api/auth", require("./routes/auth"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/users", require("./routes/users"));
app.use("/api/machines", require("./routes/machines"));
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Middleware de gestion d'erreurs
app.use((error, req, res, next) => {
  console.error("Erreur serveur:", error);
  if (error.code === "LIMIT_FILE_SIZE")
    return res.status(400).json({ error: "Fichier trop volumineux" });
  if (error.code === "LIMIT_UNEXPECTED_FILE")
    return res.status(400).json({ error: "Type de fichier non autorisé" });
  res.status(500).json({ error: "Erreur serveur interne" });
});

// Route 404
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

// --- AMÉLIORATION : Écouter sur toutes les interfaces réseau ---
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Connexion à la base de données établie");

    if (process.env.NODE_ENV !== "production") {
      await db.sequelize.sync({ alter: true });
      console.log("✅ Modèles de base de données synchronisés");
    }

    app.get("/api/config-check", (req, res) => {
      res.json({
        nodeEnv: process.env.NODE_ENV,
        jwtSecret: process.env.JWT_SECRET ? "configured" : "missing",
        dbConnected: !!db.sequelize,
        corsOrigins: allowedOrigins,
      });
    });

    // Le '0.0.0.0' est crucial pour accepter les connexions externes
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Serveur démarré et accessible sur le réseau local`);
      console.log(`📡 Adresse réseau détectée: ${LOCAL_IP}`);
      console.log(`   - Local:    http://localhost:${PORT}`);
      console.log(`   - Réseau:   http://${LOCAL_IP}:${PORT}`);
      console.log(`   - Mobile:   Assurez-vous d'être sur le même réseau WiFi`);
      console.log(`📚 API disponible sur /api`);
    });
  } catch (error) {
    console.error("❌ Erreur de démarrage du serveur:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
