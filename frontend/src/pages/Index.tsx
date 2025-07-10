
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Wrench, TrendingUp, Calendar, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoginModal from '@/components/auth/LoginModal';

const Index = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      navigate('/dashboard');
    }
  }, [navigate]);

  const features = [
    {
      icon: <Wrench className="h-8 w-8 text-blue-600" />,
      title: "Gestion des Interventions",
      description: "Créez, suivez et gérez toutes vos interventions de maintenance en temps réel."
    },
    {
      icon: <Building2 className="h-8 w-8 text-green-600" />,
      title: "Parc Machine",
      description: "Centralisez les informations de toutes vos machines et équipements."
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Équipe Technique",
      description: "Gérez vos techniciens et assignez les interventions efficacement."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
      title: "Analyses & Rapports",
      description: "Visualisez les performances et optimisez votre maintenance."
    },
    {
      icon: <Calendar className="h-8 w-8 text-red-600" />,
      title: "Planification",
      description: "Programmez la maintenance préventive et suivez les échéances."
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-yellow-600" />,
      title: "Alertes & Notifications",
      description: "Recevez des notifications pour les interventions urgentes."
    }
  ];

  const handleLogin = () => {
    setShowLogin(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Wrench className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MaintenancePro</h1>
                <p className="text-sm text-gray-500">Système de Gestion de Maintenance</p>
              </div>
            </div>
            <Button onClick={handleLogin} className="btn-primary">
              Se connecter
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              Solution Professionnelle de Maintenance
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Optimisez votre
              <span className="text-blue-600 block mt-2">Gestion de Maintenance</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Une plateforme complète pour gérer vos interventions, suivre vos équipements 
              et optimiser les performances de votre service maintenance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleLogin} size="lg" className="btn-primary text-lg px-8 py-3">
                Commencer maintenant
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Voir la démo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fonctionnalités Avancées
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tous les outils dont vous avez besoin pour une maintenance efficace et professionnelle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="maintenance-card hover:scale-105 transform transition-all duration-200 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {feature.icon}
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Temps de disponibilité</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">-40%</div>
              <div className="text-blue-100">Temps d'arrêt</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">+60%</div>
              <div className="text-blue-100">Efficacité maintenance</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Support technique</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Prêt à révolutionner votre maintenance ?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Rejoignez les entreprises qui ont déjà optimisé leur gestion de maintenance
          </p>
          <Button onClick={handleLogin} size="lg" className="btn-primary text-lg px-8 py-3">
            Démarrer gratuitement
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold">MaintenancePro</h3>
              </div>
              <p className="text-gray-400">
                La solution complète pour optimiser votre gestion de maintenance industrielle.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Fonctionnalités</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Gestion des interventions</li>
                <li>Suivi des équipements</li>
                <li>Rapports et analyses</li>
                <li>Maintenance préventive</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Tutoriels vidéo</li>
                <li>Support technique</li>
                <li>Formation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@maintenancepro.com</li>
                <li>+33 1 23 45 67 89</li>
                <li>123 Rue de l'Industrie</li>
                <li>75001 Paris, France</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MaintenancePro. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)}
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          setShowLogin(false);
          navigate('/dashboard');
        }}
      />
    </div>
  );
};

export default Index;
