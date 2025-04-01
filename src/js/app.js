const products = [
    {
        id: 1,
        name: "Canon EOS R6",
        category: "Mirrorless",
        price: 2499,
        badge: "New",
        image: "src/asset/canon/eos-r6.png",
        specs: {
            megapixels: "20.1 MP",
            iso: "100-102400",
            fps: "12 FPS"
        },
        features: ["4K Video", "Wi-Fi", "Stabilization", "Touchscreen", "Weather Sealed"],
        description: "Professional mirrorless camera with exceptional low-light performance and advanced autofocus system."
    },
    {
        id: 2,
        name: "Sony A7 IV",
        category: "Mirrorless",
        price: 2499,
        badge: "Best Seller",
        image: "a7-iv.png",
        specs: {
            megapixels: "33 MP",
            iso: "100-51200",
            fps: "10 FPS"
        },
        features: ["4K Video", "Wi-Fi", "Stabilization", "Touchscreen"],
        description: "Versatile full-frame mirrorless camera for both photos and videos with excellent dynamic range."
    },
    {
        id: 3,
        name: "Nikon Z6 II",
        category: "Mirrorless",
        price: 1999,
        badge: "",
        image: "../asset/nikon/z6-ii.png",
        specs: {
            megapixels: "24.5 MP",
            iso: "100-51200",
            fps: "14 FPS"
        },
        features: ["4K Video", "Wi-Fi", "Stabilization", "Touchscreen", "Weather Sealed"],
        description: "Well-rounded mirrorless camera with excellent ergonomics and reliable performance."
    },
    {
        id: 4,
        name: "Fujifilm X-T4",
        category: "Mirrorless",
        price: 1699,
        badge: "Popular",
        image: "../asset/fujifilm/x-t4.png",
        specs: {
            megapixels: "26.1 MP",
            iso: "160-12800",
            fps: "15 FPS"
        },
        features: ["4K Video", "Wi-Fi", "Stabilization", "Weather Sealed"],
        description: "APS-C mirrorless camera with legendary color science and film simulations for creative photography."
    },
    {
        id: 5,
        name: "Canon EOS 90D",
        category: "DSLR",
        price: 1199,
        badge: "",
        image: "../asset/canon/eos-90d.png",
        specs: {
            megapixels: "32.5 MP",
            iso: "100-25600",
            fps: "10 FPS"
        },
        features: ["4K Video", "Wi-Fi", "Touchscreen"],
        description: "High-resolution DSLR with excellent ergonomics and robust build quality for enthusiasts."
    },
    {
        id: 6,
        name: "Sony RX100 VII",
        category: "Compact",
        price: 1299,
        badge: "Premium",
        image: "../asset/sony/rx100-vii.png",
        specs: {
            megapixels: "20.1 MP",
            iso: "100-12800",
            fps: "20 FPS"
        },
        features: ["4K Video", "Wi-Fi", "Stabilization", "Touchscreen"],
        description: "Premium compact camera with incredible autofocus and versatile zoom range in a pocket-sized body."
    }
];

const productsContainer = document.getElementById('products');
const modal = document.getElementById('productModal');
const modalContent = document.getElementById('modalProductContent');
const closeModal = document.querySelector('.close-modal');
const priceInputs = document.querySelectorAll('.range-input input');
const progress = document.querySelector('.progress');
const minPrice = document.getElementById('min-price');
const maxPrice = document.getElementById('max-price');
let priceGap = 500;

document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
    setupPriceSlider();
    setupFilterListeners();
});

function displayProducts(productList) {
    if (productList.length === 0) {
        productsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-camera-retro"></i>
                <h3>No Cameras Found</h3>
                <p>Try adjusting your filters to find the perfect camera for your needs.</p>
                <button class="neon-button">Reset Filters</button>
            </div>
        `;
        return;
    }

    productsContainer.innerHTML = '';

    productList.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            </div>
            <div class="product-info">
                <div class="product-category">
                    <i class="fas fa-tag"></i> ${product.category}
                </div>
                <h3 class="product-name">${product.name}</h3>
                <div class="specs">
                    <div class="spec">
                        <i class="fas fa-image"></i>
                        <span>${product.specs.megapixels}</span>
                    </div>
                    <div class="spec">
                        <i class="fas fa-bolt"></i>
                        <span>${product.specs.iso}</span>
                    </div>
                    <div class="spec">
                        <i class="fas fa-tachometer-alt"></i>
                        <span>${product.specs.fps}</span>
                    </div>
                </div>
                <div class="product-features">
                    ${product.features.slice(0, 3).map(feature => `
                        <span class="feature-tag">
                            <i class="fas fa-check"></i> ${feature}
                        </span>
                    `).join('')}
                    ${product.features.length > 3 ? `<span class="feature-tag">+${product.features.length - 3} more</span>` : ''}
                </div>
                <div class="price">$${product.price}</div>
                <div class="product-actions">
                    <button class="details-btn" onclick="openModal(${product.id})">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                    <button class="add-to-cart-btn">
                        <i class="fas fa-shopping-cart"></i> Check Price
                    </button>
                </div>
            </div>
        `;

        productsContainer.appendChild(productCard);
    });
}

function setupFilterListeners() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });

    priceInputs.forEach(input => {
        input.addEventListener('input', filterProducts);
    });
}

function filterProducts() {
    const selectedTypes = getSelectedValues('type');
    const selectedBrands = getSelectedValues('brand');
    const selectedFeatures = getSelectedValues('features');
    const minPriceValue = parseInt(priceInputs[0].value);
    const maxPriceValue = parseInt(priceInputs[1].value);

    productsContainer.innerHTML = `
        <div class="loading">
            <div class="loader"></div>
            <div class="loading-text">Finding your perfect camera...</div>
        </div>
    `;

    setTimeout(() => {
        const filteredProducts = products.filter(product => {
            if (selectedTypes.length > 0 && !selectedTypes.includes(product.category.toLowerCase())) {
                return false;
            }

            if (selectedBrands.length > 0) {
                const productBrand = product.name.split(' ')[0].toLowerCase();
                if (!selectedBrands.includes(productBrand)) {
                    return false;
                }
            }

            if (selectedFeatures.length > 0) {
                const productFeatures = product.features.map(f => f.toLowerCase());
                if (!selectedFeatures.every(f => productFeatures.includes(f))) {
                    return false;
                }
            }

            if (product.price < minPriceValue || product.price > maxPriceValue) {
                return false;
            }

            return true;
        });

        displayProducts(filteredProducts);
    }, 800);
}

function getSelectedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
        .map(cb => cb.value);
}

function setupPriceSlider() {
    priceInputs.forEach(input => {
        input.addEventListener('input', e => {
            let minVal = parseInt(priceInputs[0].value);
            let maxVal = parseInt(priceInputs[1].value);

            if (maxVal - minVal < priceGap) {
                if (e.target.className === 'min') {
                    priceInputs[0].value = maxVal - priceGap;
                } else {
                    priceInputs[1].value = minVal + priceGap;
                }
            } else {
                minPrice.textContent = `$${minVal}`;
                maxPrice.textContent = `$${maxVal}`;
                progress.style.left = (minVal / priceInputs[0].max) * 100 + '%';
                progress.style.right = 100 - (maxVal / priceInputs[1].max) * 100 + '%';
            }
        });
    });
}


function openModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    modalContent.innerHTML = `
        <div class="modal-product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="modal-product-info">
            <span class="category">${product.category}</span>
            <h2>${product.name}</h2>
            <div class="modal-price">$${product.price}</div>
            
            <div class="product-description">
                <p>${product.description}</p>
                
                <h3>Key Specifications</h3>
                <div class="specs-grid">
                    <div class="spec-item">
                        <span class="spec-label">Resolution</span>
                        <span class="spec-value">${product.specs.megapixels}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">ISO Range</span>
                        <span class="spec-value">${product.specs.iso}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Burst Rate</span>
                        <span class="spec-value">${product.specs.fps}</span>
                    </div>
                </div>
                
                <h3>Features</h3>
                <ul class="features-list">
                    ${product.features.map(feature => `
                        <li><i class="fas fa-check-circle"></i> ${feature}</li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="cta-buttons">
                <button class="add-to-cart-btn">
                    <i class="fas fa-shopping-cart"></i> Check Price
                </button>

            </div>
        </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        modal.classList.add('active');
        modalContent.classList.add('active');
    }, 10);
}

closeModal.addEventListener('click', () => {
    closeProductModal();
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeProductModal();
    }
});

function closeProductModal() {
    modal.classList.remove('active');
    modalContent.classList.remove('active');

    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('neon-button')) {
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });

        priceInputs[0].value = priceInputs[0].min;
        priceInputs[1].value = priceInputs[1].max;
        minPrice.textContent = `$${priceInputs[0].value}`;
        maxPrice.textContent = `$${priceInputs[1].value}`;
        progress.style.left = '0%';
        progress.style.right = '0%';

        displayProducts(products);
    }
})
function addModalStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      #productModal {
        align-items: center;
        justify-content: center;
      }
      
      #modalProductContent {
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        position: relative;
      }
      
      #modalProductContent::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      #modalProductContent::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
      }
      
      #modalProductContent::-webkit-scrollbar-thumb {
        background: #8888a8;
        border-radius: 4px;
        transition: background 0.3s ease;
      }
      
      #modalProductContent::-webkit-scrollbar-thumb:hover {
        background: #6666a0;
      }
      
      .modal-product-info {
        overflow-y: auto;
        padding-right: 16px; 
      }
      
      .modal-product-info::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      .modal-product-info::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
      }
      
      .modal-product-info::-webkit-scrollbar-thumb {
        background: #8888a8;
        border-radius: 4px;
        transition: background 0.3s ease;
      }
      
      .modal-product-info::-webkit-scrollbar-thumb:hover {
        background: #6666a0;
      }
      
      @media (min-width: 768px) {
        #modalProductContent {
          flex-direction: row;
          max-width: 80%;
          padding: 24px;
        }
        
        .modal-product-image {
          flex: 0 0 40%;
          position: sticky;
          top: 0;
          align-self: flex-start;
          padding-right: 24px;
        }
        
        .modal-product-info {
          flex: 0 0 60%;
          padding-left: 24px;
          border-left: 1px solid #eaeaea;
          max-height: 65vh;
        }
      }
      
      @media (max-width: 767px) {
        #modalProductContent {
          width: 90%;
          padding: 20px;
        }
        
        .modal-product-image {
          text-align: center;
          margin-bottom: 20px;
        }
        
        .modal-product-image img {
          max-width: 100%;
          max-height: 200px;
          object-fit: contain;
        }
        
        .modal-product-info {
          max-height: 50vh;
        }
      }
      
      .close-modal-btn {
        position: absolute;
        top: 12px;
        right: 12px;
        background: rgba(0, 0, 0, 0.05);
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.2s ease;
      }
      
      .close-modal-btn:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    `;
    document.head.appendChild(styleElement);
}

function updateOpenModalFunction() {
    const originalOpenModal = window.openModal;

    window.openModal = function (productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        modalContent.innerHTML = `
          <div class="modal-product-image">
              <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="modal-product-info">
              <span class="category">${product.category}</span>
              <h2>${product.name}</h2>
              <div class="modal-price">$${product.price}</div>
              
              <div class="product-description">
                  <p>${product.description}</p>
                  
                  <h3>Key Specifications</h3>
                  <div class="specs-grid">
                      <div class="spec-item">
                          <span class="spec-label">Resolution</span>
                          <span class="spec-value">${product.specs.megapixels}</span>
                      </div>
                      <div class="spec-item">
                          <span class="spec-label">ISO Range</span>
                          <span class="spec-value">${product.specs.iso}</span>
                      </div>
                      <div class="spec-item">
                          <span class="spec-label">Burst Rate</span>
                          <span class="spec-value">${product.specs.fps}</span>
                      </div>
                  </div>
                  
                  <h3>Features</h3>
                  <ul class="features-list">
                      ${product.features.map(feature => `
                          <li><i class="fas fa-check-circle"></i> ${feature}</li>
                      `).join('')}
                  </ul>
              </div>
              
              <div class="cta-buttons">
                  <button class="add-to-cart-btn">
                      <i class="fas fa-shopping-cart"></i> Check Price
                  </button>
              </div>
          </div>
      `;

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        if (modalContent) {
            modalContent.scrollTop = 0;
        }

        setTimeout(() => {
            modal.classList.add('active');
            modalContent.classList.add('active');
        }, 10);
    };
}

function initModalFixes() {
    addModalStyles();
    updateOpenModalFunction();
    window.addEventListener('resize', function () {
        if (modal.style.display === 'flex') {
            if (window.innerHeight < modalContent.offsetHeight) {
                modalContent.style.height = '80vh';
            } else {
                modalContent.style.height = 'auto';
            }
        }
    });
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModalFixes);
} else {
    initModalFixes();
}
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn') ||
        e.target.parentElement.classList.contains('add-to-cart-btn')) {

        const button = e.target.classList.contains('add-to-cart-btn') ?
            e.target : e.target.parentElement;

        button.innerHTML = '<i class="fas fa-check"></i> Done';
        button.classList.add('added');

        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-shopping-cart"></i> Check Price';
            button.classList.remove('added');
        }, 2000);
    }
});
