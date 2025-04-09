import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";

type ProductDetailProps = {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  getCategoryName?: (categoryId: string | number) => string;
  getSubcategoryName?: (
    categoryId: string | number,
    subcategoryId: string | number,
  ) => string;
  getCompanyNames?: (companyIds: string[]) => string;
};

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  isOpen,
  onClose,
  onEdit,
  getCategoryName = () => "Categoría desconocida",
  getSubcategoryName = () => "Subcategoría desconocida",
  getCompanyNames = () => "Sin compañías",
}) => {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[600px]"
        aria-describedby="product-detail-description"
      >
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription id="product-detail-description">
            Detalles completos del producto
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Category information */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              {getCategoryName(product.categoryId)}
            </Badge>
            {product.subcategoryId && (
              <Badge variant="outline">
                {getSubcategoryName(product.categoryId, product.subcategoryId)}
              </Badge>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-medium mb-2">Descripción</h3>
            <div
              className="text-sm text-muted-foreground prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: product.description || "Sin descripción",
              }}
            />
          </div>

          {/* Companies */}
          {product.companies && product.companies.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Compañías</h3>
              <p className="text-sm text-muted-foreground">
                {getCompanyNames(product.companies)}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          {onEdit && <Button onClick={onEdit}>Editar</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetail;
