// 使用window.markdownText（如果存在），否则使用默认内容
let markdownText = window.markdownText || `显示文本`;
history.scrollRestoration = "manual";
window.onload = function() {  
    window.scrollTo(0, 0);
    marked.setOptions({  
        breaks: true,  
        gfm: true,  
        headerIds: true,  
        smartLists: true,
        smartypants: true,
        mangle: false
    });  
    const cleanText = markdownText.replace(/\[\d+(?:,\s*\d+)?\]/g, '');
    const contentDiv = document.getElementById('content');  
    contentDiv.innerHTML = marked.parse(cleanText);  
    document.querySelectorAll('#content a').forEach(link => {  
        if (link.hostname !== window.location.hostname) {  
            link.setAttribute('target', '_blank');  
            link.setAttribute('rel', 'noopener noreferrer');  
        }  
    });
    // 窗口适应函数
    setTimeout(optimizeWindowSize, 100);
}

function optimizeWindowSize() {
    try {
        const screenWidth = window.screen.availWidth;
        const screenHeight = window.screen.availHeight;
        const contentElement = document.getElementById('content');
        const contentWidth = contentElement.offsetWidth;
        const contentHeight = contentElement.offsetHeight;
        const bodyStyles = window.getComputedStyle(document.body);
        const paddingLeft = parseInt(bodyStyles.paddingLeft, 10);
        const paddingRight = parseInt(bodyStyles.paddingRight, 10);
        const paddingTop = parseInt(bodyStyles.paddingTop, 10);
        const paddingBottom = parseInt(bodyStyles.paddingBottom, 10);
        const extraWidth = 16;
        const extraHeight = 30;
        // 最小窗口尺寸限制
        const minWindowWidth = 400;
        const minWindowHeight = 250;
        
        // 计算窗口尺寸并应用最小限制
        let windowWidth = contentWidth + paddingLeft + paddingRight + extraWidth;
        let windowHeight = contentHeight + paddingTop + paddingBottom + extraHeight;
        windowWidth = Math.max(windowWidth, minWindowWidth);
        windowHeight = Math.max(windowHeight, minWindowHeight);
        
        // 根据配置选择窗口位置模式
        const positionMode = window.windowPosition || 'center'; // 默认为居中模式
        
        if (positionMode === 'top') {
            // 顶部模式：窗口显示在顶部，底部留出35%空间
            const availableHeight = Math.floor(screenHeight * 0.67); // 可用高度（屏幕高度的67%）
            windowHeight = Math.min(windowHeight, availableHeight);
            
            window.resizeTo(windowWidth, windowHeight);
            
            // 调整窗口位置：水平居中
            const left = Math.floor((screenWidth - windowWidth) / 2);
            
            // 如果窗口高度小于可用空间，则在可用空间内垂直居中
            // 否则，从顶部开始显示（加一点小边距）
            let top;
            const minTopMargin = 20; // 最小顶部边距
            
            if (windowHeight < availableHeight) {
                // 如果窗口比可用空间小，则在可用空间内垂直居中
                top = Math.floor((availableHeight - windowHeight) / 2);
                top = Math.max(top, minTopMargin); // 确保至少有最小边距
            } else {
                // 如果窗口足够大，占满或超过可用空间，则从顶部开始显示
                top = minTopMargin;
            }
            
            window.moveTo(left, top);
        } else {
            // 居中模式：窗口在屏幕中央显示（原始行为）
            window.resizeTo(windowWidth, windowHeight);
            
            const left = Math.floor((screenWidth - windowWidth) / 2);
            const top = Math.floor((screenHeight - windowHeight) / 2);
            
            window.moveTo(left, top);
        }
    } catch (e) {
        console.error("窗口适应失败:", e);
    }
}

window.addEventListener('beforeunload', function() {
    window.scrollTo(0, 0);
});
