import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { MenuExtra, MenuItem } from '@/data/mock';

export type CartLine = {
  id: string;
  restaurantId: string;
  menuItem: MenuItem;
  quantity: number;
  notes: string;
  selectedChoices: Record<string, string>;
  extras: MenuExtra[];
};

type AddToCartInput = {
  restaurantId: string;
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
  selectedChoices?: Record<string, string>;
  extras?: MenuExtra[];
};

type CartContextValue = {
  restaurantId: string | null;
  items: CartLine[];
  itemCount: number;
  subtotalSos: number;
  addItem: (input: AddToCartInput) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
  getItemCount: (menuItemId: string) => number;
};

const CartContext = createContext<CartContextValue | null>(null);

function lineSignature(input: AddToCartInput) {
  const choices = JSON.stringify(input.selectedChoices ?? {});
  const extras = JSON.stringify((input.extras ?? []).map((extra) => extra.id).sort());
  return `${input.restaurantId}:${input.menuItem.id}:${choices}:${extras}:${input.notes?.trim() ?? ''}`;
}

function lineTotal(line: CartLine) {
  const extraTotal = line.extras.reduce((sum, extra) => sum + extra.priceSos, 0);
  const choiceTotal = (line.menuItem.options ?? []).reduce((sum, group) => {
    const selectedChoiceId = line.selectedChoices[group.id];
    const selectedChoice = group.choices.find((choice) => choice.id === selectedChoiceId);
    return sum + (selectedChoice?.priceSos ?? 0);
  }, 0);

  return (line.menuItem.priceSos + extraTotal + choiceTotal) * line.quantity;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);

  const value = useMemo<CartContextValue>(() => {
    const restaurantId = items[0]?.restaurantId ?? null;

    const addItem = (input: AddToCartInput) => {
      setItems((previous) => {
        const currentRestaurantId = previous[0]?.restaurantId;
        if (currentRestaurantId && currentRestaurantId !== input.restaurantId) {
          const confirmed = window.confirm('Your cart contains items from another store. Start a new cart?');
          if (!confirmed) return previous;

          return [
            {
              id: lineSignature(input),
              restaurantId: input.restaurantId,
              menuItem: input.menuItem,
              quantity: input.quantity,
              notes: input.notes?.trim() ?? '',
              selectedChoices: input.selectedChoices ?? {},
              extras: input.extras ?? [],
            },
          ];
        }

        const signature = lineSignature(input);
        const existing = previous.find((line) => line.id === signature);
        if (existing) {
          return previous.map((line) =>
            line.id === signature ? { ...line, quantity: line.quantity + input.quantity } : line,
          );
        }

        return [
          ...previous,
          {
            id: signature,
            restaurantId: input.restaurantId,
            menuItem: input.menuItem,
            quantity: input.quantity,
            notes: input.notes?.trim() ?? '',
            selectedChoices: input.selectedChoices ?? {},
            extras: input.extras ?? [],
          },
        ];
      });
    };

    const updateQuantity = (lineId: string, quantity: number) => {
      setItems((previous) => {
        if (quantity <= 0) {
          return previous.filter((line) => line.id !== lineId);
        }

        return previous.map((line) => (line.id === lineId ? { ...line, quantity } : line));
      });
    };

    const removeLine = (lineId: string) => {
      setItems((previous) => previous.filter((line) => line.id !== lineId));
    };

    const clearCart = () => {
      setItems([]);
    };

    const itemCount = items.reduce((sum, line) => sum + line.quantity, 0);
    const subtotalSos = items.reduce((sum, line) => sum + lineTotal(line), 0);
    const getItemCount = (menuItemId: string) =>
      items.filter((line) => line.menuItem.id === menuItemId).reduce((sum, line) => sum + line.quantity, 0);

    return {
      restaurantId,
      items,
      itemCount,
      subtotalSos,
      addItem,
      updateQuantity,
      removeLine,
      clearCart,
      getItemCount,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
