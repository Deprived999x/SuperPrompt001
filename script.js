document.addEventListener('DOMContentLoaded', function() {
  fetch('HBS_Hair_v002.JSON')
    .then(response => response.json())
    .then(hairData => {
      const hairForm = document.getElementById('hairForm');
      const generatePromptButton = document.getElementById('generatePrompt');
      const promptOutputDiv = document.getElementById('promptOutput');
      
      // Get select elements for hair attributes
      const texturesSelect = document.getElementById('textures');
      const densitySelect = document.getElementById('density');
      const volumesSelect = document.getElementById('volumes');
      const lengthsSelect = document.getElementById('lengths');
      
      // Create description elements
      const texturesDesc = document.getElementById('texturesDescription');
      const densityDesc = document.getElementById('densityDescription');
      const volumesDesc = document.getElementById('volumesDescription');
      const lengthsDesc = document.getElementById('lengthsDescription');
      
      // Function to populate a select element with options from the JSON data
      function populateSelect(selectElement, data) {
        for (const key in data) {
          if (data.hasOwnProperty(key) && key !== 'description') {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = data[key].displayName;
            selectElement.appendChild(option);
          }
        }
      }
      
      // Function to create color selection elements
      function createColorSelectors() {
        const colorsFieldset = document.createElement('fieldset');
        colorsFieldset.innerHTML = '<legend>Hair Color</legend>';
        
        // Add color description from JSON
        const colorCategoryDesc = document.createElement('p');
        colorCategoryDesc.textContent = hairData.attributes.colors.description;
        colorCategoryDesc.className = 'category-description';
        colorsFieldset.appendChild(colorCategoryDesc);
        
        // Create main color category select
        const colorCategorySelect = document.createElement('select');
        colorCategorySelect.id = 'colorCategory';
        colorCategorySelect.name = 'colorCategory';
        
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select Color Category';
        colorCategorySelect.appendChild(defaultOption);
        
        // Add color categories
        for (const category in hairData.attributes.colors) {
          const option = document.createElement('option');
          option.value = category;
          option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
          colorCategorySelect.appendChild(option);
        }
        
        // Create color shade select (will be populated based on category)
        const colorShadeSelect = document.createElement('select');
        colorShadeSelect.id = 'colorShade';
        colorShadeSelect.name = 'colorShade';
        colorShadeSelect.disabled = true;
        
        const defaultShadeOption = document.createElement('option');
        defaultShadeOption.value = '';
        defaultShadeOption.textContent = 'Select Color Shade';
        colorShadeSelect.appendChild(defaultShadeOption);
        
        // Add color description
        const colorDescription = document.createElement('p');
        colorDescription.id = 'colorDescription';
        
        // Add event listener to category select
        colorCategorySelect.addEventListener('change', function() {
          // Clear and enable shade select
          colorShadeSelect.innerHTML = '';
          const defaultOpt = document.createElement('option');
          defaultOpt.value = '';
          defaultOpt.textContent = 'Select Color Shade';
          colorShadeSelect.appendChild(defaultOpt);
          
          if (this.value) {
            colorShadeSelect.disabled = false;
            const shades = hairData.attributes.colors[this.value];
            
            for (const shade in shades) {
              const option = document.createElement('option');
              option.value = shade;
              option.textContent = shades[shade].displayName;
              colorShadeSelect.appendChild(option);
            }
          } else {
            colorShadeSelect.disabled = true;
            colorDescription.textContent = '';
          }
        });
        
        // Add event listener to shade select
        colorShadeSelect.addEventListener('change', function() {
          const category = colorCategorySelect.value;
          const shade = this.value;
          
          if (category && shade) {
            const description = hairData.attributes.colors[category][shade].description;
            colorDescription.textContent = `Description: ${description}`;
          } else {
            colorDescription.textContent = '';
          }
        });
        
        // Add elements to fieldset
        const categoryLabel = document.createElement('label');
        categoryLabel.setAttribute('for', 'colorCategory');
        categoryLabel.textContent = 'Color Category:';
        
        const shadeLabel = document.createElement('label');
        shadeLabel.setAttribute('for', 'colorShade');
        shadeLabel.textContent = 'Color Shade:';
        
        colorsFieldset.appendChild(categoryLabel);
        colorsFieldset.appendChild(colorCategorySelect);
        colorsFieldset.appendChild(document.createElement('br'));
        colorsFieldset.appendChild(shadeLabel);
        colorsFieldset.appendChild(colorShadeSelect);
        colorsFieldset.appendChild(document.createElement('br'));
        colorsFieldset.appendChild(colorDescription);
        
        // Add the fieldset after the attributes fieldset
        const attributesFieldset = document.querySelector('fieldset');
        attributesFieldset.after(colorsFieldset);
      }
      
      // Function to create arrangement selectors
      function createArrangementSelectors() {
        const arrangementsFieldset = document.querySelector('fieldset:nth-of-type(2)');
        
        // Add arrangements description
        const arrangementsDesc = document.createElement('p');
        arrangementsDesc.textContent = hairData.arrangements.description;
        arrangementsDesc.className = 'category-description';
        arrangementsFieldset.appendChild(arrangementsDesc);
        
        // Create parting style selector
        const partingDiv = document.createElement('div');
        partingDiv.className = 'form-group';
        
        const partingLabel = document.createElement('label');
        partingLabel.setAttribute('for', 'partingStyle');
        partingLabel.textContent = 'Parting Style:';
        
        const partingSelect = document.createElement('select');
        partingSelect.id = 'partingStyle';
        partingSelect.name = 'partingStyle';
        
        const defaultPartingOption = document.createElement('option');
        defaultPartingOption.value = '';
        defaultPartingOption.textContent = 'Select Parting Style';
        partingSelect.appendChild(defaultPartingOption);
        
        populateSelect(partingSelect, hairData.arrangements.partingStyles);
        
        const partingDesc = document.createElement('p');
        partingDesc.id = 'partingDescription';
        
        partingSelect.addEventListener('change', function() {
          if (this.value) {
            const description = hairData.arrangements.partingStyles[this.value].description;
            partingDesc.textContent = `Description: ${description}`;
          } else {
            partingDesc.textContent = '';
          }
        });
        
        partingDiv.appendChild(partingLabel);
        partingDiv.appendChild(partingSelect);
        partingDiv.appendChild(partingDesc);
        
        // Create bangs selector
        const bangsDiv = document.createElement('div');
        bangsDiv.className = 'form-group';
        
        const bangsLabel = document.createElement('label');
        bangsLabel.setAttribute('for', 'bangsStyle');
        bangsLabel.textContent = 'Bangs Style:';
        
        const bangsSelect = document.createElement('select');
        bangsSelect.id = 'bangsStyle';
        bangsSelect.name = 'bangsStyle';
        
        const defaultBangsOption = document.createElement('option');
        defaultBangsOption.value = '';
        defaultBangsOption.textContent = 'Select Bangs Style';
        bangsSelect.appendChild(defaultBangsOption);
        
        populateSelect(bangsSelect, hairData.arrangements.bangs);
        
        const bangsDesc = document.createElement('p');
        bangsDesc.id = 'bangsDescription';
        
        bangsSelect.addEventListener('change', function() {
          if (this.value) {
            const description = hairData.arrangements.bangs[this.value].description;
            bangsDesc.textContent = `Description: ${description}`;
          } else {
            bangsDesc.textContent = '';
          }
        });
        
        bangsDiv.appendChild(bangsLabel);
        bangsDiv.appendChild(bangsSelect);
        bangsDiv.appendChild(bangsDesc);
        
        // Create hairstyle selector
        const hairstyleDiv = document.createElement('div');
        hairstyleDiv.className = 'form-group';
        
        const hairstyleLabel = document.createElement('label');
        hairstyleLabel.setAttribute('for', 'hairstyle');
        hairstyleLabel.textContent = 'Hairstyle:';
        
        const hairstyleSelect = document.createElement('select');
        hairstyleSelect.id = 'hairstyle';
        hairstyleSelect.name = 'hairstyle';
        
        const defaultHairstyleOption = document.createElement('option');
        defaultHairstyleOption.value = '';
        defaultHairstyleOption.textContent = 'Select Hairstyle';
        hairstyleSelect.appendChild(defaultHairstyleOption);
        
        populateSelect(hairstyleSelect, hairData.arrangements.simpleTiedHairstyles);
        
        const hairstyleDesc = document.createElement('p');
        hairstyleDesc.id = 'hairstyleDescription';
        
        hairstyleSelect.addEventListener('change', function() {
          if (this.value) {
            const description = hairData.arrangements.simpleTiedHairstyles[this.value].description;
            hairstyleDesc.textContent = `Description: ${description}`;
          } else {
            hairstyleDesc.textContent = '';
          }
        });
        
        hairstyleDiv.appendChild(hairstyleLabel);
        hairstyleDiv.appendChild(hairstyleSelect);
        hairstyleDiv.appendChild(hairstyleDesc);
        
        // Add all selectors to the arrangements fieldset
        arrangementsFieldset.appendChild(partingDiv);
        arrangementsFieldset.appendChild(document.createElement('br'));
        arrangementsFieldset.appendChild(bangsDiv);
        arrangementsFieldset.appendChild(document.createElement('br'));
        arrangementsFieldset.appendChild(hairstyleDiv);
      }
      
      // Add description update event listeners for base attributes
      function setupAttributeDescriptions() {
        texturesSelect.addEventListener('change', function() {
          if (this.value) {
            texturesDesc.textContent = `Description: ${hairData.attributes.textures[this.value].description}`;
          } else {
            texturesDesc.textContent = '';
          }
        });
        
        densitySelect.addEventListener('change', function() {
          if (this.value) {
            densityDesc.textContent = `Description: ${hairData.attributes.density[this.value].description}`;
          } else {
            densityDesc.textContent = '';
          }
        });
        
        volumesSelect.addEventListener('change', function() {
          if (this.value) {
            volumesDesc.textContent = `Description: ${hairData.attributes.volumes[this.value].description}`;
          } else {
            volumesDesc.textContent = '';
          }
        });
        
        lengthsSelect.addEventListener('change', function() {
          if (this.value) {
            lengthsDesc.textContent = `Description: ${hairData.attributes.lengths[this.value].description}`;
          } else {
            lengthsDesc.textContent = '';
          }
        });
      }
      
      // Add category descriptions
      function addCategoryDescriptions() {
        const attributesFieldset = document.querySelector('fieldset:nth-of-type(1)');
        
        // Add texture description
        const textureDesc = document.createElement('p');
        textureDesc.textContent = hairData.attributes.textures.description;
        textureDesc.className = 'category-description';
        attributesFieldset.insertBefore(textureDesc, attributesFieldset.firstChild);
        
        // Add density description
        const densityDesc = document.createElement('p');
        densityDesc.textContent = hairData.attributes.density.description;
        densityDesc.style.fontStyle = 'italic';
        densityDesc.style.marginBottom = '15px';
        const densityGroup = document.querySelector('.form-group:nth-of-type(2)');
        densityGroup.insertBefore(densityDesc, densityGroup.firstChild);
        
        // Add volume description
        const volumeDesc = document.createElement('p');
        volumeDesc.textContent = hairData.attributes.volumes.description;
        volumeDesc.style.fontStyle = 'italic';
        volumeDesc.style.marginBottom = '15px';
        const volumeGroup = document.querySelector('.form-group:nth-of-type(3)');
        volumeGroup.insertBefore(volumeDesc, volumeGroup.firstChild);
        
        // Add length description
        const lengthDesc = document.createElement('p');
        lengthDesc.textContent = hairData.attributes.lengths.description;
        lengthDesc.style.fontStyle = 'italic';
        lengthDesc.style.marginBottom = '15px';
        const lengthGroup = document.querySelector('.form-group:nth-of-type(4)');
        lengthGroup.insertBefore(lengthDesc, lengthGroup.firstChild);
      }
        
      // Populate the base select elements
      populateSelect(texturesSelect, hairData.attributes.textures);
      populateSelect(densitySelect, hairData.attributes.density);
      populateSelect(volumesSelect, hairData.attributes.volumes);
      populateSelect(lengthsSelect, hairData.attributes.lengths);
      
      // Setup descriptions and create additional UI elements
      setupAttributeDescriptions();
      addCategoryDescriptions();
      createColorSelectors();
      createArrangementSelectors();
      setupCompatibilityListeners();
      
      // Apply compatibility rules based on selections
      function applyCompatibilityRules() {
        // Clear any existing messages
        const existingMessages = document.querySelectorAll('.compatibility-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Reset all disabled options
        const allSelects = document.querySelectorAll('select');
        allSelects.forEach(select => {
          Array.from(select.options).forEach(option => {
            option.disabled = false;
            option.style.color = '';
          });
        });
        
        // Get current selections
        const currentSelections = {
          textures: texturesSelect.value,
          density: densitySelect.value,
          volumes: volumesSelect.value,
          lengths: lengthsSelect.value,
          colorCategory: document.getElementById('colorCategory').value,
          colorShade: document.getElementById('colorShade').value,
          partingStyle: document.getElementById('partingStyle').value,
          bangsStyle: document.getElementById('bangsStyle').value,
          hairstyle: document.getElementById('hairstyle').value
        };
        
        // Check length-based rules
        if (currentSelections.lengths) {
          const lengthRules = hairData.compatibilityRules.lengthBasedRules.filter(
            rule => rule.condition.attribute === 'lengths' && rule.condition.value === currentSelections.lengths
          );
          
          lengthRules.forEach(rule => {
            rule.incompatibleWith.forEach(incompatibility => {
              const [category, subcategory] = incompatibility.category.split('.');
              let selectElement;
              
              // Determine which select element to update
              if (category === 'arrangements') {
                if (subcategory === 'simpleTiedHairstyles') {
                  selectElement = document.getElementById('hairstyle');
                } else if (subcategory === 'bangs') {
                  selectElement = document.getElementById('bangsStyle');
                } else if (subcategory === 'partingStyles') {
                  selectElement = document.getElementById('partingStyle');
                }
              } else {
                // Handle attributes
                selectElement = document.getElementById(subcategory);
              }
              
              if (selectElement) {
                incompatibility.values.forEach(value => {
                  const option = Array.from(selectElement.options).find(opt => opt.value === value);
                  if (option) {
                    if (incompatibility.severity === 'error') {
                      option.disabled = true;
                      option.style.color = '#999';
                    } else if (incompatibility.severity === 'warning') {
                      option.style.color = 'orange';
                    }
                  }
                });
                
                // Add compatibility message if this select has a value that is incompatible
                if (selectElement.value && incompatibility.values.includes(selectElement.value)) {
                  const messageDiv = document.createElement('div');
                  messageDiv.className = 'compatibility-message';
                  messageDiv.style.color = incompatibility.severity === 'error' ? 'red' : 'orange';
                  messageDiv.style.fontStyle = 'italic';
                  messageDiv.style.marginTop = '5px';
                  messageDiv.textContent = incompatibility.message;
                  
                  selectElement.parentNode.appendChild(messageDiv);
                  
                  if (incompatibility.severity === 'error') {
                    selectElement.value = '';
                    // Trigger change event to update descriptions
                    const event = new Event('change');
                    selectElement.dispatchEvent(event);
                  }
                }
              }
            });
          });
        }
        
        // Check texture-based rules
        if (currentSelections.textures) {
          const textureRules = hairData.compatibilityRules.textureBasedRules.filter(
            rule => rule.condition.attribute === 'textures' && rule.condition.value === currentSelections.textures
          );
          
          textureRules.forEach(rule => {
            rule.incompatibleWith.forEach(incompatibility => {
              const selectElement = document.getElementById(incompatibility.category);
              
              if (selectElement) {
                incompatibility.values.forEach(value => {
                  const option = Array.from(selectElement.options).find(opt => opt.value === value);
                  if (option) {
                    if (incompatibility.severity === 'error') {
                      option.disabled = true;
                      option.style.color = '#999';
                    } else if (incompatibility.severity === 'warning') {
                      option.style.color = 'orange';
                    }
                  }
                });
                
                // Add compatibility message if this select has a value that is incompatible
                if (selectElement.value && incompatibility.values.includes(selectElement.value)) {
                  const messageDiv = document.createElement('div');
                  messageDiv.className = 'compatibility-message';
                  messageDiv.style.color = incompatibility.severity === 'error' ? 'red' : 'orange';
                  messageDiv.style.fontStyle = 'italic';
                  messageDiv.style.marginTop = '5px';
                  messageDiv.textContent = incompatibility.message;
                  
                  selectElement.parentNode.appendChild(messageDiv);
                  
                  if (incompatibility.severity === 'error') {
                    selectElement.value = '';
                    // Trigger change event to update descriptions
                    const event = new Event('change');
                    selectElement.dispatchEvent(event);
                  }
                }
              }
            });
          });
        }
        
        // Check style-based rules
        if (currentSelections.partingStyle || currentSelections.bangsStyle || currentSelections.hairstyle) {
          // Check partingStyle rules
          if (currentSelections.partingStyle) {
            const partingRules = hairData.compatibilityRules.styleBasedRules.filter(
              rule => rule.condition.category === 'arrangements.partingStyles' && 
                     rule.condition.value === currentSelections.partingStyle
            );
            
            partingRules.forEach(rule => processStyleRule(rule, currentSelections));
          }
          
          // Check bangsStyle rules
          if (currentSelections.bangsStyle) {
            const bangsRules = hairData.compatibilityRules.styleBasedRules.filter(
              rule => rule.condition.category === 'arrangements.bangs' && 
                     rule.condition.value === currentSelections.bangsStyle
            );
            
            bangsRules.forEach(rule => processStyleRule(rule, currentSelections));
          }
          
          // Check hairstyle rules
          if (currentSelections.hairstyle) {
            const hairstyleRules = hairData.compatibilityRules.styleBasedRules.filter(
              rule => rule.condition.category === 'arrangements.simpleTiedHairstyles' && 
                     rule.condition.value === currentSelections.hairstyle
            );
            
            hairstyleRules.forEach(rule => processStyleRule(rule, currentSelections));
          }
        }
      }
      
      function processStyleRule(rule, currentSelections) {
        rule.incompatibleWith.forEach(incompatibility => {
          const [category, subcategory] = incompatibility.category.split('.');
          let selectElement;
          
          // Determine which select element to update
          if (category === 'arrangements') {
            if (subcategory === 'simpleTiedHairstyles') {
              selectElement = document.getElementById('hairstyle');
            } else if (subcategory === 'bangs') {
              selectElement = document.getElementById('bangsStyle');
            } else if (subcategory === 'partingStyles') {
              selectElement = document.getElementById('partingStyle');
            }
          } else {
            // Handle attributes
            selectElement = document.getElementById(subcategory);
          }
          
          if (selectElement) {
            incompatibility.values.forEach(value => {
              const option = Array.from(selectElement.options).find(opt => opt.value === value);
              if (option) {
                if (incompatibility.severity === 'error') {
                  option.disabled = true;
                  option.style.color = '#999';
                } else if (incompatibility.severity === 'warning') {
                  option.style.color = 'orange';
                }
              }
            });
            
            // Add compatibility message if this select has a value that is incompatible
            if (selectElement.value && incompatibility.values.includes(selectElement.value)) {
              const messageDiv = document.createElement('div');
              messageDiv.className = 'compatibility-message';
              messageDiv.style.color = incompatibility.severity === 'error' ? 'red' : 'orange';
              messageDiv.style.fontStyle = 'italic';
              messageDiv.style.marginTop = '5px';
              messageDiv.textContent = incompatibility.message;
              
              selectElement.parentNode.appendChild(messageDiv);
              
              if (incompatibility.severity === 'error') {
                selectElement.value = '';
                // Trigger change event to update descriptions
                const event = new Event('change');
                selectElement.dispatchEvent(event);
              }
            }
          }
        });
      }
      
      // Add change event listeners to all selects to apply compatibility rules
      function setupCompatibilityListeners() {
        const allSelects = document.querySelectorAll('select');
        allSelects.forEach(select => {
          select.addEventListener('change', applyCompatibilityRules);
        });
      }
      
      // Event listener for the "Generate Prompt" button
      generatePromptButton.addEventListener('click', function() {
        // Get the selected values from all selects
        const selectedTexture = texturesSelect.value;
        const selectedDensity = densitySelect.value;
        const selectedVolume = volumesSelect.value;
        const selectedLength = lengthsSelect.value;
        const selectedColorCategory = document.getElementById('colorCategory').value;
        const selectedColorShade = document.getElementById('colorShade').value;
        const selectedPartingStyle = document.getElementById('partingStyle').value;
        const selectedBangsStyle = document.getElementById('bangsStyle').value;
        const selectedHairstyle = document.getElementById('hairstyle').value;
        
        // Build a more descriptive prompt string
        let prompt = "A person with ";
        let attributes = [];
        
        // Add hair attributes
        if (selectedTexture) {
          const textureName = hairData.attributes.textures[selectedTexture].displayName.toLowerCase();
          attributes.push(textureName);
        }
        
        if (selectedDensity) {
          const densityName = hairData.attributes.density[selectedDensity].displayName.toLowerCase();
          attributes.push(densityName);
        }
        
        if (selectedVolume) {
          const volumeName = hairData.attributes.volumes[selectedVolume].displayName.toLowerCase();
          attributes.push(volumeName);
        }
        
        if (selectedLength) {
          const lengthName = hairData.attributes.lengths[selectedLength].displayName.toLowerCase();
          attributes.push(lengthName);
        }
        
        // Add color information
        if (selectedColorCategory && selectedColorShade) {
          const colorName = hairData.attributes.colors[selectedColorCategory][selectedColorShade].displayName.toLowerCase();
          attributes.push(colorName);
        }
        
        // Join attributes with commas
        if (attributes.length > 0) {
          prompt += attributes.join(", ") + " hair";
        } else {
          prompt += "hair";
        }
        
        // Add arrangements
        let arrangements = [];
        
        if (selectedPartingStyle) {
          const partingName = hairData.arrangements.partingStyles[selectedPartingStyle].displayName;
          arrangements.push(`with a ${partingName.toLowerCase()}`);
        }
        
        if (selectedBangsStyle) {
          const bangsName = hairData.arrangements.bangs[selectedBangsStyle].displayName;
          arrangements.push(`featuring ${bangsName.toLowerCase()}`);
        }
        
        if (selectedHairstyle) {
          const hairstyleName = hairData.arrangements.simpleTiedHairstyles[selectedHairstyle].displayName;
          arrangements.push(`styled in a ${hairstyleName.toLowerCase()}`);
        }
        
        // Add arrangements to prompt
        if (arrangements.length > 0) {
          prompt += " " + arrangements.join(", ");
        }
        
        prompt += ".";
        
        // Display the prompt in the promptOutput div
        promptOutputDiv.textContent = prompt;
      });
    })
    .catch(error => console.error('Error loading data:', error));
});
