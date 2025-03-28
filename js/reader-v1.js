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
        window.resizeTo(windowWidth, windowHeight);
        const left = Math.floor((screenWidth - windowWidth) / 2);
        const top = Math.floor((screenHeight - windowHeight) / 2);
        window.moveTo(left, top);
    } catch (e) {
        console.error("窗口适应失败:", e);
    }
}

window.addEventListener('beforeunload', function() {
    window.scrollTo(0, 0);
});
