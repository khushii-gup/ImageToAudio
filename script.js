let uploadCounter = 0;

function handleUpload() {
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
  
  // Create unique IDs for this upload
  uploadCounter++;
  const imageId = `uploadedImage${uploadCounter}`;
  const audioId = `uploadedAudio${uploadCounter}`;
  
  // Create URL objects for the files
  const photoURL = URL.createObjectURL(photoFile);
  const audioURL = URL.createObjectURL(audioFile);
  
  // Create the HTML elements
  const container = document.createElement('div');
  container.className = 'uploaded-item';
  container.innerHTML = `
    <div class="item-info">
      <p><strong>Photo:</strong> ${photoFile.name}</p>
      <p><strong>Audio:</strong> ${audioFile.name}</p>
    </div>
    <img src="${photoURL}" id="${imageId}" alt="Uploaded image" style="width:200px;cursor:pointer;border:2px solid #ccc;margin:10px;">
    <audio id="${audioId}" src="${audioURL}" preload="auto"></audio>
    <button onclick="removeUploadedItem(this)" style="margin-left:10px;">Remove</button>
  `;
  
  // Add to the uploaded content container
  document.getElementById('uploadedContent').appendChild(container);
  
  // Add click functionality to the new image
  addClickSound(imageId, audioId);
  
  // Clear the input fields
  photoInput.value = '';
  audioInput.value = '';
  
  console.log(`Added uploaded content with IDs: ${imageId}, ${audioId}`);
}

function removeUploadedItem(button) {
  const container = button.parentElement;
  
  // Clean up object URLs to prevent memory leaks
  const img = container.querySelector('img');
  const audio = container.querySelector('audio');
  
  if (img && img.src.startsWith('blob:')) {
    URL.revokeObjectURL(img.src);
  }
  if (audio && audio.src.startsWith('blob:')) {
    URL.revokeObjectURL(audio.src);
  }
  
  // Remove the container
  container.remove();
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
