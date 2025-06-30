
import { useState } from 'react';
import { ShoppingHeader } from '@/components/ShoppingHeader';
import { ShoppingRoom } from '@/components/ShoppingRoom';
import { ProductBrowser } from '@/components/ProductBrowser';
import { SharedWishlist } from '@/components/SharedWishlist';
import { ChatPanel } from '@/components/ChatPanel';
import { UserPresence } from '@/components/UserPresence';

const Index = () => {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <ShoppingHeader />
      
      <div className="container mx-auto px-4 py-6">
        {!activeRoom ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Shop Together, Decide Together
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Experience the joy of shopping with friends in real-time
              </p>
            </div>
            
            <ShoppingRoom onJoinRoom={setActiveRoom} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
            {/* Left sidebar - User presence and controls */}
            <div className="lg:col-span-1 space-y-4">
              <UserPresence roomId={activeRoom} />
              <SharedWishlist />
            </div>
            
            {/* Main content - Product browser */}
            <div className="lg:col-span-2">
              <ProductBrowser 
                onProductSelect={setSelectedProduct}
                selectedProduct={selectedProduct}
              />
            </div>
            
            {/* Right sidebar - Chat */}
            <div className="lg:col-span-1">
              <ChatPanel roomId={activeRoom} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
