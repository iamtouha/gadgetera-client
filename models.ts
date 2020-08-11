export interface Product {
  name: string
  slug: string
  price: number
  discount: number
  description: string
  available: boolean
  variants: Array<{
    attribute: string
    value: string
    available: string
  }>
  category: {
    name: string
    id: string
    icon: string
  }
  brand: {
    name: string
    id: string
    logo: {
      url: string
    }
  }
  photos: Array<{
    url: string
  }>
}
