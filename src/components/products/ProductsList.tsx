
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type Product = {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  subcategoryId: number;
  level3CategoryId?: number;
  companies: number[];
  features: string[];
  strengths?: string;
  weaknesses?: string;
  observations?: string;
};

type ProductsListProps = {
  products: Product[];
  getCategoryName: (categoryId: number) => string;
  getSubcategoryName: (categoryId: number, subcategoryId: number) => string;
  getCompanyNames: (companyIds: number[]) => string;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
  isLoading?: boolean;
  error?: Error | null;
};

const ProductsList: React.FC<ProductsListProps> = ({
  products,
  getCategoryName,
  getSubcategoryName,
  getCompanyNames,
  onEditProduct,
  onDeleteProduct,
  isLoading = false,
  error = null
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-destructive">
          Error al cargar productos: {error.message}
        </CardContent>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          No se encontraron productos con los filtros seleccionados.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead className="hidden md:table-cell">Categoría</TableHead>
              <TableHead className="hidden md:table-cell">Subcategoría</TableHead>
              <TableHead className="hidden md:table-cell">Compañías</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground md:hidden">
                      {getCategoryName(product.categoryId)} &gt; {getSubcategoryName(product.categoryId, product.subcategoryId)}
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-1">{product.description}</div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{getCategoryName(product.categoryId)}</TableCell>
                <TableCell className="hidden md:table-cell">{getSubcategoryName(product.categoryId, product.subcategoryId)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {product.companies.length > 0 ? (
                      getCompanyNames(product.companies)
                    ) : (
                      <span className="text-muted-foreground text-sm">Ninguna</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEditProduct(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDeleteProduct(product.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProductsList;
