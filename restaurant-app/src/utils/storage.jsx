const LS_KEYS = {
  ORDERS: 'ra_orders',
  CHEFS: 'ra_chefs',
  TABLES: 'ra_tables',
  MENU: 'ra_menu'
}

const nowISO = () => new Date().toISOString()

export function seedLocalStorageIfEmpty() {
  if (!localStorage.getItem(LS_KEYS.CHEFS)) {
    const chefs = [
      { id: 'chef_1', name: 'Manesh', assignedOrders: 2 },
      { id: 'chef_2', name: 'Pritam', assignedOrders: 1 },
      { id: 'chef_3', name: 'Yash', assignedOrders: 0 },
      { id: 'chef_4', name: 'Tenzen', assignedOrders: 1 }
    ]
    localStorage.setItem(LS_KEYS.CHEFS, JSON.stringify(chefs))
  }

  if (!localStorage.getItem(LS_KEYS.TABLES)) {
    // 30 tables with optional names; reserved flags
    const tables = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      seats: [2, 4, 6, 8][Math.floor(Math.random() * 4)],
      reserved: Math.random() < 0.15,
      name: Math.random() < 0.1 ? `Table-${i + 1}` : ''
    }))
    localStorage.setItem(LS_KEYS.TABLES, JSON.stringify(tables))
  }

  if (!localStorage.getItem(LS_KEYS.MENU)) {
    const menu = [
      {
        id: 'm1',
        name: 'Burger',
        description: 'Burger from Burger King',
        price: 199,
        averagePreparationTime: 20,
        category: 'Burgers',
        stock: true
      },
      {
        id: 'm2',
        name: 'Double Cheeseburger',
        description: 'Cheesy and tasty',
        price: 249,
        averagePreparationTime: 25,
        category: 'Burgers',
        stock: true
      },
      {
        id: 'm3',
        name: 'Apple Pie',
        description: 'Dessert',
        price: 99,
        averagePreparationTime: 8,
        category: 'Desserts',
        stock: true
      }
    ]
    localStorage.setItem(LS_KEYS.MENU, JSON.stringify(menu))
  }

  if (!localStorage.getItem(LS_KEYS.ORDERS)) {
    // sample orders with types and status
    const orders = [
      { id: 'o1', type: 'Dine In', table: 5, items: 3, status: 'Processing', createdAt: nowISO(), chefId: 'chef_1', amount: 499 },
      { id: 'o2', type: 'Takeaway', table: null, items: 2, status: 'Done', createdAt: nowISO(), chefId: 'chef_2', amount: 349 },
      { id: 'o3', type: 'Dine In', table: 12, items: 4, status: 'Served', createdAt: nowISO(), chefId: 'chef_1', amount: 699 },
      { id: 'o4', type: 'Takeaway', table: null, items: 1, status: 'Processing', createdAt: nowISO(), chefId: 'chef_4', amount: 199 },
      { id: 'o5', type: 'Dine In', table: 3, items: 2, status: 'Done', createdAt: nowISO(), chefId: 'chef_2', amount: 299 }
    ]
    localStorage.setItem(LS_KEYS.ORDERS, JSON.stringify(orders))
  }
}

export function getOrders() {
  return JSON.parse(localStorage.getItem(LS_KEYS.ORDERS) || '[]')
}

export function getChefs() {
  return JSON.parse(localStorage.getItem(LS_KEYS.CHEFS) || '[]')
}

export function getTables() {
  return JSON.parse(localStorage.getItem(LS_KEYS.TABLES) || '[]')
}

export function getMenu() {
  return JSON.parse(localStorage.getItem(LS_KEYS.MENU) || '[]')
}

export function saveOrders(arr) {
  localStorage.setItem(LS_KEYS.ORDERS, JSON.stringify(arr))
}
