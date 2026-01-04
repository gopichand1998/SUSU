const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');

// Set canvas size to window size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Initial resize
resizeCanvas();

// Update canvas size when window is resized
window.addEventListener('resize', resizeCanvas);

let confetti = [];

function startSurprise() {
  const surprise = document.getElementById('surprise');
  const bgMusic = document.getElementById('bgMusic');
  
  // Show the surprise content by removing hidden class
  surprise.classList.remove('hidden');
  
  // Load images when surprise is shown
  loadImages();
  
  // Ensure music is set to loop
  bgMusic.loop = true;
  
  // Try to play music (browsers require user interaction first)
  const playPromise = bgMusic.play();
  
  // Handle promise for autoplay restrictions
  if (playPromise !== undefined) {
    playPromise.catch(error => {
      console.log("Autoplay prevented. User needs to interact first.");
    });
  }
  
  createConfetti();
}

function createConfetti() {
  // Clear existing confetti
  confetti = [];
  
  // Create new confetti particles
  for (let i = 0; i < 200; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height, // Start above the viewport
      r: Math.random() * 6 + 2,
      d: Math.random() * 2 + 1,
      color: `hsl(${Math.random() * 360}, 100%, 75%)` // Random pastel colors
    });
  }
  
  // Start animation if not already running
  if (!window.confettiAnimationRunning) {
    window.confettiAnimationRunning = true;
    animateConfetti();
  }
}

function animateConfetti() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  let stillAnimating = false;
  
  confetti.forEach(c => {
    // Draw confetti
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fillStyle = c.color;
    ctx.fill();
    
    // Move confetti
    c.y += c.d;
    c.x += Math.sin(c.y * 0.01) * 0.5; // Add some horizontal movement
    
    // Reset confetti that falls off screen
    if (c.y < canvas.height) {
      stillAnimating = true;
    } else if (Math.random() > 0.99) {
      c.y = -10;
      c.x = Math.random() * canvas.width;
    }
  });
  
  // Continue animation if there are still visible confetti
  if (stillAnimating) {
    requestAnimationFrame(animateConfetti);
  } else {
    window.confettiAnimationRunning = false;
  }
}

// Function to load images from the images folder
async function loadImages() {
  const gallery = document.getElementById('imageGallery');
  
  // Prevent duplicate loading
  if (gallery.children.length > 1) {
    console.log('Images already loaded, skipping...');
    return;
  }
  
  try {
    // Try to fetch from server first (for local development)
    let imageFiles;
    try {
      const response = await fetch('/list-images');
      imageFiles = await response.json();
    } catch (e) {
      // Fallback to static list for GitHub Pages - optimized for speed
      imageFiles = [
        "Another day after we broke up.jpeg",
        "Even if your heart didn't love me, your eyes did.jpeg", 
        "Food I crave more than biryani🥰.jpeg",
        "I can't even explain this, ma❤️.jpeg",
        "I love the way you breathe🫶🏻.jpeg",
        "In ur innocent face, I see the beauty of untouched light.jpeg",
        "I'd sacrifice my comfort, my pride—anything—for your smile.jpeg",
        "Kudhanpu Bomma....jpeg",
        "Lips like petals kissed by morning dew.jpeg",
        "Madness spills from me, landing on you😍.jpeg",
        "My little princess.jpeg",
        "Next morning after our fight🤗.jpeg",
        "Once upon a time, there were two souls.jpeg",
        "Thanks maa🥲.jpeg",
        "The Day you owned me🙈.jpeg",
        "The day you surprised me by coming.jpeg",
        "The mark you left🥰.jpeg",
        "This is my Fav pic.jpeg",
        "This is the movement that made me fall for you😍.jpeg",
        "Those innocent eyes hold a world of wonder.jpeg",
        "Together - not just our bodies🥰.jpeg",
        "You're the moon that lights my night🧖‍♀️.jpeg",
        "You've been my favorite person my whole life🤗.jpeg",
        "😘.jpeg"
      ];
    }
    
    // Clear loading message
    gallery.innerHTML = '';
    
    // Add each image to the gallery - optimized for speed
    imageFiles.forEach((image, index) => {
      const imgContainer = document.createElement('div');
      imgContainer.className = 'gallery-item';
      
      // Get image name without extension
      const imageName = image.split('.').slice(0, -1).join('.').replace(/\(\d+\)/g, '').trim();
      
      const img = document.createElement('img');
      // Use direct path - much faster than testing multiple encodings
      img.src = `images/${image}`;
      img.alt = `Memory ${index + 1}`;
      img.loading = 'lazy'; // Lazy load images for better performance
      
      // Add error handling for corrupt images
      img.onerror = function() {
        console.error(`Failed to load image: ${image}`);
        // Try alternative encoding if direct path fails
        img.src = `images/${encodeURIComponent(image)}`;
      };
      
      img.onload = function() {
        console.log(`Successfully loaded: ${image}`);
      };
      
      // Create overlay for image name with tooltip
      const overlay = document.createElement('div');
      overlay.className = 'image-overlay';
      
      // Create container for name and arrow
      const nameContainer = document.createElement('div');
      nameContainer.className = 'name-container';
      
      // Add the image name
      const nameSpan = document.createElement('span');
      nameSpan.className = 'image-name';
      nameSpan.textContent = imageName;
      
      // Add down arrow
      const arrow = document.createElement('span');
      arrow.className = 'down-arrow';
      arrow.innerHTML = ' ▼';
      
      // Add click handler to toggle expansion
      arrow.addEventListener('click', (e) => {
        e.stopPropagation();
        nameContainer.classList.toggle('expanded');
        // Toggle arrow direction
        if (nameContainer.classList.contains('expanded')) {
          arrow.textContent = ' ▲';
        } else {
          arrow.textContent = ' ▼';
        }
      });
      
      // Assemble the elements
      nameContainer.appendChild(nameSpan);
      nameContainer.appendChild(arrow);
      overlay.appendChild(nameContainer);
      
      imgContainer.appendChild(img);
      imgContainer.appendChild(overlay);
      gallery.appendChild(imgContainer);
    });
  } catch (error) {
    console.error('Error loading images:', error);
    gallery.innerHTML = '<div class="error">Error loading images. Please refresh the page.</div>';
  }
}

// Add click handler to the button
const button = document.querySelector('button');
button.addEventListener('click', startSurprise);

// Get DOM elements
const feelingsBtn = document.getElementById('feelingsBtn');
const feelingsMessage = document.getElementById('feelingsMessage');
const closeMessage = document.getElementById('closeMessage');
//ToTopBtn = document.querySelector('.back-to-top');

// Show message when clicking the feelings button
feelingsBtn.addEventListener('click', function() {
    feelingsMessage.classList.add('visible');
    // Smooth scroll to the message
    feelingsMessage.scrollIntoView({ behavior: 'smooth' });
});

// Close message when clicking the close button
closeMessage.addEventListener('click', function() {
    feelingsMessage.classList.remove('visible');
});

// Close message when clicking outside the message card
feelingsMessage.addEventListener('click', function(e) {
    if (e.target === feelingsMessage) {
        feelingsMessage.classList.remove('visible');
    }
});

// Close message when pressing Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        feelingsMessage.classList.remove('visible');
    }
});

// Back to top functionality
// backToTopBtn.addEventListener('click', function() {
//     window.scrollTo({
//         top: 0,
//         behavior: 'smooth'
//     });
// });
