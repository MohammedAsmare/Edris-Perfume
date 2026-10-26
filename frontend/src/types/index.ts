export type Role = 'ROLE_CUSTOMER' | 'ROLE_MERCHANT' | 'ROLE_ADMIN' | 'ROLE_DELIVERY_PARTNER';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL';

export type MerchantApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'READY_FOR_DISPATCH'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURNED';

export type PaymentStatus =
  | 'PENDING'
  | 'INITIATED'
  | 'AWAITING_CUSTOMER_ACTION'
  | 'PROCESSING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'REFUND_PENDING'
  | 'PARTIALLY_REFUNDED'
  | 'REFUNDED';

export type FulfillmentStatus =
  | 'UNFULFILLED'
  | 'PICKING'
  | 'PACKED'
  | 'PICKED_UP'
  | 'DISPATCHED'
  | 'DELIVERED'
  | 'DELIVERY_FAILED'
  | 'RETURNED';

export type DeliveryAssignmentStatus =
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'FAILED'
  | 'CANCELLED';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: Role;
  status: UserStatus;
  token?: string;
}

export interface MerchantProfile {
  id: number;
  userId: number;
  businessName: string;
  tinNumber?: string;
  tradeLicenseNumber?: string;
  contactPhone: string;
  address: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  approvalStatus: MerchantApprovalStatus;
  commissionRate: number;
  rejectionReason?: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  isFeatured?: boolean;
}

export interface Product {
  id: number;
  merchantId?: number;
  merchantName?: string;
  categoryId?: number;
  categoryName?: string;
  brandId?: number;
  brandName?: string;
  name: string;
  slug: string;
  shortDescription?: string;
  fullDescription?: string;
  fragranceFamily: string;
  volumeMl: number;
  concentration: string;
  topNotes?: string;
  heartNotes?: string;
  baseNotes?: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  stockQuantity: number;
  lowStockThreshold: number;
  isFeatured: boolean;
  isActive: boolean;
  ratingAvg: number;
  reviewCount: number;
  imageUrl: string;
  images?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PaymentMethod {
  id: number;
  code: string; // TELEBIRR, CBE_BIRR, BANK_TRANSFER_CBE, BANK_TRANSFER_AWASH, BANK_TRANSFER_DASHEN, BANK_TRANSFER_BOA, CASH_ON_DELIVERY
  name: string;
  description: string;
  providerType: 'TELEBIRR' | 'BANK_TRANSFER' | 'CASH';
  isActive: boolean;
  displayOrder: number;
}

export interface BankAccount {
  id: number;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  branch: string;
  qrCodeUrl?: string;
  instructions: string;
}

export interface PaymentTransaction {
  id: number;
  transactionReference: string;
  orderId: number;
  customerId: number;
  paymentMethodId: number;
  paymentMethodName: string;
  provider: string;
  merchantOrderRef: string;
  providerTransRef?: string;
  expectedAmount: number;
  verifiedAmount?: number;
  currency: string;
  paymentStatus: PaymentStatus;
  providerStatusCode?: string;
  transferProofReference?: string;
  proofDocumentUrl?: string;
  customerNotes?: string;
  adminReconciliationNotes?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  imageUrl?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  customerName?: string;
  customerEmail?: string;
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  shippingFullName: string;
  shippingPhone: string;
  shippingCity: string;
  shippingSubcity?: string;
  shippingAddressLine: string;
  shippingNotes?: string;
  trackingNumber?: string;
  items: OrderItem[];
  paymentMethod?: string;
  paymentTransaction?: PaymentTransaction;
  deliveryOtp?: string;
  acceptedAt?: string;
  readyPickupAt?: string;
  closedAt?: string;
  closedByUserId?: number;
  deliveryAssignment?: DeliveryAssignment;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryTrackingEvent {
  id: number;
  orderId: number;
  status: string;
  location: string;
  description: string;
  timestamp: string;
}

export interface CustomerLoyalty {
  pointsBalance: number;
  lifetimePoints: number;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
}

export interface AdvertisingCampaign {
  id: number;
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  placement: 'HERO_CAROUSEL' | 'FEATURED_BANNER' | 'SIDEBAR';
}

export interface SupportTicket {
  id: number;
  ticketNumber: string;
  subject: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  messages?: {
    id: number;
    senderName: string;
    message: string;
    isStaff: boolean;
    createdAt: string;
  }[];
}

export interface DeliveryPartner {
  id: number;
  userId: number;
  partnerName: string;
  vehicleType: string;
  licensePlate: string;
  phoneNumber: string;
  status: 'ACTIVE' | 'ON_DELIVERY' | 'INACTIVE';
  rating: number;
  activeDeliveriesCount: number;
}

export interface DeliveryAssignment {
  id: number;
  orderId: number;
  orderNumber?: string;
  deliveryPartnerId: number;
  partnerName?: string;
  vehicleType?: string;
  licensePlate?: string;
  partnerPhone?: string;
  merchantId?: number;
  merchantName?: string;
  status: DeliveryAssignmentStatus;
  pickupAddress: string;
  deliveryAddress: string;
  deliveryOtp: string;
  otpAttempts: number;
  maxOtpAttempts: number;
  recipientName?: string;
  recipientPhone?: string;
  recipientNotes?: string;
  proofCode?: string;
  failureReason?: string;
  pickupConfirmedAt?: string;
  startedAt?: string;
  deliveredAt?: string;
  failedAt?: string;
  createdAt: string;
  order?: Order;
}

export interface OrderStatusHistory {
  id: number;
  orderId: number;
  fromOrderStatus?: string;
  toOrderStatus: string;
  fromFulfillmentStatus?: string;
  toFulfillmentStatus: string;
  action: string;
  performedByRole: string;
  performedByName?: string;
  notes?: string;
  timestamp: string;
}
