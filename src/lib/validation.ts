import { z } from 'zod'

const phonePattern = /^\+?[0-9][0-9\s-]{8,18}$/

export const AddressSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['home', 'work', 'other']).optional().default('home'),
  fullName: z.string().min(2, 'Full name is required').max(120),
  street: z.string().min(3, 'Street address is required').max(250),
  city: z.string().min(2).max(120),
  state: z.string().min(2).max(120),
  zipCode: z.string().min(3).max(20),
  country: z.string().min(2).max(120).optional().default('India'),
  phone: z.string().regex(phonePattern, 'Enter a valid phone number'),
  isDefault: z.boolean().optional().default(false),
  lat: z.number().optional(),
  lng: z.number().optional(),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
      address: z.string().min(1),
    })
    .optional(),
})

export const ProfileSchema = z.object({
  name: z.string().min(2, 'Full name is required').max(120),
  phone: z.string().regex(phonePattern, 'Enter a valid phone number'),
  address: z.string().min(3).max(250),
  profilePhoto: z.string().optional(),
})

export const PasswordLoginSchema = z.object({
  identifier: z.string().min(3, 'Email or phone number is required').max(160),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const PasswordSetupBaseSchema = z.object({
  currentPassword: z.string().min(8).optional().or(z.literal('')),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password confirmation is required'),
})

export const PasswordSetupSchema = PasswordSetupBaseSchema.refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const PasswordResetRequestSchema = z.object({
  identifier: z.string().min(3, 'Email or phone number is required').max(160),
})

export const PasswordResetConfirmSchema = PasswordSetupBaseSchema.extend({
  token: z.string().min(12, 'Reset token is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const RegisterSchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().regex(phonePattern, 'Enter a valid phone number'),
  address: z.string().min(3).max(250),
})

export const EmailRegisterSchema = z.object({
  name: z.string().min(2, 'Full name is required').max(120),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().regex(phonePattern, 'Enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password confirmation is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const CartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(1000),
})

export const OrderCreateSchema = z.object({
  cartId: z.string().min(8).optional(),
  userId: z.string().optional(),
  customerName: z.string().min(2).max(120),
  customerEmail: z.string().email().optional().or(z.literal('')),
  customerPhone: z.string().regex(phonePattern, 'Enter a valid phone number'),
  shippingAddress: AddressSchema,
  paymentMethod: z.string().min(2).max(60),
  couponCode: z.string().optional().default(''),
  deliveryType: z.enum(['express', 'standard', 'economy']).optional().default('standard'),
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().min(1).max(1000),
    }),
  ).min(1, 'Cart cannot be empty'),
})

export const AddressMutationSchema = AddressSchema.omit({ id: true }).extend({
  addressId: z.string().optional(),
})

export type AddressInput = z.infer<typeof AddressSchema>
export type ProfileInput = z.infer<typeof ProfileSchema>
export type PasswordLoginInput = z.infer<typeof PasswordLoginSchema>
export type PasswordSetupInput = z.infer<typeof PasswordSetupSchema>
export type OrderCreateInput = z.infer<typeof OrderCreateSchema>
