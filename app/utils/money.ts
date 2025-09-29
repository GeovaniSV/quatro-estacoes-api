import Item from '#models/item'

export class MoneyManagement {
  calculateCartPrice(items: Item[]) {
    let cart_price = items.reduce(
      (previousValue: number, currentValue: Item) => previousValue + currentValue.itemPrice,
      0
    )

    return cart_price
  }

  multiply(value: number, qty: number) {
    let result = value * qty
    return result
  }

  createView(value: number) {
    let valueToString = value.toString()
    valueToString = valueToString.replace(/\B(?=(..$))+/g, ',')
    valueToString = valueToString.replace(/\B(?=(\d{3})+(?!\d|..$))/g, '.')
    return valueToString
  }

  createPaymentView(value: number) {
    let valueToString = value.toString()
    valueToString = valueToString.replace(/\B(?=(..$))+/g, '.')

    return Number(valueToString)
  }
}
