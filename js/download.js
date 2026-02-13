// download.js - Download functionality
let downloadInterval;
let isDownloading = false;
let currentProgress = 0;

function startDownload(platform) {
    if (isDownloading) {
        alert('A download is already in progress!');
        return;
    }
    
    const platformData = {
        windows: { name: 'Windows', size: '420 MB' },
        // mac: { name: 'macOS', size: '9.1 GB' },
        // linux: { name: 'Linux', size: '8.2 GB' }
    };
    
    const data = platformData[platform] || platformData.windows;
    
    // Update modal info
    document.getElementById('platformName').textContent = data.name;
    document.getElementById('fileSize').textContent = data.size;
    
    // Show modal
    document.getElementById('downloadModal').style.display = 'block';
    
    // Start download simulation
    simulateDownload();
}

function simulateDownload() {
    isDownloading = true;
    currentProgress = 0;
    
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const speedElement = document.getElementById('downloadSpeed');
    const timeElement = document.getElementById('timeLeft');
    
    // Get file size in MB
    const sizeText = document.getElementById('fileSize').textContent;
    const sizeMatch = sizeText.match(/(\d+\.?\d*)\s*GB/);
    const totalSize = sizeMatch ? parseFloat(sizeMatch[1]) * 1024 : 8601.6; // Default 8.4 GB in MB
    
    let downloaded = 0;
    let speed = 0;
    let timeLeft = 0;
    
    downloadInterval = setInterval(() => {
        // Simulate variable download speed
        speed = 2 + Math.random() * 10; // MB/s
        
        const increment = (speed * 0.1);
        downloaded = Math.min(downloaded + increment, totalSize);
        currentProgress = (downloaded / totalSize) * 100;
        
        // Update progress bar
        if (progressFill) {
            progressFill.style.width = `${currentProgress}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${Math.round(currentProgress)}%`;
        }
        
        if (speedElement) {
            speedElement.textContent = `${speed.toFixed(1)} MB/s`;
        }
        
        if (timeElement) {
            timeLeft = Math.round((totalSize - downloaded) / speed);
            timeElement.textContent = `${timeLeft}s`;
        }
        
        // Check if download is complete
        if (currentProgress >= 100) {
            completeDownload();
        }
    }, 200);
}

function pauseDownload() {
    if (downloadInterval) {
        clearInterval(downloadInterval);
        isDownloading = false;
        
        // Change button text
        const pauseBtn = document.querySelector('.btn-pause');
        if (pauseBtn) {
            pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
            pauseBtn.onclick = resumeDownload;
        }
    }
}

function resumeDownload() {
    if (!isDownloading) {
        simulateDownload();
        
        // Change button text back
        const pauseBtn = document.querySelector('.btn-pause');
        if (pauseBtn) {
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            pauseBtn.onclick = pauseDownload;
        }
    }
}

function cancelDownload() {
    if (confirm('Are you sure you want to cancel the download?')) {
        if (downloadInterval) {
            clearInterval(downloadInterval);
            downloadInterval = null;
        }
        
        isDownloading = false;
        currentProgress = 0;
        
        // Close modal
        closeDownloadModal();
        
        // Show cancelled message
        showNotification('Download cancelled', 'warning');
    }
}

function completeDownload() {
    if (downloadInterval) {
        clearInterval(downloadInterval);
        downloadInterval = null;
    }
    
    isDownloading = false;
    
    // Update UI to show completion
    const progressText = document.getElementById('progressText');
    if (progressText) {
        progressText.textContent = 'Complete!';
    }
    
    // Change button text
    const pauseBtn = document.querySelector('.btn-pause');
    if (pauseBtn) {
        pauseBtn.style.display = 'none';
    }
    
    // Show success message
    setTimeout(() => {
        closeDownloadModal();
        showNotification('Download complete! Check your downloads folder.', 'success');
        
        // Reset download button
        if (pauseBtn) {
            pauseBtn.style.display = 'block';
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            pauseBtn.onclick = pauseDownload;
        }
    }, 1500);
}

function closeDownloadModal() {
    document.getElementById('downloadModal').style.display = 'none';
    
    // Reset progress
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill) progressFill.style.width = '0%';
    if (progressText) progressText.textContent = '0%';
    
    // Reset download state
    if (downloadInterval) {
        clearInterval(downloadInterval);
        downloadInterval = null;
    }
    
    isDownloading = false;
    currentProgress = 0;
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide and remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--deep-space);
            border: 1px solid var(--neon-blue);
            border-radius: 8px;
            padding: 15px 20px;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .notification.show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .notification-success {
            border-color: var(--hologram-green);
            background: rgba(0, 255, 157, 0.1);
        }
        
        .notification-warning {
            border-color: var(--accent-yellow);
            background: rgba(252, 163, 17, 0.1);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-content i {
            font-size: 1.2rem;
        }
        
        .notification-success .notification-content i {
            color: var(--hologram-green);
        }
        
        .notification-warning .notification-content i {
            color: var(--accent-yellow);
        }
        
        .notification-content span {
            color: var(--text-light);
        }
    `;
    
    // Only add style if not already added
    if (!document.querySelector('#notification-styles')) {
        style.id = 'notification-styles';
        document.head.appendChild(style);
    }
}

function StartingDownloadNotifcation()
{
    showNotification('Download Started !', 'success');
}

// Add click event to download buttons

// document.addEventListener('DOMContentLoaded', function() {
//     const downloadButtons = document.querySelectorAll('.download-btn');
//     downloadButtons.forEach(button => {
//         button.addEventListener('click', function(e) {
//             e.stopPropagation();
//             const platformOption = this.closest('.platform-option');
//             if (platformOption) {
//                 const platform = platformOption.getAttribute('data-platform');
//                 startDownload(platform);
//             }
//         });
//     });
    
//     // Close modal when clicking overlay
//     const modalOverlay = document.querySelector('.modal-overlay');
//     if (modalOverlay) {
//         modalOverlay.addEventListener('click', closeDownloadModal);
//     }
    
//     // Close modal with Escape key
//     document.addEventListener('keydown', function(e) {
//         if (e.key === 'Escape') {
//             closeDownloadModal();
//         }
//     });
// });