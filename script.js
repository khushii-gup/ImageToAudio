let uploadCounter = 0;
const SERVER_URL = 'https://imagetoaudiouploader.onrender.com'; // Replace with your actual Render URL

async function handleUpload() {
  const photoInput = document.getElementById('photoUpload');
  const audioInput = document.getElementById('audioUpload');
  
  if (!photoInput.files[0]) {
    alert('Please select a photo file');
    return;
  }
  
  if (!audioInput.files[0]) {
    alert('Please select an audio file');
    return;
  }
  
  const photoFile = photoInput.files[0];
  const audioFile = audioInput.files[0];
  
  // Show loading state
  const uploadBtn = document.getElementById('uploadBtn');
  const originalText = uploadBtn.textContent;
  uploadBtn.textContent = 'Uploading...';
  uploadBtn.disabled = true;
  
  try {
    // Create FormData to send files to server
    const formData = new FormData();
    formData.append('photo', photoFile);
    formData.append('audio', audioFile);
    
    // Upload to server
    const response = await fetch(`${SERVER_URL}/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Create unique IDs for this upload
    uploadCounter++;
    const imageId = `uploadedImage${uploadCounter}`;
    const audioId = `uploadedAudio${uploadCounter}`;
    
    // Use server URLs instead of blob URLs
    const photoURL = `${SERVER_URL}${result.photoUrl}`;
    const audioURL = `${SERVER_URL}${result.audioUrl}`;
    
    // Create the HTML elements
    const container = document.createElement('div');
    container.className = 'uploaded-item';
    container.innerHTML = `
      <div class="item-info">
        <p><strong>Photo:</strong> ${photoFile.name}</p>
        <p><strong>Audio:</strong> ${audioFile.name}</p>
      </div>
      <img src="${photoURL}" id="${imageId}" alt="Uploaded image" class="uploaded-large-image">
      <audio id="${audioId}" src="${audioURL}" preload="auto"></audio>
      <button onclick="removeUploadedItem(this)" class="remove-btn">Remove</button>
    `;
    
    // Add to the uploaded content container
    document.getElementById('uploadedContent').appendChild(container);
    
    // Add click functionality to the new image
    addClickSound(imageId, audioId);
    
    // Clear the input fields
    photoInput.value = '';
    audioInput.value = '';
    
    console.log(`Added uploaded content with IDs: ${imageId}, ${audioId}`);
    console.log(`Photo URL: ${photoURL}`);
    console.log(`Audio URL: ${audioURL}`);
    
  } catch (error) {
    console.error('Upload error:', error);
    alert(`Upload failed: ${error.message}`);
  } finally {
    // Reset button state
    uploadBtn.textContent = originalText;
    uploadBtn.disabled = false;
  }
}

function removeUploadedItem(button) {
  const container = button.parentElement;
  
  // Simply remove the container since files are now stored on server
  // No need to clean up blob URLs anymore
  container.remove();
  
  console.log('Removed uploaded item from display');
}

function addClickSound(imageId, audioId) {
  const image = document.getElementById(imageId);
  const audio = document.getElementById(audioId);
  
  if (image && audio) {
    image.addEventListener('click', function() {
      // Reset the audio to the beginning in case it was already playing
      audio.currentTime = 0;
      
      // Play the audio
      audio.play().catch(function(error) {
        console.error('Error playing audio:', error);
        alert('Error playing audio. Please check if the audio file is valid.');
      });
      
      console.log(`Playing audio for image: ${imageId}`);
    });
    
    // Add visual feedback on hover
    image.addEventListener('mouseenter', function() {
      image.style.opacity = '0.8';
      image.style.transform = 'scale(1.05)';
    });
    
    image.addEventListener('mouseleave', function() {
      image.style.opacity = '1';
      image.style.transform = 'scale(1)';
    });
  }
}
