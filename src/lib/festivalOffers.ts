export interface FestivalOffer {
  id: string
  name: string
  nameHindi: string
  discount: number
  startDate: Date
  endDate: Date
  active: boolean
}

export const indianFestivals2024: FestivalOffer[] = [
  {
    id: 'diwali',
    name: 'Diwali Dhamaka',
    nameHindi: 'दिवाली धमाका',
    discount: 30,
    startDate: new Date('2024-10-29'),
    endDate: new Date('2024-11-03'),
    active: false,
  },
  {
    id: 'holi',
    name: 'Holi Special',
    nameHindi: 'होली स्पेशल',
    discount: 25,
    startDate: new Date('2024-03-23'),
    endDate: new Date('2024-03-26'),
    active: false,
  },
  {
    id: 'pongal',
    name: 'Pongal Offer',
    nameHindi: 'पोंगल ऑफर',
    discount: 20,
    startDate: new Date('2024-01-14'),
    endDate: new Date('2024-01-17'),
    active: false,
  },
  {
    id: 'eid',
    name: 'Eid Mubarak',
    nameHindi: 'ईद मुबारक',
    discount: 25,
    startDate: new Date('2024-04-10'),
    endDate: new Date('2024-04-13'),
    active: false,
  },
  {
    id: 'independence',
    name: 'Independence Day',
    nameHindi: 'स्वतंत्रता दिवस',
    discount: 15,
    startDate: new Date('2024-08-14'),
    endDate: new Date('2024-08-16'),
    active: false,
  },
  {
    id: 'republic',
    name: 'Republic Day',
    nameHindi: 'गणतंत्र दिवस',
    discount: 15,
    startDate: new Date('2024-01-25'),
    endDate: new Date('2024-01-27'),
    active: false,
  },
]

export function getActiveFestivalOffer(): FestivalOffer | null {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (const festival of indianFestivals2024) {
    const start = new Date(festival.startDate)
    const end = new Date(festival.endDate)
    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)

    if (today >= start && today <= end) {
      return { ...festival, active: true }
    }
  }
  return null
}

export function applyFestivalDiscount(price: number): number {
  const offer = getActiveFestivalOffer()
  if (!offer) return price
  return price - (price * offer.discount) / 100
}
