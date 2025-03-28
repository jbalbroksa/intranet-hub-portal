
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Briefcase, Package, FileText, FolderOpen, Bell, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  // Mock data for recent activities
  const recentActivities = [
    { id: 1, type: 'notification', title: 'Nueva noticia publicada', date: 'Hace 2 horas', icon: Bell },
    { id: 2, type: 'document', title: 'Manual de procedimientos actualizado', date: 'Hace 5 horas', icon: FileText },
    { id: 3, type: 'product', title: 'Nuevo producto añadido', date: 'Ayer', icon: Package },
    { id: 4, type: 'company', title: 'Actualización de datos de compañía', date: 'Hace 2 días', icon: Briefcase },
  ];

  // Quick access cards
  const quickAccessCards = [
    { title: 'Delegaciones', description: 'Gestionar delegaciones', icon: Building, link: '/delegaciones', color: 'bg-blue-50' },
    { title: 'Compañías', description: 'Gestionar compañías', icon: Briefcase, link: '/companias', color: 'bg-green-50' },
    { title: 'Productos', description: 'Gestionar productos', icon: Package, link: '/productos', color: 'bg-yellow-50' },
    { title: 'Noticias', description: 'Gestionar noticias', icon: FileText, link: '/noticias', color: 'bg-purple-50' },
    { title: 'Documentos', description: 'Gestionar documentos', icon: FolderOpen, link: '/documentos', color: 'bg-pink-50' },
  ];

  return (
    <div className="space-y-8 animate-slideInUp">
      {/* Welcome section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 mb-8">
        <div className="max-w-3xl">
          <h1 className="text-2xl md:text-3xl font-poppins font-bold mb-2">Bienvenido a la Intranet</h1>
          <p className="text-muted-foreground mb-6">
            Accede rápidamente a todas las herramientas y recursos que necesitas para gestionar tu negocio de manera eficiente.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link to="/noticias">
                Ver últimas noticias
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/documentos">
                Explorar documentos
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick access section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-poppins font-medium">Acceso rápido</h2>
          <Button variant="ghost" size="sm" className="text-sm gap-1">
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickAccessCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link 
                key={index} 
                to={card.link}
                className="block transition-transform hover:scale-[1.02] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
              >
                <Card className={`border-none shadow-sm ${card.color} h-full`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{card.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <Separator />

      {/* Recent activity section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-poppins font-medium">Actividad reciente</h2>
          <Button variant="ghost" size="sm" className="text-sm gap-1">
            Ver historial completo
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <ul className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <li key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                    <div className="p-2 rounded-full bg-muted">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{activity.title}</h3>
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="hidden md:flex">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
