import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  File, 
  FileText, 
  Download, 
  Trash, 
  Calendar, 
  User,
  Filter,
  Package,
  Building2 
} from 'lucide-react';
import { toast } from 'sonner';
import { useNoticias } from '@/hooks/useNoticias';
import { useSupabaseUpload, getPublicUrl } from '@/hooks/useSupabaseQuery';
import { NoticiaFormData } from '@/types/database';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

// Mock data for product categories
const productCategories = [
  { id: 1, name: 'Automóvil' },
  { id: 2, name: 'Hogar' },
  { id: 3, name: 'Vida' },
];

const News = () => {
  const navigate = useNavigate();
  const { 
    noticias, 
    filteredNoticias, 
    companias,
    isLoading, 
    loadingCompanias,
    error, 
    searchTerm, 
    setSearchTerm,
    companiaFilter,
    setCompaniaFilter,
    createNoticia, 
    updateNoticia, 
    deleteNoticia, 
    refetch 
  } = useNoticias();
  
  const uploadFile = useSupabaseUpload();
  
  const [currentUser, setCurrentUser] = useState<string>('Administrador');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newNoticia, setNewNoticia] = useState<NoticiaFormData>({
    titulo: '',
    contenido: '',
    imagen_url: '',
    autor: currentUser,
    fecha_publicacion: new Date().toISOString(),
    es_destacada: false,
    compania_id: null
  });
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
  const [uploading, setUploading] = useState(false);

  // Get current user on component mount
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user.email || 'Usuario');
        setNewNoticia(prev => ({ ...prev, autor: session.user.email || 'Usuario' }));
      }
    };
    
    getCurrentUser();
  }, []);

  // Format date to a more readable format
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileSelected(e.target.files[0]);
    }
  };

  // Handle input changes for the new document form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewNoticia({
      ...newNoticia,
      [name]: value
    });
  };

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setNewNoticia({
      ...newNoticia,
      es_destacada: checked
    });
  };

  // Handle company selection
  const handleCompanyChange = (value: string) => {
    setNewNoticia({
      ...newNoticia,
      compania_id: value
    });
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newNoticia.titulo) {
      toast.error('Por favor, completa el título de la noticia');
      return;
    }
    
    setUploading(true);
    
    try {
      let imageUrl = '';
      
      // Upload file to Supabase storage if selected
      if (fileSelected) {
        const fileName = `${Date.now()}_${fileSelected.name}`;
        const filePath = await uploadFile.mutateAsync({
          bucketName: 'noticias',
          filePath: fileName,
          file: fileSelected
        });
        
        // Get public URL
        imageUrl = getPublicUrl('noticias', filePath);
      }
      
      // Create new document in database
      const noticiaData: NoticiaFormData = {
        ...newNoticia,
        imagen_url: imageUrl || newNoticia.imagen_url,
        fecha_publicacion: newNoticia.fecha_publicacion || new Date().toISOString(),
        autor: newNoticia.autor || currentUser
      };
      
      await createNoticia.mutateAsync(noticiaData);
      
      // Reset form and close dialog
      setNewNoticia({
        titulo: '',
        contenido: '',
        imagen_url: '',
        autor: currentUser,
        fecha_publicacion: new Date().toISOString(),
        es_destacada: false,
        compania_id: null
      });
      setFileSelected(null);
      setDialogOpen(false);
      
      refetch();
      toast.success('Noticia creada correctamente');
    } catch (error) {
      console.error('Error creating news:', error);
      toast.error('Error al crear la noticia');
    } finally {
      setUploading(false);
    }
  };

  // Handle document deletion
  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      deleteNoticia.mutate(id, {
        onSuccess: () => {
          toast.success('Noticia eliminada correctamente');
          refetch();
        },
        onError: (error) => {
          toast.error(`Error al eliminar noticia: ${error.message}`);
        }
      });
    }
  };

  // View news detail
  const handleViewNews = (id: string) => {
    navigate(`/noticias/${id}`);
  };

  // Get company name from ID
  const getCompanyName = (id: string | null): string => {
    if (!id) return 'Sin compañía';
    const company = companias.find(c => c.id === id);
    return company ? company.nombre : 'Sin compañía';
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Cargando noticias...</div>;
  }

  if (error) {
    return <div className="text-destructive p-8">Error al cargar noticias: {error.message}</div>;
  }

  return (
    <div className="space-y-6 animate-slideInUp">
      {/* Header with search and buttons */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar noticias..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col md:flex-row gap-2">
          {/* Company filter */}
          <Select value={companiaFilter || 'none'} onValueChange={setCompaniaFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filtrar por compañía" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Todas las compañías</SelectItem>
              {companias.map(company => (
                <SelectItem key={company.id} value={company.id}>
                  {company.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Crear noticia
          </Button>
        </div>
      </div>

      {/* View selector */}
      <div className="flex justify-end">
        <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as 'grid' | 'list')}>
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">Lista</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* MAIN TABS - Wrapping all TabsContent components */}
      <Tabs value={currentView} className="mt-0">
        {/* News grid view */}
        <TabsContent value="grid" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNoticias.length > 0 ? (
              filteredNoticias.map(noticia => (
                <Card key={noticia.id} className="overflow-hidden">
                  <div className="relative h-48 bg-muted">
                    {noticia.imagen_url ? (
                      <img 
                        src={noticia.imagen_url} 
                        alt={noticia.titulo} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-muted">
                        <FileText className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    {noticia.es_destacada && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 text-xs rounded-md">
                        Destacada
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex flex-col h-full">
                      <h3 className="font-medium text-lg mb-2 line-clamp-2">{noticia.titulo}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{noticia.contenido}</p>
                      
                      <div className="mt-auto space-y-2 text-sm">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {noticia.compania_id && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {getCompanyName(noticia.compania_id)}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex justify-between">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(noticia.fecha_publicacion)}</span>
                          </div>
                          {noticia.autor && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <User className="h-4 w-4" />
                              <span>{noticia.autor}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-between mt-4">
                          <Button variant="outline" size="sm" onClick={() => handleViewNews(noticia.id)}>
                            Leer más
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(noticia.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="mt-4 text-lg font-medium">No se encontraron noticias</h3>
                <p className="text-muted-foreground">Intenta con otros criterios de búsqueda o crea una nueva noticia</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* News list view */}
        <TabsContent value="list" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Noticia</th>
                    <th className="text-left p-4 hidden md:table-cell">Compañía</th>
                    <th className="text-left p-4 hidden md:table-cell">Autor</th>
                    <th className="text-left p-4">Fecha</th>
                    <th className="text-left p-4 hidden md:table-cell">Destacada</th>
                    <th className="text-right p-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNoticias.length > 0 ? (
                    filteredNoticias.map(noticia => (
                      <tr key={noticia.id} className="border-b">
                        <td className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-muted rounded-md h-12 w-12 overflow-hidden flex-shrink-0">
                              {noticia.imagen_url ? (
                                <img 
                                  src={noticia.imagen_url} 
                                  alt={noticia.titulo} 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <FileText className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{noticia.titulo}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">{noticia.contenido}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          {noticia.compania_id ? getCompanyName(noticia.compania_id) : '-'}
                        </td>
                        <td className="p-4 hidden md:table-cell">{noticia.autor || '-'}</td>
                        <td className="p-4">{formatDate(noticia.fecha_publicacion)}</td>
                        <td className="p-4 hidden md:table-cell">
                          {noticia.es_destacada ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                              Sí
                            </span>
                          ) : 'No'}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleViewNews(noticia.id)}>
                              Leer más
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(noticia.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-6">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                        <h3 className="mt-4 text-lg font-medium">No se encontraron noticias</h3>
                        <p className="text-muted-foreground">Intenta con otros criterios de búsqueda o crea una nueva noticia</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create news dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crear noticia</DialogTitle>
            <DialogDescription>
              Crea una nueva noticia para publicar en el sistema
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  name="titulo"
                  value={newNoticia.titulo}
                  onChange={handleInputChange}
                  placeholder="Título de la noticia"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contenido">Contenido</Label>
                <Textarea
                  id="contenido"
                  name="contenido"
                  value={newNoticia.contenido || ''}
                  onChange={handleInputChange}
                  placeholder="Contenido de la noticia"
                  rows={5}
                />
              </div>

              {/* Compañía relacionada */}
              <div className="space-y-2">
                <Label htmlFor="compania">Compañía relacionada</Label>
                <Select 
                  value={newNoticia.compania_id || 'none'} 
                  onValueChange={handleCompanyChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar compañía" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin compañía</SelectItem>
                    {companias.map(company => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="autor">Autor</Label>
                <Input
                  id="autor"
                  name="autor"
                  value={newNoticia.autor || currentUser}
                  onChange={handleInputChange}
                  placeholder="Autor de la noticia"
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  El autor se asigna automáticamente al usuario actual
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fecha_publicacion">Fecha de publicación</Label>
                <Input
                  id="fecha_publicacion"
                  name="fecha_publicacion"
                  type="date"
                  value={newNoticia.fecha_publicacion ? new Date(newNoticia.fecha_publicacion).toISOString().split('T')[0] : ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="es_destacada" 
                  checked={newNoticia.es_destacada}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="es_destacada">Noticia destacada</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="file">Imagen</Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <p className="text-xs text-muted-foreground">
                  Formatos soportados: JPG, PNG, GIF. Tamaño máximo: 5MB
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={uploading}>
                {uploading ? 'Creando...' : 'Crear noticia'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default News;
