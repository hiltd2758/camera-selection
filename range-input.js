document.addEventListener('DOMContentLoaded', () => {
    const priceOptions = document.querySelectorAll('input[name="price-range"]');
    
    priceOptions.forEach(option => {
        option.addEventListener('change', filterProducts);
    });
        setupFilterListeners();
    
    displayProducts(products);
});

function setupFilterListeners() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });
}

function filterProducts() {
    const selectedTypes = getSelectedValues('type');
    const selectedBrands = getSelectedValues('brand');
    const selectedFeatures = getSelectedValues('features');
    const selectedPriceRange = getSelectedPriceRange();
    
    productsContainer.innerHTML = `
        <div class="loading">
            <div class="loader"></div>
            <div class="loading-text">Đang tìm máy ảnh phù hợp...</div>
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

            if (selectedPriceRange.min !== null && selectedPriceRange.max !== null) {
                if (product.price < selectedPriceRange.min || product.price > selectedPriceRange.max) {
                    return false;
                }
            }

            return true;
        });

        displayProducts(filteredProducts);
    }, 800);
}

function getSelectedPriceRange() {
    const selectedOption = document.querySelector('input[name="price-range"]:checked');
    
    if (!selectedOption || selectedOption.value === 'all') {
        return { min: null, max: null }; 
    }
    
    const [min, max] = selectedOption.value.split('-').map(Number);
    return { min, max };
}

function getSelectedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
        .map(cb => cb.value);
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('neon-button')) {
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        const allPriceOption = document.getElementById('price-all');
        if (allPriceOption) {
            allPriceOption.checked = true;
        }
        
        displayProducts(products);
    }
});