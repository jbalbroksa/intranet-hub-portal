import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Download, Trash, Filter, Upload, FileText, File, Image } from 'lucide-react';
import { format } from 'date-fns';

// Mock data for categories
const mockCategories = [
  { id: 1, name: 'Manuales' },
  { id: 2, name: 'Condicionados' },
  { id: 3, name: 'Formularios' },
  { id: 4, name: 'Marketing' },
  { id: 5, name: 'Normativa' },
];

// Mock data for products
const mockProducts = [
  { id: 1, name: 'Seguro Todo Riesgo Plus', categoryId: 1 },
  { id: 2, name: 'Seguro Hogar Completo', categoryId: 2 },
  { id: 3, name: 'Seguro de Vida Ahorro', categoryId: 3 },
  { id: 4, name: 'Terceros Ampliado', categoryId: 1 },
  { id: 5, name: 'Hogar Básico', categoryId: 2 },
];

// Mock data for companies
const mockCompanies = [
  { id: 1, name: 'Mapfre' },
  { id: 2, name: 'Allianz' },
  { id: 3, name: 'AXA' },
  { id: 4, name: 'Generali' },
  { id: 5, name: 'Zurich' },
];

// Mock data for documents
const mockDocuments = [
  { 
    id: 1, 
    name: 'Manual de procedimientos.pdf', 
    type: 'pdf', 
    size: '2.5 MB', 
    uploadDate: '2023-05-01', 
    categoryId: 1, 
    productId: 1, 
    companies: [1, 3], 
    downloads: 45,
    path: '#' 
  },
  { 
    id: 2, 
    name: 'Condiciones generales hogar.pdf', 
    type: 'pdf', 
    size: '1.8 MB', 
    uploadDate: '2023-05-05', 
    categoryId: 2, 
    productId: 2, 
    companies: [2, 5], 
    downloads: 30,
    path: '#' 
  },
  { 
    id: 3, 
    name: 'Formulario reclamación.docx', 
    type: 'docx', 
    size: '0.5 MB', 
    uploadDate: '2023-05-10', 
    categoryId: 3, 
    productId: null, 
    companies: [1, 2, 3, 4, 5], 
    downloads: 80,
    path: '#' 
  },
  { 
    id: 4, 
    name: 'Catálogo productos.pdf', 
    type: 'pdf', 
    size: '3.2 MB', 
    uploadDate: '2023-05-15', 
    categoryId: 4, 
    productId: null, 
    companies: [1, 4], 
    downloads: 25,
    path: '#' 
  },
  { 
    id: 5, 
    name: 'Infografía coberturas.png', 
    type: 'png', 
    size: '1.1 MB', 
    uploadDate: '2023-05-20', 
    categoryId: 4, 
    productId: 3, 
    companies: [2, 3], 
    downloads: 60,
    path: '#' 
  },
];

type Category = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
  categoryId: number;
};

type Company = {
  id: number;
  name: string;
};

type Document = {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  categoryId: number | null;
  productId: number | null;
  companies: number[];
  downloads: number;
  path: string;
};

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [categories] = useState<Category[]>(mockCategories);
  const [products] = useState<Product[]>(mockProducts);
  const [companies] = useState<Company[]>(mockCompanies);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number | null>(null);
  const [selectedProductFilter, setSelectedProductFilter] = useState<number | null>(null);
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    file: null as File | null,
    categoryId: '' as string | null,
    productId: '' as string | null,
    companies: [] as number[],
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter documents based on search term and filters
  const filteredDocuments = documents.filter(document => {
    const matchesSearch = document.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategoryFilter === null || document.categoryId === selectedCategoryFilter;
    
    const matchesProduct = selectedProductFilter === null || document.productId === selectedProductFilter;
    
    const matchesCompany = selectedCompanyFilter === null || document.companies.includes(selectedCompanyFilter);
    
    return matchesSearch && matchesCategory && matchesProduct && matchesCompany;
  });

  // Handle category filter selection
  const handleCategoryFilter = (value: string) => {
    setSelectedCategoryFilter(value ? parseInt(value) : null);
  };

  // Handle product filter selection
  const handleProductFilter = (value: string) => {
    setSelectedProductFilter(value ? parseInt(value) : null);
  };

  // Handle company filter selection
  const handleCompanyFilter = (value: string) => {
    setSelectedCompanyFilter(value ? parseInt(value) : null);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategoryFilter(null);
    setSelectedProductFilter(null);
    setSelectedCompanyFilter(null);
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        file,
      });
    }
  };

  // Handle category selection in form
  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      categoryId: value,
    });
  };

  // Handle product selection in form
  const handleProductChange = (value: string) => {
    setFormData({
      ...formData,
      productId: value,
    });
  };

  // Handle company selection in form
  const handleCompanyChange = (companyId: number) => {
    setFormData({
      ...formData,
      companies: formData.companies.includes(companyId)
        ? formData.companies.filter(id => id !== companyId)
        : [...formData.companies, companyId],
    });
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      file: null,
      categoryId: null,
      productId: null,
      companies: [],
    });
  };

  // Open dialog for uploading a new document
  const openUploadDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.file) {
      // Get file extension
      const fileExt = formData.file.name.split('.').pop()?.toLowerCase() || '';
      
      // Create new document
      const newDocument: Document = {
        id: Math.max(0, ...documents.map(d => d.id)) + 1,
        name: formData.file.name,
        type: fileExt,
        size: formatFileSize(formData.file.size),
        uploadDate: format(new Date(), 'yyyy-MM-dd'),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        productId: formData.productId ? parseInt(formData.productId) : null,
        companies: [...formData.companies],
        downloads: 0,
        path: '#', // In a real app, this would be the path to the uploaded file
      };
      
      setDocuments([...documents, newDocument]);
    }
    
    setDialogOpen(false);
    resetForm();
  };

  // Handle document deletion
  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este documento?')) {
      setDocuments(documents.filter(doc => doc.id !== id));
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get category name by id
  const getCategoryName = (categoryId: number | null) => {
    if (categoryId === null) return 'Sin categoría';
    
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Sin categoría';
  };

  // Get product name by id
  const getProductName = (productId: number | null) => {
    if (productId === null) return 'Sin producto';
    
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Sin producto';
  };

  // Get company names by ids
  const getCompanyNames = (companyIds: number[]) => {
    return companyIds
      .map(id => companies.find(c => c.id === id)?.name || '')
      .filter(Boolean)
      .join(', ');
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (e) {
      return dateString;
    }
  };

  // Get icon for file type
  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <File className="h-5 w-5 text-red-500" />;
      case 'docx':
      case 'doc':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6 animate-slideInUp">
      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar documentos..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Limpiar filtros
          </Button>
          
          <Button onClick={openUploadDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Subir Documento
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Select value={selectedCategoryFilter?.toString() || ""} onValueChange={handleCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas las categorías</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select value={selectedProductFilter?.toString() || ""} onValueChange={handleProductFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por producto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos los productos</SelectItem>
              {products.map(product => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select value={selectedCompanyFilter?.toString() || ""} onValueChange={handleCompanyFilter}>
            <SelectTrigger>
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
        </div>
      </div>

      {/* Documents table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="hidden md:table-cell">Categoría</TableHead>
                <TableHead className="hidden md:table-cell">Producto</TableHead>
                <TableHead className="hidden lg:table-cell">Compañías</TableHead>
                <TableHead className="hidden lg:table-cell">Fecha</TableHead>
                <TableHead className="hidden lg:table-cell">Tamaño</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getFileIcon(document.type)}
                        <div>
                          <div className="font-medium">{document.name}</div>
                          <div className="text-xs text-muted-foreground md:hidden">
                            {getCategoryName(document.categoryId)} • {document.size} • {formatDate(document.uploadDate)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{getCategoryName(document.categoryId)}</TableCell>
                    <TableCell className="hidden md:table-cell">{getProductName(document.productId)}</TableCell>
                    <TableCell className="hidden lg:table-cell truncate max-w-[150px]">{getCompanyNames(document.companies)}</TableCell>
                    <TableCell className="hidden lg:table-cell">{formatDate(document.uploadDate)}</TableCell>
                    <TableCell className="hidden lg:table-cell">{document.size}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={document.path} download>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(document.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No se encontraron documentos
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upload dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Subir nuevo documento</DialogTitle>
            <DialogDescription>
              Seleccione un archivo y complete la información del documento.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">Documento</Label>
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center">
                  {formData.file ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center">
                        {getFileIcon(formData.file.name.split('.').pop() || '')}
                      </div>
                      <div className="text-sm font-medium">{formData.file.name}</div>
                      <div className="text-xs text-muted-foreground">{formatFileSize(formData.file.size)}</div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setFormData({ ...formData, file: null })}
                      >
                        Cambiar archivo
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col items-center justify-center gap-1">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <div className="text-sm font-medium">Arrastre un archivo o haga clic para seleccionar</div>
                        <div className="text-xs text-muted-foreground">
                          Formatos soportados: PDF, DOCX, PNG, JPG
                        </div>
                      </div>
                      <label className="cursor-pointer w-full mt-4">
                        <div className="flex items-center gap-2 text-sm px-3 py-2 border rounded-md hover:bg-muted transition-colors w-full justify-center">
                          <Upload className="h-4 w-4" />
                          <span>Seleccionar archivo</span>
                        </div>
                        <input 
                          type="file" 
                          id="file" 
                          className="hidden" 
                          accept=".pdf,.docx,.png,.jpg,.jpeg" 
                          onChange={handleFileChange} 
                          required
                        />
                      </label>
                    </>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select value={formData.categoryId || ""} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin categoría</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="product">Producto</Label>
                <Select value={formData.productId || ""} onValueChange={handleProductChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin producto</SelectItem>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Compañías</Label>
                <div className="border rounded-md p-3 max-h-[150px] overflow-y-auto">
                  {companies.map(company => (
                    <div key={company.id} className="flex items-center space-x-2 py-1">
                      <input
                        type="checkbox"
                        id={`company-${company.id}`}
                        checked={formData.companies.includes(company.id)}
                        onChange={() => handleCompanyChange(company.id)}
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
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!formData.file}>
                Subir
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Documents;
