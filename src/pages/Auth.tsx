
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const { signIn, signUp, user, isLoading } = useAuth();
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // If user is already logged in, redirect to home
  if (user && !isLoading) {
    return <Navigate to="/" replace />;
  }

  const validateLoginForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!loginData.email) newErrors.loginEmail = 'El email es requerido';
    if (!loginData.password) newErrors.loginPassword = 'La contraseña es requerida';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!registerData.name) newErrors.registerName = 'El nombre es requerido';
    if (!registerData.email) newErrors.registerEmail = 'El email es requerido';
    if (!registerData.password) newErrors.registerPassword = 'La contraseña es requerida';
    if (registerData.password.length < 6) {
      newErrors.registerPassword = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.registerConfirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLoginForm()) return;
    
    setLoading(true);
    try {
      await signIn(loginData.email, loginData.password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) return;
    
    setLoading(true);
    try {
      await signUp(registerData.email, registerData.password, registerData.name);
      // Reset form after successful registration
      setRegisterData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      // Switch to login tab
      setAuthTab('login');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Intranet</h1>
          <p className="text-muted-foreground">Inicia sesión o crea una cuenta para continuar</p>
        </div>
        
        <Card>
          <Tabs value={authTab} onValueChange={(value) => setAuthTab(value as 'login' | 'register')}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit}>
                <CardHeader>
                  <CardTitle>Iniciar Sesión</CardTitle>
                  <CardDescription>
                    Ingresa tus credenciales para acceder a la plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="correo@ejemplo.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    />
                    {errors.loginEmail && <p className="text-sm text-destructive">{errors.loginEmail}</p>}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Contraseña</Label>
                    </div>
                    <Input 
                      id="password" 
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    />
                    {errors.loginPassword && <p className="text-sm text-destructive">{errors.loginPassword}</p>}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegisterSubmit}>
                <CardHeader>
                  <CardTitle>Crear cuenta</CardTitle>
                  <CardDescription>
                    Completa el formulario para crear una nueva cuenta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nombre</Label>
                    <Input 
                      id="register-name" 
                      placeholder="Tu nombre"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                    />
                    {errors.registerName && <p className="text-sm text-destructive">{errors.registerName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input 
                      id="register-email" 
                      type="email" 
                      placeholder="correo@ejemplo.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    />
                    {errors.registerEmail && <p className="text-sm text-destructive">{errors.registerEmail}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña</Label>
                    <Input 
                      id="register-password" 
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    />
                    {errors.registerPassword && <p className="text-sm text-destructive">{errors.registerPassword}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Confirmar Contraseña</Label>
                    <Input 
                      id="register-confirm-password" 
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                    />
                    {errors.registerConfirmPassword && <p className="text-sm text-destructive">{errors.registerConfirmPassword}</p>}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
