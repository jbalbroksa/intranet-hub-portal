
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Briefcase, Package, FileText, FolderOpen, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      {/* Quick access section */}
      <section>
        <h2 className="text-xl font-poppins font-medium mb-4">Acceso rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickAccessCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link 
                key={index} 
                to={card.link}
                className="block transition-transform hover:scale-[1.02] hover:shadow-md"
              >
                <Card className={`border-none shadow-sm ${card.color}`}>
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

      {/* Recent activity section */}
      <section>
        <h2 className="text-xl font-poppins font-medium mb-4">Actividad reciente</h2>
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
                    <div>
                      <h3 className="font-medium">{activity.title}</h3>
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                    </div>
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
