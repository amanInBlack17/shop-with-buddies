
import { useState, useEffect } from 'react';
import { ShoppingHeader } from '@/components/ShoppingHeader';
import { ShoppingRoom } from '@/components/ShoppingRoom';
import { ProductGrid } from '@/components/ProductGrid';
import { SharedWishlist } from '@/components/SharedWishlist';
import ChatInterface  from '@/components/ChatPanel';
import { UserPresence } from '@/components/UserPresence';
import { ShoppingCart } from '@/components/ShoppingCart';
import { OrderHistory } from '@/components/OrderHistory';
import { VideoCallPanel } from '@/components/VideoCallPanel';
import { useAppContext } from '@/context/AppContext.jsx';

export interface Product {
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

export interface CartItem extends Product {
  quantity: number;
}

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'browse' | 'cart' | 'orders' | 'wishlist'>('browse');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const { sharedCart, username, roomCode, setRoomCode } = useAppContext();

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

  const updateCartQuantity = (productId: string, quantity: number) => {
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

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <ShoppingHeader 
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="container mx-auto px-4 py-6">
        {activeTab === 'browse' && (
          <>
            {!localStorage.getItem('roomCode') ? (
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4 px-4">
                    Shop Together, Decide Together
                  </h1>
                  <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 px-4 max-w-4xl mx-auto">
                    Experience the joy of shopping with friends in real-time, or browse solo
                  </p>
                  <div className="px-4">
                    <ShoppingRoom />
                  </div>
                </div>
                
                <div className="px-4">
                  <ProductGrid 
                    onProductSelect={setSelectedProduct}
                    selectedProduct={selectedProduct}
                    onAddToCart={addToCart}
                    onAddToWishlist={addToWishlist}
                    isInWishlist={isInWishlist}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 lg:gap-6 px-2 lg:px-0">
                <div className="lg:col-span-1 space-y-4">  
                  <UserPresence roomId={localStorage.getItem('roomCode')} />
                  <div className="hidden lg:block">
                    <VideoCallPanel roomId={localStorage.getItem('roomCode')} />
                  </div>
                </div>
                
                <div className="lg:col-span-5">
                  <ProductGrid 
                    onProductSelect={setSelectedProduct}
                    selectedProduct={selectedProduct}
                    onAddToCart={addToCart}
                    onAddToWishlist={addToWishlist}
                    isInWishlist={isInWishlist}
                    isCollabMode={true}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'cart' && (
          <div className="px-4">
            <ShoppingCart 
              cartItems={cartItems}
              onUpdateQuantity={updateCartQuantity}
              onAddToWishlist={addToWishlist}
              isInWishlist={isInWishlist}
            />
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="px-4">
            <OrderHistory />
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="px-4">
            <SharedWishlist 
              wishlistItems={wishlistItems}
              onAddToCart={addToCart}
              onRemoveFromWishlist={(productId) => 
                setWishlistItems(prev => prev.filter(item => item.id !== productId))
              }
              isFullPage={true}
            />
          </div>
        )}
      </div>

      {localStorage.getItem('roomCode') ? <ChatInterface /> : null}
    </div>
  );
};

export default Index;
