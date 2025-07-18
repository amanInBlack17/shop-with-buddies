
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Smartphone, Laptop, Headphones, Camera, Watch, TrendingUp, Package } from 'lucide-react';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  title: string;
  image: string;
  price: number;
  originalPrice?: number;
  category: string;
  stock: number;
  inStock: boolean;
  description: string;
  store: string;
}

interface SearchDropdownProps {
  placeholder?: string;
  className?: string;
}

// Same fallback products as ProductGrid
const fallbackProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    title: 'Wireless Bluetooth Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    price: 79.99,
    originalPrice: 99.99,
    category: 'Electronics',
    stock: 25,
    inStock: true,
    description: 'High-quality wireless headphones with noise cancellation',
    store: 'TechStore'
  },
  {
    id: '2',
    name: 'Smartphone Case',
    title: 'Smartphone Case',
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8',
    price: 24.99,
    category: 'Accessories',
    stock: 50,
    inStock: true,
    description: 'Durable protection for your smartphone',
    store: 'AccessoryHub'
  },
  {
    id: '3',
    name: 'Running Shoes',
    title: 'Running Shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    price: 129.99,
    originalPrice: 159.99,
    category: 'Sports',
    stock: 15,
    inStock: true,
    description: 'Comfortable running shoes for all terrains',
    store: 'SportZone'
  },
  {
    id: '4',
    name: 'Coffee Maker',
    title: 'Coffee Maker',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e',
    price: 89.99,
    category: 'Home',
    stock: 8,
    inStock: true,
    description: 'Automatic coffee maker with timer',
    store: 'HomeGoods'
  }
];

export const SearchDropdown = ({ placeholder = "Search products, brands, or stores...", className }: SearchDropdownProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [filteredResults, setFilteredResults] = useState({
    products: [],
    brands: [],
    categories: [],
    stores: []
  });
  const searchRef = useRef<HTMLDivElement>(null);

  // Use same fetch logic as ProductGrid
  const fetchProducts = async () => {
    // Only try to fetch from API if VITE_PUBLIC_BASEURL is defined
    if (!import.meta.env.VITE_PUBLIC_BASEURL) {
      console.log('Using fallback products - no API endpoint configured');
      setProducts(fallbackProducts);
      return;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_PUBLIC_BASEURL}/api/products`);
      
      // Ensure response.data is an array
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (response.data && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      } else {
        console.warn('API response is not in expected format, using fallback products');
        setProducts(fallbackProducts);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      console.log('Using fallback products due to API error');
      setProducts(fallbackProducts);
    }
  };

  // Load products data
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Only show results when there's a search query
    if (query.length > 0) {
      const searchTerm = query.toLowerCase();
      
      // Filter products that match the search term and are in stock
      const filteredProducts = products.filter(
        product => 
          product.inStock && (
            product.name.toLowerCase().includes(searchTerm) ||
            product.title.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
          )
      ).slice(0, 8);

      // Get unique brands (stores) that have matching products
      const matchingProducts = products.filter(product => 
        product.inStock && (
          product.name.toLowerCase().includes(searchTerm) ||
          product.title.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.store.toLowerCase().includes(searchTerm)
        )
      );

      const allStores = [...new Set(matchingProducts.map(p => p.store))];
      const filteredBrands = allStores.filter(
        store => store.toLowerCase().includes(searchTerm)
      ).slice(0, 4);

      // Get unique categories that have matching products
      const allCategories = [...new Set(matchingProducts.map(p => p.category))];
      const filteredCategories = allCategories.filter(
        category => category.toLowerCase().includes(searchTerm)
      ).slice(0, 4);

      setFilteredResults({
        products: filteredProducts,
        brands: filteredBrands.map(brand => ({ 
          name: brand, 
          count: matchingProducts.filter(p => p.store === brand).length 
        })),
        categories: filteredCategories.map(cat => ({ 
          name: cat, 
          count: matchingProducts.filter(p => p.category === cat).length 
        })),
        stores: filteredBrands.map(store => ({ 
          name: store, 
          count: matchingProducts.filter(p => p.store === store).length 
        }))
      });
    } else {
      // Clear results when no query
      setFilteredResults({
        products: [],
        brands: [],
        categories: [],
        stores: []
      });
    }
  }, [query, products]);

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
    setQuery('');
    setIsOpen(false);
  };

  const handleBrandClick = (brandName: string) => {
    setQuery(brandName);
    setIsOpen(false);
  };

  const handleCategoryClick = (categoryName: string) => {
    setQuery(categoryName);
    setIsOpen(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'electronics': return Smartphone;
      case 'computers': return Laptop;
      case 'audio': return Headphones;
      case 'cameras': return Camera;
      case 'wearables': return Watch;
      default: return Package;
    }
  };

  const hasResults = filteredResults.products.length > 0 || 
                   filteredResults.brands.length > 0 || 
                   filteredResults.categories.length > 0;

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-4 py-2 w-full rounded-full border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base"
        />
      </div>

      {isOpen && query.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-[80vh] sm:max-h-96 overflow-y-auto shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-0">
            {!hasResults ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm sm:text-base">No results found for "{query}"</p>
                <p className="text-xs sm:text-sm mt-1 opacity-75">Try searching for different keywords</p>
              </div>
            ) : (
              <div className="space-y-1">
                {/* Products */}
                {filteredResults.products.length > 0 && (
                  <div>
                    <div className="px-3 sm:px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600 sticky top-0 z-10">
                      <h4 className="font-medium text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                        Products ({filteredResults.products.length})
                      </h4>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {filteredResults.products.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleProductClick(product)}
                          className="flex items-center space-x-3 px-3 sm:px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                        >
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs sm:text-sm truncate dark:text-white">{product.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{product.category} • {product.store}</p>
                          </div>
                          <div className="flex flex-col items-end flex-shrink-0">
                            <span className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">${product.price}</span>
                            {product.originalPrice && (
                              <span className="text-xs text-gray-400 line-through">${product.originalPrice}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories */}
                {filteredResults.categories.length > 0 && (
                  <div>
                    <div className="px-3 sm:px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600 sticky top-0 z-10">
                      <h4 className="font-medium text-xs sm:text-sm text-gray-700 dark:text-gray-300">Categories</h4>
                    </div>
                    {filteredResults.categories.map((category, index) => {
                      const IconComponent = getCategoryIcon(category.name);
                      return (
                        <div
                          key={index}
                          onClick={() => handleCategoryClick(category.name)}
                          className="flex items-center justify-between px-3 sm:px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <IconComponent className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="font-medium text-xs sm:text-sm dark:text-white capitalize truncate">{category.name}</span>
                          </div>
                          <Badge variant="outline" className="text-xs flex-shrink-0 ml-2">
                            {category.count} items
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Stores */}
                {filteredResults.brands.length > 0 && (
                  <div>
                    <div className="px-3 sm:px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600 sticky top-0 z-10">
                      <h4 className="font-medium text-xs sm:text-sm text-gray-700 dark:text-gray-300">Stores</h4>
                    </div>
                    {filteredResults.brands.map((brand, index) => (
                      <div
                        key={index}
                        onClick={() => handleBrandClick(brand.name)}
                        className="flex items-center justify-between px-3 sm:px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        <span className="font-medium text-xs sm:text-sm dark:text-white truncate flex-1 min-w-0">{brand.name}</span>
                        <Badge variant="secondary" className="text-xs flex-shrink-0 ml-2">
                          {brand.count} products
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
