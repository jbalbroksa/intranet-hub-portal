
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import WysiwygEditor from '@/components/WysiwygEditor';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useNoticias } from '@/hooks/useNoticias';
import { useSupabaseUpload, getPublicUrl } from '@/hooks/useSupabaseQuery';
import { useCategoriaProductos } from '@/hooks/useCategoriaProductos';
import { supabase } from '@/integrations/supabase/client';
import { NoticiaFormData } from '@/types/database';
import { X, ArrowLeft, ImageIcon, Tag } from 'lucide-react';
import { useProductos } from '@/hooks/useProductos';

const NewsCreate = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('Administrador');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  
  const uploadFile = useSupabaseUpload();
  
  const { companias, createNoticia } = useNoticias();
  const { categoriasOrganizadas } = useCategoriaProductos();
  const { productos } = useProductos();
  
  const [formData, setFormData] = useState<NoticiaFormData>({
    titulo: '',
    contenido: '',
    imagen_url: '',
    autor: currentUser,
    fecha_publicacion: new Date().toISOString().split('T')[0],
    es_destacada: false,
    compania_id: null,
    categoria_producto_id: null,
    productos_relacionados: [],
    tags: []
  });

  // Get current user on component mount
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user.email || 'Usuario');
        setFormData(prev => ({ ...prev, autor: session.user.email || 'Usuario' }));
      }
    };
    
    getCurrentUser();
  }, []);

  // Preview file when selected
  useEffect(() => {
    if (fileSelected) {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(fileSelected);
    } else {
      setFilePreview(null);
    }
  }, [fileSelected]);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileSelected(e.target.files[0]);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle rich text editor changes
  const handleContentChange = (content: string) => {
    setFormData({
      ...formData,
      contenido: content
    });
  };

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      es_destacada: checked
    });
  };

  // Handle dropdown select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value === 'none' ? null : value
    });
  };

  // Handle tag input
  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      const updatedTags = [...tags, newTag];
      setTags(updatedTags);
      setFormData({
        ...formData,
        tags: updatedTags
      });
      setNewTag('');
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    setFormData({
      ...formData,
      tags: updatedTags
    });
  };

  // Handle product selection
  const handleProductToggle = (productId: string) => {
    let updatedProducts;
    if (selectedProducts.includes(productId)) {
      updatedProducts = selectedProducts.filter(id => id !== productId);
    } else {
      updatedProducts = [...selectedProducts, productId];
    }
    setSelectedProducts(updatedProducts);
    setFormData({
      ...formData,
      productos_relacionados: updatedProducts
    });
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo) {
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
        ...formData,
        imagen_url: imageUrl || formData.imagen_url,
        fecha_publicacion: formData.fecha_publicacion || new Date().toISOString(),
        autor: formData.autor || currentUser,
        tags: tags,
        productos_relacionados: selectedProducts
      };
      
      await createNoticia.mutateAsync(noticiaData);
      
      toast.success('Noticia creada correctamente');
      navigate('/noticias');
    } catch (error) {
      console.error('Error creating news:', error);
      toast.error('Error al crear la noticia');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-slideInUp">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate('/noticias')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Crear Nueva Noticia</h1>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/noticias')}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit} 
            disabled={uploading || !formData.titulo}
          >
            {uploading ? 'Guardando...' : 'Publicar Noticia'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    placeholder="Título de la noticia"
                    className="text-lg"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contenido">Contenido</Label>
                  <div className="min-h-[400px]">
                    <WysiwygEditor
                      value={formData.contenido || ''}
                      onChange={handleContentChange}
                      placeholder="Escribe el contenido de la noticia aquí..."
                      className="min-h-[350px]"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish settings */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-medium text-lg">Publicación</h3>
              
              <div className="space-y-2">
                <Label htmlFor="fecha_publicacion">Fecha de Publicación</Label>
                <Input
                  id="fecha_publicacion"
                  name="fecha_publicacion"
                  type="date"
                  value={formData.fecha_publicacion ? formData.fecha_publicacion.toString().split('T')[0] : ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="autor">Autor</Label>
                <Input
                  id="autor"
                  name="autor"
                  value={formData.autor || currentUser}
                  onChange={handleInputChange}
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  El autor se asigna automáticamente al usuario actual
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="es_destacada" 
                  checked={formData.es_destacada}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="es_destacada">Noticia destacada</Label>
              </div>
            </CardContent>
          </Card>
          
          {/* Image */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-medium text-lg">Imagen Principal</h3>
              
              {filePreview ? (
                <div className="relative">
                  <img 
                    src={filePreview} 
                    alt="Vista previa" 
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => {
                      setFileSelected(null);
                      setFilePreview(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-8 text-center">
                  <ImageIcon className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Formatos soportados: JPG, PNG, GIF
                  </p>
                  <Input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Label htmlFor="file">
                    <Button variant="outline" type="button" className="w-full">
                      Seleccionar Archivo
                    </Button>
                  </Label>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Categories and companies */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-medium text-lg">Clasificación</h3>
              
              <div className="space-y-2">
                <Label htmlFor="categoria_producto">Categoría de Producto</Label>
                <Select 
                  value={formData.categoria_producto_id || 'none'}
                  onValueChange={(value) => handleSelectChange('categoria_producto_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin categoría</SelectItem>
                    {categoriasOrganizadas.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="compania">Compañía relacionada</Label>
                <Select 
                  value={formData.compania_id || 'none'}
                  onValueChange={(value) => handleSelectChange('compania_id', value)}
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
            </CardContent>
          </Card>
          
          {/* Tags */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-medium text-lg">Etiquetas</h3>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Nueva etiqueta..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTag} variant="outline">Agregar</Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.length > 0 ? (
                  tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      <span className="mr-1">{tag}</span>
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    <span>Sin etiquetas</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Related products */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-medium text-lg">Productos Relacionados</h3>
              
              <div className="max-h-60 overflow-y-auto space-y-1">
                {productos.length > 0 ? (
                  productos.map(producto => (
                    <div key={producto.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`product-${producto.id}`}
                        checked={selectedProducts.includes(producto.id || '')}
                        onCheckedChange={() => handleProductToggle(producto.id || '')}
                      />
                      <Label htmlFor={`product-${producto.id}`}>{producto.nombre}</Label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No hay productos disponibles</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewsCreate;
