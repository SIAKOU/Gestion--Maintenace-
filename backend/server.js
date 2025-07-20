require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const fs = require("fs");
const os = require("os");
const morgan = require("morgan");
const db = require("./models");
const { authenticateToken } = require("./middleware/auth");

// Classe d'erreur API personnalisée
class ApiError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

const cookieParser = require("cookie-parser");

// Configuration améliorée pour obtenir l'IP locale
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

const LOCAL_IP = process.env.LOCAL_IP || getLocalIP();

// Liste des origines autorisées
const allowedOrigins = [
  `http://localhost:${PORT}`,
  `http://localhost:5173`,
  `http://127.0.0.1:${PORT}`,
  `http://127.0.0.1:5173`,
  `http://${LOCAL_IP}:${PORT}`,
  `http://${LOCAL_IP}:5173`,
  `http://${LOCAL_IP}:8080`,
  `http://192.150.24.44:${PORT}`,
  `http://192.150.24.44:5173`,
  `http://192.150.24.44:8080`,
  process.env.FRONTEND_URL, // URL du frontend en production
].filter(Boolean);

// Configuration CORS améliorée
const corsOptions = {
  origin: function (origin, callback) {
    // En développement, autoriser toutes les origines locales
    if (process.env.NODE_ENV !== "production") {
      if (
        !origin ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1") ||
        origin.includes(LOCAL_IP)
      ) {
        return callback(null, true);
      }
    }

    // En production, vérifier les origines autorisées
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Bloquer les requêtes non autorisées en production
    if (process.env.NODE_ENV === "production") {
      return callback(
        new Error("Accès non autorisé par la politique CORS"),
        false
      );
    }

    // En développement, permettre quand même avec un avertissement
    console.warn(
      `Avertissement: Origine non autorisée en développement: ${origin}`
    );
    callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Authorization", "Set-Cookie"],
};

// Middlewares de base
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Limitation du taux de requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 100 : 1000, // Plus permissif en développement
  message: "Trop de requêtes depuis cette IP, réessayez plus tard.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", limiter);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Servir les fichiers statiques avec gestion d'erreurs
app.use('/uploads', (req, res, next) => {
  // Vérifier si le fichier existe
  const filePath = path.join(__dirname, 'uploads', req.path);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Fichier non trouvé' });
  }
  next();
}, express.static(path.join(__dirname, "uploads"), {
  maxAge: process.env.NODE_ENV === "production" ? "7d" : "0",
}));

// Route pour obtenir les informations d'un fichier
app.get('/api/files/:filename', authenticateToken, async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'uploads', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Fichier non trouvé' });
    }
    
    const stats = fs.statSync(filePath);
    const ext = path.extname(filename).toLowerCase();
    
    // Déterminer le type MIME
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.txt': 'text/plain',
      '.mp4': 'video/mp4',
      '.avi': 'video/avi',
      '.mov': 'video/mov'
    };
    
    res.json({
      filename,
      size: stats.size,
      mimetype: mimeTypes[ext] || 'application/octet-stream',
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des informations du fichier:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Middleware pour logger les requêtes entrantes (en développement seulement)
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.path}`);
    console.log(`🌐 Origin: ${req.headers.origin}`);
    console.log(`🍪 Cookies: ${JSON.stringify(req.cookies)}`);
    next();
  });
}

// Routes API
app.use("/api/auth", require("./routes/auth"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/users", require("./routes/users"));
app.use("/api/machines", require("./routes/machines"));
app.use("/api/maintenance-schedules", require("./routes/maintenanceSchedules"));

// Route de santé
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    env: process.env.NODE_ENV,
  });
});

// Route de vérification de configuration
app.get("/api/config-check", (req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET ? "configured" : "missing",
    dbConnected: !!db.sequelize,
    corsOrigins: allowedOrigins,
    cookieSettings: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true,
    },
  });
});

// Middleware de gestion d'erreurs amélioré
app.use((error, req, res, next) => {
  console.error("Erreur serveur:", error);

  if (error.code === "LIMIT_FILE_SIZE") {
    return res
      .status(413)
      .json({ error: "Fichier trop volumineux (max 10MB)" });
  }

  if (error.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({ error: "Type de fichier non autorisé" });
  }

  if (error.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Authentification requise" });
  }

  // Erreur API personnalisée
  if (error instanceof ApiError) {
    return res.status(error.status || 500).json({
      error: error.message,
      details: error.details,
    });
  }

  res.status(500).json({
    error: "Erreur serveur interne",
    ...(process.env.NODE_ENV !== "production" && { stack: error.stack }),
  });
});

// Route 404 améliorée
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route non trouvée",
    path: req.path,
    method: req.method,
    availableEndpoints: [
      "/api/auth",
      "/api/reports",
      "/api/users",
      "/api/machines",
      "/api/health",
      "/api/config-check",
    ],
  });
});

// Classe d'erreur API personnalisée (déplacée en haut du fichier)

// Fonction de démarrage du serveur améliorée
const startServer = async () => {
  try {
    console.log("⏳ Tentative de connexion à la base de données...");
    await db.sequelize.authenticate();
    console.log("✅ Connexion à la base de données établie");

    if (process.env.NODE_ENV !== "production") {
      console.log("⏳ Synchronisation des modèles de base de données...");
      await db.sequelize.sync({ alter: true });
      console.log("✅ Modèles de base de données synchronisés");
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`\n🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📡 Environnement: ${process.env.NODE_ENV || "development"}`);
      console.log(`🌐 Adresses d'accès:`);
      console.log(`   - Local:    http://localhost:${PORT}`);
      console.log(`   - Réseau:   http://${LOCAL_IP}:${PORT}`);
      console.log(`🔒 Origines autorisées:`, allowedOrigins);
      console.log(`📚 Points finaux API:`);
      console.log(`   - /api/auth`);
      console.log(`   - /api/reports`);
      console.log(`   - /api/users`);
      console.log(`   - /api/machines`);
      console.log(`   - /api/health (vérification de santé)`);
      console.log(`   - /api/config-check (vérification de configuration)\n`);
    });
  } catch (error) {
    console.error("❌ Erreur critique lors du démarrage du serveur:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
