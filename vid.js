// Get elements
const openVideoBtn = document.getElementById("openVideoBtn");
const videoModal = document.getElementById("videoModal");
const closeModal = document.getElementById("closeModal");
const videoFrame = document.getElementById("videoFrame");

// When the user clicks the button, open the modal and load the video
openVideoBtn.onclick = function() {
  videoModal.style.display = "block";
  videoFrame.src = "https://www.youtube.com/watch?v=tL6SQ2PGXV4"; // You can replace this with your video URL
}

// When the user clicks on <span> (x), close the modal
closeModal.onclick = function() {
  videoModal.style.display = "none";
  videoFrame.src = ""; // Stop the video when closing
}

// Close modal when user clicks outside of the modal
window.onclick = function(event) {
  if (event.target == videoModal) {
    videoModal.style.display = "none";
    videoFrame.src = ""; // Stop the video when clicking outside
  }
}
