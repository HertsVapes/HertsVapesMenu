# Herts Vapes Version 4

Inventory-driven GitHub Pages build.

## Files to edit for future updates

- `data/inventory.js` — categories, products, flavours, prices, deals, stock and category images.
- `data/settings.js` — WhatsApp number, Snapchat username and business settings.

## Stock updates

To mark something out of stock, change that product or deal to:

```js
inStock: false
```

To put it back in stock:

```js
inStock: true
```

## Images

Use only local image files already uploaded to the project. Category images are referenced in `data/inventory.js`.
