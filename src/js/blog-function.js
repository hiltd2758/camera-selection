document.addEventListener('DOMContentLoaded', function () {
    const categoryButtons = document.querySelectorAll('.blog-category-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    categoryButtons.forEach(button => {
        button.addEventListener('click', function () {
            categoryButtons.forEach(btn => btn.classList.remove('active'));

            this.classList.add('active');

            const category = this.textContent.trim();

            if (category === 'Tất cả') {
                blogCards.forEach(card => card.style.display = 'block');
            } else {
                blogCards.forEach(card => {
                    const cardCategory = card.querySelector('.blog-category').textContent;
                    if (cardCategory === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        });
    });

    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;

            alert(`Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi bản tin đến ${email}`);

            this.reset();
        });
    }

    const readMoreLinks = document.querySelectorAll('.read-more');
    readMoreLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const blogCard = this.closest('.blog-card');
            const title = blogCard.querySelector('h3').textContent;
            const category = blogCard.querySelector('.blog-category').textContent;
            const imgSrc = blogCard.querySelector('img').src;

            localStorage.setItem('blogTitle', title);
            localStorage.setItem('blogCategory', category);
            localStorage.setItem('blogImage', imgSrc);

            window.location.href = '../../public/blog-detail.html';
        });
    });

    blogCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.querySelector('.blog-img-container img').style.transform = 'scale(1.1)';
        });

        card.addEventListener('mouseleave', function () {
            this.querySelector('.blog-img-container img').style.transform = 'scale(1)';
        });
    });

    const viewAllBtn = document.querySelector('.view-all-btn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function (e) {
            e.preventDefault();

            alert('Đang tải thêm bài viết...');

            //xuli
        });
    }

    // btn
    const neonButtons = document.querySelectorAll('.neon-button');
    neonButtons.forEach(button => {
        button.addEventListener('mouseenter', function () {
            this.style.boxShadow = '0 0 20px rgba(246, 55, 236, 0.9), 0 0 40px rgba(246, 55, 236, 0.5)';
        });

        button.addEventListener('mouseleave', function () {
            this.style.boxShadow = '0 0 15px rgba(246, 55, 236, 0.7)';
        });
    });
});

// loading
function loadBlogDetail() {

    if (document.querySelector('.blog-detail-page')) {
        const title = localStorage.getItem('blogTitle') || 'Bài viết không tồn tại';
        const category = localStorage.getItem('blogCategory') || 'Chưa phân loại';
        const imgSrc = localStorage.getItem('blogImage') || '/api/placeholder/800/500';

        document.querySelector('.blog-detail-title').textContent = title;
        document.querySelector('.blog-detail-category').textContent = category;
        document.querySelector('.blog-detail-image').src = imgSrc;

        document.title = title + ' - Blog Nhiếp Ảnh';

        generateRelatedPosts();
    }
}

function generateRelatedPosts() {
    const relatedPostsContainer = document.querySelector('.related-posts-container');
    if (!relatedPostsContainer) return;

    const categories = ['Đánh giá', 'Hướng dẫn', 'Phụ kiện', 'Kỹ thuật'];
    const titles = [
        'Cách chụp ảnh chân dung đẹp với ánh sáng tự nhiên',
        'Top 5 máy ảnh tốt nhất dành cho du lịch năm 2025',
        'Hướng dẫn cài đặt máy ảnh cho người mới bắt đầu',
        'So sánh giữa ống kính cố định và ống kính zoom',
        'Cách chỉnh sửa ảnh chuyên nghiệp với Lightroom',
        'Những phụ kiện cần thiết cho nhiếp ảnh gia'
    ];

    relatedPostsContainer.innerHTML = '';

    for (let i = 0; i < 3; i++) {
        const randomTitle = titles[Math.floor(Math.random() * titles.length)];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];

        const relatedPost = document.createElement('div');
        relatedPost.className = 'related-post';
        relatedPost.innerHTML = `
            <div class="related-post-img">
                <img src="/api/placeholder/150/100" alt="Bài viết liên quan">
                <span class="related-post-category">${randomCategory}</span>
            </div>
            <div class="related-post-content">
                <h4>${randomTitle}</h4>
                <a href="#" class="read-more">Đọc tiếp <i class="fas fa-arrow-right"></i></a>
            </div>
        `;

        relatedPostsContainer.appendChild(relatedPost);
    }
}

window.addEventListener('DOMContentLoaded', loadBlogDetail);