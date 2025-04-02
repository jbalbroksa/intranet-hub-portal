
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const WelcomeSection = () => {
  return (
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
  );
};

export default WelcomeSection;
