
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Calendar, Clock, User, Building, EyeIcon } from 'lucide-react';

// This would come from an API in a real application
const mockNews = [
  { 
    id: 1, 
    title: 'Nueva normativa para seguros de automóvil', 
    excerpt: 'Cambios importantes en la regulación de seguros de automóvil que afectan a todos los mediadores.', 
    content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquet nisl, eget aliquam nisl nisl eget nisl. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquet nisl, eget aliquam nisl nisl eget nisl.</p><p>Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquet nisl, eget aliquam nisl nisl eget nisl. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquet nisl, eget aliquam nisl nisl eget nisl.</p>', 
    image: '/placeholder.svg', 
    date: '2023-05-01', 
    author: 'Admin Usuario',
    companies: [1, 3],
    views: 120
  },
  { 
    id: 2, 
    title: 'Nuevos productos de hogar disponibles', 
    excerpt: 'Lanzamiento de nuevos productos de hogar con coberturas mejoradas y precios competitivos.', 
    content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquet nisl, eget aliquam nisl nisl eget nisl. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquet nisl, eget aliquam nisl nisl eget nisl.</p><p>Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquet nisl, eget aliquam nisl nisl eget nisl. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquet nisl, eget aliquam nisl nisl eget nisl.</p>', 
    image: '/placeholder.svg', 
    date: '2023-05-05', 
    author: 'Admin Usuario',
    companies: [2, 5],
    views: 85
  },
  { 
    id: 3, 
    title: 'Formación online para mediadores', 
    excerpt: 'Nueva plataforma de formación online para mediadores con cursos certificados y gratuitos.', 
    content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquet nisl, eget aliquam nisl nisl eget nisl. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquet nisl, eget aliquam nisl nisl eget nisl.</p><p>Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquet nisl, eget aliquam nisl nisl eget nisl. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquet nisl, eget aliquam nisl nisl eget nisl.</p>', 
    image: '/placeholder.svg', 
    date: '2023-05-10', 
    author: 'María García',
    companies: [1, 2, 3, 4, 5],
    views: 230
  },
  { 
    id: 4, 
    title: 'Actualización de comisiones 2023', 
    excerpt: 'Información importante sobre la actualización de comisiones para todos los productos en 2023.', 
    content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquet nisl, eget aliquam nisl nisl eget nisl. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquet nisl, eget aliquam nisl nisl eget nisl.</p><p>Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquet nisl, eget aliquam nisl nisl eget nisl. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquet nisl, eget aliquam nisl nisl eget nisl.</p>', 
    image: '/placeholder.svg', 
    date: '2023-05-15', 
    author: 'Carlos Rodríguez',
    companies: [1, 4],
    views: 170
  },
  { 
    id: 5, 
    title: 'Nueva delegación en Valencia', 
    excerpt: 'Apertura de una nueva delegación en Valencia para dar mejor servicio a los mediadores de la zona.', 
    content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquet nisl, eget aliquam nisl nisl eget nisl. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquet nisl, eget aliquam nisl nisl eget nisl.</p><p>Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquet nisl, eget aliquam nisl nisl eget nisl. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquet nisl, eget aliquam nisl nisl eget nisl.</p>', 
    image: '/placeholder.svg', 
    date: '2023-05-20', 
    author: 'Laura Pérez',
    companies: [2, 3],
    views: 95
  },
];

// Mock data for companies
const mockCompanies = [
  { id: 1, name: 'Mapfre' },
  { id: 2, name: 'Allianz' },
  { id: 3, name: 'AXA' },
  { id: 4, name: 'Generali' },
  { id: 5, name: 'Zurich' },
];

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [newsItem, setNewsItem] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      const foundNews = mockNews.find(item => item.id === parseInt(id || '0'));
      setNewsItem(foundNews || null);
      setLoading(false);
      
      // Increment view count in a real app you'd do this server-side
    }, 300);
  }, [id]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy');
    } catch (e) {
      return dateString;
    }
  };

  // Get company names by ids
  const getCompanyNames = (companyIds: number[]) => {
    return companyIds
      .map(id => mockCompanies.find(c => c.id === id)?.name || '')
      .filter(Boolean)
      .join(', ');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Noticia no encontrada</h2>
        <p className="mb-6">La noticia que estás buscando no existe o ha sido eliminada.</p>
        <Button asChild>
          <Link to="/noticias">
            <ArrowLeft className="mr-2 h-4 w-4" /> 
            Volver a noticias
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/noticias">
          <ArrowLeft className="mr-2 h-4 w-4" /> 
          Volver a noticias
        </Link>
      </Button>
      
      <div className="aspect-video relative rounded-lg overflow-hidden mb-6 border bg-muted/20">
        <img 
          src={newsItem.image} 
          alt={newsItem.title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{newsItem.title}</h1>
        
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(newsItem.date)}
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {newsItem.author}
          </div>
          <div className="flex items-center gap-1">
            <Building className="h-4 w-4" />
            {getCompanyNames(newsItem.companies)}
          </div>
          <div className="flex items-center gap-1">
            <EyeIcon className="h-4 w-4" />
            {newsItem.views} visitas
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Contenido</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: newsItem.content }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsDetail;
