
import { useState } from 'react';
import { ShoppingHeader } from '@/components/ShoppingHeader';
import { ShoppingRoom } from '@/components/ShoppingRoom';
import { ProductGrid } from '@/components/ProductGrid';
import { SharedWishlist } from '@/components/SharedWishlist';
import { ChatPanel } from '@/components/ChatPanel';
import { UserPresence } from '@/components/UserPresence';
import { ShoppingCart } from '@/components/ShoppingCart';
import { OrderHistory } from '@/components/OrderHistory';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  store: string;
  category: string;
  originalPrice?: number;
  discount?: number;
  inStock: boolean;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

const Index = () => {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'browse' | 'cart' | 'orders' | 'wishlist'>('browse');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== productId));
    } else {
      setCartItems(prev => 
        prev.map(item => 
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const addToWishlist = (product: Product) => {
    setWishlistItems(prev => {
      if (prev.find(item => item.id === product.id)) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: number) => {
    return wishlistItems.some(item => item.id === productId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <ShoppingHeader 
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="container mx-auto px-4 py-6">
        {activeTab === 'browse' && (
          <>
            {!activeRoom ? (
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                    Shop Together, Decide Together
                  </h1>
                  <p className="text-lg md:text-xl text-gray-600 mb-6">
                    Experience the joy of shopping with friends in real-time, or browse solo
                  </p>
                  <ShoppingRoom onJoinRoom={setActiveRoom} />
                </div>
                
                <ProductGrid 
                  onProductSelect={setSelectedProduct}
                  selectedProduct={selectedProduct}
                  onAddToCart={addToCart}
                  onAddToWishlist={addToWishlist}
                  isInWishlist={isInWishlist}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
                <div className="lg:col-span-1 space-y-4">
                  <UserPresence roomId={activeRoom} />
                  <SharedWishlist 
                    wishlistItems={wishlistItems}
                    onAddToCart={addToCart}
                    onRemoveFromWishlist={(productId) => 
                      setWishlistItems(prev => prev.filter(item => item.id !== productId))
                    }
                  />
                </div>
                
                <div className="lg:col-span-2">
                  <ProductGrid 
                    onProductSelect={setSelectedProduct}
                    selectedProduct={selectedProduct}
                    onAddToCart={addToCart}
                    onAddToWishlist={addToWishlist}
                    isInWishlist={isInWishlist}
                    isCollabMode={true}
                  />
                </div>
                
                <div className="lg:col-span-1">
                  <ChatPanel roomId={activeRoom} />
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'cart' && (
          <ShoppingCart 
            cartItems={cartItems}
            onUpdateQuantity={updateCartQuantity}
            onAddToWishlist={addToWishlist}
            isInWishlist={isInWishlist}
          />
        )}

        {activeTab === 'orders' && <OrderHistory />}

        {activeTab === 'wishlist' && (
          <SharedWishlist 
            wishlistItems={wishlistItems}
            onAddToCart={addToCart}
            onRemoveFromWishlist={(productId) => 
              setWishlistItems(prev => prev.filter(item => item.id !== productId))
            }
            isFullPage={true}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
