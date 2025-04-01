
import React, { useState } from 'react';
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

// Mock data for document categories
const documentCategories = [
  { id: 1, name: 'Pólizas', icon: FileText },
  { id: 2, name: 'Normativas', icon: File },
  { id: 3, name: 'Manuales', icon: FileText },
  { id: 4, name: 'Contratos', icon: FileText },
  { id: 5, name: 'Otros', icon: File },
];

// Mock data for product categories
const productCategories = [
  { id: 1, name: 'Automóvil' },
  { id: 2, name: 'Hogar' },
  { id: 3, name: 'Vida' },
];

// Mock data for documents
const mockDocuments = [
  { 
    id: 1, 
    title: 'Contrato Comercial', 
    description: 'Modelo de contrato comercial para agentes', 
    category: 4, 
    uploadDate: '2023-05-15T14:30:00',
    uploadedBy: 'admin',
    productCategories: [1, 2],
    fileSize: '2.4 MB',
    fileType: 'application/pdf',
    url: '#'
  },
  { 
    id: 2, 
    title: 'Manual de Usuario', 
    description: 'Manual de usuario para la aplicación de gestión de pólizas', 
    category: 3, 
    uploadDate: '2023-04-20T10:15:00',
    uploadedBy: 'admin',
    productCategories: [1, 3],
    fileSize: '5.7 MB',
    fileType: 'application/pdf',
    url: '#'
  },
  { 
    id: 3, 
    title: 'Política de Privacidad', 
    description: 'Documento de política de privacidad y protección de datos', 
    category: 2, 
    uploadDate: '2023-03-10T09:45:00',
    uploadedBy: 'admin',
    productCategories: [],
    fileSize: '1.1 MB',
    fileType: 'application/pdf',
    url: '#'
  },
  { 
    id: 4, 
    title: 'Póliza Tipo - Automóvil', 
    description: 'Póliza tipo para seguros de automóvil', 
    category: 1, 
    uploadDate: '2023-02-25T16:50:00',
    uploadedBy: 'admin',
    productCategories: [1],
    fileSize: '3.2 MB',
    fileType: 'application/pdf',
    url: '#'
  },
  { 
    id: 5, 
    title: 'Guía de Procedimientos', 
    description: 'Guía interna de procedimientos administrativos', 
    category: 5, 
    uploadDate: '2023-01-05T11:20:00',
    uploadedBy: 'admin',
    productCategories: [],
    fileSize: '4.5 MB',
    fileType: 'application/pdf',
    url: '#'
  }
];

// Document type definition
type Document = {
  id: number;
  title: string;
  description: string;
  category: number;
  uploadDate: string;
  uploadedBy: string;
  productCategories: number[];
  fileSize: string;
  fileType: string;
  url: string;
};

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedProductCategory, setSelectedProductCategory] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newDocument, setNewDocument] = useState<Partial<Document>>({
    title: '',
    description: '',
    category: 1,
    productCategories: [],
  });
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter documents based on search term and category
  const filteredDocuments = documents.filter(document => {
    const matchesSearch = document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          document.description.toLowerCase().includes(searchTerm.toLowerCase());
                          
    const matchesCategory = selectedCategory === null || document.category === selectedCategory;
    
    const matchesProductCategory = selectedProductCategory === null || 
                                  document.productCategories.includes(selectedProductCategory);
                                  
    return matchesSearch && matchesCategory && matchesProductCategory;
  });

  // Format date to a more readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get category name by id
  const getCategoryName = (categoryId: number): string => {
    const category = documentCategories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Sin categoría';
  };

  // Get category icon by id
  const getCategoryIcon = (categoryId: number): React.ElementType => {
    const category = documentCategories.find(cat => cat.id === categoryId);
    return category ? category.icon : File;
  };

  // Get product category names
  const getProductCategoryNames = (categoryIds: number[]): string => {
    return categoryIds.map(id => {
      const category = productCategories.find(cat => cat.id === id);
      return category ? category.name : '';
    }).filter(Boolean).join(', ');
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
    setNewDocument({
      ...newDocument,
      [name]: value
    });
  };

  // Handle category selection
  const handleCategoryChange = (value: string) => {
    setNewDocument({
      ...newDocument,
      category: parseInt(value)
    });
  };

  // Handle product category checkbox change
  const handleProductCategoryChange = (id: number, checked: boolean) => {
    setNewDocument({
      ...newDocument,
      productCategories: checked 
        ? [...(newDocument.productCategories || []), id]
        : (newDocument.productCategories || []).filter(catId => catId !== id)
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fileSelected || !newDocument.title) {
      toast.error('Por favor, completa todos los campos obligatorios y selecciona un archivo');
      return;
    }
    
    // Create new document object
    const newDoc: Document = {
      id: Math.max(0, ...documents.map(d => d.id)) + 1,
      title: newDocument.title || '',
      description: newDocument.description || '',
      category: newDocument.category || 1,
      uploadDate: new Date().toISOString(),
      uploadedBy: 'admin',
      productCategories: newDocument.productCategories || [],
      fileSize: `${(fileSelected.size / (1024 * 1024)).toFixed(1)} MB`,
      fileType: fileSelected.type,
      url: '#'
    };
    
    // Add new document to the list
    setDocuments([...documents, newDoc]);
    
    // Reset form and close dialog
    setNewDocument({
      title: '',
      description: '',
      category: 1,
      productCategories: [],
    });
    setFileSelected(null);
    setDialogOpen(false);
    
    toast.success('Documento subido correctamente');
  };

  // Handle document deletion
  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este documento?')) {
      setDocuments(documents.filter(doc => doc.id !== id));
      toast.success('Documento eliminado correctamente');
    }
  };

  return (
    <div className="space-y-6 animate-slideInUp">
      {/* Header with search and buttons */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar documentos..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex flex-col md:flex-row gap-2">
          <Select 
            value={selectedCategory?.toString() || ''} 
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
            value={selectedProductCategory?.toString() || ''} 
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
        {/* Documents grid view */}
        <TabsContent value="grid" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map(document => (
                <Card key={document.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          {React.createElement(getCategoryIcon(document.category), { 
                            className: "h-6 w-6 text-primary" 
                          })}
                        </div>
                        <div className="flex gap-2">
                          <a 
                            href={document.url}
                            className="p-2 rounded-md hover:bg-muted transition-colors"
                            download
                          >
                            <Download className="h-4 w-4" />
                          </a>
                          <button 
                            onClick={() => handleDelete(document.id)}
                            className="p-2 rounded-md hover:bg-muted transition-colors"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="font-medium text-lg mb-2">{document.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{document.description}</p>
                      
                      <div className="mt-auto space-y-2 text-sm">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            <span>{document.fileSize}</span>
                          </div>
                          <div className="text-primary">{getCategoryName(document.category)}</div>
                        </div>
                        
                        <div className="flex justify-between">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(document.uploadDate)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>{document.uploadedBy}</span>
                          </div>
                        </div>
                        
                        {document.productCategories.length > 0 && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Package className="h-4 w-4" />
                            <span className="truncate">{getProductCategoryNames(document.productCategories)}</span>
                          </div>
                        )}
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

        {/* Documents list view */}
        <TabsContent value="list" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Documento</th>
                    <th className="text-left p-4">Categoría</th>
                    <th className="text-left p-4">Productos</th>
                    <th className="text-left p-4">Fecha</th>
                    <th className="text-left p-4">Tamaño</th>
                    <th className="text-right p-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map(document => (
                      <tr key={document.id} className="border-b">
                        <td className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/10 p-2 rounded-md">
                              {React.createElement(getCategoryIcon(document.category), { 
                                className: "h-5 w-5 text-primary" 
                              })}
                            </div>
                            <div>
                              <div className="font-medium">{document.title}</div>
                              <div className="text-sm text-muted-foreground">{document.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">{getCategoryName(document.category)}</td>
                        <td className="p-4">{getProductCategoryNames(document.productCategories) || '-'}</td>
                        <td className="p-4">{formatDate(document.uploadDate)}</td>
                        <td className="p-4">{document.fileSize}</td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <a 
                              href={document.url}
                              className="p-2 rounded-md hover:bg-muted transition-colors"
                              download
                            >
                              <Download className="h-4 w-4" />
                            </a>
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
                      <td colSpan={6} className="text-center py-6">
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

      {/* Upload document dialog */}
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
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  name="title"
                  value={newDocument.title}
                  onChange={handleInputChange}
                  placeholder="Título del documento"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newDocument.description}
                  onChange={handleInputChange}
                  placeholder="Descripción del documento"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select
                  value={newDocument.category?.toString()}
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
                <Label>Categorías de Productos</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {productCategories.map(category => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`product-category-${category.id}`} 
                        checked={(newDocument.productCategories || []).includes(category.id)}
                        onCheckedChange={(checked) => 
                          handleProductCategoryChange(category.id, checked === true)
                        }
                      />
                      <Label htmlFor={`product-category-${category.id}`} className="text-sm">
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
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
              <Button type="submit">Subir documento</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Documents;
