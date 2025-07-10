
import React from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-1">
          Configurez votre profil et les préférences de l'application
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="maintenance-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>Profil Utilisateur</span>
              </CardTitle>
              <CardDescription>
                Gérez vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    defaultValue={user.firstName}
                    placeholder="Votre prénom"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    defaultValue={user.lastName}
                    placeholder="Votre nom"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user.email}
                  placeholder="votre@email.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
              
              <Button className="btn-primary">
                Sauvegarder les modifications
              </Button>
            </CardContent>
          </Card>

          <Card className="maintenance-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span>Sécurité</span>
              </CardTitle>
              <CardDescription>
                Gérez votre mot de passe et la sécurité de votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Votre mot de passe actuel"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Nouveau mot de passe"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirmez le nouveau mot de passe"
                />
              </div>
              
              <Button className="btn-primary">
                Modifier le mot de passe
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with additional settings */}
        <div className="space-y-6">
          <Card className="maintenance-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-yellow-600" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>
                Configurez vos préférences de notification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Notifications email</Label>
                  <p className="text-sm text-gray-500">
                    Recevoir les notifications par email
                  </p>
                </div>
                <Switch id="emailNotifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="pushNotifications">Notifications push</Label>
                  <p className="text-sm text-gray-500">
                    Recevoir les notifications dans le navigateur
                  </p>
                </div>
                <Switch id="pushNotifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="urgentNotifications">Notifications urgentes</Label>
                  <p className="text-sm text-gray-500">
                    Notifications pour les interventions critiques
                  </p>
                </div>
                <Switch id="urgentNotifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenanceReminders">Rappels maintenance</Label>
                  <p className="text-sm text-gray-500">
                    Rappels de maintenance préventive
                  </p>
                </div>
                <Switch id="maintenanceReminders" defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="maintenance-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-purple-600" />
                <span>Données</span>
              </CardTitle>
              <CardDescription>
                Gestion des données personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Exporter mes données
              </Button>
              
              <Button variant="outline" className="w-full">
                Télécharger l'historique
              </Button>
              
              <Button variant="destructive" className="w-full">
                Supprimer mon compte
              </Button>
            </CardContent>
          </Card>

          <Card className="maintenance-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SettingsIcon className="h-5 w-5 text-gray-600" />
                <span>Système</span>
              </CardTitle>
              <CardDescription>
                Informations sur l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Version:</span>
                <span className="font-medium">1.0.0</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Dernière mise à jour:</span>
                <span className="font-medium">10 Jan 2024</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Rôle:</span>
                <span className="font-medium capitalize">{user.role}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">ID Utilisateur:</span>
                <span className="font-medium">#{user.id}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
