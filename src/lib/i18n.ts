export const locales = ['en', 'ar'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'ar'

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.about': 'About',
    'nav.cart': 'Cart',
    'nav.admin': 'Admin',
    'nav.login': 'Login',
    'nav.logout': 'Logout',

    // Home
    'home.hero.title': 'KAZUZA',
    'home.hero.subtitle': 'Premium Egyptian Streetwear',
    'home.hero.cta': 'Shop Now',
    'home.featured': 'Featured Products',
    'home.about.title': 'Our Story',
    'home.about.text': 'Born in the streets of Cairo, KAZUZA represents the raw energy of Egyptian youth culture. We blend traditional heritage with modern street aesthetics to create clothing that speaks louder than words.',
    'home.testimonials': 'What People Say',
    'home.instagram': 'Follow Us @kazuza',

    // Products
    'products.title': 'All Products',
    'products.addToCart': 'Add to Cart',
    'products.outOfStock': 'Out of Stock',
    'products.limited': 'Limited Stock',
    'products.inStock': 'In Stock',
    'products.price': 'Price',
    'products.egp': 'EGP',
    'products.noProducts': 'No products available yet.',
    'products.details': 'View Details',

    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.total': 'Total',
    'cart.checkout': 'Proceed to Checkout',
    'cart.remove': 'Remove',
    'cart.continue': 'Continue Shopping',

    // Checkout
    'checkout.title': 'Checkout',
    'checkout.name': 'Full Name',
    'checkout.phone': 'Phone Number',
    'checkout.email': 'Email (optional)',
    'checkout.address': 'Address',
    'checkout.city': 'City',
    'checkout.notes': 'Order Notes (optional)',
    'checkout.payment': 'Payment Method',
    'checkout.vodafone': 'Vodafone Cash',
    'checkout.instapay': 'InstaPay',
    'checkout.cod': 'Cash on Delivery',
    'checkout.placeOrder': 'Place Order',
    'checkout.success': 'Order Placed Successfully!',
    'checkout.successMsg': 'We will contact you soon to confirm your order.',
    'checkout.vodafoneInstructions': 'Send payment to: 01XXXXXXXXX',
    'checkout.instapayInstructions': 'Send payment via InstaPay to: kazuza@instapay',
    'checkout.codInstructions': 'Pay cash when you receive your order.',

    // About
    'about.title': 'About KAZUZA',
    'about.story': 'KAZUZA was founded in Cairo with a vision to bring authentic Egyptian streetwear to the world. Our designs are inspired by the vibrant streets, ancient heritage, and the unstoppable spirit of Egyptian youth.',
    'about.mission': 'Every piece we create tells a story — of resilience, creativity, and pride. We are not just a brand, we are a movement.',

    // Admin
    'admin.title': 'Admin Dashboard',
    'admin.products': 'Products',
    'admin.orders': 'Orders',
    'admin.addProduct': 'Add Product',
    'admin.editProduct': 'Edit Product',
    'admin.nameEn': 'Name (English)',
    'admin.nameAr': 'Name (Arabic)',
    'admin.descEn': 'Description (English)',
    'admin.descAr': 'Description (Arabic)',
    'admin.price': 'Price (EGP)',
    'admin.category': 'Category',
    'admin.images': 'Product Images',
    'admin.stockStatus': 'Stock Status',
    'admin.visible': 'Visible',
    'admin.hidden': 'Hidden',
    'admin.save': 'Save Product',
    'admin.delete': 'Delete',
    'admin.cancel': 'Cancel',
    'admin.noOrders': 'No orders yet.',
    'admin.uploadImages': 'Upload Images',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.currency': 'EGP',
    'common.rtl': 'false',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.products': 'المنتجات',
    'nav.about': 'عن KAZUZA',
    'nav.cart': 'السلة',
    'nav.admin': 'لوحة التحكم',
    'nav.login': 'تسجيل الدخول',
    'nav.logout': 'تسجيل الخروج',

    // Home
    'home.hero.title': 'KAZUZA',
    'home.hero.subtitle': 'ستريت وير مصري فاخر',
    'home.hero.cta': 'تسوق الآن',
    'home.featured': 'منتجات مميزة',
    'home.about.title': 'قصتنا',
    'home.about.text': 'اتولدت في شوارع القاهرة، KAZUZA بتمثل الطاقة الخام لثقافة الشباب المصري. نمزج التراث التقليدي مع الجماليات الحديثة لصناعة هدوم بتعبر أكتر من الكلام.',
    'home.testimonials': 'إيه اللي الناس بتقوله',
    'home.instagram': 'تابعنا @kazuza',

    // Products
    'products.title': 'كل المنتجات',
    'products.addToCart': 'أضف للسلة',
    'products.outOfStock': 'نفذ من المخزون',
    'products.limited': 'كمية محدودة',
    'products.inStock': 'متوفر',
    'products.price': 'السعر',
    'products.egp': 'ج.م',
    'products.noProducts': 'مفيش منتجات متاحة دلوقتي.',
    'products.details': 'عرض التفاصيل',

    // Cart
    'cart.title': 'سلة التسوق',
    'cart.empty': 'السلة فاضية',
    'cart.total': 'الإجمالي',
    'cart.checkout': 'إتمام الطلب',
    'cart.remove': 'إزالة',
    'cart.continue': 'كمّل تسوق',

    // Checkout
    'checkout.title': 'إتمام الطلب',
    'checkout.name': 'الاسم الكامل',
    'checkout.phone': 'رقم الموبايل',
    'checkout.email': 'الإيميل (اختياري)',
    'checkout.address': 'العنوان',
    'checkout.city': 'المدينة',
    'checkout.notes': 'ملاحظات الطلب (اختياري)',
    'checkout.payment': 'طريقة الدفع',
    'checkout.vodafone': 'فودافون كاش',
    'checkout.instapay': 'إنستاباي',
    'checkout.cod': 'الدفع عند الاستلام',
    'checkout.placeOrder': 'تأكيد الطلب',
    'checkout.success': 'تم تقديم الطلب بنجاح!',
    'checkout.successMsg': 'هنكلمك قريب عشان نأكد طلبك.',
    'checkout.vodafoneInstructions': 'ابعت المبلغ على: 01XXXXXXXXX',
    'checkout.instapayInstructions': 'ابعت المبلغ عبر إنستاباي على: kazuza@instapay',
    'checkout.codInstructions': 'ادفع كاش لما تستلم طلبك.',

    // About
    'about.title': 'عن KAZUZA',
    'about.story': 'KAZUZA اتأسست في القاهرة بحلم إننا نوصل الستريت وير المصري الأصيل للعالم. تصميماتنا مستوحاة من شوارع القاهرة الحيوية، التراث القديم، والروح اللي م بتوقفش للشباب المصري.',
    'about.mission': 'كل قطعة بنعملها بتحكي قصة — عن الصمود، الإبداع، والفخر. إحنا مش مجرد براند، إحنا حركة.',

    // Admin
    'admin.title': 'لوحة التحكم',
    'admin.products': 'المنتجات',
    'admin.orders': 'الطلبات',
    'admin.addProduct': 'إضافة منتج',
    'admin.editProduct': 'تعديل منتج',
    'admin.nameEn': 'الاسم (إنجليزي)',
    'admin.nameAr': 'الاسم (عربي)',
    'admin.descEn': 'الوصف (إنجليزي)',
    'admin.descAr': 'الوصف (عربي)',
    'admin.price': 'السعر (ج.م)',
    'admin.category': 'التصنيف',
    'admin.images': 'صور المنتج',
    'admin.stockStatus': 'حالة المخزون',
    'admin.visible': 'ظاهر',
    'admin.hidden': 'مخفي',
    'admin.save': 'حفظ المنتج',
    'admin.delete': 'حذف',
    'admin.cancel': 'إلغاء',
    'admin.noOrders': 'مفيش طلبات لسه.',
    'admin.uploadImages': 'رفع الصور',

    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'حصل حاجة غلط',
    'common.currency': 'ج.م',
    'common.rtl': 'true',
  },
}

export function t(key: string, locale: Locale): string {
  return translations[locale]?.[key] || translations['en']?.[key] || key
}

export function isRTL(locale: Locale): boolean {
  return locale === 'ar'
}
