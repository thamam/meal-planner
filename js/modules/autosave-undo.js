// ==========================================
// Auto-save & Undo Module
// ==========================================

// State management
let historyStack = [];
const maxHistorySize = 5;
let autoSaveTimer = null;
let isLoadingState = false;

// ==========================================
// History Management
// ==========================================

function saveToHistory(weeklyMeals) {
    if (isLoadingState) return;
    
    // Deep clone current state
    const currentState = JSON.parse(JSON.stringify(weeklyMeals));
    
    // Add to history stack
    historyStack.push(currentState);
    
    // Limit history size
    if (historyStack.length > maxHistorySize) {
        historyStack.shift(); // Remove oldest
    }
    
    // Update UI
    updateUndoButton();
    
    console.log(`📚 Saved to history (${historyStack.length}/${maxHistorySize})`);
}

function undo() {
    if (historyStack.length === 0) {
        showMessage('⚠️ Nothing to undo!', 'warning');
        if (window.playSound) playSound('error');
        return null;
    }
    
    // Get previous state
    const previousState = historyStack.pop();
    
    showMessage('↩️ Undone!', 'info');
    if (window.playSound) playSound('click');
    updateUndoButton();
    
    return JSON.parse(JSON.stringify(previousState));
}

function clearHistory() {
    historyStack = [];
    updateUndoButton();
}

function updateUndoButton() {
    const undoBtn = document.getElementById('undoButton');
    if (undoBtn) {
        undoBtn.disabled = historyStack.length === 0;
        undoBtn.style.opacity = historyStack.length === 0 ? '0.5' : '1';
        undoBtn.title = historyStack.length > 0 ? `Undo (${historyStack.length} steps available)` : 'Nothing to undo';
    }
}

// ==========================================
// Auto-save System
// ==========================================

function triggerAutoSave(saveFn, currentUser) {
    if (isLoadingState) return;
    if (!currentUser) return;
    
    // Debounce auto-save
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(async () => {
        console.log('💾 Auto-saving...');
        await saveFn(true); // Silent save
    }, 2000); // Save 2 seconds after last change
}

function setLoadingState(state) {
    isLoadingState = state;
}

function getLoadingState() {
    return isLoadingState;
}

function getHistoryLength() {
    return historyStack.length;
}

// Export functions
if (typeof window !== 'undefined') {
    window.AutoSave = {
        saveToHistory,
        undo,
        clearHistory,
        updateUndoButton,
        triggerAutoSave,
        setLoadingState,
        getLoadingState,
        getHistoryLength
    };
}
