# HIRAYA STUDIO — Fashion E-commerce

A responsive, editorial-style fashion storefront built with **HTML5, CSS3, and vanilla JavaScript**. Cart and wishlist data are saved in the browser with LocalStorage.

## Project files

- `index.html` — page structure, product views, drawers, and dialogs
- `styles.css` — responsive layout, typography, components, and interactions
- `app.js` — product catalog, search/filter/sort, cart, wishlist, and simulated checkout

## Run in VS Code

1. Extract the project folder.
2. Open the `hiraya-studio` folder in Visual Studio Code.
3. Install the **Live Server** extension if it is not already installed.
4. Right-click `index.html` and choose **Open with Live Server**.
5. The storefront should open in your browser.

You can also open `index.html` directly in a modern browser, although Live Server is recommended.

## Features

- Responsive homepage with promotional hero, category shortcuts, product collection, brand story, newsletter, and footer
- Product search, category filters, and price/name sorting
- Product detail dialog with size selection
- Add-to-bag, quantity controls, and remove actions
- Wishlist add/remove controls
- Cart and wishlist persistence with LocalStorage
- Checkout form with browser validation and a demo order confirmation
- Mobile navigation, accessible dialog labels, keyboard Escape-to-close, and toast feedback

## Demo checkout and privacy

This is a front-end demonstration. It does **not** connect to a payment gateway, process payments, or request/store card details. Checkout uses a simulated payment selection and stores a demo order locally in the browser under `hirayaStudio_demoOrders`.

## Storage keys

- `hirayaStudio_cart_v1`
- `hirayaStudio_wishlist_v1`
- `hirayaStudio_demoOrders`
- `hirayaStudio_newsletter`

To reset demo data, open the browser developer console and run:

```js
localStorage.removeItem("hirayaStudio_cart_v1");
localStorage.removeItem("hirayaStudio_wishlist_v1");
localStorage.removeItem("hirayaStudio_demoOrders");
localStorage.removeItem("hirayaStudio_newsletter");
location.reload();
```

## Notes

- Product photography is loaded from Unsplash, and fonts are loaded from Google Fonts. An internet connection is needed for those remote assets.
- Product names, prices, and descriptions are sample catalog content that can be edited near the top of `app.js`.
- Currency is displayed in Philippine pesos (PHP).
