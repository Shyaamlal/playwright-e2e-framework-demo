## My CartPage Inspection

Elements:

Text:
- There is a text at the top 'Your Cart', which is left aligned: data-test="title"
- There is a text that says QTY, which is left aligned: data-test='cart_quantity_label'
- There is a text that says 'Description', which is left aligned, after QTY text: data-test='cart_desc_label'
- There is a quantity in number for each of the products we have added to the cart, which is left aligned: data-test='item_quantity'
- There is an inventory item price and inventory item description, with data-test="inventory-item-price" and 'data-test=inventory-item-desc'
My question: How do I know if something is a text element or not? I can see the text, but how do I know if it is a text element or not?

Buttons:
- There is a button that says 'Continue Shopping', which is left aligned: data-test='continue-shopping'
- There is a button that says 'Checkout', which is right aligned: data-test='checkout
- There is a button that says 'Remove', which is right aligned: data-test='remove-sauce-labs-backpack'
My question: With buttons section, VS Code was able to give all the details correctly. I only had to hit tab. How did it know? 

Link text:
- There is a link text with data-test="inventory-item-name". In this case, the text was 'Sauce Labs Backpack'.
My question: I have now written this page containing one product. How do we do this if it contains more than one product? I am unable to think in terms of abstractions that we did - Like products in a separate page object class. Does this make sense? 