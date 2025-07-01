import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Heart, ShoppingCart, ThumbsUp, ThumbsDown, Star, Share, Filter, Grid, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/pages/Index';
import axios from 'axios';

interface ProductGridProps {
  onProductSelect: (product: Product) => void;
  selectedProduct: Product | null;
  onAddToCart: (product: Product, quantity?: number) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  isCollabMode?: boolean;
}

// Fallback mock products in case API fails
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

export const ProductGrid = ({ 
  onProductSelect, 
  selectedProduct, 
  onAddToCart,
  onAddToWishlist,
  isInWishlist,
  isCollabMode = false
}: ProductGridProps) => {
  const navigate = useNavigate();
  const [reactions, setReactions] = useState<{[key: string]: number}>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [filterCategory, setFilterCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [mockProducts, setMockProducts] = useState<Product[]>(fallbackProducts);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchProducts = async () => {
    // Only try to fetch from API if VITE_PUBLIC_BASEURL is defined
    if (!import.meta.env.VITE_PUBLIC_BASEURL) {
      console.log('Using fallback products - no API endpoint configured');
      setMockProducts(fallbackProducts);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_PUBLIC_BASEURL}/api/products`);
      
      // Ensure response.data is an array
      if (Array.isArray(response.data)) {
        setMockProducts(response.data);
      } else if (response.data && Array.isArray(response.data.products)) {
        setMockProducts(response.data.products);
      } else {
        console.warn('API response is not in expected format, using fallback products');
        setMockProducts(fallbackProducts);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      console.log('Using fallback products due to API error');
      setMockProducts(fallbackProducts);
      
      toast({
        title: "Using Sample Data",
        description: "Showing sample products. Connect to your backend to load real products.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = ['all', ...Array.from(new Set(mockProducts.map(p => p.category)))];

  const filteredProducts = mockProducts
    .filter(product => {
      if (filterCategory !== 'all' && product.category !== filterCategory) return false;
      if (priceRange.min && product.price < parseFloat(priceRange.min)) return false;
      if (priceRange.max && product.price > parseFloat(priceRange.max)) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        default: return 0;
      }
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (callback: () => void) => {
    callback();
    setCurrentPage(1);
  };

  const handleProductClick = (product: Product) => {
    onProductSelect(product);
    navigate(`/product/${product.id}`);
  };

  const handleReaction = (productId: string, type: 'like' | 'dislike') => {
    const key = `${productId}_${type}`;
    setReactions(prev => ({
      ...prev,
      [key]: (prev[key] || 0) + 1
    }));
    
    toast({
      title: type === 'like' ? "👍 Liked!" : "👎 Disliked!",
      description: isCollabMode ? "Your reaction has been shared with the group" : "Reaction saved!",
    });
  };

  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
    toast({
      title: "Added to Cart!",
      description: `${product.title} has been added to your cart`,
    });
  };

  const handleAddToWishlist = (product: Product) => {
    onAddToWishlist(product);
    const isAdding = !isInWishlist(product.id);
    toast({
      title: isAdding ? "Added to Wishlist!" : "Removed from Wishlist!",
      description: `${product.title} has been ${isAdding ? 'added to' : 'removed from'} your wishlist`,
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 md:p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 md:p-6 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Products</h2>
          <p className="text-gray-600 dark:text-gray-300">
            {filteredProducts.length} items found • Page {currentPage} of {totalPages}
          </p>
        </div>
        
        {isCollabMode && (
          <Badge variant="outline" className="text-green-600 border-green-600 dark:text-green-400 dark:border-green-400">
            2 friends browsing
          </Badge>
        )}
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <Select value={filterCategory} onValueChange={(value) => handleFilterChange(() => setFilterCategory(value))}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Customer Rating</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Input
              placeholder="Min price"
              value={priceRange.min}
              onChange={(e) => handleFilterChange(() => setPriceRange(prev => ({ ...prev, min: e.target.value })))}
              className="w-24"
              type="number"
            />
            <Input
              placeholder="Max price"
              value={priceRange.max}
              onChange={(e) => handleFilterChange(() => setPriceRange(prev => ({ ...prev, max: e.target.value })))}
              className="w-24"
              type="number"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Product Grid */}
      <div className={`
        ${viewMode === 'grid' 
          ? `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${!isCollabMode ? 'xl:grid-cols-4' : null} gap-4 md:gap-6` 
          : 'space-y-4'
        } 
        mb-8
      `}>
        {currentProducts.map((product) => (
          <Card 
            key={product.id} 
            className={`
              hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02]
              ${viewMode === 'list' ? 'flex flex-row' : ''}
              ${!product.stock ? 'opacity-75' : ''}
              dark:bg-gray-800 dark:border-gray-700
            `}
            onClick={() => handleProductClick(product)}
          >
            <CardContent className={`p-4 ${viewMode === 'list' ? 'flex flex-row w-full' : ''}`}>
              <div className={`relative mb-4 ${viewMode === 'list' ? 'w-48 mr-4 mb-0' : ''}`}>
                <img
                  src={product.image}
                  alt={product.title}
                  className={`object-cover rounded-lg ${
                    viewMode === 'list' ? 'w-full h-32' : 'w-full h-48'
                  }`}
                />
                <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2">
                  <Heart 
                    className={`w-4 h-4 transition-colors cursor-pointer ${
                      isInWishlist(product.id) ? 'text-red-500 fill-red-500' : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToWishlist(product);
                    }}
                  />
                </div>
                {!product.stock && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>

              <div className={`space-y-3 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-white line-clamp-2">
                    {product.title}
                  </h3>
                  {viewMode === 'list' && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{product.description}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-800 dark:text-white">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {isCollabMode && (
                    <div className="flex-1 items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReaction(product.id, 'like');
                        }}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/20"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        {reactions[`${product.id}_like`] || 0}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReaction(product.id, 'dislike');
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        {reactions[`${product.id}_dislike`] || 0}
                      </Button>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      size='sm'
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      disabled={!product.stock}
                    >
                      <ShoppingCart className="w-3 h-3" />
                      {product.stock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Pagination>
            <PaginationContent className="gap-2">
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  className={`
                    transition-all duration-200 border border-gray-300 dark:border-gray-600
                    ${currentPage === 1 
                      ? 'pointer-events-none opacity-50 bg-gray-100 dark:bg-gray-700' 
                      : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'
                    }
                  `}
                />
              </PaginationItem>
              
              {/* First page */}
              {currentPage > 3 && (
                <>
                  <PaginationItem>
                    <PaginationLink 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(1);
                      }}
                      className="cursor-pointer border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {currentPage > 4 && (
                    <PaginationItem>
                      <PaginationEllipsis className="text-gray-600 dark:text-gray-400" />
                    </PaginationItem>
                  )}
                </>
              )}

              {/* Current page and neighbors */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (page > totalPages) return null;
                
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page);
                      }}
                      isActive={currentPage === page}
                      className={`
                        cursor-pointer border transition-all duration-200
                        ${currentPage === page
                          ? 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {/* Last page */}
              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && (
                    <PaginationItem>
                      <PaginationEllipsis className="text-gray-600 dark:text-gray-400" />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(totalPages);
                      }}
                      className="cursor-pointer border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                  }}
                  className={`
                    transition-all duration-200 border border-gray-300 dark:border-gray-600
                    ${currentPage === totalPages 
                      ? 'pointer-events-none opacity-50 bg-gray-100 dark:bg-gray-700' 
                      : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'
                    }
                  `}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
