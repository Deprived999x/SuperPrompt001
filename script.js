fetch('HBS_Hair_v001.JSON')
  .then(response => response.json())
  .then(hairData => {
    const texturesSelect = document.getElementById('textures');
    const densitySelect = document.getElementById('density');
    const volumesSelect = document.getElementById('volumes');
    const lengthsSelect = document.getElementById('lengths');
    const generatePromptButton = document.getElementById('generatePrompt');
    const promptOutputDiv = document.getElementById('promptOutput');
    const hairForm = document.getElementById('hairForm')

    // Function to populate a select element with options from the JSON data
    function populateSelect(selectElement, data, category) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const option = document.createElement('option');
          option.value = key;
          option.textContent = data[key].displayName;

          // Create a description element and append it to the label element
          const description = document.createElement('label');
          description.textContent = data[key].description;

          selectElement.appendChild(option);
        }
      }
    }
    function createLabelDescription () {
      //Add Description labels to
      const texturesLabel = document.createElement('label');
            texturesLabel.textContent = "Textures - Descriptions";
      texturesSelect.after(texturesLabel);

      const densityLabel = document.createElement('label');
            densityLabel.textContent = "Density - Descriptions";
      densitySelect.after(densityLabel);

      const volumesLabel = document.createElement('label');
            volumesLabel.textContent = "Volume - Descriptions";
      volumesSelect.after(volumesLabel);

      const lengthsLabel = document.createElement('label');
            lengthsLabel.textContent = "Length - Descriptions";
      lengthsSelect.after(lengthsLabel);

    }

    //Create a working function to create select description with the label information from

    // Populate the select elements
    populateSelect(texturesSelect, hairData.attributes.textures, "textures");
    populateSelect(densitySelect, hairData.attributes.density, "density");
    populateSelect(volumesSelect, hairData.attributes.volumes, "volumes");
    populateSelect(lengthsSelect, hairData.attributes.lengths, "lengths");

    createLabelDescription()

     // Event listener for the "Generate Prompt" button
    generatePromptButton.addEventListener('click', function() {
      // Get the selected values from the select elements
      const selectedTexture = texturesSelect.value;
      const selectedDensity = densitySelect.value;
      const selectedVolume = volumesSelect.value;
      const selectedLength = lengthsSelect.value;

      // Build the prompt string
      let prompt = "A person with ";
      if (selectedTexture) {
        prompt += `${selectedTexture} `;
      }
      if (selectedDensity) {
        prompt += `${selectedDensity} `;
      }
      if (selectedVolume) {
        prompt += `${selectedVolume} `;
      }
      if (selectedLength) {
        prompt += `${selectedLength} `;
      }

      prompt += "hair.";

      // Display the prompt in the promptOutput div
      promptOutputDiv.textContent = prompt;
    });

  })
  .catch(error => console.error('Error loading data:', error));