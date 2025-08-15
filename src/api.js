export async function fetchCategories() {
    const res = await fetch('/data/categories.json');
    return res.json();
}

export async function fetchBusinesses(categoryId) {
    const res = await fetch(`/data/businesses.json`);
    const businesses = await res.json();
    return businesses.filter(b => b.category === categoryId);
}

export async function fetchItems(categoryId, businessId) {
    const res = await fetch(`/data/items.json`);
    const items = await res.json();
    return items.filter(i => i.category === categoryId && i.business === businessId);
}
