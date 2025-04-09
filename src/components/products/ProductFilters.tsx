import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Plus } from "lucide-react";

type Category = {
  id: string | number;
  name: string;
};

type Company = {
  id: string | number;
  name: string;
};

type ProductFiltersProps = {
  searchTerm: string;
  categories?: Category[];
  companies?: Company[];
  selectedCategoryFilter: string | null;
  selectedCompanyFilter: string | number | null;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryFilterChange: (categoryId: string | null) => void;
  onCompanyFilterChange: (companyId: string | number | null) => void;
  onClearFilters: () => void;
  onCreateClick: () => void;
};

const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchTerm,
  categories = [], // Add default empty array
  companies = [], // Add default empty array
  selectedCategoryFilter,
  selectedCompanyFilter,
  onSearchChange,
  onCategoryFilterChange,
  onCompanyFilterChange,
  onClearFilters,
  onCreateClick,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar productos..."
          className="pl-9"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select
          value={selectedCategoryFilter?.toString() || "all"}
          onValueChange={(value) =>
            onCategoryFilterChange(value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              <span>
                {selectedCategoryFilter
                  ? "Categoría: " +
                    categories.find(
                      (c) =>
                        c.id.toString() === selectedCategoryFilter.toString(),
                    )?.name
                  : "Todas las categorías"}
              </span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedCompanyFilter?.toString() || "all"}
          onValueChange={(value) =>
            onCompanyFilterChange(value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              <span>
                {selectedCompanyFilter
                  ? "Compañía: " +
                    companies.find(
                      (c) =>
                        c.id.toString() === selectedCompanyFilter.toString(),
                    )?.name
                  : "Todas las compañías"}
              </span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las compañías</SelectItem>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id.toString()}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          Limpiar filtros
        </Button>

        <Button onClick={onCreateClick}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>
    </div>
  );
};

export default ProductFilters;
