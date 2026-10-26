import React from 'react';
import { Order, DeliveryPartner, DeliveryAssignment } from '../../types';
import { OrderStatusBadge } from './OrderStatusBadge';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  Package,
  Truck,
  Send,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';

interface OrderTableProps {
  orders: Order[];
  assignments: DeliveryAssignment[];
  partners: DeliveryPartner[];
  searchTerm: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  fulfillmentFilter: string;
  onFulfillmentFilterChange: (val: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetails: (order: Order) => void;
  onAccept: (orderId: number) => void;
  onReadyPickup: (orderId: number) => void;
  onOpenAssignDialog: (order: Order) => void;
  onHandover: (orderId: number) => void;
  onOpenCloseDialog: (order: Order) => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  assignments,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  fulfillmentFilter,
  onFulfillmentFilterChange,
  currentPage,
  totalPages,
  onPageChange,
  onViewDetails,
  onAccept,
  onReadyPickup,
  onOpenAssignDialog,
  onHandover,
  onOpenCloseDialog,
}) => {
  const getAssignment = (orderId: number) => {
    return assignments.find((a) => a.orderId === orderId);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden flex flex-col">
      {/* Search & Filter Toolbar */}
      <div className="p-5 border-b border-stone-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-stone-50/50">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by order #, customer, phone, or address..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-stone-400 shadow-xs"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <span className="hidden sm:inline">Filters:</span>
          </div>

          {/* Fulfillment Filter */}
          <select
            value={fulfillmentFilter}
            onChange={(e) => onFulfillmentFilterChange(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-stone-800 shadow-xs"
          >
            <option value="ALL">All Fulfillments</option>
            <option value="UNFULFILLED">Unfulfilled / New</option>
            <option value="PICKING">Preparing & Packing</option>
            <option value="PACKED">Ready for Pickup</option>
            <option value="PICKED_UP">Handed to Courier</option>
            <option value="DISPATCHED">In Transit</option>
            <option value="DELIVERED">Delivered (Pending Close)</option>
            <option value="DELIVERY_FAILED">Delivery Failed</option>
          </select>

          {/* Order Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-stone-800 shadow-xs"
          >
            <option value="ALL">All Order Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Closed / Delivered</option>
            <option value="PENDING_PAYMENT">Pending Payment</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-100/60 text-[11px] font-serif uppercase tracking-wider text-stone-600">
              <th className="py-3 px-4">Order Ref</th>
              <th className="py-3 px-4">Customer & Destination</th>
              <th className="py-3 px-4">Perfume Items</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Fulfillment Phase</th>
              <th className="py-3 px-4">Courier Assignment</th>
              <th className="py-3 px-4 text-right">Workflow Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-stone-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Package className="w-8 h-8 text-stone-300" />
                    <p className="text-sm font-medium">No matching orders found</p>
                    <p className="text-xs text-stone-400">Try adjusting your filters or search keywords</p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const assign = getAssignment(order.id);
                const fStatus = order.fulfillmentStatus;
                const canAccept = fStatus === 'UNFULFILLED';
                const canMarkReady = fStatus === 'PICKING';
                const canAssign = fStatus === 'PACKED' && (!assign || assign.status === 'CANCELLED');
                const canHandover = (fStatus === 'PACKED' || fStatus === 'PICKING') && assign && assign.status === 'ASSIGNED';
                const canClose = fStatus === 'DELIVERED' && order.orderStatus !== 'DELIVERED';

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-amber-50/40 transition-colors group cursor-pointer"
                    onClick={() => onViewDetails(order)}
                  >
                    {/* Order Reference */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                        {order.orderNumber}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Customer & Destination */}
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <div className="font-medium text-stone-900 truncate">
                        {order.shippingFullName}
                      </div>
                      <div className="text-[11px] text-stone-500 truncate">
                        {order.shippingSubcity ? `${order.shippingSubcity}, ` : ''}{order.shippingCity}
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono">
                        {order.shippingPhone}
                      </div>
                    </td>

                    {/* Perfume Items */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-800">
                        {order.items[0]?.productName || 'Luxury Fragrance'}
                      </div>
                      <div className="text-[11px] text-stone-500 font-mono">
                        {order.items.length > 1 ? `+${order.items.length - 1} other flacon(s)` : `Qty: ${order.items[0]?.quantity || 1}`}
                      </div>
                    </td>

                    {/* Payment */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-amber-900">
                        {order.totalAmount.toLocaleString()} ETB
                      </div>
                      <div className="mt-0.5">
                        <OrderStatusBadge paymentStatus={order.paymentStatus} size="sm" />
                      </div>
                    </td>

                    {/* Fulfillment Phase */}
                    <td className="py-3.5 px-4">
                      <OrderStatusBadge fulfillmentStatus={order.fulfillmentStatus} size="sm" />
                    </td>

                    {/* Courier Assignment */}
                    <td className="py-3.5 px-4">
                      {assign ? (
                        <div>
                          <div className="font-semibold text-stone-900 flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5 text-amber-600" />
                            <span>{assign.partnerName}</span>
                          </div>
                          <div className="text-[10px] text-stone-500 font-mono">
                            Status: <span className="text-stone-700 font-medium">{assign.status}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-stone-400 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Workflow Quick Action */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {canAccept && (
                          <button
                            onClick={() => onAccept(order.id)}
                            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1 transition-all"
                            title="Accept and start preparation"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                        )}

                        {canMarkReady && (
                          <button
                            onClick={() => onReadyPickup(order.id)}
                            className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1 transition-all"
                            title="Mark parcel packed and ready for pickup"
                          >
                            <Package className="w-3.5 h-3.5" />
                            <span>Ready</span>
                          </button>
                        )}

                        {canAssign && (
                          <button
                            onClick={() => onOpenAssignDialog(order)}
                            className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1 transition-all"
                            title="Assign delivery courier"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Assign</span>
                          </button>
                        )}

                        {canHandover && (
                          <button
                            onClick={() => onHandover(order.id)}
                            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1 transition-all"
                            title="Record package handover to courier"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Handover</span>
                          </button>
                        )}

                        {canClose && (
                          <button
                            onClick={() => onOpenCloseDialog(order)}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1 transition-all"
                            title="Review proof and close order"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Close</span>
                          </button>
                        )}

                        {/* View Drawer Button */}
                        <button
                          onClick={() => onViewDetails(order)}
                          className="p-1.5 hover:bg-stone-100 text-stone-500 hover:text-stone-900 rounded-lg transition-colors"
                          title="View complete details and timeline"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-stone-200/80 bg-stone-50/50 flex items-center justify-between text-xs text-stone-600">
          <span>
            Page <strong className="font-mono text-stone-900">{currentPage}</strong> of{' '}
            <strong className="font-mono text-stone-900">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-stone-300 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-stone-300 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
