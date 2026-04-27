import { createContext, useContext, useState } from 'react';

import { createOrderRecord, finalizeOrderRecord } from '../utils/order';

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [ordersState, setOrdersState] = useState({
    activeOrder: null,
    orderHistory: [],
  });

  function startOrder(orderInput) {
    const nextOrder = createOrderRecord(orderInput);

    setOrdersState((currentState) => ({
      activeOrder: nextOrder,
      orderHistory: currentState.activeOrder
        ? [
            finalizeOrderRecord(currentState.activeOrder, nextOrder.createdAt),
            ...currentState.orderHistory,
          ]
        : currentState.orderHistory,
    }));

    return nextOrder;
  }

  function clearOrders() {
    setOrdersState({
      activeOrder: null,
      orderHistory: [],
    });
  }

  return (
    <OrderContext.Provider
      value={{
        activeOrder: ordersState.activeOrder,
        orderHistory: ordersState.orderHistory,
        startOrder,
        clearOrders,
      }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  return useContext(OrderContext);
}
