const GITHUB_TOKEN = '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';
const GITHUB_API_URL = 'https://api.github.com/repos/My-Lab-214/ediweb2/contents/index.html';
const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/My-Lab-214/ediweb2/main/index.html';

// Enable Design Mode
function enableEditMode() {
    document.designMode = 'on';
    alert('Edit mode enabled. You can now edit the page.');
}

// Save content to GitHub
async function saveContent() {
    const content = document.documentElement.outerHTML;

    // Convert content to Base64 (ensuring proper encoding)
    const encodedContent = btoa(unescape(encodeURIComponent(content)));

    try {
        // Step 1: Get the file SHA to update the existing content
        const fileResponse = await fetch(GITHUB_API_URL, {
            headers: { 
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });

        if (!fileResponse.ok) {
            throw new Error('Failed to fetch file data.');
        }

        const fileData = await fileResponse.json();
        const fileSHA = fileData.sha;  // Get the SHA to update the file

        // Step 2: Update the content in the repository
        const updateResponse = await fetch(GITHUB_API_URL, {
            method: 'PUT',
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
                Accept: 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                message: 'Updated index.html via web page',
                content: encodedContent,
                sha: fileSHA  // Required to overwrite the file
            })
        });

        if (!updateResponse.ok) {
            throw new Error('Failed to update content.');
        }

        alert('Content saved successfully!');
    } catch (error) {
        console.error('Error saving content:', error);
        alert('Failed to save content. Check the console for details.');
    }
}

// Reset content to original version from GitHub
async function resetContent() {
    try {
        const response = await fetch(GITHUB_RAW_URL);
        if (!response.ok) throw new Error('Failed to fetch original content.');

        const data = await response.text();
        document.open();
        document.write(data);
        document.close();
        alert('Page reset to original content.');
    } catch (error) {
        console.error('Error fetching content:', error);
        alert('Failed to reset content.');
    }
}
