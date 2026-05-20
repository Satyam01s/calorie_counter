document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const resetBtn = document.getElementById('reset-btn');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultsSection = document.getElementById('results-section');
    const loader = analyzeBtn.querySelector('.loader');
    const btnText = analyzeBtn.querySelector('.btn-text');

    // Drag and Drop Handlers
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('active');
    });

    ['dragleave', 'dragend'].forEach(type => {
        dropZone.addEventListener(type, () => dropZone.classList.remove('active'));
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('active');
        const file = e.dataTransfer.files[0];
        handleFile(file);
    });

    fileInput.addEventListener('change', (e) => {
        handleFile(e.target.files[0]);
    });

    function handleFile(file) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                previewContainer.classList.remove('hidden');
                analyzeBtn.classList.remove('hidden');
                resultsSection.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        }
    }

    resetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.value = '';
        previewContainer.classList.add('hidden');
        analyzeBtn.classList.add('hidden');
        resultsSection.classList.add('hidden');
    });

    analyzeBtn.addEventListener('click', async () => {
        // UI State: Loading
        analyzeBtn.disabled = true;
        loader.classList.remove('hidden');
        btnText.textContent = 'Analyzing...';

        // Simulate API Call (Demo Mode)
        setTimeout(() => {
            showResults(generateDemoData());
            analyzeBtn.disabled = false;
            loader.classList.add('hidden');
            btnText.textContent = 'Analyze Nutrition';
        }, 2000);
    });

    function generateDemoData() {
        return {
            calories: 450,
            macros: {
                protein: 25,
                carbs: 45,
                fats: 18
            },
            ingredients: [
                { name: 'Grilled Chicken Breast', quantity: '150g', calories: 240 },
                { name: 'Quinoa', quantity: '100g', calories: 120 },
                { name: 'Mixed Vegetables', quantity: '1 cup', calories: 50 },
                { name: 'Olive Oil', quantity: '1 tsp', calories: 40 }
            ]
        };
    }

    function showResults(data) {
        resultsSection.classList.remove('hidden');
        
        // Count up animation for calories
        animateValue('calorie-count', 0, data.calories, 1000);

        // Animate macro bars
        setTimeout(() => {
            updateMacro('protein', data.macros.protein, 'g', 100); // 100g as max for visual
            updateMacro('carbs', data.macros.carbs, 'g', 100);
            updateMacro('fats', data.macros.fats, 'g', 100);
        }, 100);

        // Populate ingredients
        const list = document.getElementById('ingredient-items');
        list.innerHTML = '';
        data.ingredients.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item.name} (${item.quantity})</span>
                <span>${item.calories} kcal</span>
            `;
            list.appendChild(li);
        });

        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    function animateValue(id, start, end, duration) {
        const obj = document.getElementById(id);
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function updateMacro(id, value, unit, max) {
        const bar = document.getElementById(`${id}-bar`);
        const text = document.getElementById(`${id}-val`);
        const percentage = Math.min((value / max) * 100, 100);
        bar.style.width = `${percentage}%`;
        text.textContent = `${value}${unit}`;
    }
});

// commit5: final
