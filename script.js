const contentDiv = document.getElementById('content');
const editButton = document.getElementById('editButton');
const saveButton = document.getElementById('saveButton');
const resetButton = document.getElementById('resetButton');

// GitHub Configuration
const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/My-Lab-214/ediweb2/main/content.html';
const GITHUB_API_URL = 'https://api.github.com/repos/My-Lab-214/ediweb2/content.html';
const GITHUB_TOKEN = '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';  // Store securely in the backend!

// Load original content from GitHub on page load
async function loadOriginalContent() {
    try {
        const response = await fetch(GITHUB_RAW_URL);
        if (!response.ok) throw new Error('Failed to fetch content.');
        const text = await response.text();
        contentDiv.innerHTML = text;
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Edit button to enable content editing
editButton.addEventListener('click', () => {
    contentDiv.contentEditable = true;
    editButton.style.display = 'none';
    saveButton.style.display = 'inline-block';
});

// Save button to push content to GitHub
saveButton.addEventListener('click', async () => {
    const newContent = contentDiv.innerHTML;
    const encodedContent = btoa(unescape(encodeURIComponent(newContent)));

    try {
        // Get the current file SHA to update it
        const getResponse = await fetch(GITHUB_API_URL, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });
        const fileData = await getResponse.json();

        const updateResponse = await fetch(GITHUB_API_URL, {
            method: 'PUT',
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Updated content via web app',
                content: encodedContent,
                sha: fileData.sha
            })
        });

        if (!updateResponse.ok) throw new Error('Failed to update content.');
        alert('Changes saved successfully!');
        saveButton.style.display = 'none';
        editButton.style.display = 'inline-block';
        contentDiv.contentEditable = false;
    } catch (error) {
        console.error('Error saving content:', error);
        alert('Failed to save content.');
    }
});

// Reset button to fetch the original version
resetButton.addEventListener('click', async () => {
    localStorage.removeItem('content');
    await loadOriginalContent();
    alert('Page has been reset to original content.');
});

// Load content on page load
window.onload = loadOriginalContent;
