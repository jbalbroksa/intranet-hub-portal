import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
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
  Package 
} from 'lucide-react';
import { toast } from 'sonner';
import { useDocumentos } from '@/hooks/useDocumentos';
import { useSupabaseUpload, getPublicUrl } from '@/hooks/useSupabaseQuery';
import { DocumentoFormData } from '@/types/database';

const documentCategories = [
  { id: 1, name: 'Pólizas', icon: FileText },
  { id: 2, name: 'Normativas', icon: File },
  { id: 3, name: 'Manuales', icon: FileText },
  { id: 4, name: 'Contratos', icon: FileText },
  { id: 5, name: 'Otros', icon: File },
];

const productCategories = [
  { id: 1, name: 'Automóvil' },
  { id: 2, name: 'Hogar' },
  { id: 3, name: 'Vida' },
];

const Documents = () => {
  const { 
    documentos, 
    filteredDocumentos, 
    isLoading, 
    error, 
    searchTerm, 
    setSearchTerm, 
    createDocumento, 
    updateDocumento, 
    deleteDocumento, 
    refetch 
  } = useDocumentos();
  
  const uploadFile = useSupabaseUpload();
  
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedProductCategory, setSelectedProductCategory] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newDocument, setNewDocument] = useState<DocumentoFormData>({
    nombre: '',
    descripcion: '',
    archivo_url: '',
    categoria: '',
    fecha_subida: new Date().toISOString(),
  });
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
  const [uploading, setUploading] = useState(false);

  const applyFilters = useCallback(() => {
    const filtered = filteredDocumentos.filter(document => {
      const matchesDocCategory = selectedCategory === null || 
        (document.categoria === documentCategories.find(cat => cat.id === selectedCategory)?.name.toLowerCase());
      
      const matchesProductCategory = selectedProductCategory === null; // We would need to implement product categories in the database
      
      return matchesDocCategory && matchesProductCategory;
    });
    return filtered;
  }, [filteredDocumentos, selectedCategory, selectedProductCategory]);

  const filteredDocumentsWithCategoryFilter = applyFilters();

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryName = (categoryName: string | null | undefined): string => {
    if (!categoryName) return 'Sin categoría';
    const category = documentCategories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
    return category ? category.name : 'Sin categoría';
  };

  const getCategoryIcon = (categoryName: string | null | undefined): React.ElementType => {
    if (!categoryName) return File;
    const category = documentCategories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
    return category ? category.icon : File;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileSelected(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDocument({
      ...newDocument,
      [name]: value
    });
  };

  const handleCategoryChange = (value: string) => {
    const category = documentCategories.find(cat => cat.id === parseInt(value));
    if (category) {
      setNewDocument({
        ...newDocument,
        categoria: category.name.toLowerCase()
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fileSelected || !newDocument.nombre) {
      toast.error('Por favor, completa todos los campos obligatorios y selecciona un archivo');
      return;
    }
    
    setUploading(true);
    
    try {
      const fileName = `${Date.now()}_${fileSelected.name.replace(/\s+/g, '_')}`;
      const filePath = await uploadFile.mutateAsync({
        bucketName: 'documentos',
        filePath: fileName,
        file: fileSelected
      });
      
      const publicUrl = getPublicUrl('documentos', filePath);
      
      const documentData: DocumentoFormData = {
        ...newDocument,
        archivo_url: publicUrl,
        fecha_subida: new Date().toISOString()
      };
      
      await createDocumento.mutateAsync(documentData);
      
      setNewDocument({
        nombre: '',
        descripcion: '',
        archivo_url: '',
        categoria: '',
        fecha_subida: new Date().toISOString(),
      });
      setFileSelected(null);
      setDialogOpen(false);
      
      refetch();
      toast.success('Documento subido correctamente');
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast.error(`Error al subir documento: ${error.message || ''}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este documento?')) {
      deleteDocumento.mutate(id, {
        onSuccess: () => {
          toast.success('Documento eliminado correctamente');
          refetch();
        },
        onError: (error) => {
          toast.error(`Error al eliminar documento: ${error.message}`);
        }
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Cargando documentos...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">Error al cargar productos: {error.message}</div>;
  }

  return (
    <div className="space-y-6 animate-slideInUp">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar documentos..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col md:flex-row gap-2">
          <Select 
            value={selectedCategory?.toString() || 'all'} 
            onValueChange={(value) => setSelectedCategory(value ? parseInt(value) : null)}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filtrar por categoría" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {documentCategories.map(category => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={selectedProductCategory?.toString() || 'all'} 
            onValueChange={(value) => setSelectedProductCategory(value ? parseInt(value) : null)}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filtrar por producto" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los productos</SelectItem>
              {productCategories.map(category => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Subir documento
          </Button>
        </div>
      </div>

      <div className="flex justify-end">
        <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as 'grid' | 'list')}>
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">Lista</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={currentView} className="mt-0">
        <TabsContent value="grid" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocumentsWithCategoryFilter.length > 0 ? (
              filteredDocumentsWithCategoryFilter.map(document => (
                <Card key={document.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          {React.createElement(getCategoryIcon(document.categoria), { 
                            className: "h-6 w-6 text-primary" 
                          })}
                        </div>
                        <div className="flex gap-2">
                          {document.archivo_url && (
                            <a 
                              href={document.archivo_url}
                              className="p-2 rounded-md hover:bg-muted transition-colors"
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          )}
                          <button 
                            onClick={() => handleDelete(document.id)}
                            className="p-2 rounded-md hover:bg-muted transition-colors"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="font-medium text-lg mb-2">{document.nombre}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{document.descripcion}</p>
                      
                      <div className="mt-auto space-y-2 text-sm">
                        <div className="flex justify-between">
                          <div className="text-primary">{getCategoryName(document.categoria)}</div>
                        </div>
                        
                        <div className="flex justify-between">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(document.fecha_subida || document.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <File className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="mt-4 text-lg font-medium">No se encontraron documentos</h3>
                <p className="text-muted-foreground">Intenta con otros criterios de búsqueda o sube un nuevo documento</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Documento</th>
                    <th className="text-left p-4">Categoría</th>
                    <th className="text-left p-4">Fecha</th>
                    <th className="text-right p-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocumentsWithCategoryFilter.length > 0 ? (
                    filteredDocumentsWithCategoryFilter.map(document => (
                      <tr key={document.id} className="border-b">
                        <td className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/10 p-2 rounded-md">
                              {React.createElement(getCategoryIcon(document.categoria), { 
                                className: "h-5 w-5 text-primary" 
                              })}
                            </div>
                            <div>
                              <div className="font-medium">{document.nombre}</div>
                              <div className="text-sm text-muted-foreground">{document.descripcion}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">{getCategoryName(document.categoria)}</td>
                        <td className="p-4">{formatDate(document.fecha_subida || document.created_at)}</td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            {document.archivo_url && (
                              <a 
                                href={document.archivo_url}
                                className="p-2 rounded-md hover:bg-muted transition-colors"
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            )}
                            <button 
                              onClick={() => handleDelete(document.id)}
                              className="p-2 rounded-md hover:bg-muted transition-colors"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-6">
                        <File className="h-12 w-12 text-muted-foreground mx-auto" />
                        <h3 className="mt-4 text-lg font-medium">No se encontraron documentos</h3>
                        <p className="text-muted-foreground">Intenta con otros criterios de búsqueda o sube un nuevo documento</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Subir documento</DialogTitle>
            <DialogDescription>
              Sube un nuevo documento al sistema
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Título *</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={newDocument.nombre}
                  onChange={handleInputChange}
                  placeholder="Título del documento"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  name="descripcion"
                  value={newDocument.descripcion || ''}
                  onChange={handleInputChange}
                  placeholder="Descripción del documento"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría</Label>
                <Select
                  value={documentCategories.find(cat => cat.name.toLowerCase() === newDocument.categoria)?.id.toString() || ''}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentCategories.map(category => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="file">Archivo *</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Formatos soportados: PDF, DOCX, XLSX, PPTX. Tamaño máximo: 10MB
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={uploading}>
                {uploading ? 'Subiendo...' : 'Subir documento'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Documents;
