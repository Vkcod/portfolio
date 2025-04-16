// Project Data
const projects = [
    {
        id: 1,
        title: "E-commerce Platform",
        description: "A full-featured e-commerce platform built with Laravel and Vue.js, featuring product management, cart functionality, and payment integration.",
        image: "https://via.placeholder.com/300x200",
        category: "laravel",
        tech: ["Laravel", "Vue.js", "MySQL", "Stripe API"],
        demoLink: "#",
        githubLink: "#"
    },
    {
        id: 2,
        title: "Task Management System",
        description: "A comprehensive task management application developed with CodeIgniter and jQuery, with real-time updates and team collaboration features.",
        image: "https://via.placeholder.com/300x200",
        category: "codeigniter",
        tech: ["CodeIgniter", "jQuery", "MySQL", "Bootstrap"],
        demoLink: "#",
        githubLink: "#"
    },
    {
        id: 3,
        title: "React Dashboard",
        description: "A modern admin dashboard built with React.js and PHP backend, featuring data visualization, user management, and reporting tools.",
        image: "https://via.placeholder.com/300x200",
        category: "react",
        tech: ["React.js", "PHP", "MySQL", "Chart.js"],
        demoLink: "#",
        githubLink: "#"
    },
    {
        id: 4,
        title: "Vue.js SPA",
        description: "A single-page application developed with Vue.js and PHP API, showcasing modern frontend development practices and responsive design.",
        image: "https://via.placeholder.com/300x200",
        category: "vue",
        tech: ["Vue.js", "PHP", "MySQL", "Axios"],
        demoLink: "#",
        githubLink: "#"
    }
];

// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const projectGrid = document.querySelector('.project-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const contactForm = document.getElementById('contact-form');
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');
const experienceItems = document.querySelectorAll('.timeline-item');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let isMenuOpen = false;
let currentIndex = 0;

// Theme Toggle
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    if (body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
    
    // Save preference to localStorage
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.querySelector('i').classList.remove('fa-moon');
    themeToggle.querySelector('i').classList.add('fa-sun');
}

// Mobile Menu Toggle
function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    navLinks.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    
    if (isMenuOpen) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        document.body.style.overflow = 'hidden';
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        document.body.style.overflow = '';
    }
}

menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (isMenuOpen && !menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        toggleMenu();
    }
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (isMenuOpen) {
            toggleMenu();
        }
    });
});

// Close mobile menu when pressing Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
        toggleMenu();
    }
});

// Intersection Observer for Navigation and Animations
const navObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
};

const animationObserverOptions = {
    threshold: 0.1
};

const navObserverCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${id}`) {
                    item.classList.add('active');
                }
            });
        }
    });
};

const animationObserverCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
};

const navObserver = new IntersectionObserver(navObserverCallback, navObserverOptions);
const animationObserver = new IntersectionObserver(animationObserverCallback, animationObserverOptions);

// Observe sections for navigation
sections.forEach(section => navObserver.observe(section));

// Observe elements for animations
document.querySelectorAll('.section-title, .about-content, .project-card, .experience-content, .contact-form').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    animationObserver.observe(element);
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetSection.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Project Filtering and View More
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    const viewMoreBtn = document.querySelector('.view-more-btn');
    const projectsPerPage = 3;
    let currentFilter = 'all';

    // Function to show/hide projects based on filter
    function filterProjects(filter) {
        currentFilter = filter;
        let visibleCount = 0;
        
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                if (visibleCount < projectsPerPage) {
                    card.classList.remove('hidden');
                    card.style.animation = 'none';
                    card.offsetHeight; // Trigger reflow
                    card.style.animation = 'fadeInUp 0.6s ease-out forwards';
                } else {
                    card.classList.add('hidden');
                }
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Show/hide view more button
        const totalFilteredProjects = Array.from(projectCards).filter(card => 
            filter === 'all' || card.getAttribute('data-category') === filter
        ).length;

        viewMoreBtn.style.display = totalFilteredProjects > projectsPerPage ? 'inline-block' : 'none';
    }

    // Filter button click handlers
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterProjects(button.getAttribute('data-filter'));
        });
    });

    // View more button click handler
    viewMoreBtn.addEventListener('click', () => {
        const hiddenProjects = Array.from(projectCards).filter(card => 
            (currentFilter === 'all' || card.getAttribute('data-category') === currentFilter) &&
            card.classList.contains('hidden')
        );

        hiddenProjects.slice(0, projectsPerPage).forEach(card => {
            card.classList.remove('hidden');
            card.style.animation = 'none';
            card.offsetHeight; // Trigger reflow
            card.style.animation = 'fadeInUp 0.6s ease-out forwards';
        });

        // Hide view more button if no more projects
        if (hiddenProjects.length <= projectsPerPage) {
            viewMoreBtn.style.display = 'none';
        }
    });

    // Initial filter
    filterProjects('all');
});

// Form Validation
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    let isValid = true;
    let errorMessage = '';
    
    if (name.length < 2) {
        isValid = false;
        errorMessage += 'Name must be at least 2 characters long.\n';
    }
    
    if (!isValidEmail(email)) {
        isValid = false;
        errorMessage += 'Please enter a valid email address.\n';
    }

    if (subject.length < 3) {
        isValid = false;
        errorMessage += 'Subject must be at least 3 characters long.\n';
    }
    
    if (message.length < 10) {
        isValid = false;
        errorMessage += 'Message must be at least 10 characters long.\n';
    }
    
    if (isValid) {
        // Here you would typically send the form data to a server
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
    } else {
        alert(errorMessage);
    }
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Experience Section Navigation
function updateExperience(index, shouldScroll = false) {
    experienceItems.forEach(item => item.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    experienceItems[index].classList.add('active');
    dots[index].classList.add('active');
    
    // Only scroll if explicitly requested
    if (shouldScroll) {
        experienceItems[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + experienceItems.length) % experienceItems.length;
    updateExperience(currentIndex, true);
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % experienceItems.length;
    updateExperience(currentIndex, true);
});

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentIndex = index;
        updateExperience(currentIndex, true);
    });
});

// Initialize the first experience item without scrolling
updateExperience(0, false);

// Resume Download Enhancement
// document.querySelector('a[href="pdf/resume.pdf"]').addEventListener('click', function(e) {
//     // Check if the file exists
//     fetch('E:/wamp64/www/vikas-portfolio/pdf/resume.pdf')
//         .then(response => {
//             if (!response.ok) {
//                 e.preventDefault();
//                 alert('Resume file not found. Please contact the developer.');
//             }
//         })
//         .catch(error => {
//             e.preventDefault();
//             alert('Error downloading resume. Please try again later.');
//             console.error('Error:', error);
//         });
// }); 