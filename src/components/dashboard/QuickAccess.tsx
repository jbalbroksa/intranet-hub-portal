
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building, Briefcase, Package, FileText, FolderOpen } from 'lucide-react';

const QuickAccess = () => {
  // Quick access cards
  const quickAccessCards = [
    { title: 'Delegaciones', description: 'Gestionar delegaciones', icon: Building, link: '/delegaciones', color: 'bg-blue-50' },
    { title: 'Compañías', description: 'Gestionar compañías', icon: Briefcase, link: '/companias', color: 'bg-green-50' },
    { title: 'Productos', description: 'Gestionar productos', icon: Package, link: '/productos', color: 'bg-yellow-50' },
    { title: 'Noticias', description: 'Gestionar noticias', icon: FileText, link: '/noticias', color: 'bg-purple-50' },
    { title: 'Documentos', description: 'Gestionar documentos', icon: FolderOpen, link: '/documentos', color: 'bg-pink-50' },
  ];

  return (
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
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardDescription>{card.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default QuickAccess;
