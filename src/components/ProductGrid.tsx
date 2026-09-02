/**
 * Project: CloudKart
 * File: ProductGrid.tsx
 * Description: React component with TypeScript.
 */

import fetchData from "@/lib/fetchDataFromApi";
import layoutSettings from "@/lib/layoutSettings";
import NoProductFound from "./NoProductFound";
import Paginations from "./Paginations";
import ProductCard from "./cards/ProductCard";
import type { AllProduct } from "@/types/product";

type CategoryPageProps = {
  searchParams: SearchParamsType;
  params: {
    category?: string;
    shop: string;
  };
};

const ProductGrid = async ({
  params,
  searchParams,
}: CategoryPageProps) => {
  try {
    const { shop, category } = params;

    // Helper to safely convert string | string[] | undefined to string
    const getSearchParam = (
      value: string | string[] | undefined
    ): string => {
      if (Array.isArray(value)) {
        return value[0] || "";
      }

      return value || "";
    };

    const queryParams: Record<string, string> = {
      page: getSearchParam(searchParams?.page) || "1",
      shop_category: shop,
    };

    if (category) {
      queryParams.categories = category;
    }

    const q = getSearchParam(searchParams?.q);
    if (q) {
      queryParams.search = q;
    }

    const sort = getSearchParam(searchParams?.sort);
    if (sort) {
      queryParams.sort = sort;
    }

    const color = getSearchParam(searchParams?.color);
    if (color) {
      queryParams.color = color;
    }

    const minPrice = getSearchParam(searchParams?.minPrice);
    if (minPrice) {
      queryParams.minPrice = minPrice;
    }

    const maxPrice = getSearchParam(searchParams?.maxPrice);
    if (maxPrice) {
      queryParams.maxPrice = maxPrice;
    }

    console.log("PRODUCT GRID PARAMS:", queryParams);

    const res = await fetchData.get("/products", queryParams);

    const products = (res.data?.products || []) as AllProduct[];

    const totalCount = res.data?.pagination?.total || 0;

    const settings =
      layoutSettings?.[shop] || {
        productCardVariants: "style-1",
      };

    if (products.length === 0) {
      return <NoProductFound />;
    }

    return (
      <>
        <div className="grid-layout pt-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              variants={settings.productCardVariants}
            />
          ))}
        </div>

        <Paginations
          totalCount={totalCount}
          currentPage={Number(queryParams.page)}
          totalPages={Math.ceil(totalCount / 10)}
        />
      </>
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return <NoProductFound />;
  }
};

export default ProductGrid;
