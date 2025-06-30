import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Heart, ShoppingCart, ThumbsUp, ThumbsDown, Star, Share, Filter, Grid, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/pages/Index';

interface ProductGridProps {
  onProductSelect: (product: Product) => void;
  selectedProduct: Product | null;
  onAddToCart: (product: Product, quantity?: number) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  isCollabMode?: boolean;
}

export const ProductGrid = ({ 
  onProductSelect, 
  selectedProduct, 
  onAddToCart,
  onAddToWishlist,
  isInWishlist,
  isCollabMode = false
}: ProductGridProps) => {
  const [reactions, setReactions] = useState<{[key: string]: number}>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [filterCategory, setFilterCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const { toast } = useToast();

  const mockProducts: Product[] = [
    {
      id: 1,
      name: "Wireless Noise-Canceling Headphones",
      price: 299.99,
      originalPrice: 399.99,
      discount: 25,
      image: "/placeholder.svg",
      rating: 4.5,
      reviews: 1234,
      store: "TechStore",
      category: "Electronics",
      inStock: true,
      description: "Premium wireless headphones with active noise cancellation and 30-hour battery life."
    },
    {
      id: 2,
      name: "Sustainable Cotton T-Shirt",
      price: 39.99,
      image: "/placeholder.svg",
      rating: 4.7,
      reviews: 567,
      store: "EcoFashion",
      category: "Fashion",
      inStock: true,
      description: "Made from 100% organic cotton, perfect for everyday wear."
    },
    {
      id: 3,
      name: "Smart Home Security Camera",
      price: 199.99,
      originalPrice: 249.99,
      discount: 20,
      image: "/placeholder.svg",
      rating: 4.3,
      reviews: 890,
      store: "HomeTech",
      category: "Home Security",
      inStock: true,
      description: "1080p HD camera with night vision and motion detection."
    },
    {
      id: 4,
      name: "Ergonomic Office Chair",
      price: 449.99,
      image: "/placeholder.svg",
      rating: 4.6,
      reviews: 345,
      store: "OfficeSupply",
      category: "Furniture",
      inStock: false,
      description: "Adjustable office chair with lumbar support and breathable mesh."
    },
    {
      id: 5,
      name: "Portable Bluetooth Speaker",
      price: 79.99,
      originalPrice: 99.99,
      discount: 20,
      image: "/placeholder.svg",
      rating: 4.4,
      reviews: 678,
      store: "AudioWorld",
      category: "Electronics",
      inStock: true,
      description: "Waterproof speaker with 12-hour battery and powerful bass."
    },
    {
      id: 6,
      name: "Premium Yoga Mat",
      price: 89.99,
      image: "/placeholder.svg",
      rating: 4.8,
      reviews: 234,
      store: "FitnessPro",
      category: "Fitness",
      inStock: true,
      description: "Non-slip yoga mat with alignment lines and carrying strap."
    },
    {
      id: 7,
      name: "Stainless Steel Water Bottle",
      price: 29.99,
      originalPrice: 39.99,
      discount: 25,
      image: "/placeholder.svg",
      rating: 4.6,
      reviews: 456,
      store: "EcoLife",
      category: "Lifestyle",
      inStock: true,
      description: "Insulated water bottle that keeps drinks cold for 24 hours."
    },
    {
      id: 8,
      name: "Gaming Mechanical Keyboard",
      price: 159.99,
      image: "/placeholder.svg",
      rating: 4.7,
      reviews: 789,
      store: "GameHub",
      category: "Electronics",
      inStock: true,
      description: "RGB backlit mechanical keyboard with customizable keys."
    },
    {
      id: 9,
      name: "Wireless Charging Pad",
      price: 49.99,
      originalPrice: 69.99,
      discount: 29,
      image: "/placeholder.svg",
      rating: 4.2,
      reviews: 423,
      store: "TechStore",
      category: "Electronics",
      inStock: true,
      description: "Fast wireless charging pad compatible with all Qi-enabled devices."
    },
    {
      id: 10,
      name: "Organic Skincare Set",
      price: 89.99,
      image: "/placeholder.svg",
      rating: 4.9,
      reviews: 156,
      store: "BeautyNature",
      category: "Beauty",
      inStock: true,
      description: "Complete organic skincare routine with natural ingredients."
    },
    {
      id: 11,
      name: "Smart Fitness Tracker",
      price: 199.99,
      originalPrice: 249.99,
      discount: 20,
      image: "/placeholder.svg",
      rating: 4.4,
      reviews: 892,
      store: "FitnessPro",
      category: "Fitness",
      inStock: true,
      description: "Advanced fitness tracker with heart rate monitoring and GPS."
    },
    {
      id: 12,
      name: "Artisan Coffee Beans",
      price: 24.99,
      image: "/placeholder.svg",
      rating: 4.8,
      reviews: 278,
      store: "CoffeeRoasters",
      category: "Food & Beverage",
      inStock: true,
      description: "Premium single-origin coffee beans, freshly roasted to perfection."
    },
    {
      id: 13,
      name: "Minimalist Desk Lamp",
      price: 79.99,
      image: "/placeholder.svg",
      rating: 4.5,
      reviews: 167,
      store: "HomeDesign",
      category: "Home & Garden",
      inStock: true,
      description: "Modern LED desk lamp with adjustable brightness and color temperature."
    },
    {
      id: 14,
      name: "Eco-Friendly Backpack",
      price: 119.99,
      originalPrice: 149.99,
      discount: 20,
      image: "/placeholder.svg",
      rating: 4.6,
      reviews: 334,
      store: "EcoLife",
      category: "Lifestyle",
      inStock: true,
      description: "Durable backpack made from recycled materials with laptop compartment."
    },
    {
      id: 15,
      name: "Ceramic Dinner Set",
      price: 159.99,
      image: "/placeholder.svg",
      rating: 4.7,
      reviews: 289,
      store: "KitchenEssentials",
      category: "Home & Garden",
      inStock: true,
      description: "Elegant 16-piece ceramic dinner set, dishwasher and microwave safe."
    },
    {
      id: 16,
      name: "Wireless Gaming Mouse",
      price: 89.99,
      originalPrice: 119.99,
      discount: 25,
      image: "/placeholder.svg",
      rating: 4.3,
      reviews: 445,
      store: "GameHub",
      category: "Electronics",
      inStock: true,
      description: "High-precision gaming mouse with customizable RGB lighting."
    }
  ];

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
        case 'rating': return b.rating - a.rating;
        case 'popularity': return b.reviews - a.reviews;
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
    // Scroll to top of products when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (callback: () => void) => {
    callback();
    setCurrentPage(1);
  };

  const handleReaction = (productId: number, type: 'like' | 'dislike') => {
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
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleAddToWishlist = (product: Product) => {
    onAddToWishlist(product);
    const isAdding = !isInWishlist(product.id);
    toast({
      title: isAdding ? "Added to Wishlist!" : "Removed from Wishlist!",
      description: `${product.name} has been ${isAdding ? 'added to' : 'removed from'} your wishlist`,
    });
  };

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
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6' 
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
              ${!product.inStock ? 'opacity-75' : ''}
              dark:bg-gray-800 dark:border-gray-700
            `}
            onClick={() => onProductSelect(product)}
          >
            <CardContent className={`p-4 ${viewMode === 'list' ? 'flex flex-row w-full' : ''}`}>
              <div className={`relative mb-4 ${viewMode === 'list' ? 'w-48 mr-4 mb-0' : ''}`}>
                <img
                  src={product.image}
                  alt={product.name}
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
                {product.discount && (
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                    {product.discount}% OFF
                  </Badge>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>

              <div className={`space-y-3 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-white line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{product.store}</p>
                  {viewMode === 'list' && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{product.description}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-800 dark:text-white">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {isCollabMode && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReaction(product.id, 'like');
                        }}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/20"
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
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
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        {reactions[`${product.id}_dislike`] || 0}
                      </Button>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination - Enhanced for dark mode */}
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
