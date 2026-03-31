import { WAREHOUSE_INFO } from '@/lib/productCatalog'

export type TrackingStageKey = 'warehouse' | 'packaging' | 'on_the_way' | 'delivered'
export type DeliveryType = 'express' | 'standard' | 'economy'

export type TrackingStage = {
  key: TrackingStageKey
  label: string
  labelKey: string
  timestamp: string
  location: string
  description: string
  descriptionKey: string
  completed: boolean
}

export const DELIVERY_CONFIG: Record<DeliveryType, {
  label: string
  totalDays: number
  offsets: Record<TrackingStageKey, number>
  descriptions: Record<TrackingStageKey, { text: string; key: string }>
}> = {
  express: {
    label: 'Express Delivery (Same Day)',
    totalDays: 1,
    offsets: { warehouse: 0, packaging: 0.125, on_the_way: 0.25, delivered: 1 },
    descriptions: {
      warehouse: { text: 'Order received — priority processing started immediately', key: 'trackingExpressWarehouse' },
      packaging: { text: 'Express packed within 3 hours for same-day dispatch', key: 'trackingExpressPackaging' },
      on_the_way: { text: 'Out for express delivery — arriving today', key: 'trackingExpressOnTheWay' },
      delivered: { text: 'Delivered same day as ordered', key: 'trackingExpressDelivered' },
    },
  },
  standard: {
    label: 'Standard Delivery (3 Days)',
    totalDays: 3,
    offsets: { warehouse: 0, packaging: 1, on_the_way: 2, delivered: 3 },
    descriptions: {
      warehouse: { text: 'Order collected at the Tamil Nadu warehouse', key: 'trackingOrderCollectedAtWarehouse' },
      packaging: { text: 'Products inspected, packed, and prepared for dispatch', key: 'trackingProductsInspectedPackedPreparedForDispatch' },
      on_the_way: { text: 'Parcel is moving through the delivery network', key: 'trackingParcelMovingThroughDeliveryNetwork' },
      delivered: { text: 'Order delivered to the customer', key: 'trackingOrderDeliveredToCustomer' },
    },
  },
  economy: {
    label: 'Economy Delivery (7 Days)',
    totalDays: 7,
    offsets: { warehouse: 0, packaging: 2, on_the_way: 4, delivered: 7 },
    descriptions: {
      warehouse: { text: 'Order queued at warehouse for economy batch processing', key: 'trackingEconomyWarehouse' },
      packaging: { text: 'Packed in economy batch — awaiting dispatch window', key: 'trackingEconomyPackaging' },
      on_the_way: { text: 'Parcel dispatched via economy freight route', key: 'trackingEconomyOnTheWay' },
      delivered: { text: 'Economy delivery completed', key: 'trackingEconomyDelivered' },
    },
  },
}

const STAGE_LABELS: Record<TrackingStageKey, { label: string; labelKey: string; location: string }> = {
  warehouse: { label: 'Warehouse', labelKey: 'trackingWarehouse', location: WAREHOUSE_INFO.address },
  packaging: { label: 'Packaging', labelKey: 'trackingPackaging', location: 'Packaging Unit, Coimbatore, Tamil Nadu' },
  on_the_way: { label: 'On the way', labelKey: 'trackingOnTheWay', location: 'Tamil Nadu transit corridor' },
  delivered: { label: 'Delivered', labelKey: 'trackingDelivered', location: 'Customer delivery address' },
}

const STAGE_ORDER: TrackingStageKey[] = ['warehouse', 'packaging', 'on_the_way', 'delivered']

function addFractionalDays(date: Date, days: number) {
  const copy = new Date(date)
  copy.setTime(copy.getTime() + days * 24 * 60 * 60 * 1000)
  return copy
}

export function generateTrackingTimeline(orderDate: string, deliveryType: DeliveryType = 'standard') {
  const config = DELIVERY_CONFIG[deliveryType]
  const start = new Date(orderDate)
  return STAGE_ORDER.map((key) => {
    const meta = STAGE_LABELS[key]
    const desc = config.descriptions[key]
    const timestamp = addFractionalDays(start, config.offsets[key])
    return {
      key,
      label: meta.label,
      labelKey: meta.labelKey,
      timestamp: timestamp.toISOString(),
      location: meta.location,
      description: desc.text,
      descriptionKey: desc.key,
      completed: Date.now() >= timestamp.getTime(),
    } satisfies TrackingStage
  })
}

export function getTrackingProgress(orderDate: string, deliveryType: DeliveryType = 'standard') {
  const timeline = generateTrackingTimeline(orderDate, deliveryType)
  const completedCount = timeline.filter((stage) => stage.completed).length
  const activeIndex = Math.min(completedCount, timeline.length - 1)
  const activeStage = timeline[activeIndex] || timeline[0]

  return {
    timeline,
    activeStage,
    completedCount,
    progress: timeline.length === 0 ? 0 : Math.round((completedCount / timeline.length) * 100),
    deliveryType,
  }
}

export function getTrackingStatusLabel(orderDate: string, deliveryType: DeliveryType = 'standard') {
  const { activeStage } = getTrackingProgress(orderDate, deliveryType)
  return activeStage?.label || 'Warehouse'
}
