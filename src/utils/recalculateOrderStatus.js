import { OrderItemsCollection } from '../db/models/orderItemModel.js';
import { OrdersCollection } from '../db/models/orderModel.js';

export const recalculateOrderStatus = async (existOrder) => {
  const allItems = await OrderItemsCollection.find({
    _id: { $in: existOrder.items },
  });
  const relevantItems = allItems.filter((item) => item.status !== 'rejected');
  const allCompleted =
    relevantItems.length > 0 &&
    relevantItems.every((item) => item.status === 'completed');
  const anyInProgress = relevantItems.some(
    (item) => item.status === 'in_progress' || item.status === 'completed',
  );
  const newOrderStatus = allCompleted
    ? 'completed'
    : anyInProgress
      ? 'in_progress'
      : 'created';

  await OrdersCollection.findByIdAndUpdate(existOrder._id, {
    status: newOrderStatus,
  });
};
