
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Edit, Trash, LayoutGrid, List, Upload, Calendar, Clock, EyeIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';

// Mock data for companies
const mockCompanies = [
  { id: 1, name: 'Mapfre' },
  { id: 2, name: 'Allianz' },
  { id: 3, name: 'AXA' },
  { id: 4, name: 'Generali' },
  { id: 5, name: 'Zurich' },
];

// Mock data for news
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

type Company = {
  id: number;
  name: string;
};

type NewsItem = {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  companies: number[];
  views: number;
};

type FormMode = 'create' | 'edit';
type ViewMode = 'grid' | 'list';

const News = () => {
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [companies] = useState<Company[]>(mockCompanies);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [currentNews, setCurrentNews] = useState<NewsItem | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [imageUrl, setImageUrl] = useState<string>('/placeholder.svg');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<Omit<NewsItem, 'id' | 'date' | 'author' | 'views'>>({
    title: '',
    excerpt: '',
    content: '',
    image: '/placeholder.svg',
    companies: [],
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter news based on search term and company filter
  const filteredNews = news.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompany = selectedCompanyFilter === null || item.companies.includes(selectedCompanyFilter);
    
    return matchesSearch && matchesCompany;
  });

  // Handle company filter selection
  const handleCompanyFilter = (companyId: number) => {
    setSelectedCompanyFilter(prevCompany => prevCompany === companyId ? null : companyId);
  };

  // Clear company filter
  const clearCompanyFilter = () => {
    setSelectedCompanyFilter(null);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle company selection in form
  const handleCompanyChange = (value: string) => {
    const companyId = parseInt(value);
    setFormData({
      ...formData,
      companies: formData.companies.includes(companyId)
        ? formData.companies.filter(id => id !== companyId)
        : [...formData.companies, companyId],
    });
  };

  // Simulate file upload for featured image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real application, you would upload the file to a server
      // and get a URL back. Here we're just creating a temporary URL.
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setFormData({
        ...formData,
        image: url,
      });
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image: '/placeholder.svg',
      companies: [],
    });
    setImageUrl('/placeholder.svg');
  };

  // Open dialog for creating a new news item
  const openCreateDialog = () => {
    setFormMode('create');
    resetForm();
    setDialogOpen(true);
  };

  // Open dialog for editing an existing news item
  const openEditDialog = (item: NewsItem) => {
    setFormMode('edit');
    setCurrentNews(item);
    setFormData({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      image: item.image,
      companies: [...item.companies],
    });
    setImageUrl(item.image);
    setDialogOpen(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formMode === 'create') {
      // Create new news item
      const newItem: NewsItem = {
        id: Math.max(0, ...news.map(n => n.id)) + 1,
        ...formData,
        date: format(new Date(), 'yyyy-MM-dd'),
        author: 'Admin Usuario', // In a real app, this would be the current user
        views: 0,
      };
      setNews([newItem, ...news]); // Add new news at the beginning
    } else if (formMode === 'edit' && currentNews) {
      // Update existing news item
      const updatedNews = news.map(item => 
        item.id === currentNews.id 
          ? { 
              ...item, 
              ...formData,
            } 
          : item
      );
      setNews(updatedNews);
    }
    
    setDialogOpen(false);
    resetForm();
  };

  // Handle news item deletion
  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      setNews(news.filter(item => item.id !== id));
    }
  };

  // Get company names by ids
  const getCompanyNames = (companyIds: number[]) => {
    return companyIds
      .map(id => companies.find(c => c.id === id)?.name || '')
      .filter(Boolean)
      .join(', ');
  };

  // Format date as a readable string
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6 animate-slideInUp">
      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar noticias..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={selectedCompanyFilter?.toString() || ""} onValueChange={(v) => v ? handleCompanyFilter(parseInt(v)) : clearCompanyFilter()}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por compañía" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas las compañías</SelectItem>
              {companies.map(company => (
                <SelectItem key={company.id} value={company.id.toString()}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex gap-2 ml-auto">
            <div className="border rounded-md flex overflow-hidden">
              <Button 
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Noticia
            </Button>
          </div>
        </div>
      </div>

      {/* News display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.length > 0 ? (
            filteredNews.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <Calendar className="h-3 w-3" />
                    {formatDate(item.date)}
                    <span className="mx-1">•</span>
                    <EyeIcon className="h-3 w-3" />
                    {item.views} visitas
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="text-sm text-muted-foreground line-clamp-3">{item.excerpt}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                    {getCompanyNames(item.companies)}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p>No se encontraron noticias</p>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden md:table-cell">Fecha</TableHead>
                  <TableHead className="hidden md:table-cell">Autor</TableHead>
                  <TableHead className="hidden md:table-cell">Compañías</TableHead>
                  <TableHead className="hidden md:table-cell">Visitas</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNews.length > 0 ? (
                  filteredNews.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">{item.excerpt}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{formatDate(item.date)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {item.author.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{item.author}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell truncate max-w-[150px]">
                        {getCompanyNames(item.companies)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-1">
                          <EyeIcon className="h-4 w-4 text-muted-foreground" />
                          {item.views}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No se encontraron noticias
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'create' ? 'Crear nueva noticia' : 'Editar noticia'}
            </DialogTitle>
            <DialogDescription>
              Complete todos los campos para {formMode === 'create' ? 'crear una nueva' : 'actualizar la'} noticia.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Extracto</Label>
                  <Textarea 
                    id="excerpt" 
                    name="excerpt" 
                    value={formData.excerpt} 
                    onChange={handleInputChange} 
                    required 
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Contenido</Label>
                  <Textarea 
                    id="content" 
                    name="content" 
                    value={formData.content} 
                    onChange={handleInputChange} 
                    required 
                    rows={10}
                    className="min-h-[200px] md:min-h-[300px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    En una implementación real, aquí se utilizaría un editor WYSIWYG completo.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image">Imagen destacada</Label>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-full aspect-video rounded-md border overflow-hidden bg-muted/30">
                      <img 
                        src={imageUrl}
                        alt="Featured image" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label className="cursor-pointer w-full">
                      <div className="flex items-center gap-2 text-sm px-3 py-2 border rounded-md hover:bg-muted transition-colors w-full justify-center">
                        <Upload className="h-4 w-4" />
                        <span>Subir imagen</span>
                      </div>
                      <input 
                        type="file" 
                        id="image" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload} 
                      />
                    </label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Vincular a compañías</Label>
                  <div className="space-y-2 border rounded-md p-3 max-h-[200px] overflow-y-auto">
                    {companies.map(company => (
                      <div key={company.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`company-${company.id}`}
                          checked={formData.companies.includes(company.id)}
                          onChange={() => handleCompanyChange(company.id.toString())}
                          className="rounded border-input"
                        />
                        <Label htmlFor={`company-${company.id}`} className="cursor-pointer text-sm">
                          {company.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {formMode === 'create' ? 'Publicar' : 'Guardar cambios'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default News;
