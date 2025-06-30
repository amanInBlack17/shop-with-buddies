
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Products</h2>
          <p className="text-gray-600">{filteredProducts.length} items found</p>
        </div>
        
        {isCollabMode && (
          <Badge variant="outline" className="text-green-600 border-green-600">
            2 friends browsing
          </Badge>
        )}
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
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
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className="w-24"
              type="number"
            />
            <Input
              placeholder="Max price"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
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
        overflow-y-auto max-h-[calc(100vh-300px)]
      `}>
        {filteredProducts.map((product) => (
          <Card 
            key={product.id} 
            className={`
              hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02]
              ${viewMode === 'list' ? 'flex flex-row' : ''}
              ${!product.inStock ? 'opacity-75' : ''}
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
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2">
                  <Heart 
                    className={`w-4 h-4 transition-colors cursor-pointer ${
                      isInWishlist(product.id) ? 'text-red-500 fill-red-500' : 'text-gray-600 hover:text-red-500'
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
                  <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">{product.store}</p>
                  {viewMode === 'list' && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
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
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-800">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
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
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
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
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
    </div>
  );
};
