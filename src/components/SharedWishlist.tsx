
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';

export const SharedWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      price: 299.99,
      image: "/placeholder.svg",
      addedBy: "Sarah M.",
      votes: 3
    },
    {
      id: 2,
      name: "Cotton T-Shirt",
      price: 39.99,
      image: "/placeholder.svg",
      addedBy: "Mike R.",
      votes: 2
    },
    {
      id: 3,
      name: "Yoga Mat",
      price: 89.99,
      image: "/placeholder.svg",
      addedBy: "You",
      votes: 1
    }
  ]);

  const removeItem = (id: number) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
  };

  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-red-500" />
          <span>Shared Wishlist</span>
          <Badge variant="secondary">{wishlistItems.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {wishlistItems.map((item) => (
          <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 object-cover rounded-md"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{item.name}</h4>
              <p className="text-xs text-gray-500">Added by {item.addedBy}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="font-semibold text-sm">${item.price}</span>
                <div className="flex items-center space-x-1">
                  <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                  <span className="text-xs text-gray-500">{item.votes}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeItem(item.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold">Total Value:</span>
            <span className="font-bold text-lg">${totalValue.toFixed(2)}</span>
          </div>
          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Checkout Together
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
