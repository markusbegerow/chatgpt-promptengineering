// Create button element
const button = document.createElement("button");
button.textContent = "Submit File";
button.style.backgroundColor = "green";
button.style.color = "white";
button.style.padding = "5px";
button.style.border = "none";
button.style.borderRadius = "5px";
button.style.margin = "5px";

// Create progress element
const progress = document.createElement("progress");
progress.style.width = "99%";
progress.style.height = "5px";
progress.style.backgroundColor = "grey";

// Create progress bar element
const progressBar = document.createElement("div");
progressBar.style.width = "0%";
progressBar.style.height = "100%";
progressBar.style.backgroundColor = "blue";

// Append progress bar to progress element
progress.appendChild(progressBar);

// Find the target element
const targetElement = document.querySelector(".flex.flex-col.w-full.py-2.flex-grow.md\\:py-3.md\\:pl-4");

// Insert the button and progress element before the target element
targetElement.parentNode.insertBefore(button, targetElement);
targetElement.parentNode.insertBefore(progress, targetElement);

// Add click event listener to the button
button.addEventListener("click", async () => {
  // Create file input element
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".txt, .js, .py, .html, .css, .json, .csv";
  
  // Handle file selection
  fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
      const text = await readFileAsText(file);
      const chunks = splitTextIntoChunks(text, 15000);
      const numChunks = chunks.length;
      
      for (let i = 0; i < numChunks; i++) {
        const chunk = chunks[i];
        await submitConversation(chunk, i + 1, file.name);
        progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;
      }
      
      progressBar.style.backgroundColor = "blue";
    }
  });
  
  // Trigger file selection
  fileInput.click();
});

// Function to read file as text using async
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = (event) => {
      reject(event.target.error);
    };
    reader.readAsText(file);
  });
}

// Async function to submit conversation
async function submitConversation(text, part, filename) {
  const textarea = document.querySelector("textarea[tabindex='0']");
  const enterKeyEvent = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    keyCode: 13,
  });
  textarea.value = `Part ${part} of ${filename}:\n\n${text}`;
  textarea.dispatchEvent(enterKeyEvent);
  
  // Check if ChatGPT is ready
  let chatgptReady = false;
  while (!chatgptReady) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    chatgptReady = !document.querySelector(".text-2xl > span:not(.invisible)");
  }
}

// Split text into chunks
function splitTextIntoChunks(text, chunkSize) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}


const addUpdateVscodeBtn = (codeContainer) => {
  // Check if the update button already exists in the container
  if (codeContainer.querySelector("#update-vscode-btn")) {
    return;
  }

  const updateVscodeBtn = document.createElement("button");
  updateVscodeBtn.textContent = "Create File";
  updateVscodeBtn.id = "update-vscode-btn";
  updateVscodeBtn.style.padding = "2px 10px";
  updateVscodeBtn.style.border = "none";
  updateVscodeBtn.style.borderRadius = "20px";
  updateVscodeBtn.style.color = "#fff";
  updateVscodeBtn.style.backgroundColor = "#28a745";
  updateVscodeBtn.style.fontWeight = "300";
  updateVscodeBtn.addEventListener("click", async () => {
    const codeBtn = codeContainer.querySelector(".flex.ml-auto.gap-2");
    if (codeBtn) {
      codeBtn.click();

      const langSpan = codeContainer.querySelector(
        ".flex.items-center.relative.text-gray-200.bg-gray-800.px-4.py-2.text-xs.font-sans.justify-between.rounded-t-md > span"
      );
      const lang = langSpan ? langSpan.textContent.trim() : "";
      let extension = ".txt";
      switch (lang.toLowerCase()) {
		case "SQL":
          extension = ".sql";
          break;
        case "javascript":
          extension = ".js";
          break;
        case "html":
          extension = ".html";
          break;
        case "css":
          extension = ".css";
          break;
        case "python":
          extension = ".py";
          break;
        case "Java":
          extension = ".java";
          break;
        case "C#":
          extension = ".cs";
          break;
        case "C++":
          extension = ".cpp";
          break;
        case "Go":
          extension = ".go";
          break;

        // Add more cases for other languages
      }
      const filename = `New${extension}`;
      const fileContent = await navigator.clipboard.readText();

      const blob = new Blob([fileContent], { type: "text/plain" });
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = filename;
      downloadLink.click();
    } else {
      console.log("Copy code button not found.");
    }
  });

  updateVscodeBtn.style.marginRight = "200px";

  codeContainer.insertAdjacentElement("afterbegin", updateVscodeBtn);
};

// Find and add update button to existing code containers
document
  .querySelectorAll(
    ".flex.items-center.relative.text-gray-200.bg-gray-800.px-4.py-2.text-xs.font-sans.justify-between.rounded-t-md"
  )
  .forEach(addUpdateVscodeBtn);

// Use a MutationObserver to listen for new code containers added to the page
const observer = new MutationObserver((mutationsList) => {
  mutationsList.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.matches(
          ".flex.items-center.relative.text-gray-200.bg-gray-800.px-4.py-2.text-xs.font-sans.justify-between.rounded-t-md"
        )
      ) {
        addUpdateVscodeBtn(node);
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });
// Check for button addition every 3 seconds
setInterval(() => {
  document
    .querySelectorAll(
      ".flex.items-center.relative.text-gray-200.bg-gray-800.px-4.py-2.text-xs.font-sans.justify-between.rounded-t-md"
    )
    .forEach(addUpdateVscodeBtn);
}, 3000);
